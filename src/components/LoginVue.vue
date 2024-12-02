<!-- src/components/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input
        class="input"
        v-model="form.username"
        type="text"
        placeholder="nombre de usuario"
        required
      />
    </div>
    <div>
      <input
        class="input"
        v-model="form.password"
        type="password"
        placeholder="constraseña"
        required
      />
    </div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <button type="submit">Iniciar Sesión</button>
    <button @click="redirectToRegister" type="button">Registrarse</button>
  </form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  username: "",
  password: "",
});

const error = ref("");

const handleSubmit = async () => {
  error.value = "";

  try {
    const response = await fetch("http://localhost:3000/v1/users/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (response.ok) {
      const data = await response.json();
      const userName = data.user.name;
      localStorage.setItem("userName", userName);
      window.location.href = "/protected/menu"; // Redirige al menú principal
    } else {
      const data = await response.json();
      error.value = data.error || "Credenciales inválidas";
    }
  } catch (err) {
    error.value = "Error en la conexión con el servidor";
  }
};

const redirectToRegister = () => {
  window.location.href = "/auth/register"; // Cambia a la ruta de registro
};
</script>

<style scoped>
/* Estilos opcionales */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
