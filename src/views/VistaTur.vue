<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const tour = ref(null);  // Asegúrate de que 'tour' sea un ref
const loading = ref(true);

onMounted(async () => {
  try {
    const tourId = route.params.id;
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);
    console.log(tourId); 
    tour.value = response.data;
  } catch (error) {
    console.error('Error al obtener los datos del tour:', error.response ? error.response.data : error.message);
    tour.value = {}; 
  } finally {
    loading.value = false; 
  }
});

</script>

<template>
  <div v-if="loading" class="text-center mt-10">
    <p class="text-xl text-gray-600">Cargando información del tour...</p>
  </div>
  
  <div v-else-if="!tour || Object.keys(tour).length === 0" class="text-center mt-10">
    <p class="text-xl text-red-600">No se pudo obtener la información del tour.</p>
  </div>

  <div v-else class="max-w-4xl mx-auto px-4 py-8">
    <h1 class="text-3xl font-semibold text-gray-900">{{ tour.titulo }}</h1>
    <img :src="tour.fotoPortada" alt="Foto del tour" class="mt-4 w-full h-64 object-cover rounded-lg shadow-md" />
    <p class="mt-4 text-lg text-gray-700"><strong>Descripción:</strong> {{ tour.descripcion }}</p>
    <p class="mt-2 text-lg text-gray-700"><strong>Precio:</strong> ${{ tour.precio }}</p>
    <p class="mt-2 text-lg text-gray-700"><strong>Provincia:</strong> {{ tour.provincia }}</p>
    <p class="mt-2 text-lg text-gray-700"><strong>Duración:</strong> {{ tour.duracion }}</p>

    <p class="mt-4 text-lg font-semibold text-gray-800">Fechas disponibles:</p>
    <ul class="list-disc pl-6 text-gray-700">
      <li v-for="fecha in tour.fechasDisponibles" :key="fecha">{{ new Date(fecha).toLocaleDateString() }}</li>
    </ul>

    <p v-if="tour.politicaCancelacion" class="mt-4 text-lg text-gray-700">
      <strong>Política de cancelación:</strong> {{ tour.politicaCancelacion }}
    </p>

    <button 
      @click="goBack" 
      class="mt-8 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
      Volver
    </button>
  </div>
</template>
