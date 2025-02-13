<template>
    <div class="flex justify-center mt-5">
        <button class="btn btn-primary start-room">Iniciar</button>
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

const WS_URL = 'ws://localhost:3000/v1/rooms/' + room.id;



</script>