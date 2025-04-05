<template>
  <div v-if="room" class="bg-base-100 rounded-lg p-5">
    <h1 class="font-semibold text-center">{{ room.room_title }}</h1>

    <div class="flex justify-between">
      <div>
        <h2 class="mb-2">Descripción</h2>
        <p class="mb-4">
          {{ room.description || 'Sin descripción' }}
        </p>
      </div>
      <div class="align-baseline">
        <div class="flex flex-end align-baseline justify-end">
          <h2 class="mb-2 mr-2 flex flex-end justify-end">Código</h2>
          <button @click="toggleBlur" class="text-secondary">
            <div v-if="isBlurred" class="text-primary mb-1 mr-0 p-0">
              <Icon icon="mdi:eye-closed" width="24" height="24" />

            </div>
            <div v-else class="text-primary mb-1 mr-0 p-0">
              <Icon icon="ic:outline-remove-red-eye" width="24" height="24" />
            </div>
          </button>
        </div>

        <div class="flex justify-end">
          <div class="flex gap-2 group">
            <h2 class="text-secondary" :class="{ blurredText: isBlurred }">
              {{ room.room_code }}
            </h2>
            <button @click="copyToClipboard" alt="copiar codigo en el portapapeles"
              class="btn btn-sm lg:opacity-0 lg:group-hover:opacity-100 border-none shadow-none hover:bg-transparent bg-transparent p-0">
              <Icon icon="fa6-regular:copy" class="w-5 h-5 text-primary font-bold" />
            </button>
          </div>
        </div>

        <transition name="fade">
          <div v-if="copied"
            class="fixed top-20 left-1/2 transform -translate-x-1/2 bg-success text-accent  px-2 py-1 rounded-lg text-xs md:text-sm lg:text-sm">
            Link copiado en el portapapeles
          </div>
        </transition>
      </div>
    </div>

    <div>
      <h2 class="mb-2">Fecha y hora</h2>
      <!-- Utilizamos la propiedad computada para formatear la fecha -->
      <h1 class="font-semibold mb-4">{{ formattedDate }}</h1>
    </div>


    <h2 class="mb-2">Administrador</h2>
    <h1 class="font-semibold mb-4">{{ room.admin_name }}</h1>
  </div>
  <div v-else>
    <p>No se encontraron datos de la sala. Por favor, únete a una sala primero.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from "@iconify/vue";

const room = ref(null);
const error = ref('');
const copied = ref(false); // Estado para mostrar si el link fue copiado

onMounted(() => {
  const storedRoom = localStorage.getItem('currentRoom');
  if (storedRoom) {
    try {
      room.value = JSON.parse(storedRoom);
    } catch (e) {
      error.value = 'Error al leer los datos de la sala.';
      console.error(e);
    }
  } else {
    error.value = 'No se encontraron datos de la sala en el almacenamiento local.';
  }
});

// Propiedad computada para formatear la fecha
const formattedDate = computed(() => {
  if (!room.value || !room.value.start_time) {
    return '';
  }
  const date = new Date(room.value.start_time);
  const day = date.getDate();
  // Obtenemos el mes en formato largo (en español)
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determinar am/pm y convertir a formato de 12 horas
  const period = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12;

  // Formatear los minutos para que siempre sean 2 dígitos
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${day} de ${month} ${hours}:${formattedMinutes} ${period}`;
});


const copyToClipboard = () => {
  navigator.clipboard.writeText(room.value.room_code).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000); // Ocultar el mensaje después de 2 segundos
  }).catch((err) => {
    console.error('Error al copiar el texto:', err);
  });
};

const isBlurred = ref(true);

// Función para alternar el estado
const toggleBlur = () => {
  isBlurred.value = !isBlurred.value;
};

</script>

<style scoped>
.room-info-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.room-info-container h1 {
  margin-bottom: 1.5rem;
}

.room-info-container p {
  margin: 0.5rem 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.blurredText {
  filter: blur(5px);
}
</style>
