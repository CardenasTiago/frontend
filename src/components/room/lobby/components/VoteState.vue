<template>
    <div class="w-full px-4 mx-4">
      <ul class="users flex flex-wrap justify-center gap-4">
        <li v-for="client in userList" :key="client.username" class="flex flex-col items-center">
          <div :class="[
            'w-16 h-16 rounded-full border-4',
            client.voted ? 'border-green-500' : 'border-gray-500',
          ]">
            <!-- Si hay imagen, se muestra la etiqueta <img> -->
            <img v-if="client.image" :src="client.image" alt="Foto de perfil"
              class="w-full h-full rounded-full object-cover" />

            <!-- Si no hay imagen, se muestra el componente Icon -->
            <Icon v-else icon="ic:baseline-person" class="w-full h-full rounded-full object-cover p-2 text-secondary" width="58"
              height="58" />
          </div>
          <p class="mt-2 font-semibold text-secondary">{{ client.username }}</p>
        </li>
      </ul>
    </div>
</template>

<script setup>
import { useWebSocketStore } from '../../stores/socketStore';
import { storeToRefs } from 'pinia'

const socketStore = useWebSocketStore();
const {
  userList
} = storeToRefs(socketStore)
</script>