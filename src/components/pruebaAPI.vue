<script setup>
import { ref } from 'vue';
import axios from 'axios';

// Definimos un estado reactivo para los lugares y errores
const lugares = ref([]);
const provincia = ref('');
const error = ref('');

// Función para obtener lugares de la API
const obtenerLugares = async () => {
  if (!provincia.value) {
    error.value = 'Por favor, ingresa una provincia.';
    return;
  }

  error.value = '';  // Limpiamos el error
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/api/lugares?provincia=${provincia.value}`);
    lugares.value = response.data;
  } catch (err) {
    error.value = 'Hubo un problema al obtener los lugares. Intenta de nuevo.';
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold text-center mb-4">Buscar Lugares por Provincia</h1>

    <!-- Input para la provincia -->
    <div class="mb-4">
      <input
        v-model="provincia"
        type="text"
        placeholder="Ingresa el nombre de la provincia"
        class="p-2 border border-gray-300 rounded w-full"
      />
    </div>

    <!-- Botón para buscar -->
    <button
      @click="obtenerLugares"
      class="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 w-full md:w-auto"
    >
      Buscar Lugares
    </button>

    <!-- Mensaje de error -->
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>

    <!-- Lista de lugares -->
    <div v-if="lugares.length > 0" class="mt-4">
      <ul class="space-y-4">
        <li v-for="(lugar, index) in lugares" :key="index" class="border-b pb-2">
          <h2 class="text-xl font-semibold">{{ lugar.nombre }}</h2>
          <p>{{ lugar.descripcion }}</p>
          <a :href="lugar.url" target="_blank" class="text-blue-500 hover:underline">Ver más</a>
        </li>
      </ul>
    </div>
  </div>
</template>

