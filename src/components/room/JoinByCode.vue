<template>
	<form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
		<label class="input input-bordered input-primary flex items-center gap-2">
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M2 17h20v2H2zm1.15-4.05L4 11.47l.85 1.48l1.3-.75l-.85-1.48H7v-1.5H5.3l.85-1.47L4.85 7L4 8.47L3.15 7l-1.3.75l.85 1.47H1v1.5h1.7l-.85 1.48zm6.7-.75l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H15v-1.5h-1.7l.85-1.47l-1.3-.75L12 8.47L11.15 7l-1.3.75l.85 1.47H9v1.5h1.7zM23 9.22h-1.7l.85-1.47l-1.3-.75L20 8.47L19.15 7l-1.3.75l.85 1.47H17v1.5h1.7l-.85 1.48l1.3.75l.85-1.48l.85 1.48l1.3-.75l-.85-1.48H23z"/></svg>
			<input name="room_code" type="password" class="grow" placeholder="Room code" v-model="room_code" required />
		</label>

		<div class="text-center" v-if="error" style="color: red">{{ error }}</div>

		<div class="text-center items-center mt-4">
			<button type="submit" class="btn btn-secondary">Ingresar</button>
		</div>
	</form>
</template>

<script setup>
import { ref } from "vue";

const room_code = ref("");
const error = ref("");

const handleSubmit = async () => {
  error.value = "";

  try {
    const response = await fetch("http://localhost:3000/v1/rooms/join", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room_code: room_code.value }),
    });

    if (response.ok) {
      const data = await response.json();

      // Guardar los datos de la sala en localStorage
      localStorage.setItem("currentRoom", JSON.stringify(data.room));
      localStorage.setItem("joinedRoomId", JSON.stringify(data.room.id));

      // Obtener la configuración
      const url = "http://localhost:3000/v1/settingsRoom/byRoom/" + data.room.id;
      const response2 = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response2.ok) {
        const config = await response2.json();
        localStorage.setItem("settingsRoom", JSON.stringify(config));
		console.log("hola")
      } else {
		console.log("chau")
	  }

      // Redirigir a la sala
      window.location.href = `/protected/roomInfo/${data.room.id}`;
    } else {
      const data = await response.json();
      if (response.status === 400) {
        error.value = "Código de sala inválido.";
      } else if (response.status === 403) {
        error.value = "No tienes permiso para unirte a esta sala.";
      } else {
        error.value = data.message || "Error al ingresar a la sala.";
      }
    }
  } catch (err) {
    console.error(err);
    error.value = "Ocurrió un error al intentar ingresar a la sala.";
  }
};
</script>
