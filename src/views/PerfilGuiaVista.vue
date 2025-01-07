<script setup>
import { ref, onMounted } from 'vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const provincia = ref('');
const telefono = ref('');
const userId = ref('');
const tours = ref([]);
const loading = ref(true);

const router = useRouter();

const fetchUserData = async () => {
  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los datos del usuario');
    }

    const data = await response.json();
    const { nombre, fotoPerfil, fotoPortada, descripcion: desc, email: correo, telefono: tel, provincia: prov } =
      data.data;

    userName.value = nombre;
    userProfileImage.value = fotoPerfil;
    userCoverImage.value = fotoPortada;
    descripcion.value = desc;
    email.value = correo;
    telefono.value = tel;
    provincia.value = prov;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const obtenerTours = async (id) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/segunGuia?id=${id}`);
    tours.value = response.data;
  } catch (error) {
    console.error('Error al obtener los tours del guía:', error);
  }
};

const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');

    return JSON.parse(decodeURIComponent(jsonPayload));
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

onMounted(async () => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = decodeJWT(token);

    if (decodedToken && decodedToken.userId) {
      userId.value = decodedToken.userId;
      await fetchUserData();
      await obtenerTours(userId.value);
    }
  } else {
    loading.value = false;
  }
});

const goToCreateTour = () => {
  router.push('/crearTur');
};

const eliminarTour = async (tourId) => {
  try {
    const response = await axios.delete(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    if (response.status === 200) {
      tours.value = tours.value.filter((tour) => tour._id !== tourId);
    }
  } catch (error) {
    console.error('Error al eliminar el tour:', error);
  }
};
</script>

<template>
  <IrAtras />
  <div class="max-w-md mx-auto p-4 mb-20">
    <div class="relative mb-4">
      <img
        v-if="userCoverImage"
        :src="userCoverImage"
        alt="Banner de perfil"
        class="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
      />

      <div class="absolute inset-x-0 top-16 flex justify-center">
        <img
          v-if="userProfileImage"
          :src="userProfileImage"
          alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
      </div>
    </div>

    <div class="text-center mb-4 mt-20">
      <TituloSecundario class="text-2xl">{{ loading ? 'Cargando...' : userName }}</TituloSecundario>
      <p v-if="descripcion">{{ descripcion }}</p>
      <p v-if="provincia"><strong>{{ provincia }}</strong></p>
      <TituloTerciario>Datos personales</TituloTerciario>
      <ul>
        <li v-if="email">{{ email }}</li>
        <li v-if="telefono">{{ telefono }}</li>
      </ul>
    </div>

    <div class="flex justify-center mt-24">
      <BotonPrincipal @click="goToCreateTour">
        Crear Tur
      </BotonPrincipal>
    </div>

    <div v-if="tours.length > 0" class="mt-6">
      <TituloSecundario class="text-xl">Tours Disponibles</TituloSecundario>
      <ul class="space-y-4 mt-4">
        <li
          v-for="tour in tours"
          :key="tour._id"
          class="bg-white p-4 rounded-lg shadow-md"
        >
          <div class="flex justify-between">
            <div>
              <strong class="text-lg">{{ tour.titulo }}</strong>
              <p class="text-gray-600">{{ tour.descripcion }}</p>
              <p><strong>Precio:</strong> {{ tour.precio }} ARS</p>
              <p><strong>Duración:</strong> {{ tour.duracion }}</p>
            </div>

            <div class="flex space-x-4 mt-4">
              <!-- Botón Editar -->
              <router-link to="">
                <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Editar
                </button>
              </router-link>

              <!-- Botón Eliminar -->
              <button
                @click="eliminarTour(tour._id)"
                class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>
