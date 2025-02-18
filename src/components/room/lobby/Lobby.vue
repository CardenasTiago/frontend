<template>
  <div class="main-container">
    <div role="tablist" class="tabs tabs-lifted">
      <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="Chat" />
      <div role="tabpanel" class="tab-content p-10">
        <TabChat ref="tabChatRef"/>        
      </div>

      <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="info" checked="checked" />
      <div role="tabpanel" class="tab-content p-10">
        <TabInfo />
      </div>

      <input type="radio" name="my_tabs_1" role="tab" class="tab" aria-label="usuarios" />
      <div role="tabpanel" class="tab-content p-10">
        <TabUsers />
      </div>
    </div>

    <button v-if="connected" @click="closeConnection">Cerrar Conexión</button>
    <button v-else @click="connect" :disabled="reconnecting">
      Conectar
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, provide } from 'vue';
import TabChat from './TabChat.vue'
import TabInfo from './TabInfo.vue'
import TabUsers from './TabUsers.vue'

// Declarar la clase Event ANTES de usarla
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
    default:
      alert("Unsupported action");
      break;
  }
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
  width: 600px;
  height: 600px;
  margin: 0 auto;
  padding: 1rem;
  border: 2px solid #6b48ff;
  border-radius: 8px;
  background-color: #f9f9f9;
}

button {
  padding: 0.5rem 1rem;
  background-color: #6b48ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #5941d1;
}

button:disabled {
  background-color: #a78bfa;
  cursor: not-allowed;
}
</style>
