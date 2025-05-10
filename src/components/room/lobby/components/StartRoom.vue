<template>
  <div v-bind="$attrs">
    <!-- Mientras loading sea true, ni siquiera se renderiza el contenedor de botones -->
    <div v-if="!loading" class="flex justify-center mt-5">
      <button
        v-if="room.privileges && room.state !== 'finished'"
        class="btn btn-primary start-room"
        @click="startRoom"
      >
        Iniciar Sala
      </button>

      <button
        v-else-if="room.state !== 'created' && !room.privileges && room.state !== 'finished'"
        class="btn btn-primary start-room"
        @click="startRoom"
      >
        Ingresar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import RoomService from '../../../../services/room.service';

const room    = ref(null);
const loading = ref(true);

const props = defineProps({
  roomId: { type: [String, Number], required: true }
});

onMounted(fetchRoomData);

async function fetchRoomData() {
  try {
    const response = await RoomService.find(props.roomId);
    const data     = JSON.parse(response);
    room.value     = data.room;
    // guarda la sala correctamente como string
    localStorage.setItem('currentRoom', JSON.stringify(data.room));
  } catch (err) {
    console.error('Error al cargar sala:', err);
  } finally {
    // Una vez que termina (éxito o error), pasamos loading a false
    loading.value = false;
  }
}

function startRoom() {
  window.location.href = '/protected/lobby';
}
</script>
