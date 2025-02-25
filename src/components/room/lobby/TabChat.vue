<template>
    <div class="chat-container">

        <div v-if="connected" class="status connected">
            Conectado
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
            <input v-model="inputMessageLocal" type="text" placeholder="Escribe un mensaje..."
                @keyup.enter="sendMessage" ref="msgInput" />
            <button @click="sendMessage">Enviar</button>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useWebSocketStore } from '../stores/socketStore';
import { storeToRefs } from 'pinia'

const socketStore = useWebSocketStore();
const socket = socketStore.socket;
const username = inject('username');

const { 
  connected, 
  reconnecting, 
  reconnectAttempts, 
  messages, 
  userList 
} = storeToRefs(socketStore)

const inputMessageLocal = ref('');



const sendMessage = () => {
    const msg = inputMessageLocal.value.trim();
    if (msg === '') return;
    if (socket && connected) {
        socket.sendEvents("send_message", { from: username.value, message: msg });
        socketStore.pushMessage(`Tú: ${msg}`);
        inputMessageLocal.value = '';
    } else {
        console.warn('No estás conectado al WebSocket.');
        socketStore.pushMessage('No estás conectado al servidor WebSocket.');
    }
};

</script>

<style scoped>

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