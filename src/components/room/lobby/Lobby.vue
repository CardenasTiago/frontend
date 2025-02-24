<template>

  <div class="main-container h-screen  w-screen items-center">
    <div>
      <v-card class="h-screen flex w-screen items-center justify-center">
        <v-tabs v-model="tab" align-tabs="center" hide-slider="true" class="">
          <div class="custom-buttons">
            <button :class="{ 'active-button': tab === 1 }" @click="tab = 1">Chat</button>
            <button :class="{ 'active-button': tab === 2 }" @click="tab = 2">Info</button>
            <button :class="{ 'active-button': tab === 3 }" @click="tab = 3">Usuarios</button>
          </div>

        </v-tabs>


        <v-tabs-window v-model="tab">
          <v-tabs-window-item :key="1" :value="1">
            <v-container>
              <TabChat ref="tabChatRef" />
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
              <TabUsers :clients="userList" />
            </v-container>
          </v-tabs-window-item>
        </v-tabs-window>
        <div v-if="room.privileges" class="flex justify-end m-10">
          <button class="btn btn-primary initiliaze">Iniciar</button>
        </div>
      </v-card>

    </div>

  </div>



  <button v-if="connected" @click="closeConnection">Cerrar Conexión</button>
  <button v-else @click="connect" :disabled="reconnecting">
    Conectar
  </button>
</template>

<script>
export default {
  data: () => ({
    tab: 2,
  }),
}
</script>


<script setup>

import { ref, onMounted, onBeforeUnmount, provide } from 'vue';
import TabChat from './TabChat.vue';
import TabInfo from './TabInfo.vue';
import TabUsers from './TabUsers.vue';

class Event {
  constructor(action, payload) {
    this.action = action;
    this.payload = payload;
  }
}

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
});

const userList = ref(null);
const socket = ref(null);

// Estado de conexión
const connected = ref(false);
const reconnecting = ref(false);
const reconnectAttempts = ref(0);
const maxReconnectAttempts = 5;
const inputMessage = ref('');
const reconnectBaseDelay = 1000; // 1 segundo

const tabChatRef = ref(null);

const connect = () => {
  if (socket.value) {
    console.warn('Ya estás conectado al WebSocket.');
    return;
  }

  socket.value = new WebSocket(wsUrl);

  socket.value.onopen = () => {
    connected.value = true;
    reconnecting.value = false;
    reconnectAttempts.value = 0;
    tabChatRef.value.pushMessage('Conexión abierta.');
  };

  socket.value.onmessage = (event) => {
    const eventData = JSON.parse(event.data);
    receiveEvents(eventData);
  };

  socket.value.onerror = (error) => {
    console.error('WebSocket Error:', error);
    tabChatRef.value.pushMessage('Error en la conexión WebSocket.');
  };

  socket.value.onclose = (event) => {
    connected.value = false;
    socket.value = null;
    if (event.code === 4001) {
      tabChatRef.value.pushMessage('La sala no existe. No se reintentará la conexión.');
      return;
    }
    tabChatRef.value.pushMessage('Conexión cerrada.');
    if (reconnectAttempts.value < maxReconnectAttempts) {
      attemptReconnect();
    } else {
      tabChatRef.value.pushMessage('Se alcanzó el número máximo de intentos de reconexión.');
    }
  };

  // Agregar un método personalizado al objeto WebSocket
  socket.value.sendEvents = (eventName, payload) => {
    const evt = new Event(eventName, payload);
    socket.value.send(JSON.stringify(evt));
  };
};

// Función para manejar los eventos recibidos
function receiveEvents(eventData) {
  if (!eventData.action) {
    alert("Evento no definido");
    return;
  }

  switch (eventData.action) {
    case "send_message":
      tabChatRef.value.pushMessage(`${eventData.payload.from} : ${eventData.payload.message}`);
      break;
    case "update_client_list":
      updateClientList(eventData.payload);
      break;
    default:
      alert("Unsupported action");
      break;
  }
}

function updateClientList(payload) {
  // Si el servidor envía un payload en formato string, parsearlo
  const data = typeof payload === 'string' ? JSON.parse(payload) : payload
  // Se espera una estructura { clients: [] }
  userList.value = data.clients || []
  console.log('Lista de usuarios actualizada en el padre:', userList.value)
}

// Función para cerrar la conexión
const closeConnection = () => {
  if (socket.value) {
    socket.value.close();
  }
};

// Función para reconectar con Exponential Backoff
const attemptReconnect = () => {
  reconnecting.value = true;
  reconnectAttempts.value += 1;
  const delay = reconnectBaseDelay * Math.pow(2, reconnectAttempts.value - 1);
  tabChatRef.value.pushMessage(`Intentando reconectar en ${delay / 1000} segundos...`);
  setTimeout(() => {
    tabChatRef.value.pushMessage(`Intento de reconexión #${reconnectAttempts.value}`);
    connect();
  }, delay);
};

onMounted(() => {
  connect();
});

onBeforeUnmount(() => {
  closeConnection();
});

// Proveer valores para que otros componentes (por ejemplo, TabChat) puedan inyectarlos
provide('socket', socket);
provide('connected', connected);
provide('username', username);
provide('inputMessage', inputMessage);
</script>

<style scoped>
.main-container {
  margin: 0 auto;
  padding: 1rem;
  border-radius: 8px;
  @apply bg-neutral
}


.custom-tab {
  margin: 0 20px;
  padding: 8px 16px;
}

button {
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  font-weight: 700;
  border-radius: 30px;
  cursor: pointer;
  @apply text-primary;
}

button:active {
  @apply bg-primary;
  @apply text-neutral;
}

button:hover {
  @apply bg-primary;
  @apply text-neutral;
}

.custom-buttons button.active-button {
  @apply bg-primary text-neutral;
}

/* Opcional: estilos para hover */
.custom-buttons button:hover {
  @apply bg-primary text-neutral;
  transition: all 0.3s;
}
</style>
