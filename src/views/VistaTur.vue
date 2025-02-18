<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import axios from 'axios';

const tour = ref(null);
const cantidadPersonas = ref(1);
const reservaExitosa = ref(false);
const loading = ref(true);
const isUser = ref(false);
const isGuia = ref(false);
const errorMessage = ref('');

const route = useRoute();
const tourId = route.params.id;

const guiaName = ref('');
const guiaProfileImage = ref('');
const guiaDescription = ref('');
const guiaEmail = ref('');
const guiaTelefono = ref('');
const guiaProvincia = ref('');
const guiasId = ref('');

const fetchGuiaData = async (guiaId) => {
  try {
    if (!guiaId) {
      throw new Error('ID del guía no válido');
    }

    const url = `https://back-tesis-lovat.vercel.app/arcana/usuarios/${guiaId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del guía: ${response.statusText}`);
    }

    const data = await response.json();
    const { nombre, fotoPerfil, descripcion, email, telefono, provincia, _id } = data.data;

    guiaName.value = nombre;
    guiaProfileImage.value = fotoPerfil;
    guiaDescription.value = descripcion;
    guiaEmail.value = email;
    guiaTelefono.value = telefono;
    guiaProvincia.value = provincia;
    guiasId.value = _id;

    console.log('ID del guía:', guiaId.value);
  } catch (error) {
    console.error('Error al obtener los datos del guía:', error);
  }
};

const fetchTourData = async () => {
  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);
    if (!response.ok) {
      throw new Error('No se pudo encontrar el tour');
    }
    const data = await response.json();
    tour.value = data;

    if (tour.value && tour.value.guia) {
      await fetchGuiaData(tour.value.guia);
    }
  } catch (error) {
    console.error('Error al obtener los datos del tour:', error);
  }
};

const formattedFechas = computed(() => {
  if (tour.value && tour.value.fechasDisponibles && tour.value.fechasDisponibles.length > 0) {
    return tour.value.fechasDisponibles.map(fecha => {
      const date = new Date(fecha);
      if (isNaN(date)) {
        return 'Fecha no válida';
      }
      return date.toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
  }
  return [];
});

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  }).join(''))

  return JSON.parse(jsonPayload)
}

const checkUserRole = () => {
  const token = localStorage.getItem('token');
  // console.log('Token:', token);
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      // console.log('Decoded Token:', decodedToken);
      if (typeof decodedToken.rols === 'string') {
        isGuia.value = decodedToken.rols === 'guia';
        isUser.value = decodedToken.rols === 'user';
        // console.log('isUser:', isUser.value, 'isGuia:', isGuia.value);
      } else {
        console.error('El campo "rols" no es una cadena:', decodedToken.rols);
      }
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }
}

onMounted(() => {
  fetchTourData()
  checkUserRole()
})

const reservarTour = async () => {
  const token = localStorage.getItem('token');
  const userId = token ? decodeJWT(token).userId : null;

  // console.log("User ID:", userId);
  if (!userId || !tour.value._id || !tour.value.fechasDisponibles || cantidadPersonas.value <= 0) {
    errorMessage.value = 'Por favor, verifica que todos los campos estén completos y válidos.';
    return;
  }

  const reserva = {
    userId: userId,
    tourId: tour.value._id,
    fechaTour: tour.value.fechasDisponibles[0],
    cantidadPersonas: cantidadPersonas.value,
    destino: tour.value.provincia,
  };

  // console.log("Reserva:", reserva);

  try {
    const response = await axios.post(
      'https://back-tesis-lovat.vercel.app/arcana/reservastour/tours',
      reserva,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    // console.log("Reserva creada:", response.data);
    reservaExitosa.value = true;
    setTimeout(() => {
      reservaExitosa.value = false;
    }, 3000);
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    errorMessage.value = 'Hubo un error al realizar la reserva. Intenta más tarde.';
  }
};

const costoTotal = computed(() => {
  if (tour.value && tour.value.precio) {
    return cantidadPersonas.value * tour.value.precio;
  }
  return 0;
})
</script>

<template>
  <IrAtras />
  <div class="max-w-4xl mx-auto">
    <div v-if="tour" class="relative mb-2">
      <TituloSecundario class="text-center text-4xl">{{ tour.titulo }}</TituloSecundario>
      <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full h-64 object-cover" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-95 h-1/3"></div>
    </div>

    <div v-if="tour" class="p-6">
      <TituloTerciario><strong>Descripción:</strong></TituloTerciario>
      <p class="text-lg text-gray-700 mb-4">{{ tour.descripcion }}</p>

      <!-- Información del guía -->
      <TituloTerciario><strong>Guía:</strong></TituloTerciario>

      <div v-if="tour && tour.guia"
        class="bg-white p-4 shadow-md rounded-lg max-w-md mx-auto flex items-center justify-between">

        <img :src="guiaProfileImage" alt="Foto del guía" class="w-32 h-32 rounded-full object-cover mr-4" />

        <div class="space-y-2 flex flex-col">
          <p v-if="guiaName" class="font-bold text-lg">{{ guiaName }}</p>
          <p v-if="guiaEmail" class="text-gray-500">Email: {{ guiaEmail }}</p>
          <p v-if="guiaTelefono" class="text-gray-500">Teléfono:</p>
          <p v-if="guiaTelefono" class="text-gray-500">{{ guiaTelefono }}</p>
          <p v-if="guiaProvincia" class="text-gray-500">Provincia: {{ guiaProvincia }}</p>

          <div class="flex justify-end">
            <router-link :to="`/guias/${guiasId}`">
              <BotonPrincipal>Ver más</BotonPrincipal>
            </router-link>
          </div>
        </div>
      </div>



      <!-- Información del tour -->
      <div class="mt-6">
        <p class="text-lg text-gray-700 mb-2">
          <span class="font-semibold text-[#3C4A28]">Ubicación:</span> {{ tour.provincia }}
        </p>
        <p class="text-lg text-gray-700 mb-4">
          <span class="font-semibold text-[#3C4A28]">Duración:</span> {{ tour.duracion }}
        </p>
        <div class="text-lg text-gray-700 mb-4">
          <span class="font-semibold text-[#3C4A28]">Fechas disponibles:</span>
          <ul>
            <li v-for="(fecha, index) in formattedFechas" :key="index" class="mb-2">
              - {{ fecha }}
            </li>
          </ul>
        </div>
        <p class="text-lg text-gray-700">
          <span class="font-semibold text-[#3C4A28]">Política de cancelación:</span> {{ tour.politicaCancelacion }}
        </p>
        <hr class="m-4">
        <p class="text-xl text-center font-bold text-gray-900 mb-4">
          <span class="text-lg text-[#3C4A28]">Precio:</span> ${{ costoTotal }}
        </p>
      </div>
    </div>

    <div v-if="isUser && !isGuia">
      <form @submit.prevent="reservarTour" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Reservar Tour</h3>

        <div class="mb-4">
          <label for="cantidadPersonas" class="block text-gray-700 font-medium mb-2">
            Cantidad de personas:
          </label>
          <input type="number" id="cantidadPersonas" v-model="cantidadPersonas" min="1" max="10"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3C4A28]" required />
        </div>

        <div class="mb-4">
          <p class="text-gray-700">
            <span class="font-semibold">Costo total:</span> ${{ costoTotal }}
          </p>
        </div>

        <BotonPrincipal type="submit" class="w-full px-4 py-2 ">
          Reservar
        </BotonPrincipal>

        <div v-if="reservaExitosa" class="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>¡Reserva realizada con éxito!</p>
        </div>

        <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p>{{ errorMessage }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
