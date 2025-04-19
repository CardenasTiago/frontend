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
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import RoomService from '../../services/room.service';
import SettingRoomService from '../../services/settingroom.service';

const room_code = ref('');
const error = ref('');

const handleSubmit = async () => {
  error.value = '';

  try {
    // Intentar unirse a la sala
    const respString = await RoomService.join({ room_code: room_code.value });
    const data = JSON.parse(respString);

    // Guardar datos de la sala
    localStorage.setItem('currentRoom', JSON.stringify(data.room));

    // Cargar configuración de la sala
    const settingsString = await SettingRoomService.byRoom(String(data.room.id));
    const config = JSON.parse(settingsString);
    localStorage.setItem('settingsRoom', JSON.stringify(config));

    // Redirigir según privilegios
    if (data.room.privileges) {
      window.location.href = `/protected/room/${data.room.id}`;
    } else {
      window.location.href = `/protected/roomInfo/${data.room.id}`;
    }

  } catch (err) {
    // Manejo de errores según status de respuesta
    if (err.status === 400) {
      error.value = 'Código de sala inválido.';
    } else if (err.status === 403) {
      error.value = 'No tienes permiso para unirte a esta sala.';
    }else if ( err.status === 404) {
        error.value = "Codigo de sala inexistente";
      } else {
      error.value = err.message || 'Ocurrió un error al intentar ingresar a la sala.';
    }
  }
};
</script>
