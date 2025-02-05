<template>
    <button 
        :class="[
            'btn w-full text-neutral',
            variant === 'primary' ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'
        ]"
        @click="$emit('click')"
    >
        <slot></slot>
        </button>
</template>

<script setup>
defineProps({
    variant: {
        type: String,
        default: 'primary'
    }
});

defineEmits(['click']);
</script>