<template>
    <div class="p-10 flex flex-col gap-6 justify-center items-center">
        <h2>Resultados de la votación</h2>
        <div class ="flex flex-row flex-wrap gap-4 justify-center ">
            <CardResult :result="displayResults" :proposal="socketStore.currentProposal" />
            <TabChat />
        </div>

        <VoteState />
        <button class="btn btn-primary" v-if="room.privileges && !socketStore.currentProposal.last_prop"
            @click="nextProposal">
            Siguiente propuesta
        </button>

        <h1 v-if="socketStore.currentProposal.last_prop">fin de votacion</h1>
    </div>
</template>

<script setup>
import { provide, onMounted, ref, computed, watch } from 'vue';
import { useWebSocketStore } from '../../stores/socketStore'
import TabChat from '../components/TabChat.vue';
import VoteState from '../components/VoteState.vue';
import { useRouter } from 'vue-router';
import CardResult from '../components/CardResult.vue'

const socketStore = useWebSocketStore();

const router = useRouter();


const room = ref('');
const user = ref('');
onMounted(() => {
    socketStore.resultsAvailable = false

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

provide('user', user);
</script>