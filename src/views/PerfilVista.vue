<script setup>
import { ref, onMounted } from 'vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import Mistinerario from '../components/Mistinerario.vue';
import IrAtras from '../components/IrAtras.vue';
import IconoMapa from '../components/icons/IconoMapa.vue';

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const userDescripcion = ref('');
const userProvincia = ref('');
const userId = ref('');
const loading = ref(true);

const fetchUserData = async () => {
  if (!userId.value) {
    console.error('No se encontró el ID del usuario');
    return;
  }

  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const data = await response.json();
    // console.log('Respuesta de la API:', data);

    userName.value = data.data.nombre;
    userProfileImage.value = data.data.fotoPerfil;
    userCoverImage.value = data.data.fotoPortada;
    userDescripcion.value = data.data.descripcion;
    userProvincia.value = data.data.provincia;

    loading.value = false;
  } catch (error) {
    console.error(error);
    loading.value = false;
  }
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      // console.log('Token decodificado:', decodedToken);
      userId.value = decodedToken.userId;
      fetchUserData();
    } catch (error) {
      console.error('Error decodificando el token:', error);
      loading.value = false;
    }
  }
});
</script>

<template>
  <IrAtras />
  <div class="max-w-md mx-auto p-2">

    <div class="relative mb-4">
      <img :src="userCoverImage" alt="Banner de perfil"
        class="w-full h-36 object-cover rounded-lg border-2 border-gray-300" />

      <div class="absolute inset-x-0 top-16 flex justify-center">
        <img :src="userProfileImage" alt="Foto de perfil"
          class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md" />
      </div>

    </div>

    <div class="text-center mb-4 mt-16">
      <TituloSecundario class="text-2xl">{{ loading ? 'Cargando...' : userName }}</TituloSecundario>
      <p>{{ userDescripcion }}</p>
      <p><strong>Ubicación: </strong>{{ userProvincia }}</p>
    </div>

    <Mistinerario />

  <div class="flex justify-center items-center mb-8">
    <div class="relative">
      <div class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center z-20 bg-[#3C4A28] bg-opacity-50 rounded-lg px-2 py-1 m-2">
        <div class="text-white text-xl font-bold">Próximamente</div>
      </div>

      <div class="flex flex-col items-center justify-between p-4 bg-white rounded-lg shadow-lg text-[#3C4A28] w-48 h-36 relative">
        <IconoMapa class="w-12 h-12 text-[#3C4A28] fill-current" />
        <TituloSecundario class="text-sm text-gray-700">Ver mi mapa</TituloSecundario>
      </div>
    </div>
  </div>

  </div>
</template>
