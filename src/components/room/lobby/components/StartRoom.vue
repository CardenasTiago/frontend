<template>
  <div v-bind="$attrs">
    <div class="flex justify-center mt-5">
      <button v-if="room.privileges && room.state != 'finished'" class="btn btn-primary start-room" @click="startRoom">
        Iniciar Sala
      </button>
      
      <button v-if="room.state != 'created' && !room.privileges && room.state != 'finished'" class="btn btn-primary start-room" @click="startRoom">
        Ingresar
      </button>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted } from 'vue';
import RoomService from '../../../../services/room.service';
const room = ref('');


const props = defineProps({
  roomId:    { type: [String, Number], required: true }
})

onMounted(async() => {
  fetchRoomData()
});

const fetchRoomData = async () => {
  try {
    const response = await RoomService.find(props.roomId)
    const data = JSON.parse(response);
    room.value = data.room
  } catch (err) {
    console.error('Error:', err.error);
  } 
};
function startRoom() {
  window.location.href = '/protected/lobby';
}
</script>
