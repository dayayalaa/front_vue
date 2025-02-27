<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TituloTerciario from '../components/TituloTerciario.vue';
import SpinnerCarga from './SpinnerCarga.vue';

const userName = ref('');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const provincia = ref('');
const telefono = ref('');
const userId = ref('');
const reservas = ref([]);
const cargando = ref(true);

const router = useRouter();
const activeAccordion = ref(null);

const toggle = (index) => {
  activeAccordion.value = activeAccordion.value === index ? null : index;
};

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
    cargando.value = false;
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

const obtenerReservas = async () => {
  // console.log('Guía: ', userId);
  const idGuia = userId.value;
  // console.log('Id del guía: ', idGuia);

  if (!idGuia) {
    console.error('Error: ID del guía no definido');
    return;
  }

  try {
    const url = `https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/guia/${idGuia}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    // console.log('Reservas encontradas:', response.data);

    if (response.data && Array.isArray(response.data.data)) {
      reservas.value = await Promise.all(
        response.data.data.map(async (reserva) => {
          if (!reserva.tourId?._id) {
            console.warn('Advertencia: tourId no encontrado en la reserva', reserva);
            return reserva;
          }
          const tourData = await obtenerTourData(reserva.tourId._id);
          return {
            ...reserva,
            tour: tourData,
          };
        })
      );
    } else {
      // console.log('No se encontraron reservas para el guía.');
    }
  } catch (error) {
    console.error('Error al obtener las reservas:', error.response?.data || error.message);
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
    cargando.value = false;
    router.push('/login');
  }
});
</script>

<template>
  <div v-if="reservasPorTour.length > 0" class="p-3">
    <SpinnerCarga v-if="cargando" />

    <ul class="space-y-6">
      <li v-for="grupo in reservasPorTour" :key="grupo.tour._id"
        class="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">

        <div @click="toggle(grupo.tour._id)" class="cursor-pointer flex md:flex-row items-center md:items-start gap-4">

          <img v-if="grupo.tour.fotoPortada" :src="grupo.tour.fotoPortada" alt="Foto de perfil del tour"
            class="w-24 h-24 rounded-lg object-cover" />

          <div class="flex-1">
            <strong class="text-xm text-[#222725] block">
              {{ grupo.tour.titulo }}
            </strong>
          </div>

          <svg v-bind:class="{ 'rotate-180': activeAccordion === grupo.tour._id }" xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-gray-600 transition-transform duration-200" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>

        <div v-if="activeAccordion === grupo.tour._id" class="mt-6">
          <TituloTerciario class="text-xl text-gray-800 font-semibold mb-4">
            Reservas
          </TituloTerciario>

          <div v-for="(reserva, index) in grupo.reservas" :key="reserva._id"
            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 mb-2">

            <div class="flex justify-arown items-center">
              <img v-if="reserva.userId.fotoPerfil" :src="reserva.userId.fotoPerfil" alt="Foto de perfil del tour"
                class="w-24 h-24 rounded-lg object-cover" />

              <div class="ps-6">
                <p class="text-[#788A68] font-medium">Nombre:</p>
                <p class="text-[#222725]">{{ reserva.userId?.nombre || 'Nombre no disponible' }}</p>
                <p class="text-[#788A68] font-medium">Email:</p>
                <p class="text-[#222725]">{{ reserva.userId?.email || 'Email no disponible' }}</p>
                <p class="text-[#788A68] font-medium">Fecha de reserva:</p>
                <p class="text-[#222725]">
                  {{ reserva.fechaReserva ? new Date(reserva.fechaReserva).toLocaleDateString() : 'Fecha no disponible'
                  }}
                </p>
                <p class="text-[#788A68] font-medium">Personas: {{ reserva.cantidadPersonas }}</p>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <div v-else class="mt-10 text-center text-gray-500 text-lg">
    No tienes reservas aún.
  </div>
</template>