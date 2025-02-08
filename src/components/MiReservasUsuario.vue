<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
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


const obtenerReservas = async (idGuia) => {
  try {
    const response = await axios.get(
      `https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/guia/${idGuia}`,
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
    );
    reservas.value = response.data.data;
    console.log('Reservas obtenidas:', reservas.value);
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
    console.log('Token decodificado:', decodedToken);
    return decodedToken;
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

const verificarRolGuia = (decodedToken) => {
  if (decodedToken.rols !== 'guia') {
    console.log('Usuario no es guía. Redirigiendo...');
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
  <IrAtras />
  <div class="max-w-4xl mx-auto p-6 mb-20 bg-white rounded-xl shadow-lg">
    <!-- Banner de perfil -->
    <div class="relative mb-16">
      <img v-if="userCoverImage" :src="userCoverImage" alt="Banner de perfil"
        class="w-full h-52 object-cover rounded-lg shadow-md" />
      <div class="absolute inset-x-0 -bottom-12 flex justify-center">
        <img v-if="userProfileImage" :src="userProfileImage" alt="Foto de perfil"
          class="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
      </div>
    </div>

    <!-- Información de usuario -->
    <div class="text-center mt-6">
      <TituloSecundario class="text-2xl font-bold text-gray-900">
        {{ loading ? 'Cargando...' : userName }}
      </TituloSecundario>
      <p v-if="descripcion" class="text-gray-600 mt-2 text-base max-w-md mx-auto">
        {{ descripcion }}
      </p>
      <div v-if="provincia || telefono" class="mt-4 flex justify-center gap-6">
        <p v-if="provincia" class="flex items-center text-gray-700 font-medium">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {{ provincia }}
        </p>
        <p v-if="telefono" class="flex items-center text-gray-700 font-medium">
          <svg class="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          {{ telefono }}
        </p>
      </div>
    </div>

    <!-- Lista de Reservas por Tour -->
    <div v-if="reservasPorTour.length > 0" class="mt-10">
      <TituloSecundario class="text-xl font-bold text-gray-900 mb-6">
        Reservas de tus Tours
      </TituloSecundario>
      <ul class="space-y-6">
        <li v-for="grupo in reservasPorTour" :key="grupo.tour._id"
          class="bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200">
          <div class="flex flex-col md:flex-row items-center md:items-start gap-4">
            <!-- Imagen del Tour -->
            <img v-if="grupo.tour.fotoPortada" :src="grupo.tour.fotoPortada" alt="Foto del tour"
              class="w-28 h-28 rounded-lg object-cover shadow-sm" />
            <!-- Información del Tour -->
            <div class="flex-1 text-center md:text-left">
              <strong class="text-lg text-gray-900 block">
                {{ grupo.tour.titulo }}
              </strong>
              <p class="text-gray-600 text-sm mt-1 line-clamp-2">
                {{ grupo.tour.descripcion }}
              </p>
            </div>
          </div>

          <!-- Lista de reservas -->
          <div v-if="grupo.reservas.length > 0" class="mt-6">
            <TituloTerciario class="text-lg text-gray-800 font-semibold mb-4">
              Reservas
            </TituloTerciario>
            <ul class="space-y-4">
              <li v-for="reserva in grupo.reservas" :key="reserva._id"
                class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p class="text-gray-700 font-medium">Reservado por:</p>
                    <p class="text-gray-900 font-semibold">{{ reserva.userId.nombre }}</p>
                  </div>
                  <div>
                    <p class="text-gray-700 font-medium">Email:</p>
                    <p class="text-gray-900">{{ reserva.userId.email }}</p>
                  </div>
                  <div>
                    <p class="text-gray-700 font-medium">Fecha de reserva:</p>
                    <p class="text-gray-900">
                      {{ new Date(reserva.fechaReserva).toLocaleDateString() }}
                    </p>
                  </div>
                  <div>
                    <p class="text-gray-700 font-medium">Personas:</p>
                    <p class="text-gray-900">{{ reserva.cantidadPersonas }}</p>
                  </div>
                  <div>
                    <p class="text-gray-700 font-medium">Estado:</p>
                    <span class="px-2 py-1 rounded-md text-sm font-semibold" :class="{
                      'text-green-700 bg-green-100': reserva.estado === 'Confirmada',
                      'text-red-700 bg-red-100': reserva.estado === 'Cancelada',
                      'text-yellow-700 bg-yellow-100': reserva.estado === 'Pendiente'
                    }">
                      {{ reserva.estado }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>


    <!-- Mensaje si no hay reservas -->
    <div v-else class="text-center text-gray-600 mt-10">
      <p class="text-lg font-medium">No hay reservas para mostrar.</p>
      <p class="text-sm mt-2">Cuando alguien reserve tus tours, aparecerán aquí.</p>
    </div>
  </div>
</template>
