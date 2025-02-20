<template>

    <h2>Usuarios conectados</h2>
    <ul>
        <li v-for="client in clients" :key="client">{{ client }}</li>
    </ul>
</template>

<script setup>
import { ref, defineExpose  } from 'vue';

const clients = ref([])

function updateClientList(payload) {
    // Si payload es una cadena, se puede parsear
    const data = typeof payload === 'string' ? JSON.parse(payload) : payload
    // Se espera que data tenga la estructura: { clients: [ ... ] }
    clients.value = data.clients || []
    console.log("Lista actualizada:", clients.value)
}

defineExpose({
    updateClientList
});

</script>