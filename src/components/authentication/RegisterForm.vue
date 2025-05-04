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
      <div class="form-control">
        <label class="input input-bordered input-primary flex items-center gap-2 p-2">Nombre de Usuario
          <input v-model="form.username" type="text" required minlength="3" maxlength="30" @input="validateUsername"/>
        </label>
        <div v-if="form.username.length > 0 && form.username.length < 3" class="text-error text-xs mt-1 ml-2">
          El nombre de usuario debe tener al menos 3 caracteres
        </div>
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
      <div class="password-check text-sm mt-2 space-y-1">
        <div class="flex items-center gap-2">
          <Icon
            :icon="passwordChecks.length ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.length ? 'success' : 'error']"
          />
          <span :class="passwordChecks.length ? 'text-green-500' : 'text-red-500'">
            Al menos 8 caracteres
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <Icon
            :icon="passwordChecks.uppercase ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.uppercase ? 'success' : 'error']"
          />
          <span :class="passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'">
            Al menos 1 letra mayúscula (A-Z)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <Icon
            :icon="passwordChecks.lowercase ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.lowercase ? 'success' : 'error']"
          />
          <span :class="passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'">
            Al menos 1 letra minúscula (a-z)
          </span>
        </div>

        <div class="flex items-center gap-2">
          <Icon
            :icon="passwordChecks.number ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.number ? 'success' : 'error']"
          />
          <span :class="passwordChecks.number ? 'text-green-500' : 'text-red-500'">
            Al menos 1 número (0-9)
          </span>
        </div>
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
import { ref , watch, computed} from "vue";
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

const passwordChecks = ref({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
});

const validateUsername = () => {
  if (form.value.username.length > 30) {
    form.value.username = form.value.username.slice(0, 30);
  }
};

const isFormValid = computed(() => {
  return form.value.username.length >= 3 &&
        form.value.username.length <= 30 &&
        form.value.name &&
        form.value.lastname &&
        form.value.dni &&
        form.value.email &&
        form.value.confirmEmail &&
        form.value.password &&
        form.value.confirmPassword;
});


watch(() => form.value.password, (newPassword) => {
  passwordChecks.value.length = newPassword.length >= 8;
  passwordChecks.value.uppercase = /[A-Z]/.test(newPassword);
  passwordChecks.value.lowercase = /[a-z]/.test(newPassword);
  passwordChecks.value.number = /[0-9]/.test(newPassword);
});


const handleSubmit = async () => {
  error.value = "";

  if (form.value.username.length < 3) {
    error.value = "El nombre de usuario debe tener al menos 3 caracteres";
    return;
  }

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

.password-check {
  margin-top: 0.5rem;
}

.password-check .flex {
  font-size: 0.875rem;
}

.animated-check {
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55), color 0.4s ease;
  transform: scale(1);
}

.animated-check.success {
  color: #22c55e;
  transform: scale(1.35);
  animation: pop 0.5s ease-in-out;
}

.animated-check.error {
  color: #ef4444; /* rojo */
  transform: scale(0.9) rotate(0deg);
  animation: shake 0.5s ease-in-out;
}

/* Animación de éxito (pequeño rebote) */
@keyframes pop {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.4);
    opacity: 1;
  }
  100% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Animación de error (ligero movimiento de sacudida) */
@keyframes shake {
  0% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  50% { transform: translateX(3px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

</style>
