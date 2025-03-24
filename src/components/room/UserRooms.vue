<template>
  <div class="flex justify-center">
    <BackButton/>    
  </div>
  <div v-for="(sala, index) in paginatedSalas" :key="index" class="max-w-screen-md mx-auto px-4  mt-8  bg-neutral rounded-lg">
    <a :href="`/protected/room/${sala.id}`" @click="handleCardClick" class="card card-side bg-neutral flex items-stretch h-[150px] lg:h-[180px] md:h-[180px] hover:shadow-lg hover:-translate-y-1 transition duration-300 border-2 border-secondary/30">      
        
        <div class="mt-1 p-3 w-2/3 ml-3 flex flex-col gap-3 ">
          <p class="text-secondary text-xs font-bold lg:text-sm  md:text-sm">{{ sala.state }}</p>
          <h2 class="card-title text-accent opacity-80 text-sm lg:text-xl md:text-md">{{truncateText (sala.room_title, 28) }}</h2>
          <p class="text-xs text-accent opacity-60 lg:text-sm hidden lg:block md:block " >{{truncateText (sala.description,50) }}</p>

          <div class="relative flex justify-between ">
            <button class="btn bg-transparent hover:bg-transparent border-none shadow-none p-0 "
              @click.stop.prevent="openDeleteModal(sala)">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-5 lg:size-6 md:size-6 text-primary hover:text-accent">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>

            <div class="lg:hidden md:hidden text-accent opacity-70 flex items-center gap-x-1  ">
              <p class="text-xs">Ver más</p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 mt-1">
                <path fill-rule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z"
                  clip-rule="evenodd" />
              </svg>
            </div>
          </div>       
        </div>

        <div v-if="sala.startTime" class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative md:flex md:w-1/3 ">
          <div class="absolute top-center left-0 h-36 w-px bg-accent opacity-30 "></div>
          <p class="  text-accent opacity-60 ">{{sala.startTime.toLocaleString('default', { month: 'long' }) }}</p>
          <h2 class="m-3 text-accent opacity-80 lg:text-4xl md:text-4xl">{{sala.startTime.getDate() }}</h2>
          <p class="text-accent opacity-60">
            <span v-if="sala.startTime">
              {{ sala.startTime.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false }) }}
            </span>
          </p>
        </div>
        <div v-else class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative">
          <p class="text-accent opacity-60">Fecha no disponible</p>
        </div>

        <div class="w-1/3 rounded-lg overflow-hidden">
          <img class="w-full h-full object-cover" :src="sala.image  || defaultImage"
            alt="Imagen de la sala" />
        </div>


      
    </a>
  </div>

  <!-- Paginador -->
  <div class="join flex justify-center mt-6">
    <button class="join-item btn bg-primary" :disabled="currentPage === 1" @click="previousPage">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
        <path fill-rule="evenodd"
          d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z"
          clip-rule="evenodd" />
      </svg>
    </button>
    <button class="join-item btn bg-primary">Página {{currentPage}}</button>
    <button class="join-item btn bg-primary" :disabled="currentPage === totalPages" @click="nextPage">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4">
        <path fill-rule="evenodd"
          d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd" />
      </svg>

    </button>
  </div>


  <!-- Insertamos el componente DeleteRoom -->
  <DeleteRoom ref="deleteRoomRef" />

</template>

<script setup>
  import { ref, onMounted,computed } from 'vue' 
  import DeleteRoom from "../room/deleteRoom/DeleteRoom.vue";
  import BackButton from "../reusable/BackButton2.vue"
  

  const salas = ref([]); 
  const defaultImage = "/images/cerveza.jpeg"; // Imagen por defecto 
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

 


  //obtener salas
   const obtenerDatosSala = async () => {    
  try {
    const response = await fetch("http://localhost:3000/v1/rooms/myRooms",{
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos')
    }

    const data = await response.json();

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
  .card{
    border-radius: 15px;
    box-shadow:
    rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    }
 </style>