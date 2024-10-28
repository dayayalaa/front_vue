<script setup>
import { ref, onMounted } from 'vue';
import { fetchVuelos } from '../services/apiService.js';

const vuelos = ref([]);

const getVuelos = async () => {
  try {
    const data = await fetchVuelos();
    vuelos.value = data.vuelosAPI; 
  } catch (error) {
    console.error('Error al obtener los vuelos:', error);
  }
};

onMounted(() => {
  getVuelos();
});
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center">
      <h1>Inicio</h1>
    </div>
  </main>
</template>