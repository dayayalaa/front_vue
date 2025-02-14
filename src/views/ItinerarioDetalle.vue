<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';

import IconoLista from '../components/icons/IconoLista.vue';
import IconoCalendario from '../components/icons/IconoCalendario.vue';
import IconoMapa from '../components/icons/IconoMapa.vue';

const route = useRoute();
const itinerario = ref(null);
const isLoading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const id = route.params.id;

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);

    console.log(response.data);

    itinerario.value = response.data;
    isLoading.value = false;
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
    isLoading.value = false;
  }
});

</script>

<template>
  <IrAtras />
  <div v-if="isLoading" class="text-center text-gray-600">Cargando...</div>
  <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
  <div
    v-else-if="itinerario && itinerario.vueloIda && itinerario.vueloIda.details && itinerario.vueloIda.details.flights.length > 0"
    class="max-w-3xl mx-auto px-4 py-6 mb-12">
    <!-- Aquí va tu contenido -->
    <TituloSecundario class="text-center text-4xl">{{ itinerario.destino }}</TituloSecundario>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <div class="px-6 py-4">
        <div class="flex items-center space-x-4">
          <img :src="itinerario.vueloIda.details.flights[0].airline_logo" alt="Logo Aerolínea" class="w-12 h-12">
          <div>
            <TituloTerciario>Vuelo de ida:</TituloTerciario>
            <p class="text-gray-600 text-sm leading-relaxed">
              <strong>Aerolinea:</strong> {{ itinerario.vueloIda.details.flights[0].airline }}
            </p>
            <p class="text-gray-600 text-sm leading-relaxed">
              <strong>Número de vuelo:</strong> {{ itinerario.vueloIda.details.flights[0].flight_number }}
            </p>
            <p class="text-gray-600 text-sm leading-relaxed">
              <strong>Hora de salida:</strong> {{ itinerario.vueloIda.details.flights[0].departure_airport.time }}
            </p>
          </div>
        </div>

        <hr class="m-6">

        <div class="px-6 py-4">
          <div class="flex items-center space-x-4">
            <img :src="itinerario.vueloVuelta.details.flights[0].airline_logo" alt="Logo Aerolínea" class="w-12 h-12">
            <div>
              <TituloTerciario>Vuelo de vuelta:</TituloTerciario>
              <p class="text-gray-600 text-sm leading-relaxed">
                <strong>Aerolinea:</strong> {{ itinerario.vueloVuelta.details.flights[0].airline }}
              </p>
              <p class="text-gray-600 text-sm leading-relaxed">
                <strong>Número de vuelo:</strong> {{ itinerario.vueloVuelta.details.flights[0].flight_number }}
              </p>
              <p class="text-gray-600 text-sm leading-relaxed">
                <strong>Hora de salida:</strong> {{ itinerario.vueloVuelta.details.flights[0].departure_airport.time }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-between py-2 border-t">
          <RouterLink :to="`/listas/${route.params.id}`"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
            <IconoLista class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
            <p class="text-sm text-gray-700">Checklist</p>
          </RouterLink>

          <RouterLink :to="`/hoteles/${route.params.id}`"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
            <IconoCalendario class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
            <p class="text-sm text-gray-700">Hoteles</p>
          </RouterLink>

          <RouterLink to="/guiasTarjetas"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
            <IconoMapa class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
            <p class="text-sm text-gray-700">Guias</p>
          </RouterLink>
        </div>

      </div>
    </div>
  </div>
  <p v-else class="text-center text-gray-600">Itinerario no encontrado.</p>

</template>