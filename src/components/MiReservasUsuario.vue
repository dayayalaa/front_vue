<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TituloTerciario from '../components/TituloTerciario.vue';

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const provincia = ref('');
const telefono = ref('');
const userId = ref('');
const reservas = ref([]);
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
    loading.value = false;
  }
};

const obtenerTourData = async (tourId) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos del tour:', error);
    return null;
  }
};

const obtenerReservas = async (idGuia) => {
  if (!idGuia) {
    console.error('Error: idGuia es inválido o está vacío');
    return;
  }
  try {
    const response = await axios.get(
      `https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/guia/${idGuia}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    reservas.value = await Promise.all(
      response.data.data.map(async (reserva) => {
        const tourData = await obtenerTourData(reserva.tourId._id);
        return {
          ...reserva,
          tour: tourData,
        };
      })
    );
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
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

    const decodedToken = JSON.parse(decodeURIComponent(jsonPayload));
    return decodedToken;
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

const verificarRolGuia = (decodedToken) => {
  if (decodedToken.rols !== 'guia') {
    router.push('/');
    return false;
  }
  return true;
};

const reservasPorTour = computed(() => {
  const grupos = {};
  if (reservas.value && Array.isArray(reservas.value)) {
    reservas.value.forEach((reserva) => {
      if (!grupos[reserva.tourId._id]) {
        grupos[reserva.tourId._id] = {
          tour: reserva.tourId,
          reservas: [],
        };
      }
      grupos[reserva.tourId._id].reservas.push(reserva);
    });
  }
  return Object.values(grupos);
});

onMounted(async () => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = decodeJWT(token);

    if (decodedToken && decodedToken.userId) {
      if (!verificarRolGuia(decodedToken)) {
        return;
      }

      userId.value = decodedToken.userId;
      await fetchUserData();
      await obtenerReservas(userId.value);
    }
  } else {
    loading.value = false;
    router.push('/login');
  }
});
</script>

<template>
  <div class="max-w-3xl mx-auto p-6 mb-16 bg-white rounded-xl shadow-xl border border-gray-200">
    <div v-if="reservasPorTour.length > 0" class="mt-10 space-y-10"> 
      <ul class="space-y-6">
        <li v-for="grupo in reservasPorTour" :key="grupo.tour._id" class="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-4">
            <!-- Foto de perfil del tour -->
            <img v-if="grupo.tour.fotoPerfil" :src="grupo.tour.fotoPerfil" alt="Foto de perfil del tour"
              class="w-24 h-24 rounded-full object-cover shadow-md" />

            <!-- Foto de portada del tour -->
            <div v-if="grupo.tour.fotoPortada" class="w-full h-56 md:h-72 rounded-lg overflow-hidden">
              <img :src="grupo.tour.fotoPortada" alt="Foto del tour"
                class="w-full h-full object-cover shadow-md" />
            </div>
            <p v-if="!grupo.tour.fotoPortada" class="text-red-500">¡Foto de portada no disponible!</p>

            <div class="flex-1 text-center md:text-left">
              <strong class="text-xl text-gray-900 block">
                {{ grupo.tour.titulo }}
              </strong>
              <p class="text-gray-600 text-sm mt-2 text-left">
                {{ grupo.tour.descripcion || 'Descripción no disponible' }}
              </p>
            </div>
          </div>

          <!-- Reservas -->
          <div v-if="grupo.reservas.length > 0" class="mt-6">
            <TituloTerciario class="text-xl text-gray-800 font-semibold mb-4">
              Reservas
            </TituloTerciario>
            <ul class="space-y-4">
              <li v-for="reserva in grupo.reservas" :key="reserva._id"
                class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex items-center gap-4">
                <div v-if="reserva.userId && reserva.userId.fotoPerfil">
                  <img :src="reserva.userId.fotoPerfil" alt="Foto de perfil" class="w-12 h-12 rounded-full object-cover border-2 border-gray-300" />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <p class="text-gray-700 font-medium">Usuario:</p>
                    <p class="text-gray-900 font-semibold">{{ reserva.userId?.nombre || 'Nombre no disponible' }}</p>
                  </div>
                  <div class="flex justify-between mt-2">
                    <p class="text-gray-700 font-medium">Email:</p>
                    <p class="text-gray-900">{{ reserva.userId?.email || 'Email no disponible' }}</p>
                  </div>
                  <div class="flex justify-between mt-2">
                    <p class="text-gray-700 font-medium">Fecha de reserva:</p>
                    <p class="text-gray-900">
                      {{ reserva.fechaReserva ? new Date(reserva.fechaReserva).toLocaleDateString() : 'Fecha no disponible' }}
                    </p>
                  </div>
                  <div class="flex justify-between mt-2">
                    <p class="text-gray-700 font-medium">Personas:</p>
                    <p class="text-gray-900">{{ reserva.cantidadPersonas }}</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <!-- Mensaje si no hay reservas -->
    <div v-else class="mt-10 text-center text-gray-500 text-lg">
      No tienes reservas aún.
    </div>
  </div>
</template>



