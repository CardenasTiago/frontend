<template>
    <TransitionRoot as="template" :show="modelValue">
      <Dialog class="relative z-10 " @close="handleClose">
        <TransitionChild as="template"
          enter="ease-out duration-300" 
          enter-from="opacity-0" 
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-accent/30 transition-opacity" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 flex items-center justify-center">
          <TransitionChild as="template"
            enter="ease-out duration-300" 
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg transform overflow-hidden rounded-lg bg-neutral shadow-xl transition-all">
              <DialogTitle class="text-2x1 font-semibold text-white bg-primary p-4">
                Agregar Votante
              </DialogTitle>
              
              <div class="mt-2 p-4">
                <!-- <label class="block text-sm font-medium text-accent">Ingrese el Dato</label> -->
                <input type="text" v-model="userInput" class="input input-primary w-full mt-1" placeholder="Ingrese username,email o dni" />
              </div>  
              
  
              <div class="mt-2 flex justify-center gap-10 p-4">
                <button @click="addVoter" class="btn btn-primary btn-sm border-none">Agregar</button>
                <button @click="handleClose" class="btn btn-secondary hover:bg-error btn-sm border-none">Cancelar</button>
                
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
  
  const userInput = ref("")//guarda el dato ingresado
  
  defineProps({
    modelValue: Boolean,
  })
  
  const emit = defineEmits(["update:modelValue", "add-voter"])
  
  const handleClose = () => {
    emit("update:modelValue", false)
  }
  
  const addVoter = () => {
    if (!userInput.value.trim()){
      
    } return // Validación básica
    emit("add-voter", userInput.value.trim())
    handleClose()
  }
  </script>
  