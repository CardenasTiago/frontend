<template>

  <div v-if="sala" class="bg-neutral  mt-6 lg:mt-3 relative lg:p-12 ">
    <div class="relative flex items-center justify-center">
      <div class="absolute top-0 left-0 p-4">
        <BackButton />
      </div>

      <div
        class="lg:max-w-lg  lg:h-[300px] md:max-w-lg  md:h-[300px] h-[240px] bg-gray-200  rounded-lg flex-grow flex items-center justify-center text-lg relative group">
        <!-- Imagen -->
        <img :src="sala.room.image || defaultImage" alt="Imagen de la sala"
          class="object-cover w-full h-full rounded-lg " />
        <label for="fileInput"
          class="absolute bottom-4 right-4 flex items-center font-bold py-1 px-4 rounded-full lg:opacity-0 group-hover:opacity-100 transition-opacity btn-primary btn-xs cursor-pointer">
          Cambiar Foto
        </label>
        <!-- Input de archivo (oculto, se activa con el click del label) -->
        <input id="fileInput" type="file" class="hidden" @change="handleFileChange" />
      </div>
    </div>


    <!-- titulo -->
    <div class="relative flex justify-center items-center p-3 max-w-md mx-auto text-center gap-1 group">
      <h1 v-if="!isEditing" class="font-semibold">{{ sala.room.room_title }}</h1>
      <input v-else v-model="sala.room.room_title" type="text"
        class="input input-primary lg:text-xl text-xs font-semibold text-center" />
      <!-- Contenedor principal -->
      <div class="relative flex  gap-2">

        <!-- Botón de editar (solo visible cuando NO se está editando) -->
        <button v-if="!isEditing" @click="toggleEdit()"
          class="bg-primary text-neutral btn btn-xs btn-circle group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 sm:block  ">
          <Icon icon="proicons:pencil" class="w-6 h-5" />
        </button>

        <!-- Contenedor para los botones de edición -->
        <div v-if="isEditing" class="flex items-center gap-4 ">

          <!-- Botón de guardar (solo visible en pantallas pequeñas) -->
          <button @click="updateRoom()" class="sm:block lg:hidden p-0 bg-success rounded-full text-neutral">
            <Icon icon="material-symbols:check-rounded" class="w-6 h-6" />
          </button>

          <!-- Botón de cancelar (solo visible en pantallas pequeñas) -->
          <button @click="cancelEdit()" class="sm:block lg:hidden p-0 bg-error rounded-full text-neutral">
            <Icon icon="proicons:cancel" class="w-6 h-6" />
          </button>

          <!-- Botones de texto para pantallas grandes -->
          <div class="hidden lg:flex gap-4">
            <button @click="updateRoom()" class="btn btn-sm btn-primary">Guardar</button>
            <button @click="cancelEdit()" class="btn btn-sm btn-secondary">Cancelar</button>
          </div>
        </div>

      </div>
    </div>



    <!-- descripción -->
    <div class="flex flex-col items-stretch gap-2 p-2 lg:p-6">
      <div class="relative">
        <h2>Descripción</h2>
        <div v-if="!isEditing">
          <p class="text-accent opacity-50">{{ sala.room.description }}</p>
        </div>
        <textarea v-else v-model="sala.room.description" class="textarea textarea-primary w-full"></textarea>
      </div>
    </div>


    <div class="flex flex-col lg:flex-row justify-between gap-4 ">
      <div class="lg:w-1/2 p-2 lg:p-6">
        <div class="">
          <h2>Fecha y hora programada</h2>
          <!-- Mostrar la fecha solo si startTime es válido -->
          <h2 v-if="sala.room.start_time" class="text-primary font-bold">
            {{ new Date(sala.room.start_time).toLocaleDateString('default', { month: 'long' }) }}
            {{ new Date(sala.room.start_time).toLocaleDateString('default', { day: 'numeric' }) }},
            {{ new Date(sala.room.start_time).toLocaleDateString('default', { year: 'numeric' }) }} -
            {{ new Date(sala.room.start_time).toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit',
            hour12:false }) }} hs
          </h2>
        </div>

        <div class="mt-6">
          <h2 class="text-sm">Link de Invitación</h2>
          <div class="flex gap-2 group">
            <h2 class="text-primary text-md ">{{ sala.room.link_invite }}</h2>
            <button @click="copyToClipboard"
              class="btn btn-sm lg:opacity-0 lg:group-hover:opacity-100 border-none shadow-none hover:bg-transparent bg-transparent p-0">
              <Icon icon="fa6-regular:copy" class="w-5 h-5 text-primary font-bold" />
            </button>
          </div>
          <!-- Tooltip que aparece cuando se copia -->
          <div v-if="copied"
            class="fixed top-4 left-1/2 transform -translate-x-1/2 bg-success text-accent  px-2 py-1 rounded-lg text-xs md:text-sm lg:text-sm">
            Link copiado en el portapapeles
          </div>
        </div>

        <div class="mt-4">
          <h2 class="text-sm">Administrador</h2>
          <div class="flex gap-16">
            <h2 class="text-primary text-md">{{ sala.room.admin_name }}</h2>
            <!--Botón desplegable  -->
            <div class="lg:hidden md:hidden dropdown dropdown-top">
              <div tabindex="0" role="button"
                class="btn btn-sm rounded-full bg-transparent border-none hover:bg-transparent shadow-none">
                <Icon icon="nrk:more-active" class="w-6 h-6 text-primary" />
              </div>
              <ul tabindex="0" class="dropdown-content menu bg-base-100  z-1 w-52 ">
                <li><a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary btn-sm">Propuestas</a></li>
                <li><a :href="`../formalSettingRoom?id=${sala.room.id}`" class="btn btn-primary btn-sm mt-3">Otras
                    configuraciones</a></li>
              </ul>
            </div>
          </div>
        </div>

      </div>



      <div class="hidden lg:flex md:flex flex-col lg:items-center lg:w-1/2  lg:p-10 mt-8 lg:mt-0">
        <div class="flex space-x-6 sm:space-x-4 justify-center w-full">
          <a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary btn-sm lg:w-48">
            Propuestas
          </a>
          <a :href="`../formalSettingRoom?${sala.room.id}`" class="btn btn-primary btn-sm lg:w-42">
            Otras configuraciones
          </a>
        </div>
        <div class="flex justify-center py-3">
          <a :href="`../user/addUser/${sala.room.id}`" class="btn btn-primary btn-sm lg:w-48">
            Votantes
          </a>
        </div>
      </div>

    </div>

    <div class="flex justify-center p-2">
      <StartRoom client:load />
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import BackButton from "../reusable/BackButton2.vue";
import StartRoom from "./lobby/StartRoom.vue";
import {Icon} from "@iconify/vue";


