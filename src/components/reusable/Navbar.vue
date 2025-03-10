<template>
    <header >
        <!-- Navbar de escritorio -->
        <div class="hidden md:flex justify-between items-center mb-4">
            <div class="text-xl font-bold text-primary">
                <a href="/protected/menu" class="text-primary/80">{{title}}</a>
            </div>
        <nav>
            <ul class="flex gap-4">
            <label class="grid cursor-pointer place-items-center">
                <input
                type="checkbox"
                value="mydarktheme"
                class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1" />
                <svg
                class="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path
                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
                <svg
                class="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            </label>
            <li><a href="/mis-salas" class="text-m font-bold text-primary">Mis salas</a></li>
            <li><a href="mi-perfil" class="text-m font-bold text-primary">Mi perfil</a></li>
            </ul>
        </nav>
        </div>






            <!-- Navbar de móvil (visible en pantallas pequeñas) -->
    <div class="block md:hidden">
        <div class="navbar bg-neutral">
        <div class="flex-1">
            <a @click="goBack" class="btn btn-secondary btn-md   flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M31.727 17H2.50635M2.50635 17L17.1167 31.5833M2.50635 17L17.1167 2.41663" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
            </a>
        </div>

        <div class="flex-none">
            <div>
                <h3 class="mr-2 text-secondary font-bold">{{ userName }}</h3>
            </div>
            <div class="dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar ">
                <div class="w-10 h-10 rounded-full flex items-center justify-center ">
                <img :src="userProfileImage || defaultImage" alt="foto perfil" class="">
                </div>
            </div>
            <ul tabindex="0" class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-40 p-1 shadow bg-secondary">
                
                <li><a class="bg-secondary text-accent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                    <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                </svg>
                    Mi perfil </a></li>
                <li><a @click="handleLogout" class="bg-secondary text-accent"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                    <path fill-rule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                </svg>
                Cerrar sesión</a></li>
            </ul>
            </div>
        </div>
        </div>
    </div>













    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';


// Variables reactivas
const title = "Suffgo"; // Título predeterminado
const userName = ref('');
const defaultImage = ""; // Imagen por defecto (SVG)




const handleLogout = async () => {
    
try {
  const response = await fetch('http://localhost:3000/v1/users/logout', {
    method: 'POST',
    credentials: 'include',
  });

  console.log(response); // Esto te dará más detalles sobre la respuesta

  if (response.ok) {
    localStorage.removeItem('userName');
    window.location.href = '/auth/login'; // Redirige al inicio de sesión
  } else {
    console.error('Error al cerrar sesión');
  }
} catch (error) {
  console.error('Error en la conexión con el servidor:', error);
}
};

const goBack = () => {
    window.history.back();
};




// Obtener el nombre de usuario desde localStorage al montar el componente
onMounted(() => {           
userName.value = localStorage.getItem('userName').toLowerCase() || 'Usuario';
  
});






</script>