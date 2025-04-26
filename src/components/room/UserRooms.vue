<template>
  <div v-bind="$attrs">
    <div class="ml-4">
      <BackButton />
    </div>
    <div v-if="salas.length === 0" class="flex flex-col items-center justify-center mt-10">
      <h2 class="text-accent text-lg mb-4">Hmm, no hay nada aqui.</h2>
      <a href="/protected/createRoom" class="btn btn-primary text-white">
        Crear tu primera sala
        <Icon icon="mdi:plus-circle-outline" width="24" height="24" class="ml-2" />
      </a>
    </div>
    <div class="flex flex-col items-center justify-center" v-else>
      <h1 class="font-semibold">Mis salas</h1>
    </div>
    <div class="grid grid-rows-2 min-h-[75vh]">
      <div v-for="(sala, index) in paginatedSalas" :key="index"
        class="md:w-full lg:min-w-[60vw] lg:max-w-[70vw] lg:mx-auto px-4 mt-8 bg-neutral rounded-lg">
        <a :href="`/protected/room/${sala.id}`" @click="handleCardClick"
          class="card card-side bg-neutral flex items-stretch h-[150px] lg:h-[180px] md:h-[180px] hover:shadow-lg hover:-translate-y-1 transition duration-300 border-2 border-secondary/30">

          <div class="mt-1 p-3 w-2/3 ml-3 flex flex-col gap-3">
            <p class="self-start inline-block text-xs font-bold px-3 py-1 rounded-[15px] capitalize"
              :class="stateClasses(sala.state)">
              {{ sala.state }}
            </p>
            <h2 class="card-title text-accent opacity-80 text-xs lg:text-xl md:text-md">{{ truncateText(sala.room_title,
              28)
              }}</h2>
            <p class="text-xs text-accent opacity-60 lg:text-sm hidden lg:block md:block ">{{ truncateText
              (sala.description, 50) }}</p>

              <button
                class="self-start btn bg-transparent hover:bg-transparent border-none shadow-none p-0 "
                @click.stop.prevent="openDeleteModal(sala)">
                <Icon icon="heroicons:trash" class="w-5 h-5 lg:w-6 lg:h-6 text-primary hover:text-error" />
              </button>
          </div>

          <div v-if="sala.startTime"
            class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative md:flex md:w-1/3 ">
            <div class="absolute top-center left-0 h-36 w-px bg-accent opacity-30 "></div>
            <p class="  text-accent opacity-60 ">{{ sala.startTime.toLocaleString('default', { month: 'long' }) }}</p>
            <h2 class="m-3 text-accent opacity-80 lg:text-4xl md:text-4xl">{{ sala.startTime.getDate() }}</h2>
            <p class="text-accent opacity-60">
              <span v-if="sala.startTime">
                {{ sala.startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) }}
              </span>
            </p>
          </div>
          <div v-else class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative">
            <p class="text-accent opacity-60">Fecha a determinar</p>
          </div>
          <div class="w-1/3 rounded-lg overflow-hidden">
            <img class="w-full h-full object-cover" :src="sala.image || defaultImage" alt="Imagen de la sala" />
          </div>
        </a>
      </div>
    </div>


    <!-- Paginador -->
    <div v-if="salas.length > 3" class="join flex justify-center mt-6 ">
      <button class="join-item btn bg-primary hover:bg-primary" :disabled="currentPage === 1" @click="previousPage">
        <Icon icon="heroicons-solid:arrow-left" class="h-4 w-4" />
      </button>

      <button class="join-item btn bg-primary hover:bg-primary">Página {{ currentPage }}</button>

      <button class="join-item btn bg-primary hover:bg-primary" :disabled="currentPage === totalPages"
        @click="nextPage">
        <Icon icon="heroicons-solid:arrow-right" class="h-4 w-4" />
      </button>
    </div>
    <!-- Insertamos el componente DeleteRoom -->
    <DeleteRoom ref="deleteRoomRef" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DeleteRoom from "../room/deleteRoom/DeleteRoom.vue";
import BackButton from "../reusable/BackButton2.vue"
import { Icon } from "@iconify/vue";
import RoomService from '../../services/room.service';


const salas = ref([]);
const defaultImage = "/defaultRoomImage.png"; // Imagen por defecto 
const deleteRoomRef = ref(null);  // Referencia para el componente DeleteRoom

// Estado de la paginación
const currentPage = ref(1);
const itemsPerPage = 3; // Número de elementos por página

// Computed properties para calcular el total de páginas y la lista de elementos por página
const totalPages = computed(() => Math.ceil(salas.value.length / itemsPerPage));

const paginatedSalas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return salas.value.slice(start, end);
});

// Funciones para cambiar de página
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};


// Esta función se ejecuta solo cuando se hace clic en la tarjeta
const handleCardClick = (event) => {

}

// Función para truncar el texto con un límite de caracteres
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

const stateClasses = (state) => {
  switch (state) {
    case 'created':
      return 'bg-info/60 text-white border-2 border-info/80'
    case 'online':
      return 'bg-success/60 text-white border-2 border-success/80 animate-bounce'
    case 'voting':
      return 'bg-alert/60 text-white border-2 border-alert/80'
    case 'finished':
      return 'bg-error/60 text-white border-2 border-error/80'
    default:
      return 'bg-gray-300/60 text-gray-700 border-2 border-gray/80'
  }
}


//obtener salas
const obtenerDatosSala = async () => {
  try {
    const response = await RoomService.adminRooms();

    const data = JSON.parse(response)

    if (data === null) {
      console.log('No se encontraron salas.');
      salas.value = [];
    } else {
      // Asignar los datos     
      salas.value = data.map((item) => ({
        room_title: item.room_title || 'Sala sin nombre',
        state: item.state || 'SIN ESTADO',
        id: item.id,
        description: item.description || 'sala sin descripción',
        image: item.image,
        startTime: item.start_time ? new Date(item.start_time) : null,

      })).reverse();

    }

  } catch (error) {
    console.error('Error al cargar los datos:', error)
  }
}

// Llamamos a la función del componente hijo cuando se hace clic en el botón "Eliminar"
const openDeleteModal = (sala) => {
  deleteRoomRef.value.openModal(sala);
};

onMounted(() => {
  obtenerDatosSala();
});


</script>
<style>
.card {
  border-radius: 15px;
  box-shadow:
    rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
}
</style>