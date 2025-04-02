<template>

    <!-- Alerta -->
    <div class="flex justify-center">
        <div v-if="alertMessage" :class="`alert alert-${alertType}`" class="flex justify-center p-2 max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
                viewBox="0 0 24 24">
                <path v-if="alertType === 'success'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ alertMessage }}</span>
        </div>
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


        <div class="flex items-center ml-3">
            <Icon icon="material-symbols:search-rounded" class="w-6 h-6 text-primary absolute ml-2" />
            <input 
                type="search" 
                v-model="searchQuery"
                placeholder="Buscar"
                class="input input-primary pl-10 py-2 w-64 h-11" 
            />
        </div>

        



        <ul role="list">
            <li v-for="user in filteredUsers" :key="user.email" class="flex justify-between p-2 gap-2 ">
                <div class="flex min-w-0 gap-x-4 ">
                    <img class="size-12  flex-none rounded-full bg-accent-50 mr-2" :src="user.image" alt="" />
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm/6 font-semibold text-accent">{{ user.name }} {{ user.lastname }}</p>
                        <p class="mt-1 truncate text-xs/5 text-accent">{{ user.email }}</p>
                    </div>
                </div>
                <div class="flex items-center">
                    <Icon icon="mdi:garbage" class="h-6 w-6 text-error" />
                </div>
                
            </li>
        </ul>








    </div>








</template>

<script setup>
import { ref, defineProps, onMounted,computed } from 'vue';
import { Icon } from "@iconify/vue";
import AddVoterModal from "./AddVoterModal.vue";

const users = ref([]); // Donde se guardarán los datos de la API
const props = defineProps(["id"]); // Recibir el ID de la sala
const alertMessage = ref(""); // Mensaje de la alerta
const alertType = ref(""); // Tipo de alerta (error o éxito)
const isModalOpen = ref(false)
const searchQuery = ref("");  // Valor del input de búsqueda


// Computed property para filtrar usuarios en base a searchQuery
const filteredUsers = computed(() => {
    return searchQuery.value
        ? users.value.filter(user =>
            `${user.name} ${user.lastname}`.toLowerCase().includes(searchQuery.value.toLowerCase())
        )
        : users.value; // Si no hay búsqueda, muestra todos
});







const handleAddVoter = async (userInput) => {
    console.log(userInput);
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

        // ✅ Mostrar alerta de éxito
        alertMessage.value = "El votante ha sido agregado correctamente.";
        alertType.value = "success";

        // 🔄 **Actualizar la lista de votantes sin refrescar la página**
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

    // ✅ Ocultar la alerta después de 3 segundos (ya sea éxito o error)
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


// Llamamos a fetchUsers cuando se monta el componente
onMounted(fetchUsers);

</script>