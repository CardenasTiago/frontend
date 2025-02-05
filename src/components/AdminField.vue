<template>
    <label class="form-control w-full">
        <div class="label">
            <span class="label-text text-accent/80">Administrador</span>
        </div>
        <input 
            type="text" 
            :value="currentUser" 
            disabled 
            class="input input-bordered w-full bg-secondary/10 border-secondary/20" 
        />
    </label>
</template>

<script setup>
import { ref } from 'vue';
const currentUser = ref('Usuario Actual');
</script>