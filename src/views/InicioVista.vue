<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import MiItinerario from '../components/MiItinerario.vue';
import Subtitulo from '../components/Subtitulo.vue';
import TarjetaDestino from '../components/TarjetaDestino.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import NavSuperior from '../components/NavSuperior.vue';
import Buscador from '../components/Buscador.vue';
import { RouterLink } from 'vue-router';

const destinosPopulares = ref([]); 
const destinosArcana = ref([]);    
const todosLosDestinos = ref([]); 

const obtenerDestinos = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/lugares');
    const lugares = response.data.data;
    todosLosDestinos.value = lugares; 
    destinosPopulares.value = lugares.filter(lugar => lugar.categoria = 'popular');
    destinosArcana.value = lugares.filter(lugar => lugar.categoria = 'arcana');
  } catch (error) {
    console.error('Error al obtener lugares:', error);
  }
};

onMounted(() => {
  obtenerDestinos();
});
</script>

<template>
  <div>
    <NavSuperior />
    <div class="flex flex-col justify-center items-center bg-cover bg-center h-40">
      <TituloPrincipal>¡Descubre nuevos destinos!</TituloPrincipal>


      <div class="mt-4 w-full max-w-lg">
        <Buscador :destinos="todosLosDestinos" />
      </div>
    </div>

    <div>
      <MiItinerario />
    </div>

    <!-- Sección Destinos Arcana -->
    <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>Destinos Arcana</Subtitulo>
      <div class="flex flex-wrap gap-3 justify-center m-2">
        <TarjetaDestino 
          v-for="destino in destinosArcana" 
          :key="destino._id" 
          :nombre="destino.nombre" 
          :imagen="destino.imagen[0]" 
        />
      </div>
    </section>

    <!-- Sección Conoce nuestros Guías -->
    <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>¡Conoce nuestros guías!</Subtitulo>
     <RouterLink to="/guiasTarjetas"><BotonPrincipal>Guías locales</BotonPrincipal> </RouterLink>
    </section>

    <!-- Sección Destinos Populares -->
    <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>Destinos Populares</Subtitulo>
      <div class="flex flex-col gap-6 justify-center">
        <RouterLink 
          v-for="destino in destinosPopulares" 
          :key="destino._id" 
          :to="{ name: 'lugarDetalle', params: { id: destino._id } }" 
        >
          <div class="relative w-[300px] h-[150px]">
            <img 
              :src="destino.imagen[0]" 
              :alt="`Imagen de ${destino.nombre}`" 
              class="w-full h-full object-cover rounded-lg" 
            />
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ destino.nombre }}
            </p>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
