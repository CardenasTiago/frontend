<template>
	<form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
		<label class="input input-bordered input-primary flex items-center gap-2">
			<Icon icon="ic:baseline-password" width="24" height="24" />
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
import { Icon } from "@iconify/vue";

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
      } 

      if (data.room.privileges) {
        window.location.href = `/protected/room/${data.room.id}`
      } else {
        window.location.href = `/protected/roomInfo/${data.room.id}`;
      }
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
