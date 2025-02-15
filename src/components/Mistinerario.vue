<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloSecundario from './TituloSecundario.vue';
import IconoMas from './icons/IconoMas.vue';

const userId = ref(null);
const itinerarios = ref([]);
const loading = ref(true);

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
  } catch (error) {
    console.error('Error al obtener los itinerarios:', error);
  } finally {
    loading.value = false;
  }
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
    loading.value = false;
  }
});
</script>

<template>
  <div class="w-full mb-16">
    <div class="flex justify-between m-3">
      <TituloSecundario>Mi itinerario:</TituloSecundario>
    </div>

    <div v-if="loading" class="text-center text-gray-500">Cargando itinerarios...</div>

    <div v-else class="overflow-x-auto">
      <div v-if="itinerarios.length > 0" class="flex gap-4 ml-3">
        <router-link v-for="itinerario in itinerarios" :key="itinerario._id"
          :to="{ path: `/itinerario/${itinerario._id}` }" class="flex flex-col justify-between items-center w-[150px]">

          <div class="w-[150px] h-[150px] overflow-hidden">
            <img :src="itinerario.img || '/img/default_portada.png'" :alt="itinerario.alt"
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
        No tienes itinerarios aún. <router-link to="/crear" class="text-blue-500 hover:underline">Crea uno
          aquí</router-link>.
      </div>
    </div>
  </div>
</template>
