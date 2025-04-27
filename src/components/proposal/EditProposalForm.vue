<template>
  <div class="bg-neutral p-8 rounded-xl shadow-lg">
    <div class="flex justify-between items-center mb-6">
      <BackButton />
      <div v-if="isFormal" class="dropdown dropdown-end tooltip tooltip-secondary  tooltip-left" data-tip="subir archivo" >
        <button tabindex="0" class="btn btn-circle bg-secondary/20 hover:bg-secondary/30 border-none">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <ul tabindex="0"  class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
          <li>
            <label class="flex items-center gap-2 p-2 hover:bg-secondary/10 rounded-lg cursor-pointer">
              <input type="file" class="hidden" @change="handleFileUpload" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" />
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Subir archivo
            </label>
          </li>
        </ul>
      </div>
    </div>

    <h1 class="text-2xl font-bold text-primary text-center mb-2">
      {{ isEditing ? 'Editar propuesta' : 'Nueva propuesta' }}
    </h1>

    <div v-if="loading" class="text-center py-4">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
      <div>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-accent/80 text-lg">Nombre de la propuesta</span>
          </div>
          <input v-model="form.title" type="text"
            class="input w-full bg-secondary/10 border-secondary/20" required maxlength="255"
            @input="validateForm" />
          <div class="label">
            <span class="label-text-alt text-accent/60">{{ form.title.length }}/255 caracteres</span>
            <span v-if="titleError" class="label-text-alt text-error">{{ titleError }}</span>
          </div>
        </label>
      </div>

      <div>
        <label class="form-control w-full">
          <div class="label">
            <span class="label-text text-accent/80 text-lg">Descripción</span>
          </div>
          <textarea v-model="form.description"
            class="textarea w-full bg-secondary/10 border-secondary/20 h-32" required maxlength="255"
            @input="validateForm"></textarea>
          <div class="label">
            <span class="label-text-alt text-accent/60">{{ form.description.length }}/255 caracteres</span>
            <span v-if="descriptionError" class="label-text-alt text-error">{{ descriptionError }}</span>
          </div>
        </label>
      </div>

      <!-- Archivo -->
      <div v-if="form.archiveData" class="flex items-center justify-between bg-secondary/10 p-3 rounded-lg">
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="truncate">{{ form.archive }}</span>
        </div>
        <button type="button" @click="removeFile" class="text-accent/80 hover:text-accent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Opciones -->
      <div class="space-y-4">
        <div v-for="(option, index) in form.options" :key="index" class="relative">
          <input v-model="option.value" type="text" :placeholder="`Opción ${index + 1}`"
            class="input input-bordered w-full" :class="[
              'bg-primary text-white placeholder-white/70 pr-10',
              optionErrors[index] ? 'border-error' : ''
            ]" required @input="validateOptions" />
          <div v-if="optionErrors[index]" class="text-error text-sm mt-1">
            {{ optionErrors[index] }}
          </div>
          <button v-if="form.options.length > 2" type="button" @click="removeOption(index)"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <button type="button" @click="addOption" class="btn w-full bg-secondary/20 hover:bg-secondary/30"
          :disabled="form.options.length >= 5">
          + Añadir más opciones
        </button>
      </div>

      <button type="submit" class="btn w-full bg-primary hover:bg-primary/90 text-white"
        :disabled="isSubmitting || !isFormValid">
        {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Guardar cambios' : 'Crear propuesta') }}
      </button>

      <div v-if="error" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BackButton from '../reusable/BackButton2.vue';
import ProposalService from '../../services/proposal.service';
import OptionService   from '../../services/option.service';
import RoomService     from '../../services/room.service';

// Estado del formulario
const form = ref({
  title: '',
  description: '',
  archive: null,
  archiveData: null,
  options: [
    { value: '' },
    { value: '' }
  ]
});

const isSubmitting    = ref(false);
const error           = ref(null);
const loading         = ref(true);
const proposalId      = ref(null);
const roomId          = ref(null);
const descriptionError = ref('');
const titleError      = ref('');
const optionErrors    = ref([]);
const room            = ref(null);

const isEditing = computed(() => !!proposalId.value);

// Validaciones
const validateOptions = () => {
  optionErrors.value = Array(form.value.options.length).fill('');
  const vals = form.value.options.map(o => o.value.trim().toLowerCase());
  const dup = new Set();
  vals.forEach((v,i) => {
    if (!v) { optionErrors.value[i] = 'La opción no puede estar vacía'; return; }
    const first = vals.indexOf(v);
    if (first !== i) { dup.add(v); optionErrors.value[first] = 'Opción duplicada'; optionErrors.value[i] = 'Opción duplicada'; }
  });
};

const validateForm = () => {
  titleError.value = form.value.title.length > 255 ? 'El título no puede exceder 255 caracteres' : '';
  descriptionError.value = form.value.description.length > 255 ? 'La descripción no puede exceder 255 caracteres' : '';
  validateOptions();
};

const isFormValid = computed(() => {
  return form.value.title
    && form.value.title.length <= 255
    && form.value.description.length <= 255
    && form.value.options.length >= 2
    && form.value.options.every(o=>o.value.trim())
    && !titleError.value
    && !descriptionError.value
    && !optionErrors.value.some(e=>e)
    && roomId.value;
});

const addOption = () => {
  if (form.value.options.length < 5) {
    form.value.options.push({ value: '' });
    optionErrors.value.push('');
  }
};

const removeOption = idx => {
  if (form.value.options.length > 2) {
    form.value.options.splice(idx,1);
    optionErrors.value.splice(idx,1);
    validateOptions();
  }
};

const removeFile = () => {
  form.value.archive = null;
  form.value.archiveData = null;
};

const handleFileUpload = e => {
  const file = e.target.files[0];
  if (!file) return;
  const max = 5 * 1024 * 1024;
  if (file.size > max) { error.value = `Tamaño máximo ${max/1024/1024}MB`; return; }
  form.value.archive = file.name;
  const reader = new FileReader();
  reader.onload = ev => form.value.archiveData = ev.target.result;
  reader.onerror = () => { error.value = 'Error al leer archivo'; form.value.archive = null; form.value.archiveData = null; };
  reader.readAsDataURL(file);
};

// Carga de datos para edición
const fetchProposal = async () => {
  try {
    loading.value = true;
    error.value   = null;

    const text = await ProposalService.find(String(proposalId.value));
    const data = JSON.parse(text);
    form.value.title       = data.title || '';
    form.value.description = data.description || '';
    form.value.archive     = data.archive || null;

    const optsText = await OptionService.byProposal(String(proposalId.value));
    const optsData = JSON.parse(optsText);
    if (Array.isArray(optsData.options)) {
      form.value.options = optsData.options.map(o=>({ value: o.value }));
      optionErrors.value = Array(form.value.options.length).fill('');
    }

    validateForm();
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// Guardar (crear/actualizar)
const handleSubmit = async () => {
  try {
    if (!isFormValid.value) { error.value = 'Verifica los campos'; return; }
    isSubmitting.value = true;
    error.value        = null;

    const roomNum = parseInt(roomId.value,10);
    if (isNaN(roomNum)) throw new Error('ID sala inválido');

    const payload = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
      archive: form.value.archiveData||'',
      room_id: roomNum
    };

    let resultText;
    if (isEditing.value) {
      resultText = await ProposalService.update(String(proposalId.value), payload);
    } else {
      resultText = await ProposalService.create(payload);
    }

    const result = resultText ? JSON.parse(resultText) : null;
    const newId = isEditing.value ? parseInt(proposalId.value,10) : (result?.proposal?.id?parseInt(result.proposal.id,10):null);
    if (!newId) throw new Error('No se obtuvo ID propuesta');

    // Si edito, elimino opciones previas
    if (isEditing.value) {
      const existText = await OptionService.byProposal(String(newId));
      const existData = JSON.parse(existText);
      if (Array.isArray(existData.options)) {
        for (const opt of existData.options) {
          await OptionService.remove(String(opt.id));
        }
      }
    }

    // Creo nuevas opciones
    for (const o of form.value.options) {
      await OptionService.create({ value: o.value.trim(), proposal_id: newId });
    }

    window.location.href = `/protected/proposal?id=${roomId.value}`;
  } catch (err) {
    error.value = err.message;
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};

// Detalle sala
const fetchRoomDetails = async () => {
  try {
    const text = await RoomService.find(String(roomId.value));
    room.value = JSON.parse(text);
  } catch (err) {
    console.error('Error sala:', err);
  }
};

const isFormal = computed(() => room.value?.room?.is_formal);

onMounted(() => {
  const params = new URLSearchParams(window.location.search);
  proposalId.value = params.get('id');
  roomId.value     = params.get('roomId');

  if (!roomId.value) {
    error.value   = 'No se encontró ID de sala';
    loading.value = false;
    return;
  }

  fetchRoomDetails();
  if (isEditing.value) fetchProposal(); else loading.value = false;
});
</script>


<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>