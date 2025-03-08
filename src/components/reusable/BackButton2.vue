<template>
    <button @click="goBack" class="btn btn-circle bg-secondary/20 hover:bg-secondary/30 border-none">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
    </button>
</template>

<script setup>
const goBack = () => {
    window.history.back();
};
</script>