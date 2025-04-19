<template>
    <a class="btn btn-primary initiliaze" @click="handleClick"
        :class="{ 'cursor-not-allowed opacity-50 pointer-events-none': isVotingDisabled }">
        {{ buttonText }}
        <span :class="{
            'text-error': connectedUsersCount < quorum,
            'text-success': connectedUsersCount >= quorum
        }">
            {{ connectedUsersCount }}/{{ quorum }}
        </span>
        <!-- Aquí se añade el Icon -->
        <Icon icon="ic:baseline-not-started" width="24" height="24" />
    </a>
</template>

<script setup>
import { computed, inject, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { useWebSocketStore } from '../../stores/socketStore';
import { storeToRefs } from 'pinia';

// Definir la prop que recibirá la función
const props = defineProps({
    buttonText: {
        type: String,
        requerid: false
    },
    action: {
        type: Function,
        default: null,
    }
});

const socketStore = useWebSocketStore();
const { userList, socket } = storeToRefs(socketStore);

const quorum = inject('quorum');
const user = inject('user');

onMounted(() => {
    const settingsRoom = localStorage.getItem('settingsRoom');
    if (settingsRoom) {
        const settings = JSON.parse(settingsRoom);
        quorum.value = settings.quorum;
    }
})

const connectedUsersCount = computed(() => userList.value ? userList.value.length : 0);
const isVotingDisabled = computed(() => quorum.value > (userList.value ? userList.value.length : 0));

// Función para manejar el clic
function handleClick() {
    if (props.action && typeof props.action === 'function') {
        props.action(); // Ejecuta la función que se pasó como prop
    } else {
        // En caso de que no se haya pasado ninguna función, puedes optar por una acción default
        socket.sendEvents("start_voting", { from: user.value.username });
    }
}
</script>