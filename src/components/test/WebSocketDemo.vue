<!-- src/components/WebSocketDemo.vue -->
<template>
  <div class="websocket-demo">
    <h2>Demo de WebSocket con Reconexión Automática</h2>

    <div v-if="connected" class="status connected">
      Conectado al servidor WebSocket.
    </div>
    <div v-else-if="reconnecting" class="status reconnecting">
      Intentando reconectar... (Intento {{ reconnectAttempts }})
    </div>
    <div v-else class="status disconnected">
      Desconectado del servidor WebSocket.
    </div>

    <div class="messages">
      <h3>Mensajes:</h3>
      <ul>
        <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
      </ul>
    </div>

    <div class="send-message">
      <input
        v-model="inputMessage"
        type="text"
        placeholder="Escribe un mensaje..."
        @keyup.enter="sendMessage"
      />
      <button @click="sendMessage">Enviar</button>
    </div>

    <button v-if="connected" @click="closeConnection">Cerrar Conexión</button>
    <button v-else @click="connect" :disabled="reconnecting">
      Conectar
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// URL del servidor WebSocket
const WS_URL = 'ws://localhost:3000/v1/rooms/ws';

// Referencia al objeto WebSocket
const socket = ref(null);

// Estado de conexión
const connected = ref(false);
const reconnecting = ref(false);

// Número de intentos de reconexión
const reconnectAttempts = ref(0);
const maxReconnectAttempts = 5;

// Mensajes recibidos
const messages = ref([]);

// Mensaje a enviar
const inputMessage = ref('');

// Tiempo base para reconexión en milisegundos
const reconnectBaseDelay = 1000; // 1 segundo

// Función para conectar al WebSocket
const connect = () => {
  if (socket.value) {
    console.warn('Ya estás conectado al WebSocket.');
    return;
  }

  socket.value = new WebSocket(WS_URL);

  socket.value.onopen = () => {
    connected.value = true;
    reconnecting.value = false;
    reconnectAttempts.value = 0;
    messages.value.push('Conexión abierta.');
  };

  socket.value.onmessage = (event) => {
    messages.value.push(`${event.data}`);
  };

  socket.value.onerror = (error) => {
    console.error('WebSocket Error:', error);
    messages.value.push('Error en la conexión WebSocket.');
  };

  socket.value.onclose = (event) => {
    connected.value = false;
    socket.value = null;
    messages.value.push('Conexión cerrada.');

    // Iniciar reconexión si no se ha alcanzado el máximo de intentos
    if (reconnectAttempts.value < maxReconnectAttempts) {
      attemptReconnect();
    } else {
      messages.value.push('Se alcanzó el número máximo de intentos de reconexión.');
    }
  };
};

// Función para enviar mensajes
const sendMessage = () => {
  if (socket.value && connected.value) {
    const msg = inputMessage.value.trim();
    if (msg === '') return;

    socket.value.send(msg);
    messages.value.push(`Tú: ${msg}`);
    inputMessage.value = '';
  } else {
    console.warn('No estás conectado al WebSocket.');
    messages.value.push('No estás conectado al servidor WebSocket.');
  }
};

// Función para cerrar la conexión
const closeConnection = () => {
  if (socket.value) {
    socket.value.close();
  }
};

// Función para intentar reconectar con Exponential Backoff
const attemptReconnect = () => {
  reconnecting.value = true;
  reconnectAttempts.value += 1;
  const delay = reconnectBaseDelay * Math.pow(2, reconnectAttempts.value - 1);

  messages.value.push(`Intentando reconectar en ${delay / 1000} segundos...`);

  setTimeout(() => {
    messages.value.push(`Intento de reconexión #${reconnectAttempts.value}`);
    connect();
  }, delay);
};

// Conectar al montar el componente (opcional)
onMounted(() => {
  connect();
});

// Cerrar la conexión al desmontar el componente
onBeforeUnmount(() => {
  closeConnection();
});
</script>

<style scoped>
.websocket-demo {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
  border: 2px solid #6b48ff;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.status {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
}

.connected {
  background-color: #d1fae5;
  color: #047857;
}

.reconnecting {
  background-color: #fde68a;
  color: #92400e;
}

.disconnected {
  background-color: #fee2e2;
  color: #dc2626;
}

.messages {
  margin-bottom: 1rem;
}

.messages ul {
  list-style-type: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}

.messages li {
  padding: 0.25rem 0;
  color: black;
}

.send-message {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.send-message input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.send-message button {
  padding: 0.5rem 1rem;
  background-color: #6b48ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.send-message button:hover {
  background-color: #5941d1;
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
