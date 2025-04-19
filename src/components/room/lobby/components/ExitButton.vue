<template>
    <a v-if="socketStore.connected" @click="closeConnection()" class="btn btn-error text-white">
        <Icon icon="ic:baseline-exit-to-app" width="24" height="24" />
    </a>
</template>

<script setup>
import { useWebSocketStore } from '../../stores/socketStore'
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();

const closeConnection = () => {
  socketStore.close();
  window.location.href = '/protected/menu';
};
</script>