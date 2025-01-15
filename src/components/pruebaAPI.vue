<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Definimos un estado reactivo para los lugares y errores
const lugares = ref([]);
const provincia = ref('');
const error = ref('');
const loading = ref(false); // Para mostrar un indicador de carga

// Función para obtener lugares de la API
const obtenerLugares = async () => {
  if (!provincia.value.trim()) {
    error.value = 'Por favor, ingresa una provincia.';
    return;
  }

  loading.value = true;
  error.value = ''; // Limpiamos errores previos

  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/prueba/lugares?provincia=${provincia.value}`);
    console.log("Respuesta completa:", response);
    console.log("Información:", response.data.place_results);

    if (response.data && response.data.place_results) {
      if (response.data.place_results.length > 0) {
        lugares.value = response.data.place_results;
      } else {
        lugares.value = [];  // Si no hay lugares, aseguramos que la lista sea vacía
      }
    } else {
      error.value = 'La respuesta de la API no contiene los lugares esperados o el campo place_results no existe.';
      lugares.value = [];  // En caso de un error en la respuesta de la API, vaciamos los lugares
    }
  } catch (err) {
    console.error('Error en el frontend:', err);
    error.value = err.response?.data?.error || err.message || 'Hubo un problema al obtener los lugares. Intenta de nuevo.';
    lugares.value = [];  // Si hay un error en la solicitud, vaciamos la lista de lugares
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container mx-auto p-4 max-w-3xl">
    <h1 class="text-3xl font-bold text-center mb-4">Buscar Lugares por Provincia</h1>

    <!-- Input para la provincia -->
    <div class="mb-4">
      <input
        v-model="provincia"
        type="text"
        placeholder="Ingresa el nombre de la provincia"
        class="p-3 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Botón para buscar -->
    <button
      @click="obtenerLugares"
      class="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 w-full md:w-auto"
      :disabled="loading.value"
    >
      {{ loading.value ? 'Cargando...' : 'Buscar Lugares' }}
    </button>

    <!-- Mensaje de error -->
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

    <!-- Información de la provincia -->
    <div v-if="lugares.length === 0 && !loading.value && !error.value" class="text-gray-500 mt-2">
      No se encontraron lugares para esta provincia, pero se realizó la búsqueda.
    </div>

    <!-- Lista de lugares -->
    <div v-if="lugares.length > 0 && !error.value" class="mt-4">
      <ul class="space-y-4">
        <li v-for="(lugar, index) in lugares" :key="index" class="border-b pb-2">
          <h2 class="text-xl font-semibold">{{ lugar.title }}</h2>
          <p>{{ lugar.description.snippet }}</p>
          <a :href="lugar.photos_link" target="_blank" class="text-blue-500 hover:underline">Ver más</a>
        </li>
      </ul>
    </div>
  </div>
</template>

