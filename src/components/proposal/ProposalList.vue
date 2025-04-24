<template>
  <div class="space-y-6">
    <a :href="`/protected/editProposal?roomId=${roomId}`" class="btn w-full bg-primary hover:bg-primary/90">
      Agregar propuesta
    </a>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="error" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <!-- Listado de propuestas -->
    <div v-else class="bg-secondary/20 rounded-lg p-4 space-y-2">
      <div v-for="proposal in proposals" :key="proposal.id"
        class="flex items-center justify-between p-3 bg-neutral rounded-lg shadow-sm">
        <span class="text-accent/80">{{ proposal.title }}</span>
        <div class="flex gap-2">
          <a :href="`/protected/editProposal?id=${proposal.id}&roomId=${roomId}`"
            class="btn btn-circle btn-sm btn-ghost">
            <Icon class="text-accent" icon="ic:sharp-mode-edit" width="22" height="22" />
          </a>
          <button @click="confirmDelete(proposal.id)" class="btn btn-circle btn-sm btn-ghost text-error">
            <Icon class="text-error" icon="ic:round-remove-circle-outline" width="24" height="24" />
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
          <button class="btn btn-error text-white" :disabled="isDeleting" @click="handleDelete">
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
import ProposalService from '../../services/proposal.service';
import { Icon } from '@iconify/vue';

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

    const respString = await ProposalService.byRoom(String(props.roomId));
    const data = JSON.parse(respString);
    proposals.value = Array.isArray(data) ? data : [];
  } catch (err) {
    error.value = err.message;
    console.error('Error al cargar propuestas:', err);
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

// Manejar borrado de propuesta
const handleDelete = async () => {
  if (!proposalToDelete.value) return;

  try {
    isDeleting.value = true;
    error.value = null;
    await ProposalService.remove(String(proposalToDelete.value));

    await fetchProposals();
    closeModal();
  } catch (err) {
    error.value = err.message;
    console.error('Error al eliminar propuesta:', err);
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
