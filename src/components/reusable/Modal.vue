<template>
    <TransitionRoot as="template" :show="modelValue">
      <Dialog class="relative z-10" @close="handleClose" >
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-accent/10 transition-opacity Z-30" />
        </TransitionChild>
  
        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform rounded-lg bg-neutral text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div class="bg-neutral px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="sm:flex sm:items-start">
                    <div class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary sm:mx-0 sm:size-10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-neutral">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                      </svg>
  
                    </div>
                    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" class="text-base font-semibold text-accent">{{ title }}</DialogTitle>
                      <div class="mt-2">
                        <p class="text-sm text-accent">{{ message }}</p>
                      </div>
                    </div>
                  </div>
                </div>
                  <div class="bg-neutral flex flex-col lg:flex-row gap-3 items-center lg:justify-end p-4 mr-2">
                    <!-- Botón Cancelar con estilo y condicional -->
                    <button v-if="cancelText" type="button" class="w-full lg:w-auto btn btn-secondary btn-md lg:btn-sm" @click="handleClose" ref="cancelButtonRef">{{ cancelText }}</button>
                    <!-- Botón Confirmar con estilo y condicional -->
                    <button v-if="confirmText" type="button" class="block w-full text-center lg:w-auto btn btn-primary btn-md lg:btn-sm  hover:bg-error border-none Z-20" @click="confirmAction" @touchstart.stop="confirmAction">{{ confirmText }}</button>
                  
                  </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </template>
  
  <script setup>
    //import { ref } from 'vue'
    import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
    
  
    defineProps({
      modelValue: Boolean,
      title: { type: String, default: "Confirmar acción" },
      message: { type: String, default: "¿Estás seguro de que quieres continuar?"},
      confirmText: { type: String},
      cancelText: { type: String},
      confirmAction: { type: Function} // Acción a ejecutar cuando se confirme
    })
  
    const emit = defineEmits(['update:modelValue'])
  
    const handleClose = () => {     
      emit('update:modelValue', false)
    }

  
    /*
    const handleConfirm = () => {      
      if (confirmAction) {
        confirmAction();
      }
     
    };
  
  */

 
  
  </script>
