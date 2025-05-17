<template>
  <div v-bind="$attrs">
    <form @submit.prevent="handleSubmit">
      <div class="flex flex-col lg:flex-row gap-4">
        <div>
          <label for="name" class="flex input input-bordered input-primary items-center p-2">Nombre
            <input name="name" v-model="form.name" type="text" class="p-2" required />
          </label>
        </div>
        <div>
          <label for="lastname" class="flex input input-bordered input-primary items-center p-2">Apellido
            <input name="lastname" v-model="form.lastname" type="text" class="p-2" required />
          </label>
        </div>
      </div>
      <div class="form-control">
        <label for="username" class="input input-bordered input-primary flex items-center gap-2 p-2">Nombre de Usuario
          <input name="username" v-model="form.username" type="text" required minlength="3" maxlength="30"
            @input="validateUsername" />
        </label>
        <div v-if="form.username.length > 0 && form.username.length < 3" class="text-error text-xs mt-1 ml-2">
          El nombre de usuario debe tener al menos 3 caracteres
        </div>
      </div>
      <div>
        <label for="dni" class="input input-bordered input-primary flex items-center gap-2">
          DNI
          <input name="dni" inputmode="numeric" v-model="form.dni" type="text" required maxlength="10" minlength="8" />
        </label>
        <p v-if="form.dni.length > 0 && form.dni.length !== 8" class="text-error text-xs mt-4" role="alert">
          El DNI debe tener exactamente 8 dígitos.
        </p>
      </div>
      <div>
        <label for="email" class="input input-bordered input-primary flex items-center gap-2">Email
          <input name="email" autocomplete="" v-model="form.email" type="email" required />
        </label>
      </div>
      <div>
        <label class="input input-bordered input-primary flex items-center gap-2">Confirmar Email
          <input inputmode="email" v-model="form.confirmEmail" type="email" required />
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
      <div class="password-check flex flex-col text-sm mt-2 space-y-1">
        <div class="flex justify-center items-center gap-2">
          <Icon :icon="passwordChecks.length ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.length ? 'success' : 'error']" />
          <span :class="passwordChecks.length ? 'text-green-500' : 'text-red-500'">
            Al menos 8 caracteres
          </span>
        </div>

        <div class="flex justify-center items-center gap-2">
          <Icon :icon="passwordChecks.uppercase ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.uppercase ? 'success' : 'error']" />
          <span :class="passwordChecks.uppercase ? 'text-green-500' : 'text-red-500'">
            Al menos 1 letra mayúscula (A-Z)
          </span>
        </div>

        <div class="flex justify-center items-center gap-2">
          <Icon :icon="passwordChecks.lowercase ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.lowercase ? 'success' : 'error']" />
          <span :class="passwordChecks.lowercase ? 'text-green-500' : 'text-red-500'">
            Al menos 1 letra minúscula (a-z)
          </span>
        </div>

        <div class="flex justify-center items-center gap-2">
          <Icon :icon="passwordChecks.number ? 'mdi:check-circle' : 'mdi:close-circle'"
            :class="['animated-check', passwordChecks.number ? 'success' : 'error']" />
          <span :class="passwordChecks.number ? 'text-green-500' : 'text-red-500'">
            Al menos 1 número (0-9)
          </span>
        </div>
      </div>

      <div v-if="error" style="color: red">{{ error }}</div>
      <div>
        <div>
          <button type="submit" :disabled="!isFormValid || isSubmitting" class="btn btn-primary w-full mt-6"
            aria-disabled="!isFormValid">
            {{ isSubmitting ? 'Registrando…' : 'Registrarse' }}
          </button>
        </div>

        <div>
          <p class="mt-4 text-accent">
            Ya tiene cuenta?
            <a href="/auth/login" class="font-bold text-primary">Inicie sesion</a>
          </p>
        </div>

      </div>
    </form>
    <div v-if="successMessage" role="alert" class="alert alert-success flex text-sm justify-center">
      <Icon icon="ix:success" class="h-6 w-6" />
      <span>{{ successMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref } from "vue";
import { Icon } from "@iconify/vue";
import UserService from "../../services/user.service";

// 1. Formulario como reactive
const form = reactive({
  name: "",
  lastname: "",
  username: "",
  dni: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
});

// 2. Chequeos de contraseña también como reactive
const passwordChecks = reactive({
  length: false,
  uppercase: false,
  lowercase: false,
  number: false,
});

// Flag de envío para deshabilitar botón mientras submit
const isSubmitting = ref(false);

// Estado de error y éxito
const error = ref("");
const successMessage = ref("");

// Labels de las reglas de contraseña
const passwordRules = [
  { key: "length", label: "Al menos 8 caracteres" },
  { key: "uppercase", label: "Al menos 1 mayúscula (A-Z)" },
  { key: "lowercase", label: "Al menos 1 minúscula (a-z)" },
  { key: "number", label: "Al menos 1 número (0-9)" },
];

// 3. Observamos form.password para actualizar passwordChecks
watch(
  () => form.password,
  (pwd) => {
    passwordChecks.length = pwd.length >= 8;
    passwordChecks.uppercase = /[A-Z]/.test(pwd);
    passwordChecks.lowercase = /[a-z]/.test(pwd);
    passwordChecks.number = /[0-9]/.test(pwd);
  }
);

// 4. Validación reactiva del formulario completo
const isFormValid = computed(() => {
  return (
    form.name &&
    form.lastname &&
    form.username.length >= 3 &&
    form.username.length <= 30 &&
    form.dni.length == 8 &&
    form.email === form.confirmEmail &&
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.lowercase &&
    passwordChecks.number
  );
});

// 5. Mensaje inline para username
const usernameError = computed(() =>
  form.username && form.username.length < 3 ? "Mínimo 3 caracteres" : ""
);

// 6. Limitar username a 30 chars
const validateUsername = () => {
  if (form.username.length > 30) {
    form.username = form.username.slice(0, 30);
  }
};

// 7. Submit handler
const handleSubmit = async () => {
  if (!isFormValid.value) return;
  error.value = "";
  isSubmitting.value = true;

  try {
    // enviamos directamente el objeto reactive
    const responseJson = await UserService.create(JSON.stringify(form));
    const response = JSON.parse(responseJson);

    if (response) {
      successMessage.value =
        "Registro exitoso. Serás redirigido al inicio de sesión en unos momentos.";
      setTimeout(() => {
        window.location.href = "/auth/login";
      }, 3000);
    }
  } catch (err) {
    error.value = err.error || "Error de conexión";
  } finally {
    isSubmitting.value = false;
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
  color: #ef4444;
  /* rojo */
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
  0% {
    transform: translateX(0);
  }

  25% {
    transform: translateX(-3px);
  }

  50% {
    transform: translateX(3px);
  }

  75% {
    transform: translateX(-3px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
