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


            <div class="lg:max-w-lg  lg:h-[300px] h-[240px] bg-gray-200  rounded-lg flex-grow flex items-center justify-center text-lg ">
                <img src="" alt="Imagen de prueba" class=" object-cover w-full h-full rounded-lg">
                
            </div>

        </div>    

        <div class="flex justify-center items-center p-3 max-w-md mx-auto text-center">
            
                <h1 class="font-semibold">{{ sala.room.room_title }}</h1>
             
        </div>

        
          <div class="flex flex-col items-stretch p-3 gap-2">
              <div class="relative">
              <h2>Descripción</h2>
                  
                        <p class="accent">{{ sala.room.description }}</p> 

                    
                  
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
                    <a :href="`../formalSettingRoom?id=${sala.room.id}`" class="btn btn-primary sm:btn-sm">
                            Otras Configuraciones
                        </a>

                    <a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary sm:btn-sm">
                            Propuestas
                        </a>
                        </div>
                        <div class="w-full flex  p-2 mt-2 justify-center">
                        <a href="" class="btn btn-secondary sm:btn-sm">
                            Empezar Sala
                        </a>
                        </div>
                    
                    </div>

                </div>
              




          </div>
          
          

         

        




        
    </div>


</template> 


<script setup>
import { ref, onMounted } from "vue";
import FormButton from '../../components/FormButton.vue';  







const props = defineProps({
id: String 
});



console.log('ID recibido:', props.id);

const sala = ref(null);
const error = ref(null);



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














// Cargar datos cuando el componente se monte
onMounted(fetchSala);
</script>