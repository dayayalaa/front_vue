<script setup>
import { ref, onMounted } from 'vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';
import { useRouter } from 'vue-router'; 

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const provincia = ref('');
const telefono = ref('');
const userId = ref('');
const loading = ref(true);

const router = useRouter();  

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
    userName.value = data.data.nombre;
    userProfileImage.value = data.data.fotoPerfil;
    userCoverImage.value = data.data.fotoPortada;
    descripcion.value = data.data.descripcion;
    email.value = data.data.email;
    telefono.value = data.data.telefono;
    provincia.value = data.data.provincia;

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
      userId.value = decodedToken.userId;
      fetchUserData();
    } catch (error) {
      console.error('Error decodificando el token:', error);
      loading.value = false;
    }
  }
});

const goToCreateTour = () => {
  router.push('/crearTur'); 
};
</script>

<template>
  <IrAtras />
  <div class="max-w-md mx-auto p-4 mb-20">
    <div class="relative mb-4">
      <img :src="userCoverImage" alt="Banner de perfil"
        class="w-full h-32 object-cover rounded-lg border-2 border-gray-300" />

      <div class="absolute inset-x-0 top-16 flex justify-center">
        <img :src="userProfileImage" alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md" />
      </div>
    </div>

    <div class="text-center mb-4 mt-20">
      <TituloSecundario class="text-2xl">{{ loading ? 'Cargando...' : userName }}</TituloSecundario>
      <p>{{ descripcion }}</p>
      <p><strong>{{ provincia }}</strong></p>
      <TituloTerciario>Datos personales</TituloTerciario>
        <ul>
          <li>{{ email }}</li>
          <li>{{ telefono }}</li>
        </ul>
    </div>
    

    <div class="flex justify-center mt-24">
      <BotonPrincipal @click="goToCreateTour">
        Crear Tur
      </BotonPrincipal>
    </div>
  </div>
</template>
