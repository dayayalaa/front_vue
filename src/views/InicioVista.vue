<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import Mistinerario from '../components/Mistinerario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import NavSuperior from '../components/NavSuperior.vue';
import Buscador from '../components/Buscador.vue';
import { RouterLink } from 'vue-router';

const provinciasPopulares = ref([]);
const guias = ref([]);

// const obtenerProvinciasPopulares = async () => {
//   try {
//     const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/destino/populares');
//     provinciasPopulares.value = response.data;
//     console.log(provinciasPopulares.value);
//   } catch (error) {
//     console.error('Error al obtener provincias populares:', error);
//   }
// };

const obtenerGuias = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/usuarios/guia');
    guias.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener guías:', error);
  }
};

onMounted(() => {
  // obtenerProvinciasPopulares();
  obtenerGuias();
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
      <Mistinerario />
    </div>

    <!-- Guías -->
    <section class="flex flex-col justify-center items-center mb-20">
      <TituloSecundario>¡Conoce nuestros guías!</TituloSecundario>

      <div class="flex justify-center gap-4 m-6 flex-wrap">
        <div v-for="guia in guias.slice(0, 3)" :key="guia._id"
          class="bg-white shadow-md rounded-lg overflow-hidden w-28 text-center">
          <router-link :to="`/guias/${guia._id}`">
            <img :src="guia.fotoPerfil" alt="Guía" class="w-28 h-28 object-cover" />
            <div class="p-2">
              <h3 class="text-md font-semibold text-gray-800">{{ guia.nombre }}</h3>
            </div>
          </router-link>
        </div>
      </div>

      <RouterLink to="/guiasTarjetas">
        <BotonPrincipal>Guías locales</BotonPrincipal>
      </RouterLink>
    </section>



    <!-- Provincias Populares -->
    <section class="flex flex-col justify-center items-center mb-20">
      <TituloSecundario>Provincias Populares</TituloSecundario>
      <strong class="text-center">¡Esta silenciado lo de las provincias para no gastar busquedas!</strong>
      <!--  <div class="flex flex-wrap gap-5 justify-center m-2">
        <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
          :to="{ name: 'ProvinciasVistas', params: { id: provincia.provincia } }">
          <div class="relative w-[140px] h-[200px]">

            <img :src="provincia.thumbnail" :alt="`Imagen de ${provincia.provincia}`"
              class="w-full h-full object-cover rounded-lg" />

            <p
              class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ provincia.provincia }}
            </p>
          </div>
        </RouterLink>
      </div> -->
    </section>

  </div>
</template>
