<template>
  <div class="max-w-md mx-auto p-4">
    <h2 class="text-2xl font-bold mb-4 text-center">Buscar Vuelos</h2>
    <form @submit.prevent="irARuta">
      <div class="mb-4">
        <label for="origen" class="block text-sm font-medium">Origen:</label>
        <input type="text" id="origen" v-model="origen" class="border border-gray-300 p-2 rounded w-full" required>
      </div>
      <div class="mb-4">
        <label for="destino" class="block text-sm font-medium">Destino:</label>
        <input type="text" id="destino" v-model="destino" class="border border-gray-300 p-2 rounded w-full" required>
      </div>
      <div class="mb-4">
        <label for="fechaSalida" class="block text-sm font-medium">Fecha de Ida:</label>
        <input type="date" id="fechaSalida" v-model="fechaSalida" class="border border-gray-300 p-2 rounded w-full" required>
      </div>
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Buscar Vuelos</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const origen = ref('');
const destino = ref('');
const fechaSalida = ref('');

const irARuta = () => {
  if (!origen.value || !destino.value || !fechaSalida.value) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  router.push({
    path: '/resultados',
    query: {
      origen: origen.value,
      destino: destino.value,
      fechaSalida: fechaSalida.value,
    }
  });
};
</script>
