<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloSecundario from './TituloSecundario.vue';
import IconoMas from './icons/IconoMas.vue';
import SpinnerCarga from './SpinnerCarga.vue';


const userId = ref(null);
const itinerarios = ref([]);
const cargando = ref(true);
const lugaresTuristicos = ref([]);
const provinciaInfo = ref({ gallery: [] });

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

const fetchUserData = async () => {
  try {
    if (!userId.value) return;

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/usuario/${userId.value}`);
    itinerarios.value = response.data.data;

    itinerarios.value.forEach(async (itinerario) => {
      await obtenerProvincia(itinerario.destino);
      itinerario.thumbnail = provinciaInfo.value.thumbnail || '/img/default_portada.png';
    });

  } catch (error) {
    console.error('Error al obtener los itinerarios:', error);
  } finally {
    cargando.value = false;
  }
};


const obtenerProvincia = async (provincia) => {
  //console.log('Buscando lugares turísticos para la provincia:', provincia);
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/provincia?provincia=${provincia}`);

    //console.log('Estructura de response.data:', response.data);

    if (response && response.data) {
      provinciaInfo.value = {
        title: response.data.title,
        address: response.data.address,
        description: response.data.description?.snippet || 'No disponible',
        thumbnail: response.data.thumbnail,
      };

      const data_id = response.data.data_id;
      //console.log('data_id:', data_id);
      obtenerImagenes(data_id);
    } else {
      console.error('Formato inesperado en la respuesta de la API');
    }
  } catch (error) {
    console.error('Error al obtener lugares turísticos:', error);
  }
};

const obtenerImagenes = async (data_id) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${data_id}`);
    //console.log('Respuesta de la API img:', response.data);

    if (response.data && response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
      const validImage = response.data.images.find(image => isValidImage(image));
      provinciaInfo.value.thumbnail = validImage || '/img/default_portada.png'; 
    } else {
      console.warn('No se encontraron imágenes, se asignará una imagen predeterminada');
      provinciaInfo.value.thumbnail = '/img/default_portada.png'; 
    }
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    provinciaInfo.value.thumbnail = '/img/default_portada.png';
  }
};


const isValidImage = (image) => {
  return image && image.startsWith('http');
};

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = decodeJWT(token);

    if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
      userId.value = decodedToken.userId;
      fetchUserData();
    } else {
      console.warn('Token expirado o inválido');
      localStorage.removeItem('token');
    }
  } else {
    cargando.value = false;
  }
});
</script>

<template>
  <div class="w-full mb-16">
    <div class="flex justify-between m-3">
      <TituloSecundario>Mi itinerario:</TituloSecundario>
    </div>

    <SpinnerCarga v-if="cargando" />

    <div v-else class="overflow-x-auto">
      <div v-if="itinerarios.length > 0" class="flex gap-4 ml-3">
        <router-link v-for="itinerario in itinerarios" :key="itinerario._id"
          :to="{ path: `/itinerario/${itinerario._id}` }" class="flex flex-col justify-between items-center w-[150px]">

          <!-- Mostrar la imagen del destino -->
          <div class="w-[150px] h-[150px] overflow-hidden">
            <img :src="itinerario.thumbnail || '/img/default_portada.png'" :alt="itinerario.destino"
              class="w-full h-full object-cover rounded-lg" />
          </div>

          <p class="text-center mt-2 text-sm">{{ itinerario.destino }}</p>
        </router-link>

        <router-link to="/crear">
          <div
            class="w-[150px] h-[150px] flex-none rounded-lg border border-gray-600 flex items-center justify-center hover:bg-gray-100 transition">
            <IconoMas class="w-20 h-20 text-gray-600" />
          </div>
        </router-link>
      </div>

      <!-- Mensaje si no hay itinerarios -->
      <div v-else class="text-center text-gray-500 mt-4">
        No tienes itinerarios aún. <router-link to="/crear" class="text-[#A86A36] hover:underline">Crea uno
          aquí</router-link>.
      </div>
    </div>
  </div>
</template>
