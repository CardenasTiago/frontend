<template>
  <div v-bind="$attrs">
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col lg:flex-row gap-4">
        <div>
          <label class="flex input input-bordered input-primary items-center p-2">Nombre
            <input v-model="form.name" type="text" class="p-2" required />
          </label>
        </div>
        <div>
          <label class="flex input input-bordered input-primary items-center p-2">Apellido
            <input v-model="form.lastname" type="text" class="p-2" required />
          </label>
        </div>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2 p-2">Nombre de Usuario
          <input v-model="form.username" type="text" required />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">
          DNI
          <input v-model="form.dni" type="text" required maxlength="10" minlength="8" />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">Email
          <input v-model="form.email" type="email" required />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">Confirmar Email
          <input v-model="form.confirmEmail" type="email" required />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">Contraseña
          <input v-model="form.password" type="password" required />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">Confirmar Contraseña
          <input v-model="form.confirmPassword" type="password" required />
        </label>
      </div>
      <div v-if="error" style="color: red">{{ error }}</div>
      <div>
        <div>
          <button type="submit" class="btn btn-primary">Registrarse</button>
        </div>

        <div>
          <p class="mt-4 text-accent">
            Ya tiene cuenta?
            <a href="/auth/login" class="font-bold text-primary">Inicie sesion</a>
          </p>
        </div>

      </div>
    </form>
    <!-- caja invisible para generar un espacio mas prolijo -->
    <div class="h-4"></div>

    <div v-if="successMessage" role="alert" class="alert alert-success flex text-sm justify-center">
      <Icon icon="ix:success" class="h-6 w-6" />
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import UserService from "../../services/user.service";

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
    const json = await UserService.create(JSON.stringify(dataToSend));
    const response = JSON.parse(json)

    if (response) {
      successMessage.value =
        "Registro exitoso. Serás redirigido al inicio de sesión en unos momentos.";

      // Opcional: Redirigir automáticamente después de unos segundos
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000); // Redirige después de 3 segundos
    }
  } catch (err) {
    error.value = err.error || "error en la conexion con el servidor";
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}


label {
  font-weight: 600;
  @apply text-secondary;
}

input {
  font-weight: 500;
  @apply text-accent;
}
</style>
