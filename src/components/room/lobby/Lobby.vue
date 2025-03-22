<template>
  <div class="main-container h-max w-screen items-center p-0 m-0">
    <div class="max-w-3xl mx-auto flex-shrink-0 overflow-hidden">
      <img class="w-full max-h-[40vh] object-contain object-center" :src="room.image || defaultImage"
        alt="Imagen de la sala" />
    </div>
    <div>
      <v-card flat elevation="0" class="min-h-[40vh] flex items-center justify-center elevation-0">
        <v-tabs v-model="tab" align-tabs="center" class="elevation-0">
          <div class="custom-buttons">
            <button :class="{ 'active-button': tab === 1 }" @click="tab = 1">Chat</button>
            <button :class="{ 'active-button': tab === 2 }" @click="tab = 2">Info</button>
            <button :class="{ 'active-button': tab === 3 }" @click="tab = 3">Usuarios</button>
          </div>

        </v-tabs>


        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1">
            <v-container>
              <TabChat />
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="2" :value="2">
            <v-container>
              <TabInfo />
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>

        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="3" :value="3">
            <v-container>
              <TabUsers />
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>

        <div class="flex justify-between align-baseline p-4">
          <a v-if="socketStore.connected" @click="closeConnection" class="btn btn-error text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor"
                d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2" />
            </svg>
          </a>
          <a v-else @click="connect" :disabled="socketStore.reconnecting" class="btn btn-warning">
            Conectar
          </a>
          <div v-if="room.privileges" class="flex justify-end">
            <a class="btn btn-primary initiliaze" @click="startVoting">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-1 14H9V8h2zm1 0V8l5 4z"/></svg>
            </a>
          </div>
        </div>
      </v-card>
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

import { ref, onMounted, provide, watch } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import TabChat from './TabChat.vue';
import TabInfo from './TabInfo.vue';
import TabUsers from './TabUsers.vue';

const socketStore = useWebSocketStore();
const {
  voting,
} = storeToRefs(socketStore)


const router = useRouter()
const room = ref('');
const roomId = ref('');
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

  const joinedRoomId = localStorage.getItem('joinedRoomId');
  roomId.value = JSON.parse(joinedRoomId);

  wsUrl = `ws://localhost:3000/v1/rooms/ws/${roomId.value}`;

  socketStore.connect(wsUrl);
});

function connect() {
  socketStore.connect(wsUrl);
};

function closeConnection() {
  socketStore.close();
  window.location.href = '/protected/joinRoom'
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

// Proveer valores para que otros componentes (por ejemplo, TabChat) puedan inyectarlos
provide('username', username);
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
