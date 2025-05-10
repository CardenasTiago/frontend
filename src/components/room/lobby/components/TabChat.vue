<template>
    <div class="chat-container flex justify-between bg-secondary/10 border-secondary p-2 shadow-md shadow-secondary gap-2 "
        :style="{ maxHeight: props.maxVh + 'vh' }">
        <div v-if="socketStore.connected" class="text-success font-semibold flex items-end text-end">
            Conectado
        </div>
        <div v-else-if="socketStore.reconnecting" class="text-warning">
            Intentando reconectar... (Intento {{ socketStore.reconnectAttempts }})
        </div>
        <div v-else class="text-error">
            Desconectado.
        </div>
        <div class="messages flex-1 w-full justify-start gap-2 overflow-y-auto" ref="messagesContainer">
            <ul>
                <li v-for="(msg, index) in messages" :key="index"
                    :class="['text-start', msg.isCurrentUser ? 'bg-primary' : 'bg-secondary']" class="p-2 m-2 rounded">
                    {{ msg.text }}
                </li>
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
import { inject, ref, onUpdated } from 'vue';
import { useWebSocketStore } from '../../stores/socketStore';
import { storeToRefs } from 'pinia'
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();
const socket = socketStore.socket;
const user = inject('user');

const {
    messages,
} = storeToRefs(socketStore)

const inputMessageLocal = ref('');
const messagesContainer = ref(null);

const props = defineProps({
    maxVh: {
        type: [Number, String],
        default: 60
    }
})
const sendMessage = () => {
    const msg = inputMessageLocal.value.trim();
    if (msg === '') return;
    if (socket && socketStore.connected) {
        socket.sendEvents("send_message", { from: user.value.username, message: msg });
        socketStore.pushMessage("tu: " + msg, true);
        inputMessageLocal.value = '';
    } else {
        console.warn('No estás conectado al WebSocket.');
        socketStore.pushMessage('No estás conectado al servidor WebSocket.');
    }
};

onUpdated(() => {
    if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
});
</script>

<style scoped>
.chat-container {
    flex-direction: column;
    align-items: start;
    border-radius: 10px;
    min-height: 30vh;
}

.messages {
    height: 26vh;
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
    max-width: 80vw;
    overflow-wrap: break-word;
    @apply text-white p-2 m-2;
}
</style>