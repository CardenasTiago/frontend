<template>
  <div v-if="loading" class="text-center py-4">
    <span class="loading loading-spinner loading-lg text-primary"></span>
  </div>

  <form v-else @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Privacidad</span>
        </div>
        <select 
          v-model="form.privacy"
          class="select w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
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
          <span class="label-text text-accent/80 text-lg">Tiempo por propuesta (segundos)</span>
        </div>
        <input
          v-model.number="form.proposalTimer"
          type="number"
          min="1"
          max="10000"
          class="input w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        />
      </label>
    </div>

    <div>
      <label class="form-control w-full">
        <div class="label">
          <span class="label-text text-accent/80 text-lg">Quórum</span>
        </div>
        <input
          v-model.number="form.quorum"
          type="number"
          min="2"
          max="100"
          class="input w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
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
            class="input w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
            required
            :min="minDate"
          />
          <input
            v-model="form.time"
            type="time"
            class="input w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
            required
          />
          <div class="label">
            <span v-if="dateError" class="label-text-alt text-error">{{ dateError }}</span>
          </div>
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
          max="1000"
          class="input w-full bg-secondary/10 border-secondary/20 h-12 text-lg"
          required
        />
        <div class="label">
          <span class="label-text-alt text-accent/60">Mínimo 2 votantes</span>
        </div>
      </label>
    </div>

    <AdminField />

    <div class="flex justify-center pt-4">
      <button 
        type="submit" 
        class="btn btn-primary px-14 py-2"
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
import SettingRoomService from '../../../services/settingroom.service';

// Estado del formulario
const form = ref({
  privacy: false,
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
const dateError = ref('');

// Fecha mínima (hoy)
const minDate = computed(() => new Date().toISOString().split('T')[0]);

// Carga de configuración existente
const fetchSettings = async () => {
  try {
    const txt = await SettingRoomService.byRoom(String(roomId.value));
    const data = JSON.parse(txt);
    if (data) {
      settingId.value         = data.id;
      form.value.privacy      = data.privacy;
      form.value.proposalTimer = data.proposal_timer;
      form.value.quorum       = data.quorum;
      if (data.start_time) {
        const dt = new Date(data.start_time);
        form.value.date = dt.toISOString().split('T')[0];
        form.value.time = dt.toTimeString().slice(0,5);
      }
      form.value.voterLimit = data.voter_limit;
    }
  } catch (err) {
    console.error('Error cargando configuración:', err);
  }
};

// Validar campos
const validateForm = () => {
  if (!roomId.value) throw new Error('No se encontró el ID de la sala');
  dateError.value = '';
  const dt = new Date(`${form.value.date}T${form.value.time}`);
  if (dt <= new Date()) {
    dateError.value = 'La fecha y hora deben ser futuras';
    return null;
  }
  return dt;
};

// Enviar formulario
const handleSubmit = async () => {
  try {
    isSubmitting.value = true;
    error.value = '';

    const dt = validateForm();
    if (!dt) return;

    const payload = {
      privacy: form.value.privacy,
      proposal_timer: form.value.proposalTimer,
      quorum: form.value.quorum,
      start_time: dt.toISOString(),
      voter_limit: form.value.voterLimit,
      room_id: parseInt(roomId.value, 10),
    };

    if (settingId.value) {
      await SettingRoomService.update(String(settingId.value), payload);
    } else {
      const resp = await SettingRoomService.create(payload);
      const created = JSON.parse(resp);
      settingId.value = created.id;
    }

    window.location.href = `/protected/room/${settingId.value}`;
  } catch (err) {
    error.value = err.message || 'Error al guardar la configuración';
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  const params = new URLSearchParams(window.location.search);
  roomId.value = params.get('id');
  form.value.date = minDate.value;
  form.value.time = new Date().toTimeString().slice(0,5);

  await fetchSettings();
  loading.value = false;
});
</script>