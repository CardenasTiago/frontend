<template>
  <div class="bg-neutral p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <BackButton />
    </div>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
      <a href="/protected/myRooms" class="btn btn-sm btn-ghost">Volver a mis salas</a>
    </div>

    <div v-else>
      <div class="aspect-video bg-gray-200 mb-6 rounded-lg flex items-center justify-center">
        <input type="file" class="file-input file-input-ghost w-full max-w-xs" @change="handleFileChange" />
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
              maxlength="255"
              @input="validateForm"
            />
            <div class="label">
              <span class="label-text-alt text-accent/60">{{ form.name.length }}/255 caracteres</span>
              <span v-if="nameError" class="label-text-alt text-error">{{ nameError }}</span>
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
              maxlength="255"
              @input="validateForm"
            ></textarea>
            <div class="label">
              <span class="label-text-alt text-accent/60">{{ form.description.length }}/255 caracteres</span>
              <span v-if="descriptionError" class="label-text-alt text-error">{{ descriptionError }}</span>
            </div>
          </label>
        </div>

        <AdminField />

        <div class="pt-4">
          <button 
            type="submit" 
            class="btn btn-secondary w-full text-white h-14 text-lg font-medium"
            :disabled="isSubmitting || !isFormValid"
          >
            {{ isSubmitting ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

        <div v-if="error" class="alert alert-error mt-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
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
  imageBase64: '',
});

const isSubmitting = ref(false);
const error = ref('');
const roomId = ref(null);
const roomType = ref(null);
const nameError = ref('');
const descriptionError = ref('');
const loading = ref(false);

const validateForm = () => {
  // Validar nombre
  if (form.value.name.length < 3) {
    nameError.value = 'El nombre debe tener al menos 3 caracteres';
  } else if (form.value.name.length > 255) {
    nameError.value = 'El nombre no puede exceder los 255 caracteres';
  } else if (!/^[a-zA-Z0-9\s]+$/.test(form.value.name)) {
    nameError.value = 'El nombre solo puede contener letras, números y espacios';
  } else {
    nameError.value = '';
  }

  // Validar descripción
  if (form.value.description.length < 5) {
    descriptionError.value = 'La descripción debe tener al menos 5 caracteres';
  } else if (form.value.description.length > 255) {
    descriptionError.value = 'La descripción no puede exceder los 255 caracteres';
  } else {
    descriptionError.value = '';
  }
};

const isFormValid = computed(() => {
  return form.value.name.length >= 3 &&
          form.value.name.length <= 255 &&
          /^[a-zA-Z0-9\s]+$/.test(form.value.name) &&
          form.value.description.length >= 5 &&
          form.value.description.length <= 255 &&
          !nameError.value &&
          !descriptionError.value;
});

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  roomId.value = urlParams.get('id');
  roomType.value = urlParams.get('tipo');

  // Si tenemos un ID, estamos editando una sala existente
  if (roomId.value) {
    loading.value = true;
    fetchRoomData();
  }
});

const fetchRoomData = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/rooms/${roomId.value}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los datos de la sala');
    }

    const data = await response.json();
    if (!data.room) {
      throw new Error('No se encontraron datos de la sala');
    }

    const roomData = data.room;
    form.value.name = roomData.name || '';
    form.value.description = roomData.description || '';
    validateForm();

  } catch (err) {
    error.value = err.message || 'Error al cargar los datos de la sala';
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Por favor, corrige los errores del formulario antes de guardar';
      return;
    }

    isSubmitting.value = true;
    error.value = '';

    // Preparar los datos para enviar al backend
    const roomData = {
      name: form.value.name.trim(),
      description: form.value.description.trim(),
      link_invite: 'default-link',
      is_formal: roomType.value === 'formal',
      state: 'created',
      image: form.value.imageBase64
    };

    // Si estamos editando, usamos PUT, si es nueva sala usamos POST
    const method = roomId.value ? 'PUT' : 'POST';
    const url = roomId.value 
      ? `http://localhost:3000/v1/rooms/${roomId.value}`
      : 'http://localhost:3000/v1/rooms';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || `Error del servidor: ${response.status}`);
    }

    const responseData = await response.json();
    const newRoomId = roomId.value || responseData.room.id;
    const isFormal = roomType.value === 'formal' || responseData.room.is_formal;

    // Redirigir según el tipo de sala
    if (isFormal) {
      window.location.href = `/protected/formalSettingRoom?id=${newRoomId}`;
    } else {
      window.location.href = `/protected/myRooms`;
    }

  } catch (err) {
    error.value = err.message || 'Error al guardar la sala';
    console.error('Error completo:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    form.value.imageBase64 = reader.result;
  };
};
</script>