<template>
  <div class="bg-base-100 p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <BackButton />
    </div>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else>
      <div class="aspect-video bg-gray-200 mb-6 rounded-lg flex items-center justify-center">
        <input type="file" class="file-input file-input-ghost w-full max-w-xs" />
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-accent/80 text-lg">Nombre de la sala</span>
            </div>
            <input 
              v-model="form.name"
              type="text" 
              placeholder="Nombre de la sala"
              class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg" 
              required
              minlength="3"
              maxlength="50"
              @input="validateForm"
            />
            <div v-if="nameError" class="label">
              <span class="label-text-alt text-error">{{ nameError }}</span>
            </div>
          </label>
        </div>

        <div>
          <label class="form-control w-full">
            <div class="label">
              <span class="label-text text-accent/80 text-lg">Descripción</span>
            </div>
            <textarea 
              v-model="form.description"
              class="textarea textarea-bordered w-full bg-secondary/10 border-secondary/20 text-lg" 
              rows="4" 
              placeholder="Agregue una descripción"
              required
              minlength="5"
              maxlength="500"
              @input="validateForm"
            ></textarea>
            <div v-if="descriptionError" class="label">
              <span class="label-text-alt text-error">{{ descriptionError }}</span>
            </div>
          </label>
        </div>

        <AdminField/>

        <div class="pt-4">
          <button 
            type="submit" 
            class="btn btn-secondary w-full text-white h-14 text-lg font-medium"
            :disabled="isSubmitting || !isFormValid"
          >
            {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminField from '../../reusable/AdminField.vue';
import BackButton from '../../reusable/BackButton2.vue';

const form = ref({
  name: '',
  description: '',
});

const isSubmitting = ref(false);
const error = ref('');
const roomId = ref(null);
const isFormal = ref(false);
const nameError = ref('');
const descriptionError = ref('');
const loading = ref(true);
const currentState = ref('created');

const validateForm = () => {
  // Validar nombre
  if (form.value.name.length < 3) {
    nameError.value = 'El nombre debe tener al menos 3 caracteres';
  } else if (form.value.name.length > 50) {
    nameError.value = 'El nombre no puede exceder los 50 caracteres';
  } else if (!/^[a-zA-Z0-9\s]+$/.test(form.value.name)) {
    nameError.value = 'El nombre solo puede contener letras, números y espacios';
  } else {
    nameError.value = '';
  }

  // Validar descripción
  if (form.value.description.length < 5) {
    descriptionError.value = 'La descripción debe tener al menos 10 caracteres';
  } else if (form.value.description.length > 500) {
    descriptionError.value = 'La descripción no puede exceder los 500 caracteres';
  } else {
    descriptionError.value = '';
  }
};

const isFormValid = computed(() => {
  return form.value.name.length >= 3 &&
          form.value.name.length <= 50 &&
          /^[a-zA-Z0-9\s]+$/.test(form.value.name) &&
          form.value.description.length >= 5 &&
          form.value.description.length <= 500 &&
          !nameError.value &&
          !descriptionError.value;
});

onMounted(async () => {
  try {
    loading.value = true;
    // Obtener el roomId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    roomId.value = urlParams.get('id');
    
    if (!roomId.value) {
      error.value = 'No se encontró el ID de la sala';
      loading.value = false;
      return;
    }

    // Obtener los datos de la sala
    const response = await fetch(`http://localhost:3000/v1/rooms/${roomId.value}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('La sala no existe');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los datos de la sala');
    }

    const data = await response.json();
    if (!data.room) {
      throw new Error('No se encontraron datos de la sala');
    }

    const roomData = data.room;
    form.value.name = roomData.room_title || roomData.name || '';
    form.value.description = roomData.description || '';
    isFormal.value = roomData.is_formal || false;
    currentState.value = roomData.state || 'created';

    console.log('Datos de sala cargados:', {
      name: form.value.name,
      description: form.value.description,
      isFormal: isFormal.value,
      state: currentState.value
    });

    validateForm();

  } catch (err) {
    error.value = err.message || 'Error al cargar los datos de la sala';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Por favor, corrige los errores del formulario antes de guardar';
      return;
    }

    isSubmitting.value = true;
    error.value = '';

    if (!roomId.value) {
      throw new Error('No se encontró el ID de la sala');
    }

    // Preparar los datos para enviar al backend
    const updateData = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      link_invite: 'default-link',
      is_formal: isFormal.value,
      state: currentState.value
    };

    console.log('Enviando datos:', updateData);

    const response = await fetch(`http://localhost:3000/v1/rooms/${roomId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error response:', errorData);
      throw new Error(errorData.error || errorData.message || `Error del servidor: ${response.status}`);
    }

    const responseData = await response.json();
    console.log('Respuesta del servidor:', responseData);

    // Verificar si la sala es formal después de la actualización
    const updatedRoom = responseData.room;
    const isRoomFormal = Boolean(updatedRoom?.is_formal);

    // Redireccionar según el tipo de sala
    if (isRoomFormal) {
      console.log('Redirigiendo a configuración formal');
      window.location.href = `/protected/formalSettingRoom?id=${roomId.value}`;
    } else {
      console.log('Redirigiendo a mis salas');
      window.location.href = `/protected/roomInfo/rooms`;
    }

  } catch (err) {
    error.value = err.message || 'Error al actualizar la sala';
    console.error('Error completo:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>