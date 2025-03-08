<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text text-accent/80">Administrador</span>
        </div>
        <input 
            type="text" 
            :value= userName
            disabled 
            class="input input-bordered w-full bg-secondary/10 border-secondary/20" 
        />
    </label>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const userName = ref('');

onMounted(() => {
    userName.value = localStorage.getItem('userName') || 'Usuario';
});
</script>
