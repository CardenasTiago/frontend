<template>
  <div class="ml-4">
    <BackButton />
  </div>
  <div class="flex flex-col gap-10 p-8 max-w-screen-md mx-auto ">

    <h1 class="flex justify-center font-bold text-2xl">Votantes</h1>
    <div class="flex justify-center gap-10">
      <button class="btn btn-primary" @click="isModalOpen = true">
        Agregar Votante
      </button>
      <!-- Modal -->
      <AddVoterModal v-model="isModalOpen" @add-voter="handleAddVoter" />

      <button class="btn btn-primary">
        <Icon icon="material-symbols:upload" class="w-6 h-6 " />
        Subir Archivo
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-2 ">
      <div class="flex items-center w-2/3 lg:w-1/2 input input-primary ">
        <div>
          <Icon icon="mdi:magnify" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Buscar" class="w-full ml-2 outline-none" />
        </div>

      </div>
      <!-- Alerta -->
      <div class="flex h-6 justify-center lg:mt-2">
        <div v-if="alertMessage" :class="`alert bg-${alertType}`" class="flex justify-center p-2 max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none"
            viewBox="0 0 24 24">
            <path v-if="alertType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm">{{ alertMessage }}</span>
        </div>
      </div>

    </div>


    <ul role="list" class="flex flex-col gap-y-7 ">
      <li v-for="user in filteredUsers" :key="user.email" class="flex justify-between">
        <div class="flex min-w-0 gap-x-4 ">
          <img class="size-12  flex-none rounded-full bg-accent-50 mr-2" :src="user.image" alt="" />
          <div class="min-w-0 flex-auto">
            <p class="text-sm/6 font-semibold text-accent">{{ user.name }} {{ user.lastname }}</p>
            <p class="mt-1 truncate text-xs/5 text-accent">{{ user.email }}</p>
          </div>
        </div>

        <div class="flex items-center">
          <Icon icon="mdi:garbage" class="h-6 w-6 text-error cursor-pointer" @click="openDeleteModal(user)" />
          <ModalConfirm v-model="showDeleteModal" title="Eliminar votante"
            message="¿Estás seguro de que deseas eliminar el votante de la whitelist?" confirmText="Eliminar"
            cancelText="Cancelar" :confirmAction="removeVoter" />

        </div>


      </li>
    </ul>

  </div>








</template>

<script setup>
import { ref, defineProps, onMounted, computed } from 'vue';
import { Icon } from "@iconify/vue";
import AddVoterModal from "./AddVoterModal.vue";
import ModalConfirm from "../reusable/Modal.vue";
import BackButton from '../reusable/BackButton2.vue';

const users = ref([]); // Donde se guardarán los datos de la API
const props = defineProps(["id"]); // Recibir el ID de la sala
const alertMessage = ref(""); // Mensaje de la alerta
const alertType = ref(""); // Tipo de alerta (error o éxito)
const isModalOpen = ref(false)
const searchQuery = ref("");  // Valor del input de búsqueda
const showDeleteModal = ref(false)
const selectedUser = ref(null)



// Computed property para filtrar usuarios en base a searchQuery
const filteredUsers = computed(() => {
  return searchQuery.value
    ? users.value.filter(user =>
      `${user.name} ${user.lastname}`.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    : users.value; // Si no hay búsqueda, muestra todos
});


const handleAddVoter = async (userInput) => {
  try {
    const response = await fetch("http://localhost:3000/v1/rooms/addUser", {
      method: "POST",
      credentials: "include", // Envía cookies de autenticación
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_data: userInput,
        room_id: Number(props.id),
      }),
    });

    if (!response.ok) {
      throw new Error(response.status); // Lanzamos el código de estado como error
    }

    const data = await response.json();
    console.log("Votante agregado:", data);

    // Mostrar alerta de éxito
    alertMessage.value = "El votante ha sido agregado";
    alertType.value = "success";

    // Actualizar la lista de votantes sin refrescar la página
    await fetchUsers();

  } catch (error) {
    console.error("Error en la solicitud:", error);

    // Convertimos el error en un número para poder compararlo
    const statusCode = Number(error.message);

    if (statusCode === 409) {
      alertMessage.value = "El usuario ya se encuentra en la whitelist.";
    } else if (statusCode === 404) {
      alertMessage.value = "Error: el votante no está registrado.";
    } else {
      alertMessage.value = "Error de conexión o inesperado.";
    }

    alertType.value = "error";
  }

  // Ocultar la alerta después de 3 segundos (ya sea éxito o error)
  setTimeout(() => {
    alertMessage.value = "";
    alertType.value = "";
  }, 3000);
};




const fetchUsers = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/users/byRoom/${props.id}`, {
      method: "GET",
      credentials: "include", // Esto permite enviar cookies de autenticación
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo obtener la lista de usuarios`);
    }

    const data = await response.json();
    users.value = data.users.reverse();
    console.log(users.value);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
  }
};


const openDeleteModal = (user) => {
  selectedUser.value = user
  showDeleteModal.value = true
}


const removeVoter = async () => {
  try {
    const response = await fetch('http://localhost:3000/v1/rooms/whitelist/removeUser', {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: selectedUser.value.id,
        room_id: Number(props.id),
      }),
    })

    if (!response.ok) {
      const errorMsg = await response.text()
      throw new Error(`Error: ${errorMsg}`)
    }

    isModalOpen.value = false
    // Actualizar la lista de votantes sin refrescar la página
    await fetchUsers();
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  }
}



onMounted(fetchUsers);

</script>