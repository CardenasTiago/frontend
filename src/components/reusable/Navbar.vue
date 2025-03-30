<template>
    <!-- Navbar de escritorio -->
    <div class="hidden md:flex justify-between items-center p-4">
        <div class="text-xl font-bold text-primary">
            <a href="/protected/menu" class="text-primary/80">{{ title }}</a>
        </div>
        <nav>
            <ul class="flex gap-4">
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
                <li v-show="!hideMenuItems"><a href="/protected/myRooms" class="text-m font-bold text-primary">Mis salas</a></li>
                <li v-show="!hideMenuItems"><a href="/protected/user/myProfile" class="text-m font-bold text-primary">Mi perfil</a></li>
            </ul>
        </nav>
    </div>

    <!-- Navbar de móvil (visible en pantallas pequeñas) -->

    <div class="block md:hidden">
        <div class="navbar bg-neutral flex justify-between">

            <div class="text-xl font-bold text-primary mr-4">
                <a href="/protected/menu" class="text-primary/80">{{ title }}</a>
            </div>

            <div v-show="!hideMenuItems" class="flex-none">
                <div>
                    <h3 class="mr-2 text-secondary font-bold">{{ userName }}</h3>
                </div>
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="btn btn-ghost btn-circle bg-base-100">
                        <div class="w-10 h-10 flex-justify-center  ">
                            <!-- Mostrar el SVG si no hay imagen de perfil -->
                            <div v-if="!userProfileImage" v-html="defaultImage"></div>

                            <!-- Mostrar la imagen de perfil si está disponible -->
                            <img v-else :src="userProfileImage" alt="foto perfil" class="rounded-full">
                        </div>
                    </div>
                    <ul tabindex="0"
                        class="menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-40 p-1 shadow bg-base-100">

                        <li><a href="/protected/user/myProfile" class="bg-base-100 text-accent"><svg
                                    xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                                    class="size-5">
                                    <path
                                        d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
                                </svg>
                                Mi perfil </a></li>
                        <li><a @click="handleLogout" class="bg-base-100 text-accent">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor"
                                        d="M10.09 15.59L11.5 17l5-5l-5-5l-1.41 1.41L12.67 11H3v2h9.67zM19 3H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2" />
                                </svg>
                                Cerrar sesión</a></li>
                        <label class="flex cursor-pointer gap-2 justify-center my-4 ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="5" />
                                <path
                                    d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                            </svg>
                            <input type="checkbox" class="toggle" :checked="theme === 'mydarktheme'"
                                @change="toggleTheme" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        </label>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const title = "Suffgo"; // Título predeterminado
const userName = ref('');
const defaultImage = `<svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.05827 31.625C9.83238 30.2708 11.8152 29.2031 14.0068 28.4218C16.1983 27.6406 18.4942 27.25 20.8945 27.25C23.2948 27.25 25.5907 27.6406 27.7822 28.4218C29.9738 29.2031 31.9566 30.2708 33.7307 31.625C34.9482 30.2013 35.8962 28.5868 36.5745 26.7812C37.2529 24.9757 37.592 23.0486 37.592 21C37.592 16.3819 35.9658 12.4496 32.7132 9.20308C29.4607 5.95656 25.5211 4.33329 20.8945 4.33329C16.2679 4.33329 12.3283 5.95656 9.07577 9.20308C5.82324 12.4496 4.19697 16.3819 4.19697 21C4.19697 23.0486 4.53613 24.9757 5.21447 26.7812C5.89281 28.5868 6.84074 30.2013 8.05827 31.625ZM20.8945 23.0833C18.8421 23.0833 17.1115 22.3802 15.7026 20.9739C14.2938 19.5677 13.5893 17.8402 13.5893 15.7916C13.5893 13.743 14.2938 12.0156 15.7026 10.6093C17.1115 9.20308 18.8421 8.49996 20.8945 8.49996C22.9469 8.49996 24.6775 9.20308 26.0864 10.6093C27.4952 12.0156 28.1997 13.743 28.1997 15.7916C28.1997 17.8402 27.4952 19.5677 26.0864 20.9739C24.6775 22.3802 22.9469 23.0833 20.8945 23.0833ZM20.8945 41.8333C18.0072 41.8333 15.2939 41.2864 12.7544 40.1927C10.215 39.0989 8.00609 37.6145 6.12762 35.7395C4.24914 33.8645 2.76202 31.6597 1.66625 29.125C0.570471 26.5902 0.022583 23.8819 0.022583 21C0.022583 18.118 0.570471 15.4097 1.66625 12.875C2.76202 10.3402 4.24914 8.13538 6.12762 6.26038C8.00609 4.38538 10.215 2.901 12.7544 1.80725C15.2939 0.713501 18.0072 0.166626 20.8945 0.166626C23.7818 0.166626 26.4951 0.713501 29.0345 1.80725C31.574 2.901 33.7829 4.38538 35.6614 6.26038C37.5398 8.13538 39.027 10.3402 40.1227 12.875C41.2185 15.4097 41.7664 18.118 41.7664 21C41.7664 23.8819 41.2185 26.5902 40.1227 29.125C39.027 31.6597 37.5398 33.8645 35.6614 35.7395C33.7829 37.6145 31.574 39.0989 29.0345 40.1927C26.4951 41.2864 23.7818 41.8333 20.8945 41.8333Z" fill="#6B48FF"/>
</svg>`;

defineProps({
    hideMenuItems:{type: Boolean , default:false}
})



// Variable reactiva para el tema
const theme = ref(localStorage.getItem('theme') || 'mytheme');

// Función para cambiar el tema
const toggleTheme = () => {
    theme.value = theme.value === 'mytheme' ? 'mydarktheme' : 'mytheme';
    document.documentElement.setAttribute('data-theme', theme.value);
    localStorage.setItem('theme', theme.value);
};


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


// Obtener el nombre de usuario desde localStorage al montar el componente
onMounted(() => {
    userName.value = localStorage.getItem('userName').toLowerCase() || 'Usuario';
    document.documentElement.setAttribute('data-theme', theme.value);

});

</script>