<template>

    <div v-if="sala" class="bg-base-100 rounded-lg shadow-lg mt-3">
        <div class="relative flex items-center justify-center">
            <div class="absolute top-0 left-0 hidden sm:block">
                <a href="../myRooms" class="btn btn-secondary btn-md ">
                    <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.727 17H2.50635M2.50635 17L17.1167 31.5833M2.50635 17L17.1167 2.41663" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                </a>
            </div>


            <div class="lg:max-w-lg  lg:h-[300px] h-[240px] bg-gray-200  rounded-lg flex-grow flex items-center justify-center text-lg relative group ">
                
                <!-- Imagen -->
                <img src="" alt="Imagen de prueba" class="object-cover w-full h-full rounded-lg" />

                
                <button
                @click="handleChangePhoto"
                class="absolute bottom-4 right-4 bg-opacity-70 bg-primary text-neutral flex items-center font-bold py-1 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity btn-xs">
                Cambiar Foto
                </button>

                <!-- Input de archivo (oculto, se activa con el click del botón) -->
                <input type="file" class="hidden" ref="fileInput" @change="handleFileChange" />

                
            </div>

        </div>    

        <div class="flex justify-center items-center p-3 max-w-md mx-auto text-center gap-4">
            <!-- Input para editar el título -->
            <input v-if="isEditing" 
             v-model="sala.room.room_title" 
             type="text" 
             placeholder="Type here" 
             class="input input-primary text-xl font-semibold text-center" />
      
            <!-- Título estático cuando no está en modo de edición -->
            <h1 v-else class="font-semibold">{{ sala.room.room_title }}</h1>

            <!-- Botón para alternar entre edición y visualización -->
            <button @click="toggleEditTitle" class="btn btn-secondary btn-xs">
                <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                     <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                </svg>

                {{ isEditing ? 'Guardar' : '' }}
            </button>
        </div>

        
        <div class="flex flex-col items-stretch p-3 gap-2">
              <div class="relative">
              <h2>Descripción</h2>
              

                <div  v-if="!isEditingDescription">
                    <p class="accent">{{ sala.room.description }}</p> 
                </div>
            
                  
        </div>
        

            <div class="flex flex-col lg:flex-row justify-between gap-4 ">
                <div class="lg:w-1/2">
                        <div class="">
                            <h2>Fecha y hora programada</h2>
                            
                                <h2 class="text-primary font-bold">{{ sala.room.start_time }}    </h2>                                
                                
                        </div>          
                    
                             

                        <div>
                            <h2 class="text-sm">Administrador</h2>
                            <div class="flex gap-1">
                                <h2 class="text-primary text-md">{{sala.room.admin_name}}</h2>                                
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-col lg:items-center lg:w-1/2  ">
                        <div class="flex space-x-6 sm:space-x-4 justify-center w-full">
                    <a :href="`../formalSettingRoom?id=${sala.room.id}`" class="btn btn-primary btn-sm">
                            Otras Configuraciones
                        </a>

                    <a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary btn-sm">
                            Propuestas
                        </a>
                        </div>
                        <div class="w-full flex  p-2 mt-2 justify-center gap-8 ">
                        <a href="" class="btn btn-secondary btn-sm">
                            Empezar Sala
                        </a>
                        <a @click="openDeleteModal"  class="btn btn-primary btn-sm lg:hidden ">
                            ELiminar
                        </a>
                        </div>
                    
                    </div>

                </div>
              




          </div>
          
          

         

        

             <!-- Insertamos el componente DeleteRoom -->
            <DeleteRoom ref="deleteRoomRef" />


        
    </div>


</template> 


<script setup>
import { ref, onMounted } from "vue";
import DeleteRoom from "../room/deleteRoom/DeleteRoom.vue";


const props = defineProps({
id: String 
});

const deleteRoomRef = ref(null);  // Referencia para el componente DeleteRoom
const sala = ref(null);
const error = ref(null);
const isEditing = ref(false); // Para controlar el modo de edición


// Función para obtener los datos
const fetchSala = async () => {
try {
const response = await fetch(`http://localhost:3000/v1/rooms/${props.id}`, {
  method: "GET",
  credentials: "include", // Enviar cookies con la solicitud
 
});


if (!response.ok) {
  throw new Error("Error al obtener la sala");
}

sala.value = await response.json();
console.log("recibi los datos de ", sala.value);
} catch (err) {
error.value = err.message;
}
};





// Llamamos a la función del componente hijo cuando se hace clic en el botón "Eliminar"
const openDeleteModal = () => {
  // Usamos la referencia para llamar al método 'openModal' en el hijo
  deleteRoomRef.value.openModal(sala.value.room);
};




// Función para alternar el modo de edición del título
const toggleEditTitle = () => {
  isEditing.value = !isEditing.value;
};

// Función para cambiar la foto (esto se activará al hacer clic en el botón "Cambiar Foto")
const handleChangePhoto = () => {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.click(); // Abre el input de archivo al hacer clic en "Cambiar Foto"
};










// Cargar datos cuando el componente se monte
onMounted(fetchSala);
</script>