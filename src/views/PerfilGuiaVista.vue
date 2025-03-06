<script setup>
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ref, onMounted } from 'vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';
import MiReservasUsuario from '../components/MiReservasUsuario.vue';

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const provincia = ref('');
const telefono = ref('');
const userId = ref('');
const tours = ref([]);
const cargando = ref(true);
const router = useRouter();

// Estados para el modal de confirmación
const showModal = ref(false);
const tourToDelete = ref(null);

const fetchUserData = async () => {
  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos del usuario: ${response.statusText}`);
    }
    const data = await response.json();
    if (!data.data) {
      throw new Error('La API no devolvió datos válidos.');
    }
    const { nombre, fotoPerfil, fotoPortada, descripcion: desc, email: correo, telefono: tel, provincia: prov } = data.data;
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
    cargando.value = false;
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
    cargando.value = false;
  }
});

const goToCreateTour = () => {
  router.push('/crearTur');
};

// Función para abrir el modal de confirmación
const confirmDelete = (tourId) => {
  tourToDelete.value = tourId;
  showModal.value = true;
};

// Función para eliminar el tour después de confirmar
const eliminarTourConfirmado = async () => {
  if (tourToDelete.value) {
    try {
      const response = await axios.delete(
        `https://back-tesis-lovat.vercel.app/arcana/tur/${tourToDelete.value}`,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (response.status === 200) {
        tours.value = tours.value.filter((tour) => tour._id !== tourToDelete.value);
      }
    } catch (error) {
      console.error('Error al eliminar el tour:', error);
    } finally {
      showModal.value = false;
      tourToDelete.value = null;
    }
  }
};

// Función para cancelar la eliminación
const cancelarEliminacion = () => {
  showModal.value = false;
  tourToDelete.value = null;
};
</script>

<template>
  <IrAtras />
  <div class="max-w-md mx-auto p-4 mb-20">
    <div class="relative mb-4">
      <img :src="userCoverImage" alt="Banner de perfil"
        class="w-full h-36 object-cover rounded-lg border-2 border-gray-300" />
      <div class="absolute inset-x-0 top-16 flex justify-center">
        <img :src="userProfileImage" alt="Foto de perfil"
          class="w-32 h-32 object-cover rounded-full border-4 border-white shadow-md" />
      </div>
    </div>

    <!-- Información de usuario -->
    <div class="text-center mb-8 mt-16">
      <TituloSecundario class="text-2xl font-semibold text-gray-800">
        {{ userName }}
      </TituloSecundario>

      <p v-if="descripcion" class="text-gray-600 mt-2 ms-3 me-2 text-sm text-left">{{ descripcion }}</p>
      <p v-if="provincia" class="text-gray-700 font-medium mt-1">{{ provincia }}</p>
    </div>

    <!-- Datos personales -->
    <div class="bg-gray-100 p-4 rounded-lg shadow-sm mb-8">
      <TituloTerciario class="text-lg text-gray-700 font-semibold">
        Datos personales
      </TituloTerciario>
      <ul class="mt-2 text-gray-600 text-sm">
        <li v-if="email" class="mb-1">
          <strong class="text-[#A86A36]">Email:</strong> {{ email }}
        </li>
        <li v-if="telefono" class="mb-1">
          <strong class="text-[#A86A36]">Teléfono:</strong> {{ telefono }}
        </li>
      </ul>
    </div>

    <!-- Botón Crear Tour -->
    <div class="flex justify-center mt-6 mb-8">
      <BotonPrincipal class="w-3/4 py-3 text-sm" @click="goToCreateTour">
        Crear Tour
      </BotonPrincipal>
    </div>

    <!-- Lista de Tours Disponibles -->
    <div v-if="tours.length > 0" class="mt-8">
      <TituloSecundario class="text-xl font-semibold text-gray-800 mb-4">
        Tours Disponibles
      </TituloSecundario>
      <ul class="space-y-4">
        <li v-for="tour in tours" :key="tour._id" class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
          <div class="flex flex-col">
            <div class="flex-1 mb-4">
              <strong class="text-lg text-gray-800">{{ tour.titulo }}</strong>
              <p class="text-gray-600 text-sm mt-1">{{ tour.descripcion }}</p>
            </div>

            <!-- Botones abajo de todo -->
            <div class="flex space-x-3 mt-4">
              <router-link :to="`/vistaTur/${tour._id}`"
                class="px-4 py-2 flex items-center bg-[#788A68] text-white text-sm rounded ">
                <i class="fas fa-eye mr-2"></i> Ver
              </router-link>

              <router-link :to="`/editarTur/${tour._id}`"
                class="px-4 py-2 flex items-center bg-[#A86A36] text-white text-sm rounded ">
                <i class="fas fa-edit mr-2"></i> Editar
              </router-link>

              <button @click="confirmDelete(tour._id)"
                class="px-4 py-2 flex items-center bg-[#7E2323] text-white text-sm rounded">
                <i class="fas fa-trash-alt mr-2"></i> Eliminar
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <p v-else class="text-center text-gray-600 mt-4">No hay tours disponibles.</p>

    <TituloSecundario class="mt-12 text-2xl font-semibold text-gray-800 mb-4">
      Reservas de tus Tours
    </TituloSecundario>
    <MiReservasUsuario />

    <!-- Modal de confirmación -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-3">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro de eliminar este tour?</h3>
        <div class="flex justify-end space-x-4">
          <button @click="cancelarEliminacion" class="px-4 py-2 bg-[#788A68] text-white rounded hover:bg-gray-400">
            Cancelar
          </button>
          <button @click="eliminarTourConfirmado" class="px-4 py-2 bg-[#7E2323] text-white rounded hover:bg-[#6A1C1C]">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>