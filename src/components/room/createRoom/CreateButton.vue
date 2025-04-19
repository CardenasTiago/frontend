<template>
  <button 
    @click="handleCreate" 
    class="btn w-full text-white"
    :class="type === 'formal' ? 'btn-primary' : 'btn-secondary'"
  >
    {{ `Crear sala ${type === 'formal' ? 'formal' : 'informal'}` }}
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value) => ['formal', 'informal'].includes(value)
  }
});

const handleCreate = () => {
  // redirige con el tipo de sala
  window.location.href = `/protected/editRoom?tipo=${props.type}`;
};
</script>