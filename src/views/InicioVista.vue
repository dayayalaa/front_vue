<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import Mistinerario from '../components/Mistinerario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import NavSuperior from '../components/NavSuperior.vue';
import Buscador from '../components/Buscador.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const provinciasPopulares = ref([]);
const guias = ref([]);
const cargando = ref(true); 

const obtenerProvinciasPopulares = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/destino/populares');
    provinciasPopulares.value = response.data;
    response.data.forEach(provincia => {
      if (provincia.data_id) {
        obtenerImagenes(provincia);
      } else {
        provincia.thumbnail = '/img/default_portada.png';
      }
    });
  } catch (error) {
    console.error('Error al obtener provincias populares:', error);
  }
};

const obtenerImagenes = async (provincia) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${provincia.data_id}`);
    if (response.data && response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
      const validImage = response.data.images.find(image => isValidImage(image));
      provincia.thumbnail = validImage || '/img/default_portada.png';
    } else {
      provincia.thumbnail = '/img/default_portada.png';
    }
    provinciasPopulares.value = [...provinciasPopulares.value];
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    provincia.thumbnail = '/img/default_portada.png';
  }
};

const isValidImage = (image) => {
  return image && image.startsWith('http');
};

const obtenerGuias = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/usuarios/guia');
    guias.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener guías:', error);
  }
};

onMounted(async () => {
  await Promise.all([obtenerProvinciasPopulares(), obtenerGuias()]);
  cargando.value = false; 
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

   <SpinnerCarga v-if="cargando"/>

    <template v-else>
      <section class="flex flex-col justify-center items-center mb-20">
        <TituloSecundario>¡Conoce nuestros guías!</TituloSecundario>

        <div class="flex justify-center gap-2 m-2 flex-wrap">
          <div v-for="guia in guias.slice(0, 3)" :key="guia._id"
            class="bg-white shadow-md rounded-lg overflow-hidden w-28 mb-6 text-center">
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

      <section class="flex flex-col justify-center items-center mb-20">
        <TituloSecundario>Provincias Populares</TituloSecundario>

        <div v-if="provinciasPopulares.length > 0" class="flex flex-wrap gap-5 justify-center m-2">
          <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
            :to="{ name: 'ProvinciasVistas', params: { id: provincia.provincia } }">
            <div class="relative w-[140px] h-[200px]">
              <img :src="provincia.thumbnail" :alt="`Imagen de ${provincia.provincia}`"
                class="w-full h-full object-cover rounded-lg" />
              <p class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
                {{ provincia.provincia }}
              </p>
            </div>
          </RouterLink>
        </div>

        <div v-else>
          <p class="text-[#7E2323]">No hay provincias populares disponibles en este momento.</p>
        </div>
      </section>
    </template>
  </div>
</template>
