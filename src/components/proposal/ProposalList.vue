<template>
  <div class="space-y-6">
    <a 
      :href="`/protected/editProposal?roomId=${roomId}`"
      class="btn w-full bg-primary hover:bg-primary/90"
    >
      Agregar propuesta
    </a>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Listado de propuestas -->
    <div v-else class="bg-secondary/20 rounded-lg p-4 space-y-2">
      <div 
        v-for="proposal in proposals" 
        :key="proposal.id"
        class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
      >
        <span class="text-accent/80">{{ proposal.title }}</span>
        <div class="flex gap-2">
          <a 
            :href="`/protected/editProposal?id=${proposal.id}&roomId=${roomId}`"
            class="btn btn-circle btn-sm btn-ghost"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </a>
          <button 
            @click="confirmDelete(proposal.id)"
            class="btn btn-circle btn-sm btn-ghost text-error"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="proposals.length === 0" class="text-center py-4 text-accent/60">
        No hay propuestas creadas
      </div>
    </div>

    <!-- Modal de confirmación -->
    <dialog ref="deleteModal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-error">¿Eliminar propuesta?</h3>
        <p class="py-4">Esta acción no se puede deshacer. ¿Estás seguro?</p>
        <div class="modal-action">
          <button class="btn" @click="closeModal">Cancelar</button>
          <button 
            class="btn btn-error text-white"
            :disabled="isDeleting"
            @click="handleDelete"
          >
            {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
          </button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  roomId: {
    type: [String, Number],
    required: true
  }
});

const proposals = ref([]);
const loading = ref(true);
const error = ref(null);
const deleteModal = ref(null);
const proposalToDelete = ref(null);
const isDeleting = ref(false);

const fetchProposals = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    if (!props.roomId) {
      throw new Error('No se encontró el ID de la sala');
    }

    const response = await fetch(`http://localhost:3000/v1/proposals/byRoom/${props.roomId}`, {
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Error al cargar las propuestas');
    }

    const data = await response.json();
    proposals.value = Array.isArray(data) ? data : [];
    
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    loading.value = false;
  }
};

const confirmDelete = (id) => {
  proposalToDelete.value = id;
  deleteModal.value.showModal();
};

const closeModal = () => {
  deleteModal.value.close();
  proposalToDelete.value = null;
};

const deleteOptions = async (proposalId) => {
  try {
    const optionsResponse = await fetch(`http://localhost:3000/v1/options/byProposal/${proposalId}`, {
      credentials: 'include'
    });

    if (!optionsResponse.ok) {
      throw new Error('Error al obtener las opciones de la propuesta');
    }

    const optionsData = await optionsResponse.json();
    
    if (optionsData.options && Array.isArray(optionsData.options)) {
      // Eliminar cada opción 
      for (const option of optionsData.options) {
        const deleteResponse = await fetch(`http://localhost:3000/v1/options/${option.id}`, {
          method: 'DELETE',
          credentials: 'include'
        });

        if (!deleteResponse.ok) {
          throw new Error(`Error al eliminar la opción ${option.id}`);
        }
      }
    }
  } catch (err) {
    throw new Error(`Error al eliminar las opciones: ${err.message}`);
  }
};

const handleDelete = async () => {
  if (!proposalToDelete.value) return;

  try {
    isDeleting.value = true;
    error.value = null;

    // Primero eliminamos todas las opciones
    await deleteOptions(proposalToDelete.value);

    // Luego eliminamos la propuesta
    const response = await fetch(`http://localhost:3000/v1/proposals/${proposalToDelete.value}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar la propuesta');
    }

    // Se actualiza la lista de propuestas
    await fetchProposals();
    closeModal();
  } catch (err) {
    error.value = err.message;
    console.error('Error:', err);
  } finally {
    isDeleting.value = false;
  }
};

onMounted(() => {
  if (!props.roomId) {
    error.value = 'No se encontró el ID de la sala';
    loading.value = false;
    return;
  }
  
  fetchProposals();
  
  const refreshInterval = setInterval(() => {
    if (!loading.value) {
      fetchProposals();
    }
  }, 30000);

  onUnmounted(() => {
    clearInterval(refreshInterval);
  });
});
</script>