<template>
  <div class="main-container h-[100vh] w-screen grid grid-rows-[35%,auto] overflow-hidden p-0 m-0">
    <div :style="containerStyle" class="relative w-full h-full mx-auto overflow-hidden mt-0 p-0">
      <!-- Imagen de fondo borrosa -->
      <img class="absolute inset-0 w-full h-full object-cover filter blur-md mt-0 p-0" :src="room.image || defaultImage"
        alt="Imagen de fondo" crossOrigin="anonymous" />
      <!-- Imagen principal -->
      <img class="relative w-full h-full object-contain object-center mt-0 p-0" ref="imgElement"
        :src="room.image || defaultImage" alt="Imagen de la sala" @load="extractDominantColor"
        crossOrigin="anonymous" />
    </div>
    <div class="overflow-y-auto w-full">
      <v-card flat elevation="0" class="flex items-center justify-center">
        <v-tabs v-model="tab" align-tabs="center" class="w-full">
          <div class="custom-buttons mb-4 pl-6">
            <button :class="{ 'active-button': tab === 1 }" @click="tab = 1">
              Chat
            </button>
            <button :class="{ 'active-button': tab === 2 }" @click="tab = 2">
              Info
            </button>
            <button :class="{ 'active-button': tab === 3 }" @click="tab = 3">
              Usuarios
            </button>
          </div>
        </v-tabs>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1">
            <v-container>
              <TabChat />
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item :key="2" :value="2">
            <v-container>
              <TabInfo />
            </v-container>
          </v-tabs-window-item>
          <v-tabs-window-item :key="3" :value="3">
            <v-container>
              <TabUsers />
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
      <footer class="absolute bottom-0 z-10 flex flex-row justify-between py-2 px-4 w-full">
        <div>
          <ExitButton />
          <a v-if="!socketStore.connected" @click="connect" class="btn btn-warning text-white">
            <Icon icon="ic:baseline-replay" width="24" height="24" />
          </a>
        </div>
        <div v-if="room.privileges" class="">
          <QuorumButton buttonText="Iniciar" :action="startVoting" />
        </div>
      </footer>
    </div>

  </div>
</template>
<script>
export default {
  data: () => ({
    tab: 2,
  }),
}
</script>
<script setup>

import { ref, onMounted, provide, watch, computed } from 'vue';
import { useWebSocketStore } from '../../stores/socketStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ColorThief from 'colorthief';
import TabChat from '../components/TabChat.vue';
import TabInfo from '../components/TabInfo.vue';
import TabUsers from '../components/TabUsers.vue';
import QuorumButton from '../components/QuorumButton.vue';
import { Icon } from "@iconify/vue";
import ExitButton from '../components/ExitButton.vue';

const socketStore = useWebSocketStore();
const {
  voting,
} = storeToRefs(socketStore)


const router = useRouter()
const room = ref('');
const user = ref('');
const quorum = ref('');

const theme = ref(localStorage.getItem('theme') || 'mytheme');

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value);
  const loggedUser = localStorage.getItem('user');
  if (loggedUser) {
    user.value = JSON.parse(loggedUser);
  }

  const storedRoom = localStorage.getItem('currentRoom');

  if (storedRoom) {
    room.value = JSON.parse(storedRoom);
  } else {
    console.error('No se encontró el room ID en el almacenamiento local.');
  }

  const settingsRoom = localStorage.getItem('settingsRoom');
  if (settingsRoom) {
    const settings = JSON.parse(settingsRoom);
    quorum.value = settings.quorum;
  }
  socketStore.connect(room.value.id);
});

function connect() {
  socketStore.connect(room.value.id);
};

function startVoting() {
  socketStore.socket.sendEvents("start_voting", { from: user.value.username })
}

//atento para ver cuando arranca la votacion y redireccionar
watch(voting, (val) => {
  if (val) {
    router.push('/voting')
  }
})

//en caso de que un usuario entre tarde a la sala y la votacion ya haya empezado
watch(socketStore.resultsReady, (val) => {
  if (val) {
    router.push('/results')
  }
})

watch(
  () => socketStore.redirectMenu,
  (available) => {
    if (available && room.value?.privileges) {
      window.location.href = '/protected/menu'
    }
  },
  { immediate: true }
);

provide('user', user);
provide('quorum', quorum);

const defaultImage = '/defaultRoomImage.png';
const dominantColor = ref('');
const imgElement = ref(null);

const extractDominantColor = () => {
  if (imgElement.value && imgElement.value.complete) {
    try {
      const colorThief = new ColorThief();
      const result = colorThief.getColor(imgElement.value);
      dominantColor.value = `rgb(${result.join(',')})`;
    } catch (error) {
      console.error('Error al extraer el color dominante:', error);
    }
  }
};

const containerStyle = computed(() => ({
  boxShadow: dominantColor.value ? `0 4px 10px ${dominantColor.value}` : 'none'
}));


</script>

<style scoped>
.main-container {
  border-radius: 8px;
  @apply bg-neutral
}


.custom-tab {
  margin: 0 20px;
  padding: 8px 16px;
}

button {
  @apply text-accent;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;
  @apply text-primary;
}

button:active {
  @apply bg-primary;
}

button:hover {
  @apply bg-primary;
  @apply text-white;
}

.custom-buttons button.active-button {
  @apply bg-primary text-white;
}

/* Opcional: estilos para hover */
.custom-buttons button:hover {
  @apply bg-primary text-white;
  transition: all 0.3s;
}

.initiliaze {
  border-radius: 30px;
  @apply text-white
}

.initiliaze:hover {
  size: 1.4rem;
}

.btn-error {
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;

}
</style>
