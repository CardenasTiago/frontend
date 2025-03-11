<template>
  <div class="flex justify-center mt-5">
    <button v-if="room.privileges" class="btn btn-primary start-room" @click="startRoom">
      Iniciar Sala
    </button>

    <button v-if="room.state === 'online' && !room.privileges" class="btn btn-primary start-room" @click="startRoom">
      Ingresar
    </button>
  </div>


</template>

<script setup>
import { ref, onMounted } from 'vue';

const room = ref('');

onMounted(() => {
  // Se asume que el ID de la sala se guarda en localStorage
  const storedRoom = localStorage.getItem('currentRoom');
  if (storedRoom) {
    room.value = JSON.parse(storedRoom);
  } else {
    console.error('No se encontró el room ID en el almacenamiento local.');
  }
});

function startRoom() {
  window.location.href = '/protected/lobby';
}
</script>
