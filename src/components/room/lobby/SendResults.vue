<template>
    <h1>mostrar resultados</h1>
    <button class="btn btn-primary" @click="showResults">Mostrar</button>
</template>

<script setup>
import { useWebSocketStore } from '../stores/socketStore'
import { useRouter } from 'vue-router'

const socketStore = useWebSocketStore();

const router = useRouter()

function showResults() {
    socketStore.socket.sendEvents('results', {})
    router.push('/results' )
}

</script>