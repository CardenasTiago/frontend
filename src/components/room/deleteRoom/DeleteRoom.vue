<template>
    <div>
      <!-- Modal de Confirmación -->
      <ConfirmModal
        :modelValue="isModalOpen"
        @update:modelValue="isModalOpen = $event"
        :cancelText="'Cancelar'"
        :confirmText="'Eliminar Sala'"
        :confirmAction="deleteRoom"
      />
  
      <!-- Modal de Éxito -->
      <ConfirmModal
        v-if="isSuccessModalOpen"
        :modelValue="isSuccessModalOpen"
        @update:modelValue="isSuccessModalOpen = $event"
        title="Sala Eliminada"
        :message="successMessage"
        :cancel-text="'Cerrar'"
      />
    </div>
  </template>
  
  <script setup>
  import { ref,watch } from 'vue';
  import ConfirmModal from '../../reusable/Modal.vue';  
import RoomService from '../../../services/room.service';
  
  const isModalOpen = ref(false); // Estado para el modal de confirmación
  const isSuccessModalOpen = ref(false); // Para el modal de éxito  
  const successMessage = ref("");
  const roomDelete = ref(null);

 



  // Función para abrir el modal con la sala seleccionada
    const openModal = (room) => {  
        roomDelete.value=room;
        isModalOpen.value = true;
    };

  
  const deleteRoom = async () => {
    try {

      const response = await RoomService.remove(roomDelete.value.id)
  
      if (!response) {
        const errorMessage = await response.text();
        throw new Error(`Error al eliminar la sala: ${errorMessage}`);
      }
  
      // Si la eliminación es exitosa, actualizamos el estado
      successMessage.value = `Se eliminó la sala "${roomDelete.value.room_title}"`;
      isSuccessModalOpen.value = true;
      isModalOpen.value = false;  
      roomDelete.value = null;
        
      
    } catch (error) {
      console.error("Error eliminando la sala:", error);
    }
  };


  //  **Detectar cuándo el usuario cierra el modal de éxito**
    watch(isSuccessModalOpen, (newValue) => {
    if (!newValue) {
        window.location.href = "/protected/myRooms"; //redirige si se cierra el mdoal
    }
    });


    // Exponer openModal a través de ref
    defineExpose({
    openModal,
    });
  
  </script>
  