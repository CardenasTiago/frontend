<template>
  <div class="bg-neutral p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <BackButton />
      <div class="dropdown dropdown-end">
        <button tabindex="0" class="btn btn-circle bg-secondary/20 hover:bg-secondary/30 border-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <label class="flex items-center gap-2 p-2 hover:bg-secondary/10 rounded-lg cursor-pointer">
              <input 
                type="file" 
                class="hidden" 
                @change="handleFileUpload"
                accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Subir archivo
            </label>
          </li>
        </ul>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary text-center mb-2">
      {{ isEditing ? 'Editar propuesta' : 'Nueva propuesta' }}
    </h1>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-accent/80 text-lg">Nombre de la propuesta</span>
          </div>
          <input 
            v-model="form.title"
            type="text"
            class="input input-bordered w-full bg-secondary/10 border-secondary/20"
            required
            maxlength="255"
            @input="validateForm"
          />
          <div class="label">
            <span class="label-text-alt text-accent/60">{{ form.title.length }}/255 caracteres</span>
            <span v-if="titleError" class="label-text-alt text-error">{{ titleError }}</span>
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
            class="textarea textarea-bordered w-full bg-secondary/10 border-secondary/20 h-32"
            required
            maxlength="255"
            @input="validateForm"
          ></textarea>
          <div class="label">
            <span class="label-text-alt text-accent/60">{{ form.description.length }}/255 caracteres</span>
            <span v-if="descriptionError" class="label-text-alt text-error">{{ descriptionError }}</span>
          </div>
        </label>
      </div>

      <!-- Archivo -->
      <div v-if="form.archiveData" class="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="truncate">{{ form.archive }}</span>
        </div>
        <button 
          type="button"
          @click="removeFile"
          class="text-accent/80 hover:text-accent"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Opciones -->
      <div class="space-y-4">
        <div 
          v-for="(option, index) in form.options" 
          :key="index"
          class="relative"
        >
          <input 
            v-model="option.value"
            type="text"
            :placeholder="`Opción ${index + 1}`"
            class="input input-bordered w-full"
            :class="[
              'bg-primary text-white placeholder-white/70 pr-10',
              optionErrors[index] ? 'border-error' : ''
            ]"
            required
            @input="validateOptions"
          />
          <div v-if="optionErrors[index]" class="text-error text-sm mt-1">
            {{ optionErrors[index] }}
          </div>
          <button 
            v-if="form.options.length > 2"
            type="button"
            @click="removeOption(index)" 
            class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button 
          type="button"
          @click="addOption"
          class="btn w-full bg-secondary/20 hover:bg-secondary/30"
          :disabled="form.options.length >= 5"
        >
          + Añadir más opciones
        </button>
      </div>

      <button 
        type="submit" 
        class="btn w-full bg-primary hover:bg-primary/90 text-white"
        :disabled="isSubmitting || !isFormValid"
      >
        {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear propuesta') }}
      </button>

      <div v-if="error" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BackButton from '../reusable/BackButton2.vue';

const form = ref({
  title: '',
  description: '',
  archive: null,
  archiveData: null,
  options: [
    { value: '' },
    { value: '' }
  ]
});

const isSubmitting = ref(false);
const error = ref(null);
const loading = ref(true);
const proposalId = ref(null);
const roomId = ref(null);
const descriptionError = ref('');
const titleError = ref('');
const optionErrors = ref([]);

const isEditing = computed(() => !!proposalId.value);

const validateOptions = () => {
  optionErrors.value = Array(form.value.options.length).fill('');
  
  // Verificamos que no haya opciones duplicadas
  const values = form.value.options.map(opt => opt.value.trim().toLowerCase());
  const duplicates = new Set();
  
  values.forEach((value, index) => {
    if (value === '') {
      optionErrors.value[index] = 'La opción no puede estar vacía';
      return;
    }
    
    const firstIndex = values.indexOf(value);
    if (firstIndex !== index) {
      duplicates.add(value);
      optionErrors.value[firstIndex] = 'Opción duplicada';
      optionErrors.value[index] = 'Opción duplicada';
    }
  });
};

const validateForm = () => {
  // Validar título
  if (form.value.title.length > 255) {
    titleError.value = 'El título no puede exceder los 255 caracteres';
  } else {
    titleError.value = '';
  }

  // Validar descripción
  if (form.value.description.length > 255) {
    descriptionError.value = 'La descripción no puede exceder los 255 caracteres';
  } else {
    descriptionError.value = '';
  }

  // Validar opciones
  validateOptions();
};

const isFormValid = computed(() => {
  return form.value.title.length > 0 &&
          form.value.title.length <= 255 &&
          form.value.description.length <= 255 &&
          form.value.options.length >= 2 &&
          form.value.options.every(option => option.value.trim() !== '') &&
          !titleError.value &&
          !descriptionError.value &&
          !optionErrors.value.some(error => error !== '') &&
          roomId.value;
});

const addOption = () => {
  if (form.value.options.length < 5) {
    form.value.options.push({ value: '' });
    optionErrors.value.push('');
  }
};

const removeOption = (index) => {
  if (form.value.options.length > 2) {
    form.value.options.splice(index, 1);
    optionErrors.value.splice(index, 1);
    validateOptions();
  }
};

const removeFile = () => {
  form.value.archive = null;
  form.value.archiveData = null;
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    error.value = `El archivo es demasiado grande. El tamaño máximo permitido es ${maxSize / (1024 * 1024)}MB`;
    return;
  }
  form.value.archive = file.name;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.archiveData = e.target.result;
  };
  reader.onerror = () => {
    error.value = 'Error al leer el archivo';
    form.value.archive = null;
    form.value.archiveData = null;
  };
  reader.readAsDataURL(file);
};

