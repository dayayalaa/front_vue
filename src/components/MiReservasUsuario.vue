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

// Obtener datos del usuario
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

// Obtener las reservas asociadas a los tours del guía
const obtenerReservas = async (idGuia) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservasTour/tours`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    // Filtrar las reservas por el ID del guía
    reservas.value = response.data.data.filter((reserva) => reserva.tourId.guia === idGuia);
    console.log('Reservas obtenidas:', reservas.value); // Depuración
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
  }
};

// Decodificar el token JWT
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');

    const decodedToken = JSON.parse(decodeURIComponent(jsonPayload));
    console.log('Token decodificado:', decodedToken); // Depuración
    return decodedToken;
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

// Verificar si el usuario es un guía
const verificarRolGuia = (decodedToken) => {
  if (decodedToken.rols !== 'guia') { // Cambia 'role' por 'rols' y 'guide' por 'guia'
    console.log('Usuario no es guía. Redirigiendo...'); // Depuración
    router.push('/'); // Redirige si no es guía
    return false;
  }
  return true;
};

// Agrupar reservas por tour
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
      // Verifica si el usuario es un guía
      if (!verificarRolGuia(decodedToken)) {
        return; // Detiene la ejecución si no es guía
      }

      userId.value = decodedToken.userId;
      await fetchUserData();
      await obtenerReservas(userId.value); // Obtener las reservas del guía
    }
  } else {
    loading.value = false;
    router.push('/login'); // Redirige al login si no hay token
  }
});
</script>

<template>
  <IrAtras />
  <div class="max-w-4xl mx-auto p-4 mb-20">
    <!-- Banner de perfil -->
    <div class="relative mb-8">
      <img
        v-if="userCoverImage"
        :src="userCoverImage"
        alt="Banner de perfil"
        class="w-full h-40 object-cover rounded-lg border border-gray-200 shadow-sm"
      />
      <div class="absolute inset-x-0 top-20 flex justify-center">
        <img
          v-if="userProfileImage"
          :src="userProfileImage"
          alt="Foto de perfil"
          class="w-28 h-28 rounded-full border-4 border-white shadow-md"
        />
      </div>
    </div>

    <!-- Información de usuario -->
    <div class="text-center mb-8">
      <TituloSecundario class="text-2xl font-semibold text-gray-800">
        {{ loading ? 'Cargando...' : userName }}
      </TituloSecundario>
      <p v-if="descripcion" class="text-gray-600 mt-2 text-sm">{{ descripcion }}</p>
      <p v-if="provincia" class="text-gray-700 font-medium mt-1">{{ provincia }}</p>
    </div>

    <!-- Lista de Reservas por Tour -->
    <div v-if="reservasPorTour.length > 0" class="mt-8">
      <TituloSecundario class="text-xl font-semibold text-gray-800 mb-4">
        Reservas de tus Tours
      </TituloSecundario>
      <ul class="space-y-4">
        <li
          v-for="grupo in reservasPorTour"
          :key="grupo.tour._id"
          class="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <div class="flex flex-col">
            <div class="flex-1 mb-4">
              <strong class="text-lg text-gray-800">{{ grupo.tour.titulo }}</strong>
              <p class="text-gray-600 text-sm mt-1">{{ grupo.tour.descripcion }}</p>
            </div>

            <!-- Lista de reservas para este tour -->
            <div v-if="grupo.reservas.length > 0" class="mt-4">
              <TituloTerciario class="text-lg text-gray-700 font-semibold">
                Reservas
              </TituloTerciario>
              <ul class="space-y-2 mt-2">
                <li
                  v-for="reserva in grupo.reservas"
                  :key="reserva._id"
                  class="bg-gray-50 p-3 rounded-lg"
                >
                  <p><strong>Reservado por:</strong> {{ reserva.usuario.nombre }}</p>
                  <p><strong>Email:</strong> {{ reserva.usuario.email }}</p>
                  <p><strong>Teléfono:</strong> {{ reserva.usuario.telefono }}</p>
                  <p><strong>Fecha de reserva:</strong> {{ reserva.fechaReserva }}</p>
                  <p><strong>Personas:</strong> {{ reserva.cantidadPersonas }}</p>
                  <p><strong>Estado:</strong> {{ reserva.estado }}</p>
                </li>
              </ul>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- Mensaje si no hay reservas -->
    <div v-else class="text-center text-gray-600 mt-8">
      No hay reservas para mostrar.
    </div>
  </div>
</template>