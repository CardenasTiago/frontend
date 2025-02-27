<template>
    <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router';
import { useWebSocketStore } from './stores/socketStore';
import { onBeforeUnmount } from 'vue';

const socketStore = useWebSocketStore()

onBeforeUnmount(() => {
  socketStore.close();
});
</script>