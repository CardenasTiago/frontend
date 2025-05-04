<template>
    <qrcode-vue :value="url" :size="200" />

</template>

<script setup>
import { ref, computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const { id } = defineProps({
    id: {
        type: String,
        required: true
    }
})

// Computed para construir la URL dinámicamente
const url = computed(() => {
  const origin = window.location.origin  // e.g. "https://tu-frontend.onrender.com"
  return `${origin}/protected/roomInfo/${id}`
})

</script>