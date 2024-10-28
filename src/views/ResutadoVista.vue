<template>
    <div class="max-w-md mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4 text-center">Resultados de Vuelos de Ida</h2>
      <p><strong>Origen:</strong> {{ origen }}</p>
      <p><strong>Destino:</strong> {{ destino }}</p>
  
      <div v-if="cargando">
        <p>Cargando opciones de vuelos...</p>
      </div>
  
      <div v-else-if="Array.isArray(vuelosIda) && vuelosIda.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosIda" :key="vuelo.flight_number" class="bg-white shadow-md rounded-lg p-4">
            <img :src="vuelo.logo" alt="Logo de la aerolínea" class="w-12 h-12 object-contain">
            <p><strong>Número de Vuelo:</strong> {{ vuelo.flight_number }}</p>
            <p><strong>Precio:</strong> {{ vuelo.price }} ARS</p>
            <p><strong>Origen:</strong> {{ vuelo.origin }}</p>
            <p><strong>Destino:</strong> {{ vuelo.destination }}</p>
            <p><strong>Salida:</strong> {{ vuelo.departure_at }}</p>
            <p><strong>Duración:</strong> {{ vuelo.duration }} Minutos</p>
            <button class="bg-blue-500 text-white px-4 py-2 rounded">Seleccionar vuelo</button>
          </div>
        </div>
      </div>
      <p v-else>No hay opciones de vuelos de ida disponibles.</p>

      <div class="max-w-md mx-auto p-4 flex flex-col justify-center items-center">
        <h2  class="text-2xl font-bold mb-4 text-center">Agregar un hotel</h2>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
      </div>
      <div class="max-w-md mx-auto p-4 flex flex-col justify-center items-center">
        <h2  class="text-2xl font-bold mb-4 text-center">Agregar una actividad</h2>
        <button class="bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
      </div>
  
      <h2 class="text-2xl font-bold mb-4 text-center">Resultados de Vuelos de Vuelta</h2>
      <p><strong>Origen:</strong> {{ destino }}</p>
      <p><strong>Destino:</strong> {{ origen }}</p>
  
      <div v-if="cargandoVuelta">
        <p>Cargando opciones de vuelos de vuelta...</p>
      </div>
  
      <div v-else-if="Array.isArray(vuelosVuelta) && vuelosVuelta.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosVuelta" :key="vuelo.flight_number" class="bg-white shadow-md rounded-lg p-4">
            <img :src="vuelo.logo" alt="Logo de la aerolínea" class="w-12 h-12 object-contain">
            <p><strong>Número de Vuelo:</strong> {{ vuelo.flight_number }}</p>
            <p><strong>Precio:</strong> {{ vuelo.price }} ARS</p>
            <p><strong>Origen:</strong> {{ vuelo.origin }}</p>
            <p><strong>Destino:</strong> {{ vuelo.destination }}</p>
            <p><strong>Salida:</strong> {{ vuelo.departure_at }}</p>
            <p><strong>Duración:</strong> {{ vuelo.duration }} Minutos</p>
            <button class="bg-blue-500 text-white px-4 py-2 rounded">Seleccionar vuelo</button>
          </div>
        </div>
      </div>
      <p v-else>No hay opciones de vuelos de vuelta disponibles.</p>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  
  const route = useRoute();
  const origen = route.query.origen;
  const destino = route.query.destino;
  const fechaSalida = route.query.fechaSalida;
  const fechaVuelta = route.query.fechaVuelta; // Obtener la fecha de vuelta del query
  const vuelosIda = ref([]);
  const vuelosVuelta = ref([]);
  const cargando = ref(true);
  const cargandoVuelta = ref(true);
  
  onMounted(async () => {
    try {
      if (!origen || !destino || !fechaSalida || !fechaVuelta) { // Validar todas las entradas
        cargando.value = false;
        cargandoVuelta.value = false;
        return;
      }
  
      // Obtener vuelos de ida
      const responseIda = await axios.get('http://localhost:3000/arcana/vuelos/ida', {
        params: {
          origen,
          destino,
          fechaSalida,
        }
      });
      vuelosIda.value = responseIda.data.vuelosAPI || [];
  
      // Obtener vuelos de vuelta
      const responseVuelta = await axios.get('http://localhost:3000/arcana/vuelos/vuelta', {
        params: {
          origen: destino,  
          destino: origen,  
          fechaVuelta, // Usar la fecha de vuelta ingresada por el usuario
        }
      });
      vuelosVuelta.value = responseVuelta.data.vuelosAPI || [];
    } catch (error) {
      console.error('Error al obtener vuelos:', error);
    } finally {
      cargando.value = false;
      cargandoVuelta.value = false;
    }
  });
  </script>
  