<template>

  <div v-if="sala" class="bg-neutral rounded-lg shadow-lg mt-3 relative ">
    <div class="relative flex items-center justify-center">
      <div class="absolute top-0 left-0 p-4">
        <BackButton />
      </div>


      <div
        class="lg:max-w-lg  lg:h-[300px] md:max-w-lg  md:h-[300px] h-[240px] bg-gray-200  rounded-lg flex-grow flex items-center justify-center text-lg relative group">
        <!-- Imagen -->
        <img :src="sala.room.image || defaultImage" alt="Imagen de la sala"
          class="object-cover w-full h-full rounded-lg " />

        <button @click="handleChangePhoto"
          class="absolute bottom-4 right-4 bg-opacity-70 bg-primary  text-neutral flex items-center font-bold py-1 px-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity btn-xs">
          Cambiar Foto
        </button>

        <!-- Input de archivo (oculto, se activa con el click del botón) -->
        <input type="file" class="hidden" ref="fileInput" @change="handleFileChange" />
      </div>
    </div>


    <!-- titulo -->
    <div class="relative flex justify-center items-center p-3 max-w-md mx-auto text-center gap-4 group">
      <h1 v-if="!isEditing" class="font-semibold">{{ sala.room.room_title }}</h1>
      <input v-else v-model="sala.room.room_title" type="text"
        class="input input-primary lg:text-xl text-xs font-semibold text-center" />
      <!-- Contenedor principal -->
      <div class="relative flex  gap-2">

        <!-- Botón de editar (solo visible cuando NO se está editando) -->
        <button v-if="!isEditing" @click="toggleEdit()"
          class="bg-primary text-neutral btn btn-sm btn-circle group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-100 sm:block lg:flex lg:items-center lg:justify-center ">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.862 4.487 18.549 2.8a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </button>

        <!-- Contenedor para los botones de edición -->
        <div v-if="isEditing" class="flex items-center gap-4 ">

          <!-- Botón de guardar (solo visible en pantallas pequeñas) -->
          <button @click="updateRoom()" class="sm:block lg:hidden p-0 bg-success rounded-full text-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>

          <!-- Botón de cancelar (solo visible en pantallas pequeñas) -->
          <button @click="cancelEdit()" class="sm:block lg:hidden p-0 bg-error rounded-full text-neutral">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
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
            {{ new Date(sala.room.start_time).toLocaleDateString('default', { year: 'numeric' }) }}
          </h2>
          <!-- Mostrar la hora solo si startTime es válido -->
          <h2 v-if="sala.room.start_time" class="text-primary font-bold">
            {{ new Date(sala.room.start_time).toLocaleTimeString('es-ES', {
              hour: '2-digit', minute: '2-digit', hour12:
            false }) }}
          </h2>
        </div>


        <div class="mt-6">
          <h2 class="text-sm">Administrador</h2>
          <div class="flex gap-1">
            <h2 class="text-primary text-md">{{ sala.room.admin_name }}</h2>
          </div>
          <div class="flex justify-center">
            <a @click="openDeleteModal" class="btn btn-primary btn-sm lg:hidden ">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="size-6 ">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </a>
          </div>
        </div>

      </div>


      <div class="flex flex-col lg:items-center lg:w-1/2  lg:p-10 mt-8 lg:mt-0">

        <div class="flex space-x-6 sm:space-x-4 justify-center w-full">
          <a :href="`../proposal?id=${sala.room.id}`" class="btn btn-primary btn-sm lg:w-48">
            Propuestas
          </a>

          <a :href="`../formalSettingRoom?id=${sala.room.id}`" class="btn btn-primary btn-sm lg:w-42">
            otras configuraciones
          </a>
        </div>

      </div>

    </div>

    <div class="flex justify-center p-4">
      <StartRoom client:load />
    </div>









    <!-- Insertamos el componente DeleteRoom -->
    <DeleteRoom ref="deleteRoomRef" />

  </div>


</template>


<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import DeleteRoom from "../room/deleteRoom/DeleteRoom.vue";
import BackButton from "../reusable/BackButton2.vue";
import StartRoom from "./lobby/StartRoom.vue";


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

// Función para cancelar la edición
const cancelEdit = () => {
  const storedRoom = localStorage.getItem("currentRoom");

  if (storedRoom) {
    sala.value.room = JSON.parse(storedRoom); // Restaurar valores originales
  }

  isEditing.value = false; // Salir del modo edición
};
// Función para limpiar currentRoom cuando el componente se desmonte
onUnmounted(() => {
  localStorage.removeItem("currentRoom");
});


onMounted(() => {
  fetchSala();

});

</script>