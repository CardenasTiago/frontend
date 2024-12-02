<!-- src/components/ProtectedRoute.vue -->
<template>
    <div>
      <slot v-if="isAuthenticated"></slot>
      <div v-else>Redirigiendo al inicio de sesión...</div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const isAuthenticated = ref(false);
  
  onMounted(async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/users/auth', {
        method: 'GET',
        credentials: 'include',
      });
  
      if (response.ok) {
        isAuthenticated.value = true;
      } else {
        window.location.href = '/auth/login';
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      window.location.href = '/auth/login';
    }
  });
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  