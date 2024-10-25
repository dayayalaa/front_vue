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
      <h1>Vuelos</h1>
      <div>
        <div v-if="vuelos.length === 0">Cargando...</div>
        <div v-else id="vuelosContainer">
          <ul>
            <li v-for="vuelo in vuelos" :key="vuelo.flight_number">
              <p>Origen: {{ vuelo.origin }}</p>
              <p>Destino: {{ vuelo.destination }}</p>
              <p>Precio: {{ vuelo.price }}</p>
              <p>Aerolínea: {{ vuelo.airline }}</p>
              <p>Salida: {{ vuelo.departure_at }}</p>
              <p>Regreso: {{ vuelo.return_at }}</p>
              <a :href="vuelo.link" target="_blank">Ver más</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </main>
</template>