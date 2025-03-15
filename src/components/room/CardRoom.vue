<template>
    
    <div v-if="sala" class="bg-base-100 rounded-lg shadow-lg mt-3 relative z-10">
        <div class="relative flex items-center justify-center">
            <div class="absolute top-0 left-0 hidden sm:block">
                <a href="../myRooms" class="btn btn-secondary btn-md ">
                    <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M31.727 17H2.50635M2.50635 17L17.1167 31.5833M2.50635 17L17.1167 2.41663" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                </a>
            </div>


            <div class="lg:max-w-lg  lg:h-[300px] md:max-w-lg  md:h-[300px] h-[240px] bg-gray-200  rounded-lg flex-grow flex items-center justify-center text-lg relative group">
                
                <!-- Imagen -->
                <img src="" alt="Imagen de prueba" class="object-cover w-full h-full rounded-lg" />

                
                <button
                    @click="handleChangePhoto"
                    class="absolute bottom-4 right-4 bg-opacity-70 bg-primary  text-neutral flex items-center font-bold py-1 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity btn-xs">
                    Cambiar Foto
                </button>

                <!-- Input de archivo (oculto, se activa con el click del botón) -->
                <input type="file" class="hidden" ref="fileInput" @change="handleFileChange" />

                
            </div>

                                  
             
                
           

        </div>    

        
            <!-- titulo -->
            <div class="flex justify-center items-center p-3 max-w-md mx-auto text-center gap-4">
            
                <h1 v-if="!isEditing" class="font-semibold">{{ sala.room.room_title }}</h1>
                
                <input 
                    v-else v-model="sala.room.room_title" 
                    type="text" 
                    class="input input-primary lg:text-xl text-xs font-semibold text-center"               
                />
                <button @click="isEditing ? updateRoom() : toggleEdit()":class="{
                                            ' bg-primary text-neutral btn btn-sm': true,  
                                            'btn-circle': !isEditing,  
                                            'px-4 py-2 rounded-lg': isEditing  
                                            }">           
                    <svg v-if="!isEditing" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                    <span v-else>Guardar</span>
                </button>
               
            </div>

            <!-- descripción -->
            <div class="flex flex-col items-stretch gap-2 p-2 lg:p-6">         
                <div class="relative">
                    <h2>Descripción</h2>             
                    <div v-if="!isEditing">
                        <p class="text-accent opacity-50">{{ sala.room.description }}</p> 
                    </div>  
                    <textarea v-else
                        v-model="sala.room.description"
                        class="textarea textarea-primary w-full"                    
                    ></textarea>         
                </div>
            </div>  
       
       
            <div class="flex flex-col lg:flex-row justify-between gap-4 ">
                <div class="lg:w-1/2 p-2 lg:p-6">
                        <div class="">
                            <h2>Fecha y hora programada</h2>
                            
                                <h2 class="text-primary font-bold">{{ sala.room.start_time }}    </h2>                                
                                
                        </div>          
                    
                             

                        <div class="mt-6">
                            <h2 class="text-sm">Administrador</h2>
                            <div class="flex gap-1">
                                <h2 class="text-primary text-md">{{sala.room.admin_name}}</h2>                                
                            </div>
                        </div>

                    </div>

                    <div class="flex flex-col lg:items-center lg:w-1/2  lg:p-10 ">
                        <div class="flex space-x-6 sm:space-x-4 justify-center w-full">
                            <a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary btn-sm lg:w-48">
                                    Propuestas
                            </a>
                            <a :href="`../formalSettingRoom?id=${sala.room.id}`" class="btn btn-primary btn-sm lg:w-42">
                                    otras configuraciones
                            </a>

                        </div>
                        <div class="w-full flex  p-2 mt-2 justify-center gap-8 ">
                            <a href="" class="btn btn-secondary btn-sm w-auto lg:w-56">
                                <p class="text-neutral">Empezar Sala</p>
                            </a>
                            <a @click="openDeleteModal"  class="btn btn-primary btn-sm lg:hidden ">
                                ELiminar
                            </a>
                        </div>
                    
                    </div>

                </div>
              




          
          
          

         

        

             <!-- Insertamos el componente DeleteRoom -->
            <DeleteRoom ref="deleteRoomRef" />


        
    </div>


</template> 


<script setup>
import { ref, onMounted,onUnmounted } from "vue";
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



const updateRoom = async () => {
    if (!sala.value) return; 
    try {
        const response = await fetch(`http://localhost:3000/v1/rooms/${props.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                description: sala.value.room.description,
                name: sala.value.room.room_title,                
                link_invite: sala.value.room.link_invite
               
            }),
            credentials: "include" 
        });
        if (!response.ok) {
            throw new Error("Error al actualizar la sala");
        }

        
        isEditing.value = false; // Salir del modo edición
    } catch (err) {
        console.error("Error al actualizar la sala:", err);
    }
};






// Llamamos a la función del componente hijo cuando se hace clic en el botón "Eliminar"
const openDeleteModal = () => {
  // Usamos la referencia para llamar al método 'openModal' en el hijo
  deleteRoomRef.value.openModal(sala.value.room);
};



const toggleEdit = () => {    
        isEditing.value = !isEditing.value; 
             
};


// Función para cambiar la foto (esto se activará al hacer clic en el botón "Cambiar Foto")
const handleChangePhoto = () => {
  const fileInput = document.querySelector('input[type="file"]');
  fileInput.click(); // Abre el input de archivo al hacer clic en "Cambiar Foto"
};




onMounted(() => {
    fetchSala(); 
    
});  


</script>