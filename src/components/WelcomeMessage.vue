<!-- src/components/WelcomeMessage.vue -->
<template>
    <div>
      <h2>¡Bienvenido, {{ userName }}!</h2>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const userName = ref('');
  
  onMounted(() => {
    userName.value = localStorage.getItem('userName') || 'Usuario';
  });
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  