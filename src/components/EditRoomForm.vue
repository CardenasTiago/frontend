<template>
  <div class="bg-base-100 p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <BackButton />
    </div>

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
            minlength="10"
            maxlength="500"
            @input="validateForm"
          ></textarea>
          <div v-if="descriptionError" class="label">
            <span class="label-text-alt text-error">{{ descriptionError }}</span>
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

    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import AdminField from './AdminField.vue';
import BackButton from './BackButton2.vue';

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
  if (form.value.description.length < 10) {
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
          form.value.description.length >= 10 &&
          form.value.description.length <= 500 &&
          !nameError.value &&
          !descriptionError.value;
});

onMounted(async () => {
  try {
    // Obtener el roomId de la URL
    const urlParams = new URLSearchParams(window.location.search);
    roomId.value = urlParams.get('id');
    
    if (!roomId.value) {
      error.value = 'No se encontró el ID de la sala';
      return;
    }

    // Obtener los datos de la sala
    const response = await fetch(`http://localhost:3000/v1/rooms/${roomId.value}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener los datos de la sala');
    }

    const roomData = await response.json();
    form.value.name = roomData.room.room_title || '';
    form.value.description = roomData.room.description || '';
    isFormal.value = roomData.room.is_formal;

    validateForm();

  } catch (err) {
    error.value = err.message || 'Error al cargar los datos de la sala';
    console.error('Error:', err);
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

    const response = await fetch(`http://localhost:3000/v1/rooms/${roomId.value}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        is_formal: isFormal.value,
        link_invite: 'default-link',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar la sala');
    }

    // Redireccionar a mis salas
    window.location.href = '/protected/mis-salas';

  } catch (err) {
    error.value = err.message || 'Error al actualizar la sala';
    console.error('Error:', err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>