<template>
  <div v-if="loading" class="text-center py-4">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="error" class="alert alert-error mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ error }}</span>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Privacidad</span>
        </div>
        <select 
          v-model="form.privacy"
          class="select select-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        >
          <option :value="true">Privada</option>
          <option :value="false">Pública</option>
        </select>
      </label>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Tiempo por propuesta (minutos)</span>
        </div>
        <input
          v-model.number="form.proposalTimer"
          type="number"
          min="1"
          max="60"
          class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        />
      </label>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Quórum (%)</span>
        </div>
        <input
          v-model.number="form.quorum"
          type="number"
          min="1"
          max="100"
          class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        />
      </label>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Fecha y hora programada</span>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <input
            v-model="form.date"
            type="date"
            class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
            required
            :min="minDate"
          />
          <input
            v-model="form.time"
            type="time"
            class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
            required
          />
        </div>
      </label>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Límite de votantes</span>
        </div>
        <input
          v-model.number="form.voterLimit"
          type="number"
          min="2"
          max="255"
          class="input input-bordered w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        />
        <div class="label">
          <span class="label-text-alt text-accent/60">Mínimo 2 votantes</span>
        </div>
      </label>
    </div>

    <AdminField />

    <div class="grid grid-cols-2 gap-6 pt-4">
      <a :href="`/protected/proposal?id=${roomId}`" class="w-full">
        <button type="button" class="btn btn-secondary w-full text-white">
          Propuestas
        </button>
      </a>
      <button 
        type="submit" 
        class="btn btn-primary w-full text-white"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AdminField from '../../reusable/AdminField.vue';

const form = ref({
  privacy: true,
  proposalTimer: 5,
  quorum: 50,
  date: '',
  time: '',
  voterLimit: 2,
});

const isSubmitting = ref(false);
const error = ref('');
const loading = ref(true);
const roomId = ref(null);
const settingId = ref(null);

const minDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const fetchSettings = async () => {
  try {
    const response = await fetch(`http://localhost:3000/v1/settingsRoom/byRoom/${roomId.value}`, {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      if (data) {
        settingId.value = data.id;
        form.value.privacy = data.privacy;
        form.value.proposalTimer = data.proposal_timer;
        form.value.quorum = data.quorum;
        
        // Convierte el formato datetime a date y time
        if (data.start_time) {
          const datetime = new Date(data.start_time);
          form.value.date = datetime.toISOString().split('T')[0];
          form.value.time = datetime.toTimeString().slice(0, 5);
        }
        
        form.value.voterLimit = data.voter_limit;
      }
    }
  } catch (err) {
    console.error('Error fetching settings:', err);
  }
};

// Validadores del formulario
const validateForm = () => {
  if (!roomId.value) {
    throw new Error('No se encontró el ID de la sala');
  }

  if (form.value.proposalTimer < 1 || form.value.proposalTimer > 60) {
    throw new Error('El tiempo por propuesta debe estar entre 1 y 60 minutos');
  }

  if (form.value.quorum < 1 || form.value.quorum > 100) {
    throw new Error('El quórum debe estar entre 1 y 100%');
  }

  if (form.value.voterLimit < 2 || form.value.voterLimit > 255) {
    throw new Error('El límite de votantes debe estar entre 2 y 255');
  }

  const selectedDateTime = new Date(`${form.value.date}T${form.value.time}`);
  const now = new Date();
  
  if (selectedDateTime <= now) {
    throw new Error('La fecha y hora deben ser futuras');
  }

  return selectedDateTime;
};

const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = '';

    const selectedDateTime = validateForm();

    const settingRoomData = {
      privacy: form.value.privacy,
      proposal_timer: form.value.proposalTimer,
      quorum: form.value.quorum,
      date_time: selectedDateTime.toISOString(),
      voter_limit: form.value.voterLimit,
      room_id: parseInt(roomId.value),
    };

    const method = settingId.value ? 'PUT' : 'POST';
    const url = settingId.value 
      ? `http://localhost:3000/v1/settingsRoom/${settingId.value}`
      : 'http://localhost:3000/v1/settingsRoom';

    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(settingRoomData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || data.message || `Error del servidor: ${response.status}`);
    }

    // Redireccionar a la página de mis salas
    window.location.href = `/protected/myRooms`;

  } catch (err) {
    error.value = err.message || 'Error al guardar la configuración de la sala';
    console.error('Error:', err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    roomId.value = urlParams.get('id');

    if (!roomId.value) {
      error.value = 'No se encontró el ID de la sala';
      return;
    }

    // Establece valores por defecto
    form.value.date = minDate.value;
    const now = new Date();
    now.setHours(now.getHours() + 1);
    form.value.time = now.toTimeString().slice(0, 5);

    // Intenta obtener la configuración existente
    await fetchSettings();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>