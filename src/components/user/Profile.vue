<template>
    <div class="avatar flex justify-center">
        <div class="ring-primary ring-offset-base-100 w-24 rounded-full ring ring-offset-2">
            <img src="/images/images.png" />
        </div>
    </div> 

    <div class="mt-6 p-4 lg:flex lg:items-center lg:flex-col">
        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Nombre</legend>
            <input
                type="text"
                class="input border-0 border-b border-primary w-full"
                v-model="user.name"                 
                :readonly="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none'"
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Apellido</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.lastname" 
                :readonly="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none'"
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Nombre de usuario</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.username" 
                :readonly="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none'"
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Documento</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.dni" 
                :readonly="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none'"
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Email</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.email" 
                :readonly="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none'"
            />
        </fieldset>

        <!-- Botones -->
        <div class="flex justify-center mt-8 gap-4">
            <button 
                class="btn" 
                :class="isEditing ? 'bg-error' : 'bg-secondary'"
                @click="isEditing ? storeUser() : isEditing = true">
                {{ isEditing ? 'Guardar' : 'Editar' }}
            </button>

            <button v-if="isEditing" @click="isEditing = false" class="btn bg-secondary">
                Cancelar
            </button>
        </div>
      </div>









</template>

<script setup>
import { ref,onMounted } from 'vue';

const user = ref({
  name: "",
  lastname: "",
  username: "",
  dni: "",
  email: "",
});

const isEditing = ref(false);

const toggleEdit = () => {
  isEditing.value = !isEditing.value;
};

const cancelEdit = () => {
  isEditing.value = false;
};



// Guardar datos en el backend
const storeUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/v1/users/update", {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user.value),
    });

    if (response.ok) {
      const updatedUser = await response.json();
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Actualizar localStorage
      isEditing.value = false; // Salir del modo edición
      
    } 
  } catch (error) {
    console.error("Error en la actualización:", error);
  }
};





// Cargar datos guardados en localStorage al iniciar
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = storedUser; // Cargamos los datos en los inputs
    console.log(storedUser); // Verifica si el objeto 'user' contiene todos los campos

  }
});







</script>