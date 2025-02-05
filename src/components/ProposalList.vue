<template>
    <div class="space-y-6">
        <a href="/editar-propuesta" class="btn w-full bg-primary hover:bg-primary/90 text-neutral">
            Agregar propuesta
        </a>
        

        <div class="bg-secondary/20 rounded-lg p-4 space-y-2">
            <div 
                v-for="(proposal) in proposals" 
                :key="proposal.id"
                class="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
            >
                <span class="text-accent/80">{{ proposal.title }}</span>
                <div class="flex gap-2">
                    <button 
                        @click="$emit('edit-proposal', proposal.id)"
                        class="btn btn-circle btn-sm btn-ghost"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
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
        </div>

        <!-- Confirmación -->
        <dialog ref="deleteModal" class="modal">
            <div class="modal-box">
                <h3 class="font-bold text-lg text-error">¿Eliminar propuesta?</h3>
                <p class="py-4">Esta acción no se puede deshacer. ¿Estás seguro?</p>
                <div class="modal-action">
                    <button class="btn" @click="closeModal">Cancelar</button>
                    <button 
                        class="btn btn-error text-white"
                        @click="handleDelete"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
            <form method="dialog" class="modal-backdrop">
                <button>close</button>
            </form>
        </dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

interface Proposal {
    id: number;
    title: string;
}

interface Props {
    proposals: Proposal[];
}

const props = defineProps<Props>();

const emit = defineEmits(['delete-proposal', 'edit-proposal', 'editar-propuesta']);

const deleteModal = ref<HTMLDialogElement | null>(null);
const proposalToDelete = ref<number | null>(null);

const confirmDelete = (id: number) => {
    proposalToDelete.value = id;
    if (deleteModal.value) {
        deleteModal.value.showModal();
    }
};

const closeModal = () => {
    if (deleteModal.value) {
        deleteModal.value.close();
    }
    proposalToDelete.value = null;
};

const handleDelete = () => {
    emit('delete-proposal', proposalToDelete.value);
    closeModal();
};
</script>

