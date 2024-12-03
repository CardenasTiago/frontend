<!-- src/components/LoginForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="16"
          height="16"
          viewBox="0 0 48 48"
        >
          <path
            d="M24 4A10 10 0 1024 24 10 10 0 1024 4zM36.021 28H11.979C9.785 28 8 29.785 8 31.979V33.5c0 3.312 1.885 6.176 5.307 8.063C16.154 43.135 19.952 44 24 44c7.706 0 16-3.286 16-10.5v-1.521C40 29.785 38.215 28 36.021 28z"
          ></path>
        </svg>
        <input
          v-model="form.username"
          type="text"
          class="grow"
          placeholder="Nombre de usuario"
          required
        />
      </label>
    </div>
    <label class="input input-bordered flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        class="h-4 w-4 opacity-70"
      >
        <path
          fill-rule="evenodd"
          d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
          clip-rule="evenodd"
        />
      </svg>
      <input
        type="password"
        class="grow"
        placeholder="Password"
        v-model="form.password"
        required
      />
    </label>
    <div v-if="error" style="color: red">{{ error }}</div>
    <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
    <p className="text-slate-600">
      Todavía no tienes cuenta?
      <a
        @click="redirectToRegister"
        href="/auth/register"
        class="register-text"
      >
        Registrese aqui</a
      >
    </p>
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
      error.value = data.error || "Usuario o contraseña incorrectos";
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
  align-items: center;
}

.btn-primary {
  color: white;
}

.btn-secondary {
  width: 15rem;
  font-weight: 500;
}

a {
  background-color: white;
  color: #6b48ff;
}
</style>
