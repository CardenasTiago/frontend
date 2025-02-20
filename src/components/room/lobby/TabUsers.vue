<template>
    <div class="w-full">
        <ul class="users flex justify-between font-semibold" v-for="client in clients" :key="client">
            <li class="text-start">
                {{ client }} 
            </li>
            <li class="text-end">
                <span class="status">en línea</span>
                <span class="inline-block ml-2 w-3 h-3 bg-[#71F260] rounded-full mr-1"></span>
            </li>
        </ul>
    </div>

</template>

<script setup>
import { defineProps } from 'vue'

// Definimos las props que recibirá este componente
const props = defineProps({
    clients: {
        type: Array,
        default: () => []
    }
})
</script>

<style>
.users {
    @apply text-primary bg-slate-50;
    padding: 8px;
    margin: 8px;
    box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px;
    border-radius: 10px;
}

.status {
    color: #8F8F8F;
}
</style>