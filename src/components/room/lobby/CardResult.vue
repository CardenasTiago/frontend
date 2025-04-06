<template>
  <div class="max-w-xs lg:max-w-3xl mx-auto p-4 rounded-xl shadow-md shadow-base-100 bg-neutral flex flex-col border border-accent/10">
    <h2 class="text-accent font-semibold text-sm mb-2 lg:border-b lg:border-accent/20 pb-1 text-center lg:text-start">
      {{ proposal?.title || 'Propuesta sin título' }}
    </h2>

    <div class="flex flex-col md:flex-row gap-20 items-center p-6">    

      <!-- Tabla -->
      <div class="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full hidden lg:block md:block">
        <table class="table">
          <thead class="">
            <tr>
              <th>Opciones</th>
              <th>Votos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in result" :key="i">
              <td class="font-semibold">{{ item.value }}</td>
              <td>{{ item.count }}</td>              
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dona -->
      <div class="">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

  
<script setup>
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)


const props = defineProps({
  result: Array,
  proposal: Object
})

// Función para generar colores del gráfico
function generarColores(cantidad) {
  const paleta = [
    '#6ee7b7', // success
    '#fde047', // warning
    '#f87171', // error   
    '#6B48FF', // primary
    '#a78bfa', // secondary
    '#0ea5e9' // info         
  ] 
  const colores = []
  for (let i = 0; i < cantidad; i++) {
    colores.push(paleta[i % paleta.length])
  }
  return colores
}

// Computed para construir dinámicamente el chartData con los resultados recibidos
const chartData = computed(() => {
  const resultados = props.result || []
  return {
    labels: resultados.map(r => r.value),
    datasets: [{
      data: resultados.map(r => r.count),
      backgroundColor: generarColores(resultados.length),
      borderWidth: 2
    }]
  }
})

// Config del gráfico
const chartOptions = {
  responsive: true,
  cutout: '60%',
  plugins: {
    legend: {
      display: true      
    }
  }
}
</script>

  