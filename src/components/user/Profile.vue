<template> 
  <form @submit.prevent="storeUser">
    <div class="avatar flex flex-col items-center">
        <div class="ring-primary ring-offset-base-100 w-24 h-24 rounded-full ring ring-offset-2 overflow-hidden">
            <img v-if="user.image" :src="user.image" alt="Foto de perfil" class="w-full h-full object-cover" />
            <Icon v-else icon="ic:baseline-person" class="rounded-full object-cover text-secondary w-full h-full" />
        </div>
        <div v-if="isEditing" class="mt-2">
          <label for="fileInput" class="btn btn-sm bg-secondary cursor-pointer mt-2">
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
    
    <div class="p-4 flex flex-col gap-8 ">
        <fieldset class="fieldset flex">
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

        <fieldset class="fieldset flex">
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

        <fieldset class="fieldset flex ">
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

        <fieldset class="fieldset flex ">
            <legend class="fieldset-legend font-semi-bold text-secondary">Documento</legend>
            <div class="relative w-full">
              <input
                  type="text"
                  class="input w-full"
                  v-model="user.dni" 
                  :disabled="true"                
                  :class="isEditing ? '!border !border-primary !pl-10' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                  required
                  maxlength="10"
                  minlength="8"
              />
              <Icon v-if="isEditing" icon="uil:padlock" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary"/> 
          </div>
        </fieldset>

        <fieldset class="fieldset flex">
            <legend class="fieldset-legend font-semi-bold text-secondary">Email</legend>
            <div class="relative w-full">             
              <input
                  type="email"
                  class="input w-full"
                  v-model="user.email" 
                  :disabled="true"
                  :class="isEditing ? '!border !border-primary !pl-10' : '!border-0 !border-b !border-primary pointer-events-none !bg-transparent'"
                  required                
              />
              <Icon v-if="isEditing" icon="uil:padlock" class="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-primary"/>  
            </div>             
        </fieldset>

        <div class="flex justify-center mt-8 gap-4">
          <!-- Botón Editar -->
          <button
            v-if="!isEditing"
            type="button"
            class="btn bg-primary"
            @click="toggleEdit"
          >
            Editar
          </button>

          <button
            v-if="isEditing"
            type="button"
            class="btn bg-error"
            @click="cancelEdit"
          >
            Cancelar
          </button>

          <button
            v-if="isEditing"
            type="submit"
            class="btn bg-success"
          >
            Guardar
          </button>         
        </div>
        
      </div>      
  </form> 

  <dialog ref="deleteModal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg text-error">¿Eliminar cuenta?</h3>
      <p class="py-4">Esta acción no se puede deshacer. ¿Estás seguro que deseas eliminar tu cuenta?</p>
      <div class="modal-action">
        <button class="btn" @click="closeModal">Cancelar</button>
        <button 
          class="btn btn-error text-white"
          :disabled="isDeleting"
          @click="handleDelete"
        >
          {{ isDeleting ? 'Eliminando...' : 'Eliminar' }}
        </button>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import {Icon} from "@iconify/vue";
import UserService from '../../services/user.service';

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
    const response = await UserService.update(JSON.stringify(user.value))
   
    if (response) {      
      const updatedUser = JSON.parse(response);           
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

