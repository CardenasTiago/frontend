<template>

  <div class="flex flex-col items-center justify-center text-center h-screen w-screen">
    <div>
      <h2>Tiempo restante</h2>
    </div>
    <div>
      <h1 class="font-bold">00:30</h1>
    </div>
    <div v-if="currentProposal" class="proposal-container pb-4 m-4 w-[80%]">
      <div class="description bg-secondary p-4">
        <p>{{ currentProposal.description }} </p>
      </div>
      <h1 class="font-semibold">{{ currentProposal.title }}</h1>
    </div>

    <div
      v-for="(option, index) in currentProposal.options"
      :key="index"
    >
      <!-- Aplica una clase adicional cuando está seleccionado -->
      <button
        class="btn btn-primary font-semibold mt-4"
        :class="{ 'selected bg-success': selectedIndex === index }"
        @click="toggleSelection(index)"
      >
        {{ option.value }}
      </button>
    </div>

    
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useWebSocketStore } from '../stores/socketStore'
import { storeToRefs } from 'pinia'

const socketStore = useWebSocketStore();
const { currentProposal } = storeToRefs(socketStore)

const selectedIndex = ref(null);

function toggleSelection(index) {
  if (selectedIndex.value === index) {
    selectedIndex.value = null;
  } else {
    selectedIndex.value = index;
  }
}

onMounted(() => {

})

</script>

<style scoped>
.proposal-container {
  border-radius: 20px;
  box-shadow: #a78bfa 0px 3px 8px;
}

.description {
  border-radius: 10px;
}

button {
  width: 200px;
}

.selected {
  @apply text-accent;
  transform: scale(1.1);
}

p {
  color: black;
}
</style>