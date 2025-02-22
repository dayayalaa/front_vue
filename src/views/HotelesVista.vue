<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const route = useRoute();
const itinerario = ref(null);
const cargando = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);

    //console.log(response.data);

    itinerario.value = response.data;
    cargando.value = false;
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
    cargando.value = false;
  }
});
</script>

<template>
  <IrAtras />
  <SpinnerCarga v-if="cargando" />
  <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
  <div
    v-else-if="itinerario && itinerario.vueloIda && itinerario.vueloIda.details && itinerario.vueloIda.details.flights.length > 0"
    class="max-w-3xl mx-auto px-4 py-6 mb-12">
    <TituloSecundario class="text-center text-4xl">Hotel reservado en {{ itinerario.destino }}</TituloSecundario>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4">
        <img :src="itinerario.hotel.images[0].original_image" :alt="'Imagen del hotel ' + itinerario.hotel.name"
          class="w-[50] h-[50]" />

        <TituloTerciario>{{ itinerario.hotel.name }}</TituloTerciario>
        
        <div>
          <p class="text-gray-600 text-sm leading-relaxed">
            <strong>Calificación:</strong> {{ itinerario.hotel.location_rating }}
          </p>

          <div class="flex">
            <span v-for="n in 5" :key="n" class="text-xl"
              :class="{ 'text-yellow-500': n <= itinerario.hotel.location_rating, 'text-gray-300': n > itinerario.hotel.location_rating }">★</span>
          </div>
        </div>

        <!-- Amenidades como lista -->
        <p class="text-gray-600 text-sm leading-relaxed">
          <strong>Amenidades:</strong>
        </p>
        <ul class="list-disc pl-5 text-gray-600">
          <li v-for="(amenidad, index) in itinerario.hotel.amenities" :key="index">
            {{ amenidad }}
          </li>
        </ul>

        <!-- Galería de imágenes (ignorando la primera imagen) -->
        <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <img v-for="(image, index) in itinerario.hotel.images.slice(1)" :key="index" :src="image.original_image"
            :alt="'Imagen del hotel ' + itinerario.hotel.name + ' ' + (index + 1)"
            class="w-full h-[100px] object-cover rounded-md" />
        </div>
      </div>
    </div>
  </div>

  <p v-else class="text-center text-gray-600">Itinerario no encontrado.</p>
</template>
