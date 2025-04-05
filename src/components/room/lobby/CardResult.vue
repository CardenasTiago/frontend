<template>
  <div class="max-w-3xl mx-auto p-4 rounded-xl shadow bg-white">
    <h2 class="text-accent font-semibold text-sm mb-2 border-b border-gray-300 pb-1">
      ¿Cual es el mejor club de Argentina?
    </h2>

    <div class="flex flex-col md:flex-row gap-8 items-center">
     

      <!-- Tabla -->
      <div class="overflow-x-auto w-full">
        <table class="table table-zebra">
          <thead>
            <tr>
              <th>Resultado</th>
              <th colspan="2">Votos</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in resultados" :key="i">
              <td class="font-semibold">{{ item.nombre }}</td>
              <td>{{ item.votos }}</td>
              <td class="text-sm text-gray-500">{{ item.porcentaje }}%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Dona -->
      <div class="w-60 h-60">
        <canvas ref="donaChart"></canvas>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'

const donaChart = ref(null)

const resultados = [
  { nombre: 'Boca', votos: 120, porcentaje: 40 },
  { nombre: 'Racing', votos: 100, porcentaje: 33.3 },
  { nombre: 'River', votos: 80, porcentaje: 26.7 }
]

onMounted(() => {
  const ctx = donaChart.value.getContext('2d')
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: resultados.map(r => r.nombre),
      datasets: [{
        data: resultados.map(r => r.votos),
        backgroundColor: ['#60a5fa', '#f87171', '#34d399'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      cutout: '60%',
      plugins: {
        legend: {
          display: false
        }
      }
    }
  })
})
</script>

  