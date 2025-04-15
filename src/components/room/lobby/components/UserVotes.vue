<template>
    <div class="user-votes p-4 rounded-lg shadow-md shadow-secondary flex-auto">
        <h2 class="text-xl font-bold mb-3">Votos por propuesta</h2>
        <div v-for="option in proposal.options" :key="option.option_Id" class="option mb-6">
            <h4 class="text-base font-semibold text-primary "> {{ option.option_value }}</h4>
            <!-- Si la opción tiene votos, se listan -->
            <ul v-if="option.votes && option.votes.length > 0" class="ml-4 list-disc">
                <li v-for="vote in option.votes" :key="vote.vote_id" class="flex items-center gap-2">
                    <span class="font-medium">{{ vote.username }}</span>
                </li>
            </ul>
            <!-- Mensaje si no hay votos en la opción -->
            <p v-else class="text-sm text-gray-500 ml-4">Sin votos</p>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    proposal: {
        type: Object,
        required: true
    }
});
</script>

<style scoped>
.user-votes {
    @apply bg-base-100;
    max-width: 800px;
    margin: 0 auto;
}

.proposal {
    border-radius: 15px;
}

.option {
    @apply bg-neutral;
    padding: 0.5rem;
    border-radius: 15px;
}
</style>