const fetchProposal = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/proposals/${proposalId.value}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Error al obtener la propuesta');
    }

    const data = await response.json();
    form.value.title = data.title || '';
    form.value.description = data.description || '';
    form.value.archive = data.archive || null;
    // No podemos recuperar el contenido en base64 del archivo ya guardado

    // Obtener las opciones de la propuesta
    const optionsResponse = await fetch(`http://localhost:3000/v1/options/byProposal/${proposalId.value}`, {
      credentials: 'include'
    });

    if (optionsResponse.ok) {
      const optionsData = await optionsResponse.json();
      if (Array.isArray(optionsData.options)) {
        form.value.options = optionsData.options.map(option => ({ value: option.value }));
        optionErrors.value = Array(form.value.options.length).fill('');
      }
    }

    validateForm();
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!isFormValid.value) {
      error.value = 'Por favor, verifica todos los campos del formulario';
      return;
    }

    isSubmitting.value = true;
    error.value = null;

    // Verificar que el roomId sea un número
    const roomIdNumber = parseInt(roomId.value, 10);
    if (isNaN(roomIdNumber)) {
      throw new Error('ID de sala inválido');
    }

    // Crear la propuesta
    const proposalPayload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      archive: form.value.archiveData || '', // Enviamos los datos en base64 si existen
      room_id: roomIdNumber 
    };

    let method = 'POST';
    let url = 'http://localhost:3000/v1/proposals';
    
    if (isEditing.value) {
      method = 'PUT';
      url = `http://localhost:3000/v1/proposals/${proposalId.value}`;
    }

    const proposalResponse = await fetch(url, {
      method: method,
      headers: { 
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(proposalPayload)
    });

    if (!proposalResponse.ok) {
      const errorText = await proposalResponse.text();
      let errorMessage;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || 'Error al guardar la propuesta';
      } catch {
        errorMessage = errorText || `Error del servidor: ${proposalResponse.status}`;
      }
      throw new Error(errorMessage);
    }

    const proposalText = await proposalResponse.text();
    let proposalResult;
    try {
      proposalResult = proposalText ? JSON.parse(proposalText) : null;
    } catch {
      throw new Error('Error al procesar la respuesta del servidor');
    }


    const newProposalId = isEditing.value ? 
      parseInt(proposalId.value, 10) : 
      (proposalResult?.proposal?.id ? parseInt(proposalResult.proposal.id, 10) : null);

    if (!newProposalId || isNaN(newProposalId)) {
      throw new Error('No se pudo obtener el ID de la propuesta');
    }

    // Si estamos editando, primero eliminamos las opciones existentes una por una
    if (isEditing.value) {
      const existingOptionsResponse = await fetch(`http://localhost:3000/v1/options/byProposal/${newProposalId}`, {
        credentials: 'include'
      });

      if (existingOptionsResponse.ok) {
        const existingOptionsText = await existingOptionsResponse.text();
        try {
          if (existingOptionsText) {
            const existingOptions = JSON.parse(existingOptionsText);
            if (Array.isArray(existingOptions.options)) {
              for (const option of existingOptions.options) {
                const deleteResponse = await fetch(`http://localhost:3000/v1/options/${option.id}`, {
                  method: 'DELETE',
                  credentials: 'include'
                });
                
                if (!deleteResponse.ok) {
                  console.error(`Error al eliminar la opción ${option.id}`);
                }
              }
            }
          }
        } catch (e) {
          console.error('Error al procesar las opciones existentes:', e);
        }
      }
    }

    // Crear las nuevas opciones
    for (const option of form.value.options) {
      const optionPayload = {
        value: option.value.trim(),
        proposal_id: newProposalId
      };

      const optionResponse = await fetch('http://localhost:3000/v1/options', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(optionPayload)
      });

      if (!optionResponse.ok) {
        const errorText = await optionResponse.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || 'Error al guardar una opción';
        } catch {
          errorMessage = errorText || `Error del servidor: ${optionResponse.status}`;
        }
        throw new Error(errorMessage);
      }
    }

    // Redirigir a la página de propuestas
    window.location.href = `/protected/proposal?id=${roomIdNumber}`;
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  proposalId.value = urlParams.get('id');
  roomId.value = urlParams.get('roomId');

  if (!roomId.value) {
    error.value = 'No se encontró el ID de la sala';
    loading.value = false;
    return;
  }

  if (isEditing.value) {
    fetchProposal();
  } else {
    loading.value = false;
  }
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>