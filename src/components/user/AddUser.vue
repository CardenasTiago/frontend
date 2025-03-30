<template>
    <div class="flex flex-col gap-10 p-10 max-w-screen-md mx-auto">
        <h1 class="flex justify-center font-bold text-2xl">Votantes</h1>
        <div class="flex justify-center gap-10">
            <button class="btn btn-primary" @click="isModalOpen = true">
                Agregar Votante
            </button>
                <!-- Modal -->
            <AddVoterModal v-model="isModalOpen" @add-voter="handleAddVoter" />
            <button class="btn btn-primary">
                <Icon icon="material-symbols:upload" class="w-6 h-6 text-neutral" />
                Subir Archivo
            </button>
        </div>
        <div class="flex items-center ml-2">
            <Icon icon="material-symbols:search-rounded" class="w-6 h-6 absolute ml-2 left-2"/>
            <input 
                type="search" 
                placeholder="Buscar" 
                class="input input-primary pl-10 py-2 w-64" 
            />
        </div>



        <ul role="list" class="">
            <li v-for="person in people" :key="person.email" class="flex justify-between gap-x-6 py-5 p-2">
                <div class="flex min-w-0 gap-x-4">
                    <img class="size-12  flex-none rounded-full bg-accent-50 mr-2" :src="person.imageUrl" alt="" />
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm/6 font-semibold text-accent">{{ person.name }}</p>
                        <p class="mt-1 truncate text-xs/5 text-accent">{{ person.email }}</p>
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
import { ref } from 'vue';
import { Icon } from "@iconify/vue";
import AddVoterModal from "./AddVoterModal.vue";
const people = [
    {
        name: 'Leslie Alexander',
        email: 'leslie.alexander@example.com',
        role: 'Co-Founder / CEO',
        imageUrl:
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Michael Foster',
        email: 'michael.foster@example.com',
        role: 'Co-Founder / CTO',
        imageUrl:
            'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Dries Vincent',
        email: 'dries.vincent@example.com',
        role: 'Business Relations',
        imageUrl:
            'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
    {
        name: 'Lindsay Walton',
        email: 'lindsay.walton@example.com',
        role: 'Front-end Developer',
        imageUrl:
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Courtney Henry',
        email: 'courtney.henry@example.com',
        role: 'Designer',
        imageUrl:
            'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: '3h ago',
        lastSeenDateTime: '2023-01-23T13:23Z',
    },
    {
        name: 'Tom Cook',
        email: 'tom.cook@example.com',
        role: 'Director of Product',
        imageUrl:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        lastSeen: null,
    },
]
const isModalOpen = ref(false)

const handleAddVoter = (voterData) => {
  console.log("Nuevo votante agregado:", voterData)
  // Aquí puedes hacer una llamada a la API o actualizar tu lista de votantes
}
</script>