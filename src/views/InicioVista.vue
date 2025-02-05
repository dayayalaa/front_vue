<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import MiItinerario from '../components/MiItinerario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import NavSuperior from '../components/NavSuperior.vue';
import Buscador from '../components/Buscador.vue';
import { RouterLink } from 'vue-router';

const provinciasPopulares = ref([]);

const obtenerProvinciasPopulares = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/destino/populares');
    provinciasPopulares.value = response.data;
    console.log(provinciasPopulares.value);
  } catch (error) {
    console.error('Error al obtener provincias populares:', error);
  }
};

onMounted(() => {
  obtenerProvinciasPopulares();
});
</script>

<template>
  <div>
    <NavSuperior />
    <div class="flex flex-col justify-center items-center bg-cover bg-center h-40">
      <TituloPrincipal>¡Descubrí nuevas provincias!</TituloPrincipal>

      <div class="mt-4 w-full max-w-lg">
        <Buscador :destinos="provinciasPopulares" />
      </div>
    </div>

    <div>
      <MiItinerario />
    </div>

    <!-- Guías -->
    <section class="flex flex-col justify-center items-center mb-20">
      <TituloSecundario>¡Conoce nuestros guías!</TituloSecundario>
      <RouterLink to="/guiasTarjetas">
        <BotonPrincipal>Guías locales</BotonPrincipal>
      </RouterLink>
    </section>

    <!-- Provincias Populares -->
    <section class="flex flex-col justify-center items-center mb-20">
      <TituloSecundario>Provincias Populares</TituloSecundario>
      <div class="flex flex-wrap gap-5 justify-center m-2">
        <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
          :to="{ name: 'lugarDetalle', params: { id: provincia.provincia } }">
          <div class="relative w-[140px] h-[200px]">

            <img :src="provincia.thumbnail" :alt="`Imagen de ${provincia.provincia}`"
              class="w-full h-full object-cover rounded-lg" />

            <p
              class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ provincia.provincia }}
            </p>
          </div>
        </RouterLink>
      </div>
    </section>

  </div>
</template>
