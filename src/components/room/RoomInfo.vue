<template>
      <div v-if="room">
        <h1 class="font-semibold m-3 text-center">{{ room.room_title }}</h1>
        <h2 class="mb-2">Descripción</h2>
        <p class="mb-4">
          {{ room.description || 'Sin descripción' }}
        </p>
        
        <h2 class="mb-2">Fecha y hora programada</h2>
        <h1 class="font-semibold mb-4">{{ room.start_time}}</h1>
        
        <h2 class="mb-2">Administrador</h2>
        <h1 class="font-semibold">{{ room.admin_name }}</h1>
      </div>
      <div v-else>
        <p>No se encontraron datos de la sala. Por favor, únete a una sala primero.</p>
      </div>
  </template>
  
  
  <script setup>
  import { ref, onMounted } from 'vue';

  const room = ref(null);
  const error = ref('');
  
  onMounted(() => {
    const storedRoom = localStorage.getItem('currentRoom');
    if (storedRoom) {
      try {

        room.value = JSON.parse(storedRoom);

      } catch (e) {
        error.value = 'Error al leer los datos de la sala.';
        console.error(e);
      }
    } else {
      error.value = 'No se encontraron datos de la sala en el almacenamiento local.';
    }
  });
  </script>
  
  <style scoped>
  .room-info-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
  }
  
  .room-info-container h1 {
    margin-bottom: 1.5rem;
  }
  
  .room-info-container p {
    margin: 0.5rem 0;
  }

  </style>
  