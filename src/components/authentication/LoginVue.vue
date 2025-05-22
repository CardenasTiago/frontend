<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="username" class="input input-bordered input-primary flex items-center gap-2">
        <Icon icon="ic:baseline-person" width="24" height="24" />
        <input
          id="username"
          name="username"
          v-model="form.username"
          type="text"
          class="grow"
          placeholder="Nombre de usuario"
          @keydown="blockSpaces"
          @paste="blockPasteSpaces"
          required
        />
      </label>
    </div>
    
      <label for="password" class="input input-bordered input-primary flex items-center gap-2">
        <Icon icon="ic:baseline-key" width="24" height="24" />
        <input
          id="password"
          autocomplete="current-password"
          name="password"
          type="password"
          class="grow"
          placeholder="Password"
          v-model="form.password"
          required
        />
      </label>
      
    <div class="text-xs text-primary flex justify-end">¿Has olvidado tu constraseña?</div>
    
    <div v-if="error" style="color: red">{{ error }}</div>
    <button
      type="submit"
      class="btn btn-primary w-full"
      :disabled="!isFormValid || isSubmitting"
      :aria-disabled="!isFormValid || isSubmitting"
    >
      {{ isSubmitting ? 'Ingresando…' : 'Iniciar Sesión' }}
    </button>
    <p className="text-slate-600">
      Todavía no tienes cuenta?
      <a
        @click="redirectToRegister"
        href="/auth/register"
        class="font-bold text-primary"
      >
        Registrese aqui</a
      >
    </p>
  </form>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import {Icon} from "@iconify/vue";
import UserService from '../../services/user.service';

const form = reactive({
  username: '',
  password: '',
});

const error = ref('');
const isSubmitting = ref(false);

const handleSubmit = async () => {
  error.value = '';
  try {
    const json = await UserService.login(form);
    
    const data = JSON.parse(json);
    if (data.user) {
      localStorage.setItem('userName', data.user.name);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/protected/menu';
    } else {
      error.value = data.error || 'Usuario o contraseña incorrectos';
    }
  } catch (err) {
    error.value = err.error || 'Error en la conexión con el servidor';
  }
};

const isFormValid = computed(() =>
  form.username.trim().length > 0 &&
  form.password.trim().length > 0
);

const redirectToRegister = () => {
  window.location.href = '/auth/register';
};

const controlKeys = [
  'Backspace','Delete','ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
  'Home','End','Tab'
];


const blockSpaces = (e) => {
  if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) return;
  if (e.key === ' ') e.preventDefault();
};

const blockPasteSpaces = (e) => {
  e.preventDefault();
  const el = e.target;
  const pasted = (e.clipboardData || window.clipboardData).getData('text');
  const noSpaces = pasted.replace(/\s+/g, '');
  const { selectionStart: start, selectionEnd: end, value } = el;
  const newVal = value.slice(0, start) + noSpaces + value.slice(end);
  el.value = newVal;
  form[el.name] = newVal;
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

.btn-secondary {
  width: 15rem;
  font-weight: 500;
}

</style>
