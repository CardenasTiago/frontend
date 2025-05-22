<template>
  <div class="flex h-screen flex-col justify-center items-center text-center">
    <div>
      <h2>Tiempo restante</h2>
    </div>
    <div>
      <h1 v-if="settingsRoom && settingsRoom.proposal_timer" class="font-bold">
        {{ socketStore.countdown }}
      </h1>
    </div>
    <div v-if="currentProposal" class="proposal-container flex flex-col min-w-[40vw] max-w-[50vw] pb-4 m-4">
      <div class="description bg-secondary font-semibold p-4">
        <p>{{ currentProposal.description }}</p>
      </div>
      <div class="proposal-header grid grid-cols-3 items-center py-2">
        <div></div>
        <h1 class="justify-self-center font-semibold">
          {{ currentProposal.title }}
        </h1>
        <a v-if="currentProposal.archive" @click="openFile(currentProposal.archive)"
          class="justify-self-end btn btn-primary btn-circle btn-sm mr-2 " title="Ver archivo">
          <Icon icon="material-symbols-light:docs-outline" width="20" height="20" />
        </a>
      </div>
    </div>

    <div v-for="(option, index) in currentProposal.options" :key="index">
      <button class="btn btn-primary font-semibold mt-4" :class="{ 'selected bg-success': selectedIndex === index }"
        @click="toggleSelection(index)">
        {{ option.value }}
      </button>
    </div>

    <div v-if="selectedIndex !== null" class="mt-4 flex justify-end">
      <a class="flex justify-end btn btn-primary font-bold" @click="confirmVote">
        Enviar
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="m3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a.993.993 0 0 0-1.39.91L2 9.12c0 .5.37.93.87.99L17 12L2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useWebSocketStore } from '../../stores/socketStore';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Icon } from "@iconify/vue";

const router = useRouter();
const socketStore = useWebSocketStore();
const { currentProposal, socket, resultsAvailable } = storeToRefs(socketStore);

const selectedIndex = ref(null);
const room = ref(null);
const error = ref("");
const settingsRoom = ref(null);

// Función para verificar si el archivo existe y abrirlo en una nueva pestaña
const openFile = (fileName) => {
  // Fallback opcional si no estuviera definida:
  const baseUrl = import.meta.env.PUBLIC_API_BASE_URL || 'http://localhost:3000';

  const fileURL = `${baseUrl}/uploads/proposalFiles/${fileName}`;
  window.open(fileURL, '_blank');
};

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
      error.value = 'Error al leer los datos de la configuración de la sala.';
      console.error(e);
    }
  } else {
    error.value = 'No se encontraron datos de la configuración de la sala en el almacenamiento local.';
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
  @apply text-accent bg-success;
  transform: scale(1.1);
}

p {
  color: black;
}
</style>