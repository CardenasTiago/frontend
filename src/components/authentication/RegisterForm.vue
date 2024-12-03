<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Nombre
        <input v-model="form.name" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Apellido
        <input v-model="form.lastname" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Nombre de Usuario
        <input v-model="form.username" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2">
        DNI
        <input v-model="form.dni" type="text" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Email
        <input v-model="form.email" type="email" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Confirmar Email
        <input v-model="form.confirmEmail" type="email" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Contraseña
        <input v-model="form.password" type="password" required />
      </label>
    </div>
    <div>
      <label class="input input-bordered flex items-center gap-2"
        >Confirmar Contraseña
        <input v-model="form.confirmPassword" type="password" required />
      </label>
    </div>
    <div v-if="error.value" style="color: red">{{ error.value }}</div>
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

const handleSubmit = async () => {
  error.value = "";

  if (form.email != form.confirmEmail) {
    error.value = "los correos no coinciden";
    return;
  }

  if (form.password != form.confirmPassword) {
    error.value = "las contraseñas no coinciden";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/v1/users", {
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
  color: white;
}

a {
  background-color: white;
  color: #6b48ff;
}

label {
  font-weight: 600;
  color: #a78bfa;
}

input {
  font-weight: 500;
  color: black;
}
</style>
