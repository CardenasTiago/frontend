<template>
    <div v-if="!hideHeader ">
        <!-- Navbar de escritorio -->
        <div class="hidden md:flex justify-between items-center p-4">
            <div class="text-xl font-bold text-primary">
                <a href="/protected/menu" class="text-primary/80">{{ title }}</a>
            </div>
            <nav>
                <ul class="flex gap-4 items-center">
                    <li>
                        <label class="grid cursor-pointer place-items-center">
                            <input type="checkbox"
                                class="toggle theme-controller bg-base-content col-span-2 col-start-1 row-start-1"
                                :checked="theme === 'mydarktheme'" @change="toggleTheme" />
                            <svg class="stroke-base-100 fill-base-100 col-start-1 row-start-1"
                                xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <path
                                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                            <svg class="stroke-base-100 fill-base-100 col-start-2 row-start-1"
                                xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </label>
                    </li>

                    <li v-show="!hideMenuItems && isAuthenticated"><a href="/protected/myRooms" class="text-m font-bold text-primary">Mis salas</a></li>
                    <li v-show="!hideMenuItems && isAuthenticated"><a href="/protected/user/myProfile"
                            class="text-m font-bold text-primary">Mi perfil</a></li>
                    <li v-if="isAuthenticated">
                        <a @click="handleLogout" class="bg-base-100 text-accent">
                            <Icon icon="material-symbols:logout-rounded" width="24" height="24" color="#6B48FF"/>
                        </a>
                    </li>          
                </ul>
            </nav>
        </div>

        <!-- Navbar de móvil (visible en pantallas pequeñas) -->

        <div class="block md:hidden">
            <div class="navbar bg-neutral flex justify-between">

                <div class="text-xl font-bold text-primary mr-4">
                    <a href="/protected/menu" class="text-primary/80">{{ title }}</a>
                </div>
                <!-- Cuando se oculta el menu esto se muestra -->
                <!-- Contenido a la derecha -->
                <div v-if="hideMenuItems || !isAuthenticated">
                    <!-- Solo el toggle de tema -->
                    <label class="flex cursor-pointer gap-2 items-center">
                        <Icon icon="ic:outline-wb-sunny" width="24" height="24" />
                        <input type="checkbox" class="toggle" :checked="theme === 'mydarktheme'"
                            @change="toggleTheme" />
                        <Icon icon="mdi:moon-and-stars" width="24" height="24" />
                    </label>
                </div>

                <div v-else>
                    <div>
                        <h3 class="mr-2 text-secondary font-bold">{{ user.username }}</h3>
                    </div>
                    <div class="dropdown dropdown-end">
                        <div :style="containerStyle" tabindex="0" role="button" class="btn btn-ghost btn-circle">
                            <div class="w-10 h-10 flex items-center justify-center">
                                <Icon v-if="!user.image" icon="ic:baseline-person"
                                    class="rounded-full object-cover text-primary w-full h-full" />
                                <img v-else :src="user.image" alt="Foto de perfil"
                                    class="rounded-full object-cover w-full h-full" ref="imgElement"
                                    @load="extractDominantColor" crossOrigin="anonymous" />
                            </div>
                        </div>
                        <ul tabindex="0"
                            class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-40 p-1 shadow bg-base-100">
                            <li>
                                <a href="/protected/user/myProfile" class="bg-base-100 text-accent">
                                    <Icon icon="ic:baseline-person" width="24" height="24" />
                                    Mi perfil
                                </a>
                            </li>
                            <li>
                                <a @click="handleLogout" class="bg-base-100 text-accent">
                                    <Icon icon="ic:baseline-exit-to-app" width="24" height="24" />
                                    Cerrar sesión
                                </a>
                            </li>
                            <li>
                                <label class="flex cursor-pointer gap-2 justify-center my-4">
                                    <Icon icon="ic:outline-wb-sunny" width="24" height="24" />
                                    <input type="checkbox" class="toggle" :checked="theme === 'mydarktheme'"
                                        @change="toggleTheme" />
                                    <Icon icon="mdi:moon-and-stars" width="24" height="24" />
                                </label>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Icon } from "@iconify/vue";
import ColorThief from 'colorthief';

const title = "Suffgo"; // Título predeterminado
const user = ref('');
const imgElement = ref(null);
const dominantColor = ref('');

const { hideMenuItems, hideHeader } = defineProps({
    hideMenuItems: Boolean,
    hideHeader: Boolean
});



// Variable reactiva para el tema
const theme = ref(localStorage.getItem('theme') || 'mytheme');

// Función para cambiar el tema
const toggleTheme = () => {
    theme.value = theme.value === 'mytheme' ? 'mydarktheme' : 'mytheme';
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};

const extractDominantColor = () => {
    if (imgElement.value && imgElement.value.complete) {
        try {
            const colorThief = new ColorThief();
            const result = colorThief.getColor(imgElement.value);
            dominantColor.value = `rgb(${result.join(',')})`;
        } catch (error) {
            console.error('Error al extraer el color dominante:', error);
        }
    }
};

const containerStyle = computed(() => ({
    boxShadow: dominantColor.value ? `0 4px 10px ${dominantColor.value}` : 'none'
}));

//funcion para realizar el cierre de sesión
const handleLogout = async () => {

    try {
        const response = await fetch('http://localhost:3000/v1/users/logout', {
            method: 'POST',
            credentials: 'include',
        });

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

const isAuthenticated = ref("");
// Obtener el nombre de usuario desde localStorage al montar el componente
onMounted(async() => {
    const loggedUser = localStorage.getItem('user');
    if (loggedUser) {
        user.value = JSON.parse(loggedUser);
    }
    document.documentElement.setAttribute('data-theme', theme.value);

    if (user.image === "") {
        user.image = null;
    }

    try {
      const response = await fetch("http://localhost:3000/v1/users/auth", {
        credentials: 'include',
      });
  
      if (response.status === 200) {
        isAuthenticated.value = true;
        // Lógica adicional si es necesario
      } else {
        isAuthenticated.value = false;
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      isAuthenticated.value = false;
    }
});
</script>