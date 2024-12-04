<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Nombre
        <input v-model="form.name" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Apellido
        <input v-model="form.lastname" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Nombre de Usuario
        <input v-model="form.username" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2">
        DNI
        <input v-model="form.dni" type="text" required maxlength="10" minlength="8"/>
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Email
        <input v-model="form.email" type="email" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Confirmar Email
        <input v-model="form.confirmEmail" type="email" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Contraseña
        <input v-model="form.password" type="password" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered input-primary flex items-center gap-2"
        >Confirmar Contraseña
        <input v-model="form.confirmPassword" type="password" required />
      </label>
    </div>
    <div v-if="error" style="color: red">{{ error }}</div>
    <div>
      <div>
        <button type="submit" class="btn btn-primary">Registrarse</button>
      </div>

      <div>
        <p class="mt-4 text-slate-600">
          Ya tiene cuenta?
          <a href="/auth/login">Inicie sesion</a>
        </p>
      </div>

      <div v-if="successMessage">
      <div style="color: green; font-weight: bold;">{{ successMessage }}</div>
      <div>
        <!-- Opcional: Proporcionar un enlace para iniciar sesión inmediatamente -->
        <p>Si no eres redirigido automáticamente, <a href="/auth/login">haz clic aquí para iniciar sesión</a>.</p>
      </div>
    </div>

    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";

const form = ref({
  name: "",
  lastname: "",
  username: "",
  dni: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
});

const error = ref("");

const successMessage = ref("");

const handleSubmit = async () => {
  error.value = "";

  if (form.value.email != form.value.confirmEmail) {
    error.value = "Los correos no coinciden";
    return;
  }

  if (form.value.password != form.value.confirmPassword) {
    error.value = "Las contraseñas no coinciden";
    return;
  }

  const dataToSend = {
    name: form.value.name,
    lastname: form.value.lastname,
    username: form.value.username,
    dni: form.value.dni,
    email: form.value.email,
    password: form.value.password,
  };


  try {

    const response = await fetch("http://localhost:3000/v1/users", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });

    if (response.ok) {
      successMessage.value =
        "Registro exitoso. Serás redirigido al inicio de sesión en unos momentos.";

      // Opcional: Redirigir automáticamente después de unos segundos
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000); // Redirige después de 3 segundos
    } else {
      const data = await response.json();
      error.value = data.error || "Usuario o contraseña incorrectos";
    }
  } catch (err) {
    error.value = "Error en la conexion con el servidor";
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-primary {
  @apply text-neutral;
}

a {
  @apply bg-neutral;
  @apply text-primary
}

label {
  font-weight: 600;
  @apply text-secondary;
}

input {
  font-weight: 500;
  color: black;
}
</style>
