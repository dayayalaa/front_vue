<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

import IconoLista from '../components/icons/IconoLista.vue';
import IconoCalendario from '../components/icons/IconoCalendario.vue';
import IconoMapa from '../components/icons/IconoMapa.vue';

const route = useRoute();
const itinerario = ref(null);
const provinciaInfo = ref(null);
const cargando = ref(true);
const error = ref(null);

const obtenerProvincia = async () => {
    const provinciaId = itinerario.value.destino;
   // console.log('La provincia es:', provinciaId);

    if (!provinciaId) {
        console.error('No se ha especificado una provincia');
        provinciaInfo.value = null;
        return;
    }

   cargando.value = true;
    try {
        const response = await axios.get(
            `https://back-tesis-lovat.vercel.app/arcana/destino/provincia?provincia=${provinciaId}`
        );

       // console.log('Estructura de response.data:', response.data);

        if (response && response.data) {
            provinciaInfo.value = {
                title: response.data.title,
                address: response.data.address,
                description: response.data.description?.snippet || 'No disponible',
                thumbnail: response.data.thumbnail,
            };

            const data_id = response.data.data_id;
          //  console.log('data_id:', data_id);
            obtenerImagenes(data_id);
        } else {
            console.error('No se encontró la información esperada en la respuesta de la API');
            provinciaInfo.value = null;
        }

    } catch (error) {
        console.error('Error al obtener la información de la provincia:', error);
        provinciaInfo.value = null;
    } finally {
     cargando.value = false;
    }
};

const obtenerImagenes = async (data_id) => {
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${data_id}`);

       // console.log('Respuesta de la API img:', response.data);

        if (response.data && response.data.images && Array.isArray(response.data.images)) {
            provinciaInfo.value.gallery = response.data.images;
           // console.log('Galería después de asignar:', provinciaInfo.value.gallery);
        } else {
            console.warn('No se encontraron imágenes en la respuesta o el formato es incorrecto');
        }
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
    }
};

onMounted(async () => {
  try {
    const id = route.params.id;

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);

   // console.log(response.data);

    itinerario.value = response.data;
   cargando.value = false;
    
    obtenerProvincia();
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
   cargando.value = false;
  }
});

</script>

<template>
  <IrAtras />
  <SpinnerCarga v-if="cargando"/>
  <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>
  <div
    v-else-if="itinerario && itinerario.vueloIda && itinerario.vueloIda.details && itinerario.vueloIda.details.flights.length > 0"
    class="max-w-3xl mx-auto px-4 py-6 mb-12 -mt-4">

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">

        <div class="relative h-[500px]">
            <img :src="provinciaInfo.gallery && provinciaInfo.gallery.length ? provinciaInfo.gallery[0] : '/img/default_portada.png'"
                class="w-full h-full object-cover rounded-lg" />
            <div class="absolute inset-0 bg-gradient-to-t from-white to-transparent rounded-lg"></div>
            <div class="absolute bottom-4 left-4 text-white">
                <TituloSecundario class="text-4xl font-semibold">{{ itinerario.destino }}</TituloSecundario>
                <TituloTerciario class="mt-2">{{ provinciaInfo.address }}</TituloTerciario>
            </div>
        </div>

        <div v-if="provinciaInfo" class="m-4">
            <p v-if="provinciaInfo.description" class="mt-4 text-gray-700">
                <strong class="text-green-600">Descripción:</strong>
                {{ provinciaInfo.description }}
            </p>
        </div>

        <div class="flex justify-between m-8">
            <RouterLink :to="`/listas/${route.params.id}`"
                class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
                <IconoLista class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
                <p class="text-sm text-gray-700">Checklist</p>
            </RouterLink>

            <RouterLink :to="`/hoteles/${route.params.id}`"
                class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
                <IconoCalendario class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
                <p class="text-sm text-gray-700">Hotel</p>
            </RouterLink>

            <RouterLink to="/guiasTarjetas"
                class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
                <IconoMapa class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
                <p class="text-sm text-gray-700">Guias</p>
            </RouterLink>
        </div>

        <hr class="m-6">

        
        <TituloSecundario class="text-center text-4xl">Vuelos reservados</TituloSecundario>

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

        </div>
    </div>
</div>

  <p v-else class="text-center text-gray-600">Itinerario no encontrado.</p>

</template>
