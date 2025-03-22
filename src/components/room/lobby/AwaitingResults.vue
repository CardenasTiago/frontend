<template>
    <div class="flex flex-col items-center justify-center text-center h-screen w-screen">
        <div>
            <h2>Tiempo restante</h2>
        </div>
        <div>
            <h1 class="font-bold">
                {{ socketStore.countdown }}
            </h1>
        </div>
        <div class="w-full">
            <ul class="users flex justify-between font-semibold" v-for="client in userList" :key="client">
                <li class="text-start">
                    {{ client.username }}
                    {{ client.voted }}
                </li>
                <li class="text-end">
                    <span class="status">en línea</span>
                    <span class="inline-block ml-2 w-3 h-3 bg-[#71F260] rounded-full mr-1"></span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { useWebSocketStore } from '../stores/socketStore';
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const router = useRouter();
const socketStore = useWebSocketStore();
const {
    userList
} = storeToRefs(socketStore)

const room = ref('');
const settingsRoom = ref(null);
onMounted(() => {
    const storedRoom = localStorage.getItem('currentRoom');
  if (storedRoom) {
    try {
      room.value = JSON.parse(storedRoom);
    } catch (e) {
      error.value = 'Error al leer los datos de la sala.';
      console.error(e);
    }
  } else {
    error.value = 'No se encontraron datos de la sala en el almacenamiento local.';
  }
  
  const storedSettingsRoom = localStorage.getItem('settingsRoom');
  if (storedSettingsRoom) {
    try {
      settingsRoom.value = JSON.parse(storedSettingsRoom);
    } catch (e) {
      error.value = 'Error al leer los datos de la configuracion de la sala.';
      console.error(e);
    }
  } else {
    error.value = 'No se encontraron datos de la configuracion de la sala en el almacenamiento local.';
  }
});

onUnmounted(() => {
    socketStore.stopCountdown();
});


//El admin voto y los resultados estan listos
watch(
  () => socketStore.resultsAvailable,
  (available) => {
    if (available && room.value?.privileges) {
      router.push('/confirmResults'); 
    }
  },
  { immediate: true }
);

//Votante normal y resultados listos
watch(
  () => socketStore.resultsReady,
  (available) => {
    if (available && !room.value?.privileges) {
      router.push('/results'); 
    }
  },
  { immediate: true }
);

</script>