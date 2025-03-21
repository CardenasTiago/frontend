<template>
  <div class="flex flex-col items-center justify-center text-center h-screen w-screen">
    <div>
      <h2>Tiempo restante</h2>
    </div>
    <div>
      <h1 v-if="settingsRoom && settingsRoom.proposal_timer" class="font-bold">
        {{ socketStore.countdown }}
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

    <!-- Botón de confirmar que aparece si se ha seleccionado una opción -->
    <div v-if="selectedIndex !== null" class="mt-4">
      <button class="btn btn-primary font-bold" @click="confirmVote">
        Confirmar
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useWebSocketStore } from '../stores/socketStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter();
const socketStore = useWebSocketStore();
const { currentProposal, socket, resultsAvailable } = storeToRefs(socketStore);

const selectedIndex = ref(null);
const room = ref(null);
const error = ref("");
const settingsRoom = ref(null);

function toggleSelection(index) {
  if (selectedIndex.value === index) {
    selectedIndex.value = null;
  } else {
    selectedIndex.value = index;
  }
}

function confirmVote() {
  if (selectedIndex.value === null) return;
  // Envía el voto a través del socket
  socketStore.socket.sendEvents("vote", { option_id: currentProposal.value.options[selectedIndex.value].id });
  console.log("Voto confirmado:", currentProposal.value.options[selectedIndex.value].value);
  
  socket.voting = false;
  
  router.push('/awaitResults');
}

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
  
  const storedSettingsRoom = localStorage.getItem('settingsRoom');
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
    socketStore.startCountdown(Number(settingsRoom.value.proposal_timer) || 0);
  }
});

//si sos el admin y no votaste te lleva a confirmar resultados
watch(
  () => socketStore.resultsAvailable,
  (available) => {
    if (available && room.value?.privileges) {
      router.push('/confirmResults'); 
    }
  },
  { immediate: true }
);

//No llegaste a votar siendo usuario normal, se te muestra esta pagina hasta que se muestren los resultados
watch(resultsAvailable, (val) => {
  if (val && !room.value?.privileges) {
    router.push('/awaitResults');
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
