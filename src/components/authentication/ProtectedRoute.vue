<template>
    <div v-bind="$attrs">
      <slot v-if="isAuthenticated"></slot>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import UserService from '../../services/user.service';

const isAuthenticated = ref(false);

onMounted(async () => {
  const ok = await UserService.authCheck();
  if (ok) {
    isAuthenticated.value = true;
  } else {
    window.location.href = '/auth/login';
  }
});
</script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  