const props = defineProps({
  id: String
});

const sala = ref(null);
const error = ref(null);
const isEditing = ref(false); // Para controlar el modo de edición
const copied = ref(false); // Estado para mostrar si el link fue copiado

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
    localStorage.setItem("currentRoom", JSON.stringify(sala.value.room));
    console.log("Sala guardada en localStorage:", sala.value);

    const url = "http://localhost:3000/v1/settingsRoom/byRoom/" + props.id;
      const response2 = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response2.ok) {
        const config = await response2.json();
        localStorage.setItem("settingsRoom", JSON.stringify(config));
      } 
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
        link_invite: sala.value.room.link_invite,
        image: sala.value.room.image 

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

const toggleEdit = () => {
  isEditing.value = !isEditing.value;

};


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    sala.value.room.image = reader.result; 
    updateRoom(); 
  };
  reader.onerror = (error) => {
    console.error("Error al convertir la imagen:", error);
  };
};


// Función para cancelar la edición
const cancelEdit = () => {
  const storedRoom = localStorage.getItem("currentRoom");

  if (storedRoom) {
    sala.value.room = JSON.parse(storedRoom); // Restaurar valores originales
  }

  isEditing.value = false; // Salir del modo edición
};

// Función para copiar al portapapeles
const copyToClipboard = () => {
  navigator.clipboard.writeText(sala.value.room.link_invite).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000); // Ocultar el mensaje después de 2 segundos
  }).catch((err) => {
    console.error('Error al copiar el texto:', err);
  });
};



// Función para limpiar currentRoom cuando el componente se desmonte
onUnmounted(() => {
  localStorage.removeItem("currentRoom");
});


onMounted(() => {
  fetchSala();

});

</script>