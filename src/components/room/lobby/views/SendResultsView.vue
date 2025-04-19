<template>
    <div class="flex flex-col items-center justify-center h-screen">
        <div class="flex flex-col items-center justify-center bg-base-100 rounded-lg p-6">
        <div class="flex flex-row text-primary gap-2 items-center">
            <h1>Mostrar resultados</h1>
            <Icon icon="mdi:graph-pie" width="24" height="24" />
        </div>
        <div class="mt-8">
            <button class="btn btn-primary" @click="showResults">Mostrar</button>
        </div>
    </div>
    </div>
    
</template>

<script setup>
import { useWebSocketStore } from '../../stores/socketStore'
import { useRouter } from 'vue-router'
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();

const router = useRouter()

function showResults() {
    socketStore.socket.sendEvents('results', {})
    router.push('/results')
}
</script>