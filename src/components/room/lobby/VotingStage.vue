<template>

<div class="flex flex-col items-center justify-center text-center h-screen w-screen">
    <div>
      <h2>Tiempo restante</h2>
    </div>
    <div>
      <h1 class="font-bold">00:30</h1>
    </div>
    <div v-if="firstProposal" class="proposal-container pb-4 m-4 w-[80%]">
      <div class="description bg-secondary p-4">
        <p>{{ firstProposal.description }} </p>
      </div>
      <h1 class="font-semibold">{{ firstProposal.title }}</h1>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import { storeToRefs } from 'pinia'

const socketStore = useWebSocketStore();
const { firstProposal } = storeToRefs(socketStore)

onMounted(() => {

})

</script>

<style scoped>

.proposal-container{
  border-radius: 20px;
  box-shadow: #a78bfa 0px 3px 8px;
}

.description{
  border-radius: 10px;
}

p {
  color: black;
}
</style>