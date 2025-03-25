<template>
  <div
    class="main-container h-[85vh] w-screen grid grid-rows-[35%,50%,10%] overflow-hidden p-0 m-0"
  >
    <div
      :style="containerStyle"
      class="relative w-full h-full max-w-3xl mx-auto overflow-hidden mt-0 p-0"
    >
      <!-- Imagen de fondo borrosa -->
      <img
        class="absolute inset-0 w-full h-full object-cover filter blur-sm mt-0 p-0"
        :src="room.image || defaultImage"
        alt="Imagen de fondo"
        crossOrigin="anonymous"
      />
      <!-- Imagen principal -->
      <img
        class="relative w-full h-full object-contain object-center mt-0 p-0"
        ref="imgElement"
        :src="room.image || defaultImage"
        alt="Imagen de la sala"
        @load="extractDominantColor"
        crossOrigin="anonymous"
      />
    </div>
    <div class="overflow-y-auto">
      <v-card flat elevation="0" class="flex flex-col items-center justify-center">
        <v-tabs v-model="tab" align-tabs="center" class="w-full">
          <div class="custom-buttons mb-4">
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
    </div>
    <footer class="flex justify-between items-center px-4 p-0 mb-0">
      <a v-if="socketStore.connected" @click="closeConnection" class="btn btn-error text-white">
        <!-- Ícono SVG de desconexión -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"
          />
        </svg>
      </a>
      <button v-else @click="connect" :disabled="socketStore.reconnecting" class="btn btn-warning">
        Conectar
      </button>
      <div v-if="room.privileges" class="flex justify-end">
        <a class="btn btn-primary" @click="startVoting">
          Iniciar
          <Icon icon="ic:baseline-not-started" width="24" height="24" />
        </a>
      </div>
    </footer>
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

import { ref, onMounted, onUnmounted, provide, watch, computed } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import ColorThief from 'colorthief';
import TabChat from './TabChat.vue';
import TabInfo from './TabInfo.vue';
import TabUsers from './TabUsers.vue';
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();
const {
  voting,
} = storeToRefs(socketStore)


const router = useRouter()
const room = ref('');
const username = ref('');
let wsUrl = ''; // Variable normal, ya que no se requiere reactividad

onMounted(() => {
  const loggedUser = localStorage.getItem('userName');
  username.value = loggedUser;
  const storedRoom = localStorage.getItem('currentRoom');

  if (storedRoom) {
    room.value = JSON.parse(storedRoom);
  } else {
    console.error('No se encontró el room ID en el almacenamiento local.');
  }

  wsUrl = `ws://localhost:3000/v1/rooms/ws/${room.value.id}`;

  socketStore.connect(wsUrl);
});

function connect() {
  socketStore.connect(wsUrl);
};

function closeConnection() {
  socketStore.close();
  window.location.href = '/protected/menu'
};

function startVoting() {
  socketStore.socket.sendEvents("start_voting", { from: username.value })
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

provide('username', username);

const defaultImage = '/src/assets/default-image.jpg'; 
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
  size: 1.1rem;
}

.btn-error {
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;

}

</style>
