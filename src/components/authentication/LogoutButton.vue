<template>
    <button @click="handleLogout" class="btn btn-primary">Cerrar Sesión</button>
  </template>
  
  <script setup>
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/v1/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        localStorage.removeItem('userName');
        window.location.href = '/auth/login'; // Redirige al inicio de sesión
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error en la conexión con el servidor:', error);
    }
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  button {
    margin-top: 1rem;
  }
  </style>
  