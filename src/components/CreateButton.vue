<template>
    <button 
        @click="handleCreateSala"
        :class="[
            'btn w-full border-none text-neutral',
            type === 'formal' ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'
        ]"
        :disabled="isCreating"
    >
        {{ isCreating ? 'Creando...' : buttonText }}
    </button>
</template>

<script setup>
import { computed, ref, defineEmits } from 'vue';

const props = defineProps({
    type: {
        type: String,
        required: true,
        validator: (value) => ['formal', 'informal'].includes(value)
    }
});

const emit = defineEmits(['sala-creada']);
const isCreating = ref(false);

const buttonText = computed(() => 
    props.type === 'formal' ? 'Crear sala formal' : 'Crear sala informal'
);

const handleCreateSala = async () => {
    try {
        isCreating.value = true;

        const roomData = {
            link_invite: 'default-link',
            is_formal: props.type === 'formal',
            name: props.type === 'formal' ? 'nueva sala formal' : 'nueva sala informal',
            description: props.type === 'formal' ? 'descripcion sala formal' : 'descripcion sala informal',
        };

        const response = await fetch('http://localhost:3000/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(roomData),
        });

        if (!response.ok) throw new Error('Error al crear la sala');

        const result = await response.json();
        console.log('Sala creada exitosamente:', result);

        if (result.room && result.room.id) {
            window.location.href = `/editar-sala?id=${result.room.id}`;
        } else {
            throw new Error('No se recibió el ID de la sala');
        }
    } catch (error) {
        console.error('Error al crear la sala:', error);
        alert('Error al crear la sala: ' + (error.message || 'Error desconocido'));
    } finally {
        isCreating.value = false;
    }
};
</script>
