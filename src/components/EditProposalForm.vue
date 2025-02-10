<template>
    <div class="bg-base-100 p-8 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-6">
            <button @click="goBack" class="btn btn-circle bg-secondary/20 hover:bg-secondary/30 border-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
        </div>

        <h1 class="text-2xl font-bold text-primary text-center mb-2">Editar propuesta</h1>
        <div class="text-center mb-6">
            <p class="text-secondary mb-1">Tiempo restante</p>
            <div class="flex justify-center items-center gap-2">
                <input 
                    v-model="minutes"
                    type="number"
                    min="0"
                    max="59"
                    class="input input-bordered w-20 bg-secondary/10 border-secondary/20 text-center text-xl font-semibold"
                />
            <span class="text-xl font-semibold">:</span>
            <input 
                v-model="seconds"
                type="number"
                min="0"
                max="59"
                class="input input-bordered w-20 bg-secondary/10 border-secondary/20 text-center text-xl font-semibold"
            />
        </div>
    </div>

    <div class="space-y-6">
        <textarea 
            v-model="description"
            placeholder="Añadir una descripción para la propuesta"
            class="textarea textarea-bordered w-full bg-secondary/10 border-secondary/20 h-32"
        ></textarea>
    
        <input 
            v-model="proposalName"
            type="text"
            placeholder="Nombre de la propuesta"
            class="input input-bordered w-full bg-secondary/10 border-secondary/20"
        />

        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-4">
                <div 
                    v-for="(option, index) in displayedOptions.slice(0, Math.ceil(displayedOptions.length / 2))" 
                    :key="`left-${index}`"
                    class="relative"
                    >
                        <input 
                            v-model="options[index]"
                            type="text"
                            :placeholder="`Opción ${index + 1}`"
                            class="input input-bordered w-full bg-primary text-white placeholder-white/70 pr-10"
                        />
                        <button 
                            v-if="options.length > 2"
                            @click="removeOption(index)" 
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div class="space-y-4">
                    <div 
                        v-for="(option, index) in displayedOptions.slice(Math.ceil(displayedOptions.length / 2))" 
                        :key="`right-${index + Math.ceil(displayedOptions.length / 2)}`"
                        class="relative"
                    >
                        <input 
                            v-model="options[index + Math.ceil(displayedOptions.length / 2)]"
                            type="text"
                            :placeholder="`Opción ${index + Math.ceil(displayedOptions.length / 2) + 1}`"
                            class="input input-bordered w-full bg-primary text-white placeholder-white/70 pr-10"
                        />
                        <button 
                            v-if="options.length > 2"
                            @click="removeOption(index + Math.ceil(displayedOptions.length / 2))" 
                            class="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>      
                        </button>
                    </div>
                </div>
            </div>

            <button 
                @click="addOption"
                class="btn w-full bg-secondary/20 hover:bg-secondary/30"
            >
                + Añadir más opciones
            </button>

            <button class="btn w-full bg-primary hover:bg-primary/90 text-white">
                Guardar
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const description = ref('');
const proposalName = ref('');
const options = ref(['', '']);
const minutes = ref('00');
const seconds = ref('00');

  // esta parte es para mostrar las opciones sin incluir el botón de añadir
const displayedOptions = computed(() => {
    return options.value;
});

// Función para añadir una nueva opción
const addOption = () => {
    options.value.push('');
};

// Función para eliminar una opción
const removeOption = (index) => {
    if (options.value.length > 2) {
        options.value.splice(index, 1);
    }
};

// Validar y formatear el tiempo
const validateTime = (value, max) => {
    let num = parseInt(value);
    if (isNaN(num)) num = 0;
    if (num > max) num = max;
    if (num < 0) num = 0;
    return num.toString().padStart(2, '0');
};

  // validador de el tiempo
watch(minutes, (newValue) => {
    minutes.value = validateTime(newValue, 59);
});

watch(seconds, (newValue) => {
    seconds.value = validateTime(newValue, 59);
});

const goBack = () => {
    window.history.back();
};
</script>

<style scoped>
    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
}
input[type="number"] {
    appearance: textfield;
    -moz-appearance: textfield;
}
</style>