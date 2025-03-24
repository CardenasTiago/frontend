<template> 
  <form @submit.prevent="storeUser">
    <div class="avatar flex flex-col items-center">
        <div class="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring ring-offset-2 overflow-hidden">
            <img :src="user.image || defaultImage" alt="Foto de perfil" class="w-full h-full object-cover" />
        </div>
        <div v-if="isEditing" class="mt-2">
          <label for="fileInput" class="btn btn-sm bg-secondary cursor-pointer">
              Cambiar imagen
          </label>
          <input 
              id="fileInput"
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleFileChange" 
          />
       </div>
    </div> 

    <div class="mt-6 p-4 lg:flex-row">
        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Nombre</legend>
            <input
                type="text"
                class="input border-0 border-b border-primary w-full"
                v-model="user.name"                 
                :disabled="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                required
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Apellido</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.lastname" 
                :disabled="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                required
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Nombre de usuario</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.username" 
                :disabled="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                required
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Documento</legend>
            <input
                type="text"
                class="input  w-full"
                v-model="user.dni" 
                :disabled="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                required
                maxlength="10"
                minlength="8"
            />
        </fieldset>

        <fieldset class="fieldset flex mb-8">
            <legend class="fieldset-legend font-semi-bold text-secondary">Email</legend>
            <input
                type="email"
                class="input  w-full"
                v-model="user.email" 
                :disabled="!isEditing"
                :class="isEditing ? '!border !border-primary !p-2' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                required
            />
        </fieldset>

        <div class="flex justify-center mt-8 gap-4">
          <!-- Botón Editar -->
          <button
            v-if="!isEditing"
            type="button"
            class="btn bg-secondary"
            @click="toggleEdit"
          >
            Editar
          </button>

          <!-- Botón Guardar -->
          <button
            v-if="isEditing"
            type="submit"
            class="btn bg-error"
          >
            Guardar
          </button>

          <!-- Botón Cancelar -->
          <button
            v-if="isEditing"
            type="button"
            class="btn bg-secondary"
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </div> 
    </form> 
</template>

<script setup>
import { ref,onMounted } from 'vue';

const user = ref({
  name: "",
  lastname: "",
  username: "",
  dni: "",
  email: "",
  image: "",
});


const isEditing = ref(false);

const toggleEdit = () => {
  isEditing.value = true;
};

const cancelEdit = () => {
  isEditing.value = false;
  // Restaurar los datos originales desde localStorage
  const storedUser = JSON.parse(localStorage.getItem("user"));
  if (storedUser) {
    user.value = { ...storedUser };
  }
};


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    user.value.imageBase64 = reader.result; 
    user.value.image = reader.result; 
  };
  reader.onerror = (error) => {
    console.error("Error al convertir la imagen:", error);
  };
};

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
      localStorage.setItem("user", JSON.stringify(updatedUser.user)); // Actualizar localStorage      
      user.value = { ...updatedUser.user };      
      isEditing.value = false;                  
    } 
  } catch (error) {
    console.error("Error en la actualización:", error);
  }
};


// Cargar datos guardados en localStorage al iniciar
onMounted(() => {
  const storedUser = JSON.parse(localStorage.getItem("user"));   
  if (storedUser) {
    user.value.name = storedUser.name || "";
    user.value.lastname = storedUser.lastname || "";
    user.value.username = storedUser.username || "";
    user.value.dni = storedUser.dni || "";
    user.value.email = storedUser.email || "";  
    user.value.image = storedUser.image || ""; 
    
  }
});

</script>

