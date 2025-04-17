<template>
    <button @click="handleLogout" class="btn btn-primary">Cerrar Sesión</button>
  </template>
  
  <script setup>
  import UserService from '../../services/user.service';
  const handleLogout = async () => {
    try {
      const json = await UserService.logout();
      response = JSON.parse(json)
      if (response) {
        localStorage.removeItem('userName');
        window.location.href = '/auth/login'; // Redirige al inicio de sesión
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (err) {
      console.error('Error en la conexión con el servidor:', error.error);
    }
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  button {
    margin-top: 1rem;
  }
  </style>
  