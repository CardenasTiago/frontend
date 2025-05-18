<template>
    <div class="w-full">
        <ul class="users flex justify-between font-semibold" v-for="client in userList" :key="client">
            <li class="text-start">
                <div class="flex items-center gap-2">
                    <img v-if="client.image" :src="client.image" alt="Foto de perfil"
                        class="w-[24px] h-[24px] rounded-full object-cover" />

                    <!-- Si no hay imagen, se muestra el componente Icon -->
                    <Icon v-else icon="ic:baseline-person" class="rounded-full object-cover text-secondary" width="24"
                        height="24" />


                    <span alt="Nombre de usuario">
                        {{ client.username }}
                    </span>
                    <button alt="expulsar usuario" v-if="client.username !== user.username && room.privileges" class="text-error"
                        @click="kickUser(client.id)">
                        <Icon icon="mdi:cross-circle-outline" width="24" height="24" />
                    </button>
                </div>


            </li>
            <li class="text-end">
                <span class="status">en línea</span>
                <span class="inline-block ml-2 w-3 h-3 bg-[#71F260] rounded-full mr-1"></span>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { useWebSocketStore } from '../../stores/socketStore';
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();
const {
    userList
} = storeToRefs(socketStore)

const user = ref('');
const room = ref('');


onMounted(() => {
    const loggedUser = localStorage.getItem('user');

    if (loggedUser) {
        user.value = JSON.parse(loggedUser);
    } else {
        console.error('No se encontro el usuario en el almacenamiento local.');
    }

    const storedRoom = localStorage.getItem('currentRoom');

    if (storedRoom) {
        room.value = JSON.parse(storedRoom);
    } else {
        console.error('No se encontró el room ID en el almacenamiento local.');
    }
});

function kickUser(id) {
    socketStore.socket.sendEvents("kick_user", { user_id: id });
}
</script>

<style>
.users {
    @apply text-primary bg-secondary/10;
    padding: 8px;
    margin: 8px auto;
    /* Auto en los laterales centra el elemento */
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    border-radius: 10px;
    max-width: 500px;
}


.status {
    color: #8F8F8F;
}
</style>