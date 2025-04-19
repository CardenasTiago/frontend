<template>
    <ul>
      <li v-for="(vote, index) in socketStore.results" :key="index">
        <!-- Se usa una función para convertir el objeto a JSON de forma segura -->
        <pre>{{ stringify(vote) }}</pre>
      </li>
    </ul>
  </template>
  
  <script setup>
  import { useWebSocketStore } from '../../stores/socketStore'
  const socketStore = useWebSocketStore();
  
  /**
   * Función que convierte un objeto a string en formato JSON de forma segura
   * para evitar ciclos (referencias circulares).
   */
  function stringify(obj) {
    try {
      return JSON.stringify(obj, getCircularReplacer(), 2);
    } catch (error) {
      return 'Error al convertir el objeto';
    }
  }
  
  /**
   * Retorna un replacer para JSON.stringify que ignora las referencias circulares.
   */
  function getCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) return;
        seen.add(value);
      }
      return value;
    };
  }
  </script>
  