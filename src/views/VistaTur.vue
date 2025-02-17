<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
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

const fetchGuiaData = async (guiaId) => {
  try {
    console.log('Obteniendo datos del guía con ID:', guiaId);
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/guias/${guiaId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del guía: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API del guía:', data);

    if (!data.data) {
      throw new Error('La API no devolvió datos válidos.');
    }

    const { nombre, fotoPerfil, descripcion: desc, email: correo, telefono: tel, provincia: prov } = data.data;

    guiaName.value = nombre;
    guiaProfileImage.value = fotoPerfil;
    guiaDescription.value = desc;
    guiaEmail.value = correo;
    guiaTelefono.value = tel;
    guiaProvincia.value = prov;

    console.log('Nombre del guía:', guiaName.value);

  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const fetchTourData = async () => {
  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);
    if (!response.ok) {
      throw new Error('No se pudo encontrar el tour');
    }
    const data = await response.json();
    console.log('Tour data:', data);
    tour.value = data;

    if (data.guia) {
      fetchGuiaData(data.guia._id);
    }

  } catch (error) {
    console.error('Error al obtener los datos del tour:', error);
    errorMessage.value = 'No se pudo cargar la información del tour. Intenta más tarde.';
  }
};

const formattedFecha = computed(() => {
  if (tour.value && tour.value.fechaDisponible) {
    const date = new Date(tour.value.fechaDisponible);
    return date.toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  return '';
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
  console.log('Token:', token);
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      console.log('Decoded Token:', decodedToken);
      if (typeof decodedToken.rols === 'string') {
        isGuia.value = decodedToken.rols === 'guia';
        isUser.value = decodedToken.rols === 'user';
        console.log('isUser:', isUser.value, 'isGuia:', isGuia.value);
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

  console.log("User ID:", userId);
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

  console.log("Reserva:", reserva);

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
    console.log("Reserva creada:", response.data);
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
    <div v-if="tour" class="relative mb-4">
      <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full h-64 object-cover" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-75 h-1/3"></div>
      <TituloSecundario class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-4xl">
        {{ tour.titulo }}
      </TituloSecundario>
    </div>

    <div v-if="tour" class="p-6">
      <TituloSecundario>Información</TituloSecundario>
      <p class="text-lg text-gray-700 mb-4">{{ tour.descripcion }}</p>

      <div v-if="tour && tour.guia">
        <TituloTerciario>Guía: </TituloTerciario>
        <div>
          <img :src="guiaProfileImage" alt="Foto del guía" class="w-16 h-16 rounded-full" />
          <p>{{ guiaName }}</p>
          <p>{{ guiaDescription }}</p>
          <p>Email: {{ guiaEmail }}</p>
          <p>Teléfono: {{ guiaTelefono }}</p>
          <p>Provincia: {{ guiaProvincia }}</p>
        </div>
      </div>


      <p class="text-xl font-bold text-gray-900 mb-4">
        <span class="text-lg text-[#3C4A28]">Precio:</span> ${{ costoTotal }}
      </p>
      <p class="text-lg text-gray-700 mb-4">
        <span class="font-semibold text-[#3C4A28]">Ubicación:</span> {{ tour.provincia }}
      </p>
      <p class="text-lg text-gray-700 mb-4">
        <span class="font-semibold text-[#3C4A28]">Duración:</span> {{ tour.duracion }}
      </p>
      <p class="text-lg text-gray-700 mb-4">
        <span class="font-semibold text-[#3C4A28]">Fecha disponible:</span> {{ formattedFecha }}
      </p>
      <p class="text-lg text-gray-700">
        <span class="font-semibold text-[#3C4A28]">Política de cancelación:</span> {{ tour.politicaCancelacion }}
      </p>
    </div>

    <div v-if="isUser && !isGuia" class="mt-6">
      <form @submit.prevent="reservarTour" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Reservar Tour</h3>

        <div class="mb-4">
          <label for="cantidadPersonas" class="block text-gray-700 font-medium mb-2">
            Cantidad de personas:
          </label>
          <input type="number" id="cantidadPersonas" v-model="cantidadPersonas" min="1" max="10"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>

        <div class="mb-4">
          <p class="text-gray-700">
            <span class="font-semibold">Costo total:</span> ${{ costoTotal }}
          </p>
        </div>

        <button type="submit"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Reservar
        </button>

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
