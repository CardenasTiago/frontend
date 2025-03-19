<template>
    <div>
        <h2>Resultados de la votación</h2>
        <ul>
            <li v-for="option in displayResults" :key="option.id">
                {{ option.value }}: {{ option.count }} voto(s)
            </li>
        </ul>

        <TabChat />


        <button class="btn btn-primary" v-if="room.privileges && !socketStore.currentProposal.last_prop"
            @click="nextProposal">
            Siguiente propuesta
        </button>

        <h1 v-if="socketStore.currentProposal.last_prop">fin de votacion</h1>

    </div>
</template>

<script setup>
import { provide, onMounted, ref, computed, watch } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import TabChat from './TabChat.vue';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const socketStore = useWebSocketStore();

const router = useRouter();
const {
    voting,
} = storeToRefs(socketStore)


const room = ref('');
const username = ref('');
onMounted(() => {
    socketStore.resultsAvailable = false
    const loggedUser = localStorage.getItem('userName');
    username.value = loggedUser;

    const storedRoom = localStorage.getItem('currentRoom');

    if (storedRoom) {
        room.value = JSON.parse(storedRoom);
    } else {
        console.error('No se encontró el room ID en el almacenamiento local.');
    }
});

const displayResults = computed(() => {
    if (!socketStore.currentProposal || !socketStore.currentProposal.options) {
        return []
    }
    const voteCounts = socketStore.voteCounts
    return socketStore.currentProposal.options.map(option => {
        return {
            ...option,
            count: voteCounts[option.id] || 0
        }
    })
})

function nextProposal() {
    socketStore.socket.sendEvents('next_proposal', {})
}

const currentProposal = computed(() => socketStore.currentProposal);

watch(currentProposal, (newVal, oldVal) => {
    console.log("currentProposal cambió de", oldVal, "a", newVal);
    if (newVal) {
        router.push('/voting');
    }
});


provide('username', username);
</script>