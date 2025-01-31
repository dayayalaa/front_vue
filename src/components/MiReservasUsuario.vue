<script setup>
import { ref, onMounted } from 'vue';
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
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/segunGuia?id=${idGuia}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    reservas.value = response.data;
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
    console.log('Token decodificado:', decodedToken); // Depuración
    return decodedToken;
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

const verificarRolGuia = (decodedToken) => {
  // Asegúrate de que el rol sea 'guide' (o el valor correcto que uses)
  if (decodedToken.role !== 'guide') {
    console.log('Usuario no es guía. Redirigiendo...'); // Depuración
    router.push('/'); // Redirige si no es guía
    return false;
  }
  return true;
};

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
      await obtenerReservas(userId.value);
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

    <!-- Lista de Reservas -->
    <div v-if="reservas.length > 0" class="mt-8">
      <TituloSecundario class="text-xl font-semibold text-gray-800 mb-4">
        Reservas de tus Tours
      </TituloSecundario>
      <ul class="space-y-4">
        <li
          v-for="reserva in reservas"
          :key="reserva._id"
          class="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <div class="flex flex-col">
            <div class="flex-1 mb-4">
              <strong class="text-lg text-gray-800">{{ reserva.tour.titulo }}</strong>
              <p class="text-gray-600 text-sm mt-1">{{ reserva.tour.descripcion }}</p>
            </div>
            <div class="text-gray-600 text-sm">
              <p><strong>Reservado por:</strong> {{ reserva.usuario.nombre }}</p>
              <p><strong>Email:</strong> {{ reserva.usuario.email }}</p>
              <p><strong>Teléfono:</strong> {{ reserva.usuario.telefono }}</p>
              <p><strong>Fecha de reserva:</strong> {{ reserva.fechaReserva }}</p>
              <p><strong>Personas:</strong> {{ reserva.cantidadPersonas }}</p>
              <p><strong>Estado:</strong> {{ reserva.estado }}</p>
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