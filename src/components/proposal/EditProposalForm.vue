<template>
  <div class="bg-base-100 p-8 rounded-xl shadow-lg">
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
                accept=".pdf,.doc,.docx,.txt"
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
          />
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
          ></textarea>
        </label>
      </div>


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
            class="input input-bordered w-full bg-primary text-white placeholder-white/70 pr-10"
            required
          />
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
        :disabled="isSubmitting || !roomId || form.options.length < 2"
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
import BackButton from '../../components/reusable/BackButton2.vue';

const form = ref({
  title: '',
  description: '',
  archive: null,
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

const isEditing = computed(() => !!proposalId.value);

const addOption = () => {
  if (form.value.options.length < 5) {
    form.value.options.push({ value: '' });
  }
};

const removeOption = (index) => {
  if (form.value.options.length > 2) {
    form.value.options.splice(index, 1);
  }
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

    // Obtener las opciones de la propuesta
    const optionsResponse = await fetch(`http://localhost:3000/v1/options/proposal/${proposalId.value}`, {
      credentials: 'include'
    });

    if (optionsResponse.ok) {
      const optionsData = await optionsResponse.json();
      if (Array.isArray(optionsData) && optionsData.length > 0) {
        form.value.options = optionsData.map(option => ({ value: option.value }));
      }
    }
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  try {
    if (!roomId.value) {
      error.value = 'No se encontró el ID de la sala';
      return;
    }

    if (form.value.options.length < 2) {
      error.value = 'Se requieren al menos 2 opciones';
      return;
    }

    isSubmitting.value = true;
    error.value = null;

    // Crear la propuesta
    const proposalPayload = {
      title: form.value.title,
      description: form.value.description || '',
      archive: form.value.archive || '',
      room_id: parseInt(roomId.value)
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
      const errorData = await proposalResponse.json();
      throw new Error(errorData.error || 'Error al guardar la propuesta');
    }

    const proposalResult = await proposalResponse.json();
    const newProposalId = isEditing.value ? proposalId.value : proposalResult.proposal.id;

    // Si estamos editando, primero eliminamos las opciones existentes
    if (isEditing.value) {
      const deleteOptionsResponse = await fetch(`http://localhost:3000/v1/options/proposal/${proposalId.value}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!deleteOptionsResponse.ok) {
        throw new Error('Error al actualizar las opciones');
      }
    }

    // Crear las opciones
    for (const option of form.value.options) {
      const optionPayload = {
        value: option.value,
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
        const errorData = await optionResponse.json();
        throw new Error(errorData.error || 'Error al guardar una opción');
      }
    }

    // Redirigir a la página de propuestas
    window.location.href = `/protected/proposal?id=${roomId.value}`;
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.archive = file.name;
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