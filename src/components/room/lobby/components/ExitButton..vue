<template>
    <a v-if="socketStore.connected" @click="openDeleteModal(user)" class="btn btn-error text-white">
        <!-- boton salir sala -->
        <Icon icon="ic:baseline-exit-to-app" width="24" height="24" />
    </a>

    <Modal v-model="showDeleteModal" :confirmAction="closeConnection" title="Salir de la sala"
        message="Estas seguro de que desea salir de la sala?" confirmText="Salir" cancelText="Cancelar" />
</template>

<script setup>
import { useWebSocketStore } from '../../stores/socketStore'
import { Icon } from "@iconify/vue";
import Modal from '../../../reusable/Modal.vue';
import { onMounted } from 'vue';

const socketStore = useWebSocketStore();

const showDeleteModal = ref('')

onMounted(() => {
    showDeleteModal = false
})
openExitModal(() => {
    showDeleteModal = true
})

const closeConnection = async (() => {
    socketStore.close();
    window.location.href = '/protected/menu'
})


</script>