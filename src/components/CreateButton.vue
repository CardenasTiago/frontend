<template>
    <button 
        @click="handleCreateSala" 
        :class="[
            'btn w-full border-none text-neutral',
            type === 'formal' 
            ? 'bg-primary hover:bg-primary/90' 
            : 'bg-secondary hover:bg-secondary/90'
        ]"
    >
        {{ buttonText }}
    </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ['formal', 'informal'].includes(value)
    }
});

const buttonText = computed(() => 
    props.type === 'formal' 
        ? 'Crear sala formal' 
        : 'Crear sala informal'
);

const handleCreateSala = () => {
    const baseUrl = window.location.origin;
    const configPage = props.type === 'formal' ? 'configurar-sala-formal' : 'configurar-sala-informal';
    window.location.href = `${baseUrl}/${configPage}`;
};
</script>

<style scoped>
button {
    margin-top: 1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.75rem 1.5rem;
}

button:hover {
    transform: translateY(-1px);
    transition: all 0.2s ease;
}
</style>