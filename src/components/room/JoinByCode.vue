<template>
	<form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
	  <label class="input input-bordered input-primary flex items-center gap-2">
		<svg
		  fill="#000000"
		  version="1.1"
		  id="Capa_1"
		  xmlns="http://www.w3.org/2000/svg"
		  xmlns:xlink="http://www.w3.org/1999/xlink"
		  width="40px"
		  height="40px"
		  viewBox="0 0 47 47"
		  xml:space="preserve"
		>
		  <g>
			<g>
			  <path
				d="M37.076,19.748c-0.824,0-1.494,0.672-1.494,1.499v1.46h2.991v-1.46C38.573,20.42,37.9,19.748,37.076,19.748z"
			  />
			  <path
				d="M41.227,12.635H5.773C2.6,12.635,0,15.237,0,18.41v10.18c0,3.178,2.6,5.775,5.773,5.775h35.454
				  C44.4,34.365,47,31.768,47,28.59V18.41C47,15.237,44.4,12.635,41.227,12.635z M12.56,25.077l1.385,1.508l-2.399,1.8l-0.984-1.8
				  c-0.145-0.257-0.372-0.761-0.691-1.508c-0.349,0.821-0.581,1.321-0.696,1.508l-0.998,1.8l-2.466-1.8l1.491-1.508
				  c0.42-0.415,0.827-0.771,1.229-1.063c-0.41-0.037-0.949-0.113-1.614-0.238l-2.065-0.336l0.958-2.812l1.852,0.842
				  c0.195,0.088,0.68,0.365,1.452,0.824c-0.165-0.747-0.271-1.302-0.319-1.666l-0.263-2.013h2.941l-0.238,2.013
				  c-0.052,0.49-0.166,1.045-0.335,1.666c0.339-0.17,0.563-0.283,0.669-0.345c0.372-0.207,0.659-0.35,0.852-0.442l1.853-0.879
				  l0.918,2.812l-2.049,0.428c-0.375,0.072-0.931,0.119-1.67,0.146C11.874,24.406,12.266,24.758,12.56,25.077z M26.137,25.077
				  l1.387,1.508l-2.399,1.799l-0.983-1.799c-0.145-0.257-0.372-0.761-0.69-1.508c-0.35,0.821-0.58,1.321-0.695,1.508l-1,1.799
				  l-2.465-1.799l1.491-1.508c0.42-0.415,0.826-0.771,1.229-1.063c-0.408-0.037-0.949-0.113-1.614-0.238l-2.066-0.336l0.959-2.812
				  l1.853,0.842c0.193,0.088,0.68,0.365,1.451,0.824c-0.169-0.747-0.275-1.302-0.32-1.666l-0.264-2.011h2.942l-0.239,2.011
				  c-0.054,0.49-0.166,1.045-0.333,1.666c0.337-0.17,0.561-0.283,0.668-0.345c0.37-0.207,0.658-0.35,0.852-0.442l1.854-0.879
				  l0.919,2.812l-2.051,0.428c-0.375,0.072-0.929,0.119-1.669,0.146C25.451,24.406,25.844,24.758,26.137,25.077z M41.35,27.625
				  c0,0.619-0.507,1.125-1.125,1.125H33.93c-0.619,0-1.125-0.506-1.125-1.125v-3.794c0-0.619,0.506-1.125,1.125-1.125h0.152v-1.46
				  c0-1.653,1.343-2.998,2.994-2.998c1.652,0,2.996,1.344,2.996,2.998v1.46h0.152c0.617,0,1.125,0.506,1.125,1.125V27.625z"
			  />
			</g>
		  </g>
		</svg>
		<input
		  name="room_code"
		  type="password"
		  class="grow"
		  placeholder="Room code"
		  v-model="room_code"
		  required
		/>
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
		// Enviar el body como un objeto con la clave "room_code"
		body: JSON.stringify({ room_code: room_code.value }),
	  });
  
	  if (response.ok) {
		const data = await response.json();
  
		// Guardar los datos de la sala en localStorage
		localStorage.setItem("currentRoom", JSON.stringify(data));
  
		// Redireccionar a la página de la sala
		window.location.href = `/protected/roomInfo`; 
	  } else {
		const data = await response.json();
		error.value = data.message || "Error al ingresar a la sala.";
	  }
	} catch (err) {
	  console.error(err);
	  error.value = "Ocurrió un error al intentar ingresar a la sala.";
	}
  };
  </script>
  
  <style scoped>

  
  </style>
  