<template>
  <div class="ml-4">
    <BackButton />
  </div>
  <div class="flex flex-col gap-5 p-4 max-w-screen-md mx-auto ">
    <h1 class="flex justify-center font-bold text-2xl">Votantes</h1>
    <div class="flex justify-center gap-10">
      <button class="btn btn-primary" @click="isModalOpen = true">
        Agregar Votante
      </button>
      <!-- Modal -->
      <AddVoterModal v-model="isModalOpen" @add-voter="handleAddVoter" />
    </div>

    <div class="flex flex-col gap-2 w-full">
      <div class="flex items-center w-full input input-primary">
        <div>
          <Icon icon="mdi:magnify" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Buscar" class="w-full ml-2 outline-none" />
        </div>
      </div>
      <!-- Alerta -->
      <div class="flex h-6 justify-center lg:mt-2 text-white">
        <div v-if="alertMessage" :class="`alert bg-${alertType}`" class="flex justify-center p-2 max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none"
            viewBox="0 0 24 24">
            <Icon v-if="alertType === 'success'" icon="material-symbols-light:check-circle-outline" width="24" height="24" class="text-white"/>

            <Icon v-else icon="material-symbols-light:error-outline" width="24" height="24" class="text-white"/>
          </svg>
          <span class="text-sm text-white">{{ alertMessage }}</span>
        </div>
      </div>
    </div>

    <ul role="list" class="flex flex-col gap-5">
      <li v-for="user in filteredUsers" :key="user.email" class="flex justify-between bg-base-100 p-4 rounded-xl">
        <div class="flex min-w-0 gap-x-4">
          <img v-if="user.image" class="size-12  flex-none rounded-full bg-accent-50 mr-2" :src="user.image" alt="" />
          <Icon v-else icon="ic:baseline-person" class="rounded-full object-cover text-secondary" height="40"
            width="40" />
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

<script setup lang="ts">
import { ref, defineProps, onMounted, computed } from 'vue'
import { Icon } from "@iconify/vue"
import AddVoterModal from "./AddVoterModal.vue"
import ModalConfirm from "../reusable/Modal.vue"
import BackButton from '../reusable/BackButton2.vue'
import UserService from '../../services/user.service'
import RoomService from '../../services/room.service'

// recibimos el ID de sala
const props = defineProps<{ id: string }>()

// estado reactivo
const users            = ref<any[]>([])
const searchQuery      = ref('')
const alertMessage     = ref('')
const alertType        = ref<'success'|'error'>('success')
const isModalOpen      = ref(false)
const showDeleteModal  = ref(false)
const selectedUser     = ref<any>(null)

// lista filtrada según búsqueda
const filteredUsers = computed(() =>
  searchQuery.value
    ? users.value.filter(u =>
        `${u.name} ${u.lastname}`.toLowerCase()
          .includes(searchQuery.value.toLowerCase())
      )
    : users.value
)

// traigo la whitelist
async function fetchUsers() {
  try {
    const resp = await UserService.whitelist(props.id)
    const data = JSON.parse(resp)
    users.value = data.users.reverse()
  } catch (e) {
    console.error('Error fetchUsers:', e)
  }
}

// agregar un votante
async function handleAddVoter(userInput: any) {
  try {
    // pasamos objeto, NO JSON.stringify
    const resp = await RoomService.addUser({
      user_data: userInput,
      room_id: Number(props.id),
    })
    const data = JSON.parse(resp)
    console.log('Votante agregado:', data)

    alertMessage.value = data.success || 'Votante agregado correctamente'
    alertType.value = 'success'
    isModalOpen.value = false

    await fetchUsers();
  } catch (err: any) {
    console.error('Error en handleAddVoter:', err)
    alertType.value = 'error'
    switch (err.status) {
      case 409:
        alertMessage.value = 'Ya está en la whitelist.'
        break
      case 404:
        alertMessage.value = 'Usuario no registrado.'
        break
      default:
        alertMessage.value = 'Error de conexión o inesperado.'
    }
  } finally {
    setTimeout(() => (alertMessage.value = ''), 3000)
  }
}

// abre modal de confirmación
function openDeleteModal(user: any) {
  selectedUser.value = user 
  showDeleteModal.value = true
}

// eliminar un votante
async function removeVoter() {
  console.log("ENTRE A LA FUNCION");
  try {
    const resp = await RoomService.removeUser({
      user_id: selectedUser.value.id,
      room_id: Number(props.id),
    })
    const data = JSON.parse(resp)
    console.log('Votante eliminado:', data)

    alertMessage.value = data.success || 'Votante eliminado correctamente'
    alertType.value = 'success'
    showDeleteModal.value = false

    await fetchUsers()
  } catch (err) {
    console.error('Error en removeVoter:', err)
    alertMessage.value = 'No se pudo eliminar el votante.'
    alertType.value = 'error'
  } finally {
    setTimeout(() => (alertMessage.value = ''), 3000)
  }
}

// carga inicial
onMounted(fetchUsers)
</script>

