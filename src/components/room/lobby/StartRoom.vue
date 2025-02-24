<template>
  <div class="flex justify-center mt-5" >
    <button v-if=" room.privileges " class="btn btn-primary start-room" @click="startRoom">
      Iniciar Sala 
    </button>

    <button v-if=" room.state === 'online' && !room.privileges " class="btn btn-primary start-room" @click="startRoom">
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
  if (!room.value) {
    console.error('No se ha definido el room ID.');
    return;
  }
  
  const WS_URL = `ws://localhost:3000/v1/rooms/ws/${room.value.id}`;
  const ws = new WebSocket(WS_URL);
  
  ws.onopen = () => {
    console.log("Conexión WebSocket establecida. Enviando acción 'start_room'.");
    // Enviar el mensaje inicial para iniciar la sala.
    ws.send(JSON.stringify({
      action: 'start_room',
      payload: {
        message: "starting room"
      }
    }));
    // Redireccionar a index.astro tras iniciar la sala.
    window.location.href = '/protected/lobby';
  };

  ws.onerror = (error) => {
    console.error("Error en el WebSocket:", error);
  };

  ws.onmessage = (event) => {
    console.log("Mensaje recibido:", event.data);
  };
}
</script>
