<template>

  <div class="flex flex-col items-center justify-center text-center h-screen w-screen">
    <div>
      <h2>Tiempo restante</h2>
    </div>
    <div>
      <h1 v-if="settingsRoom && settingsRoom.proposal_timer" class="font-bold">
        {{ countdown }}
      </h1>
    </div>
    <div v-if="currentProposal" class="proposal-container pb-4 m-4 w-[80%]">
      <div class="description bg-secondary p-4">
        <p>{{ currentProposal.description }} </p>
      </div>
      <h1 class="font-semibold">{{ currentProposal.title }}</h1>
    </div>

    <div v-for="(option, index) in currentProposal.options" :key="index">
      <button class="btn btn-primary font-semibold mt-4" :class="{ 'selected bg-success': selectedIndex === index }"
        @click="toggleSelection(index)">
        {{ option.value }}
      </button>
    </div>


  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import { storeToRefs } from 'pinia'

const socketStore = useWebSocketStore();
const { currentProposal, socket } = storeToRefs(socketStore)

const selectedIndex = ref(null);
const error = ref("");
const settingsRoom = ref(null);
const countdown = ref(0);
let timerId = null;          // Guardará la referencia del setInterval

function toggleSelection(index) {
  if (selectedIndex.value === index) {
    selectedIndex.value = null;
  } else {
    selectedIndex.value = index;
  }
}

onMounted(() => {
  const storedSettingsRoom = localStorage.getItem('settingsRoom')
  if (storedSettingsRoom) {
    try {
      settingsRoom.value = JSON.parse(storedSettingsRoom);
    } catch (e) {
      error.value = 'Error al leer los datos de la configuracion de la sala.';
      console.error(e);
    }
  } else {
    error.value = 'No se encontraron datos de la configuracion de la sala en el almacenamiento local.';
  }

  if (settingsRoom.value?.proposal_timer) {
    countdown.value = Number(settingsRoom.value.proposal_timer) || 0;
  }

  if (countdown.value > 0) {
    timerId = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        clearInterval(timerId);
        timerId = null;

        if (selectedIndex.value !== null) {
          socketStore.socket.sendEvents("vote", { option_id:  currentProposal.value.options[selectedIndex.value].id})
          console.log(
            "¡Tiempo agotado! Tu voto fue por:",
            currentProposal.value.options[selectedIndex.value].value
          );
        } else {
          console.log("¡Tiempo agotado! No has seleccionado ninguna opción.");
          socketStore.socket.sendEvents("vote", { option_id: 0})
        }
      }
    }, 1000);
  }
})

onUnmounted(() => {
  if (timerId) {
    clearInterval(timerId);
  }
});

</script>

<style scoped>
.proposal-container {
  border-radius: 20px;
  box-shadow: #a78bfa 0px 3px 8px;
}

.description {
  border-radius: 10px;
}

button {
  width: 300px;
}

.selected {
  @apply text-accent;
  transform: scale(1.1);
}

p {
  color: black;
}
</style>