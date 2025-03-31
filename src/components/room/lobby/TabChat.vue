<template>
    <div class="chat-container flex  bg-base-100 border-secondary p-2 shadow-md shadow-secondary">

        <div v-if="socketStore.connected" class="text-success font-semibold flex items-end text-end">
            Conectado
        </div> 
        <div v-else-if="socketStore.reconnecting" class="text-warning">
            Intentando reconectar... (Intento {{ socketStore.reconnectAttempts }})
        </div>
        <div v-else class="text-error">
            Desconectado.
        </div>
        <div class="messages flex-1 overflow-y-auto">
            <ul>
                <li v-for="(msg, index) in messages" :key="index" class="text-accent">{{ msg }}</li>
            </ul>
        </div>

        <div class="send-message flex justify-between items-center w-full">
            <div class="flex-1">
                <input v-model="inputMessageLocal" class="flex bg-neutral m-0 p-2 w-full" type="text"
                    placeholder="Escribe un mensaje..." @keyup.enter="sendMessage" ref="msgInput" />
            </div>
            <div>
                <button @click="sendMessage" class="text-primary m-2">
                    <Icon icon="ic:baseline-send" width="24" height="24" />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useWebSocketStore } from '../stores/socketStore';
import { storeToRefs } from 'pinia'
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();
const socket = socketStore.socket;
const username = inject('username');

const {
    messages,
} = storeToRefs(socketStore)

const inputMessageLocal = ref('');



const sendMessage = () => {
    const msg = inputMessageLocal.value.trim();
    if (msg === '') return;
    if (socket && socketStore.connected) {
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
.chat-container {
    flex-direction: column;
    align-items: start;
    border-radius: 10px;
    min-height: 30vh;
}


.send-message {
    border-radius: 15px;
    @apply bg-neutral border border-secondary;
}

input {
    border-radius: 15px;
}

li {
    border-radius: 15px;
    width: fit-content;
    @apply bg-secondary p-2 m-2 ;
}
</style>