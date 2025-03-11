<template>
    <div v-if="isAuthenticated === true">
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const isAuthenticated = ref(null);
  
  onMounted(async () => {
    try {
      const response = await fetch("http://localhost:3000/v1/users/auth", {
        credentials: 'include',
      });
  
      if (response.status === 200) {
        isAuthenticated.value = true;
        // Lógica adicional si es necesario
      } else {
        isAuthenticated.value = false;
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      isAuthenticated.value = false;
      window.location.href = '/login';
    }
  });
  </script>
  