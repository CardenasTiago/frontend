<template>
    <button 
      @click="handleCreate" 
      class="btn w-full text-white"
      :class="type === 'formal' ? 'btn-primary' : 'btn-secondary'"
      :disabled="isLoading"
    >
      {{ isLoading ? 'Creando...' : `Crear sala ${type === 'formal' ? 'formal' : 'informal'}` }}
    </button>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    type: {
      type: String,
      required: true,
      validator: (value) => ['formal', 'informal'].includes(value)
    }
  });
  
  const isLoading = ref(false);
  
  // Crea la sala en la base de datos
  const handleCreate = async () => {
    try {
      isLoading.value = true;
  
      const roomData = {
        name: props.type === 'formal' ? 'Nueva sala formal' : 'Nueva sala informal',
        description: 'Descripción de la sala',
        is_formal: props.type === 'formal',
        link_invite: 'default-link',
        state: 'created'
      };
  
      const response = await fetch('http://localhost:3000/v1/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(roomData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la sala');
      }
  
      const data = await response.json();
      // Limpiar la sala si ya existe
      const storedRoom = localStorage.getItem("currentRoom");

      if (storedRoom) {
          // Si hay una sala guardada, la limpiamos para evitar inconsistencias
          localStorage.removeItem("currentRoom");
          console.log("Sala anterior eliminada de localStorage.");
      }
      
      // Redirigir a editar sala con el ID creado
      window.location.href = `/protected/editRoom?id=${data.room.id}`;
  
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear la sala: ' + error.message);
    } finally {
      isLoading.value = false;
    }
  };
  </script>