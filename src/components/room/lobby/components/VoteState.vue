<template>
  <div class="w-full px-4 mx-4">
    <ul class="users flex flex-wrap justify-center gap-4">
      <li v-for="client in userList" :key="client.username" class="flex flex-col items-center">
        <!-- Se muestra tooltip solo si hay votos -->
        <template v-if="hasVotes">
          <div class="tooltip tooltip-secondary" :data-tip="getVoteValue(client.username)">
            <div :class="[
              'w-16 h-16 rounded-full border-4',
              client.voted ? 'border-green-500' : 'border-gray-500'
            ]">
              <img v-if="client.image" :src="client.image" alt="Foto de perfil"
                   class="w-full h-full rounded-full object-cover" />
              <Icon v-else icon="ic:baseline-person" 
                    class="w-full h-full rounded-full object-cover p-2 text-secondary"
                    width="58" height="58" />
            </div>
          </div>
        </template>
        <!-- Si no hay votos, se muestra el avatar sin tooltip -->
        <template v-else>
          <div :class="[
              'w-16 h-16 rounded-full border-4',
              client.voted ? 'border-green-500' : 'border-gray-500'
            ]">
            <img v-if="client.image" :src="client.image" alt="Foto de perfil"
                 class="w-full h-full rounded-full object-cover" />
            <Icon v-else icon="ic:baseline-person" 
                  class="w-full h-full rounded-full object-cover p-2 text-secondary"
                  width="58" height="58" />
          </div>
        </template>
        <p class="mt-2 font-semibold text-secondary">{{ client.username }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useWebSocketStore } from '../../stores/socketStore';
import { Icon } from "@iconify/vue";

const socketStore = useWebSocketStore();
const { userList, results, currentProposal } = storeToRefs(socketStore);

/**
 * Computada que genera el mapeo de usuario a valor de opción votada, 
 * si la información de currentProposal y results existe.
 */
const voteMapping = computed(() => {
  const mapping = {};
  if (currentProposal.value && currentProposal.value.options && results.value) {
    results.value.forEach(vote => {
      const option = currentProposal.value.options.find(
        opt => opt.id === vote.option_id
      );
      if (option) {
        mapping[vote.from.username] = option.value;
      }
    });
  }
  return mapping;
});

/**
 * Función auxiliar para obtener el valor de voto dado el username.
 * Se retornará un texto por defecto si no existe el voto, aunque en este caso
 * si no hay votos (results es nulo) el tooltip no se mostrará.
 */
const getVoteValue = (username) => {
  return voteMapping.value[username] || "No ha votado";
};

/**
 * Computada que indica si existen votos.
 */
const hasVotes = computed(() => {
  return results.value && results.value.length > 0;
});

onMounted(() => {
  console.log("Resultados:", results.value);
  console.log("Current Proposal:", currentProposal.value);
});
</script>
