<template>
  <div v-if="sala" class="bg-neutral w-[90%] flex flex-col justify-center mx-auto P-0">
    <div class="flex justify-between">
      <!-- Contenedor de imagen -->
      <div :style="containerStyle" class="group relative w-full max-h-[40vh] mx-auto overflow-hidden mt-0 p-0">
        <img class="absolute inset-0 w-full h-full object-cover filter blur-md mt-0 p-0"
          :src="sala.room.image || defaultImage" alt="Imagen de fondo" crossOrigin="anonymous" />
        <BackButton class="absolute top-2 left-2 z-10" />
        <!-- Imagen principal -->
        <img class="relative w-full h-full object-contain object-center mt-0 p-0" ref="imgElement"
          :src="sala.room.image || defaultImage" alt="Imagen de la sala" @load="extractDominantColor"
          crossOrigin="anonymous" />

        <!-- Botón para cambiar imagen (solo visible en pantallas grandes al hacer hover) -->
        <label for="fileInput"
          class="z-11 absolute bottom-4 right-4 flex items-center font-bold py-1 px-4 rounded-full lg:opacity-0 group-hover:opacity-100 transition-opacity btn-primary btn-xs cursor-pointer">
          Cambiar Foto
        </label>
        <input id="fileInput" type="file" class="hidden z-10" @change="handleFileChange" />
      </div>
    </div>

    <div class="relative flex justify-center items-center p-3 max-w-md mx-auto text-center gap-1 group ">
      <h1 v-if="!isEditing" class="font-semibold lg:ml-6">{{ sala.room.room_title }}</h1>
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

    <div class="main-info bg-base-100 p-2">
      <div class="flex flex-col justify-between p-4">
        <div class="flex flex-col">
          <div class="relative">
            <div class="flex flex-row justify-between">
              <div class="flex flex-col">
                <h2 class="">Descripción</h2>
                <div v-if="!isEditing">
                  <p class="text-accent opacity-50">{{ sala.room.description }}</p>
                </div>
                <textarea v-else v-model="sala.room.description" class="textarea textarea-primary w-full"></textarea>
              </div>

              <!-- Boton de DropDown -->
              <div class="dropdown dropdown-left ">
                <div tabindex="0" role="button"
                  class="btn rounded-full bg-transparent border-none hover:bg-transparent shadow-none">
                  <Icon icon="iconamoon:menu-kebab-horizontal-circle-bold" class="w-6 h-6 lg:w-8 lg:h-8 text-primary" />
                </div>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 p-5 gap-3 rounded-xl shadow-lg z-10 ">
                  <li><a :href="`../proposal?id=${sala.room.id}`"
                      class="btn btn-primary btn-xs lg:btn-sm">Propuestas</a>
                  </li>
                  <li><a :href="`../formalSettingRoom?id=${sala.room.id}`"
                      class="btn btn-primary btn-xs lg:btn-sm pb-1">Otras
                      Configuraciones</a></li>
                  <li><a :href="`../user/addUser/${sala.room.id}`" class="btn btn-primary btn-xs lg:btn-sm">Votantes</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="">
          <div class="">
            <h2 v-if="sala.room.start_time" class="mt-2">Fecha y hora programada</h2>
            <!-- Mostrar la fecha solo si startTime es válido -->
            <h2 v-if="sala.room.start_time" class="text-primary font-bold">
              {{ new Date(sala.room.start_time).toLocaleDateString('default', { month: 'long' }) }}
              {{ new Date(sala.room.start_time).toLocaleDateString('default', { day: 'numeric' }) }},
              {{ new Date(sala.room.start_time).toLocaleDateString('default', { year: 'numeric' }) }} -
              {{ new Date(sala.room.start_time).toLocaleTimeString('es-ES', {
                hour: '2-digit', minute: '2-digit',
                hour12: false
              }) }} hs
            </h2>
          </div>

          <div class="mt-6">
            <h2 class="text-md">Codigo de sala</h2>
            <div class="flex gap-2 group">
              <h2 class="text-primary text-md ">{{ sala.room.room_code }}</h2>
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

          <div class=" mt-4">
            <h2 class="text-md">Administrador</h2>
            <div class="flex gap-16">
              <h2 class="text-primary text-md">{{ sala.room.admin_name }}</h2>
            </div>
          </div>

        </div>

      </div>
    </div>
    <div class="flex justify-center p-2 ">
      <StartRoom client:load />
    </div>
  </div>
  <div class="flex flex-col justify-center items-center">
    <h1 class="mt-5">Resultados finales</h1>
    <div v-for="propuesta in resultados" :key="propuesta.id" class="flex flex-row flex-wrap justify-center items-center">
    <div class="m-10 flex flex-row flex-wrap justify-center gap-5">
      <CardResult  :proposal="propuesta" :result="propuesta.options.map(opt => ({
        value: opt.option_value,
        count: opt.votes.length
      }))" />
      <UserVotes :proposal="propuesta" />
    </div>
  </div>
  </div>
  

</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import BackButton from "../reusable/BackButton2.vue";
import StartRoom from "./lobby/components/StartRoom.vue";
import { Icon } from "@iconify/vue";
import ColorThief from 'colorthief';
import CardResult from "./lobby/components/CardResult.vue";
import UserVotes from "./lobby/components/UserVotes.vue";

const props = defineProps({
  id: String
});

const sala = ref(null);
const error = ref(null);
const isEditing = ref(false); // Para controlar el modo de edición
const copied = ref(false); // Estado para mostrar si el link fue copiado
const resultados = ref(null);

const fetchSala = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/rooms/${props.id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Error al obtener la sala");
    }
    sala.value = await response.json();
    localStorage.setItem("currentRoom", JSON.stringify(sala.value.room));
    console.log("Sala guardada en localStorage:", sala.value);

    const urlConfig = "http://localhost:3000/v1/settingsRoom/byRoom/" + props.id;
    const response2 = await fetch(urlConfig, {
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

    // Corrige la comprobación usando sala.value.room.state
    if (sala.value.room.state === "finished") {
      const urlResultados = "http://localhost:3000/v1/proposals/results/" + props.id;
      const responseResultados = await fetch(urlResultados, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (responseResultados.ok) {
        // Actualiza la variable reactiva mediante .value
        resultados.value = await responseResultados.json();
      }
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

const defaultImage = '/defaultRoomImage.png';
const dominantColor = ref('');
const imgElement = ref(null);

const extractDominantColor = () => {
  if (imgElement.value && imgElement.value.complete) {
    try {
      const colorThief = new ColorThief();
      const result = colorThief.getColor(imgElement.value);
      dominantColor.value = `rgb(${result.join(',')})`;
    } catch (error) {
      console.error('Error al extraer el color dominante:', error);
    }
  }
};

const containerStyle = computed(() => ({
  boxShadow: dominantColor.value ? `0 4px 10px ${dominantColor.value}` : 'none'
}));


// Función para limpiar currentRoom cuando el componente se desmonte
onUnmounted(() => {
  localStorage.removeItem("currentRoom");
});


onMounted(() => {
  fetchSala();
});

</script>


<style>
.main-info {
  border-radius: 30px;
}
</style>