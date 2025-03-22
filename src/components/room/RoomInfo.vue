<template>
  <div v-if="room">
    <h1 class="font-semibold m-3 text-center">{{ room.room_title }}</h1>
    <h2 class="mb-2">Descripción</h2>
    <p class="mb-4">
      {{ room.description || 'Sin descripción' }}
    </p>
    
    <h2 class="mb-2">Fecha y hora programada</h2>
    <!-- Utilizamos la propiedad computada para formatear la fecha -->
    <h1 class="font-semibold mb-4">{{ formattedDate }}</h1>
    
    <h2 class="mb-2">Administrador</h2>
    <h1 class="font-semibold">{{ room.admin_name }}</h1>
  </div>
  <div v-else>
    <p>No se encontraron datos de la sala. Por favor, únete a una sala primero.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

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

// Propiedad computada para formatear la fecha
const formattedDate = computed(() => {
  if (!room.value || !room.value.start_time) {
    return '';
  }
  const date = new Date(room.value.start_time);
  const day = date.getDate();
  // Obtenemos el mes en formato largo (en español)
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();
  
  let hours = date.getHours();
  const minutes = date.getMinutes();
  
  // Determinar am/pm y convertir a formato de 12 horas
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;
  
  // Formatear los minutos para que siempre sean 2 dígitos
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  // Capitalizamos la primera letra del mes
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  
  return `${day} de ${capitalizedMonth} ${year} ${hours}:${formattedMinutes} ${period}`;
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
