<template>
    <div v-if="isAuthenticated === true">
      <slot></slot>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import UserService from '../../services/user.service';

  const isAuthenticated = ref(null);
  
  onMounted(async () => {
    try {
      const json = UserService.authCheck();
      const response = JSON.parse(json)
      
      if (response.status === 200) {
        isAuthenticated.value = true;
        // Lógica adicional si es necesario
      } else {
        isAuthenticated.value = false;
        window.location.href = '/login';
      }
    } catch (err) {
      console.error('Error al verificar autenticación:', err.error);
      isAuthenticated.value = false;
      window.location.href = '/login';
    }
  });
  </script>
  