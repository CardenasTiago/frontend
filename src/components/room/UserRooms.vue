<template>     
    <div v-for="(sala, index) in salas" :key="index" class="container mx-auto px-4  mt-8 max-w-screen-md">
      <a :href= "`/protected/room/${sala.id}`" @click="handleCardClick" >  
        
        <div class="card card-side bg-white flex items-stretch min-h-[150px] hover:shadow-lg hover:-translate-y-1 transition duration-300 ">        
                  
            <div class="card-body p-2 lg:p-3 lg:w-2/3">
              <p class=" text-secondary sm:text-xs sm:font-bold lg:text-sm lg:font-normal">{{ sala.state }}</p>
                <h2 class="card-title text-accent opacity-80 ">{{ sala.room_title || "cargando"}}</h2>
              <p class="sm:text-xs text-accent opacity-60 lg:text-sm hidden sm:block">{{ sala.description }}</p>
              
              <div class="flex justify-end  ">
                               
                  <button class="btn bg-transparent   hidden lg:block md:block hover:bg-transparent border-none shadow-none"
                  @click.stop.prevent="openDeleteModal(sala)"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-primary  hover:text-accent">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  
                  </button> 
                        

                
              </div> 
              
              <div class=" lg:hidden md:hidden ">
                    <div class="  text-accent opacity-70 flex justify-end gap-x-1  ">
                      <h3>Ver más</h3> 
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 mt-1">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.1 1.95a.75.75 0 0 0 1.02 1.1l3.5-3.25a.75.75 0 0 0 0-1.1l-3.5-3.25a.75.75 0 1 0-1.02 1.1l2.1 1.95H6.75Z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    
                  </div>
            

            </div>

            <div v-if="sala.startTime" class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative ">
                <div class="absolute top-center left-0 h-36 w-px bg-accent opacity-30 "></div>
                <p class="  text-accent opacity-60 ">{{ new Date(sala.startTime).toLocaleString('default', { month: 'long' }) }}</p>
                <h2 class="m-3 text-accent opacity-80 lg:text-4xl" >{{ new Date(sala.startTime).getDate() }}</h2>
                <p class="text-accent opacity-60">{{ new Date(sala.startTime).toLocaleString('default', { hour: '2-digit', minute: '2-digit', hour12: false }) }}</p>
                                
            </div>
            <div v-else class="hidden lg:flex flex-col justify-center items-center lg:w-1/3 p-3 relative">                
                <p class="text-accent opacity-60">Fecha no disponible</p>
            </div>


            
              <div class="lg:w-44 lg:h-41 w-32 h-41  rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  class="w-full h-full flex items-center justify-center"
                  :src="sala.imagen  || defaultImage"
                  alt="Imagen de la sala" />
              </div>
  
    

         


         </div>
        </a>    
        </div>

        <!-- Insertamos el componente DeleteRoom -->
        <DeleteRoom ref="deleteRoomRef" />

</template>

<script setup>
  import { ref, onMounted } from 'vue' 
  import DeleteRoom from "../room/deleteRoom/DeleteRoom.vue";
  

   const salas = ref([]); 
   const defaultImage = ""; // Imagen por defecto 
   const deleteRoomRef = ref(null);  // Referencia para el componente DeleteRoom


      // Esta función se ejecuta solo cuando se hace clic en la tarjeta
    const handleCardClick = (event) => {
     
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
      startTime: item.start_time ? new Date(item.start_time) : null,      
      
    }));   

  } 

  } catch (error) {
    console.error('Error al cargar los datos:', error)
  }
}




// Llamamos a la función del componente hijo cuando se hace clic en el botón "Eliminar"
const openDeleteModal = (sala) => {
  // Usamos la referencia para llamar al método 'openModal' en el hijo
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