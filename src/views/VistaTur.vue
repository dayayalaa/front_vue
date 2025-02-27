<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import axios from 'axios';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const tour = ref(null);
const cantidadPersonas = ref(1);
const reservaExitosa = ref(false);
const cargando = ref(true);
const isUser = ref(false);
const isGuia = ref(false);
const errorMessage = ref('');
const reservaEnProceso = ref(false);

const route = useRoute();
const router = useRouter();
const tourId = route.params.id;

const guiaName = ref('');
const guiaProfileImage = ref('');
const guiaDescription = ref('');
const guiaEmail = ref('');
const guiaTelefono = ref('');
const guiaProvincia = ref('');
const guiasId = ref('');
const fechasSeleccionadas = ref([]);

const fetchGuiaData = async (guiaId) => {
  try {
    // console.log('Id guia:', guiasId);
    guiasId.value = route.params.id;
    // console.log('Id guia:', guiasId.value);

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

  } catch (error) {
    console.error('Error al obtener los datos del guía:', error);
  } finally {
    cargando.value = false;
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

    // console.log('Tour: ', tour.value);

    if (tour.value && tour.value.guia) {
      await fetchGuiaData(tour.value.guia);
    } else {
      console.log('No guía encontrado para este tour');
    }
  } catch (error) {
    console.error('Error al obtener los datos del tour:', error);
  }
};

const formattedFechas = computed(() => {
  if (tour.value && tour.value.fechasDisponibles && tour.value.fechasDisponibles.length > 0) {
    return tour.value.fechasDisponibles.map(fecha => {
      const date = new Date(fecha);

      if (isNaN(date.getTime())) {
        return 'Fecha no válida';
      }

      const year = date.getUTCFullYear();
      const month = date.getUTCMonth();
      const day = date.getUTCDate();

      return new Date(year, month, day).toLocaleDateString('es-AR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
  }
  return ['No hay fechas disponibles'];
});

function formatDateToCustomFormat(fecha) {
  const meses = {
    enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
    julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
  };

  const regex = /^(\d{1,2}) de (\w+) de (\d{4})$/;

  const match = fecha.match(regex);
  if (match) {
    const day = parseInt(match[1], 10);
    const month = meses[match[2].toLowerCase()];
    const year = parseInt(match[3], 10);

    const date = new Date(year, month, day);

    return date.toISOString();
  }

  return null;
}

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

const checkUserRole = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      if (typeof decodedToken.rols === 'string') {
        isGuia.value = decodedToken.rols === 'guia';
        isUser.value = decodedToken.rols === 'user';
      } else {
        console.error('El campo "rols" no es una cadena:', decodedToken.rols);
      }
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }
}

onMounted(() => {
  fetchTourData();
  checkUserRole();
})

const reservarTour = async () => {
  const token = localStorage.getItem('token');
  const userId = token ? decodeJWT(token).userId : null;
  const userName = token ? decodeJWT(token).userName : '';

  if (!userId || !tour.value._id || !fechasSeleccionadas.value.length || cantidadPersonas.value <= 0) {
    errorMessage.value = 'Por favor, verifica que todos los campos estén completos y válidos.';
    return;
  }

  // console.log('Fecha disponible:', tour.value.fechasDisponibles);
  const fechaTour = fechasSeleccionadas.value[0];
  // console.log('Fecha seleccionada:', fechasSeleccionadas);
  const fechaFormateada = formatDateToCustomFormat(fechaTour);
  // console.log('Fecha formateada:', fechaFormateada);

  const reserva = {
    userId: userId,
    userName: userName,
    tourId: tour.value._id,
    tourTitulo: tour.value.titulo,
    fechaTour: fechaFormateada,
    cantidadPersonas: cantidadPersonas.value,
    destino: tour.value.provincia,
    precio: tour.value.precio,
  };

  try {
    reservaEnProceso.value = true;
    const response = await axios.post(
      'https://back-tesis-lovat.vercel.app/arcana/reservastour/tours',
      reserva,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    reservaExitosa.value = true;

    const userResponse = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId}`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const userEmail = userResponse.data.data.email;

    await enviarCorreos(userEmail, guiaEmail.value, reserva);

    setTimeout(() => {
      reservaExitosa.value = false;
      router.push(`/reservaDetalle/${response.data.data._id}`);
    }, 3000);

  } catch (error) {
    console.error("Error al crear la reserva:", error);
    errorMessage.value = 'Hubo un error al realizar la reserva. Intenta más tarde.';
  } finally {
    reservaEnProceso.value = false;
  }
};

const enviarCorreos = async (usuarioEmail, guiaEmail, reserva) => {
  try {
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/mail/reserva', {
      usuarioEmail,
      guiaEmail,
      reserva,
    });

    if (response.status === 200) {
      // console.log('Correos enviados exitosamente');
    } else {
      console.error('Error al enviar los correos');
    }
  } catch (error) {
    console.error('Error al llamar al servicio de correos:', error);
  }
};

const costoTotal = computed(() => {
  if (tour.value && tour.value.precio) {
    return cantidadPersonas.value * tour.value.precio;
  }
  return 0;
});
</script>



<template>
  <IrAtras />
  <div class="max-w-4xl mx-auto">
    <SpinnerCarga v-if="cargando" />
    <div v-if="tour">

      <div class="relative mb-2">
        <TituloSecundario class="text-center text-4xl">{{ tour.titulo }}</TituloSecundario>
        <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full h-64 object-cover" />
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-95 h-1/3"></div>
      </div>

      <div class="p-6">
        <TituloTerciario><strong>Descripción:</strong></TituloTerciario>
        <p class="text-lg text-[#222725] mb-4">{{ tour.descripcion }}</p>

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

      </div>

      <!-- Información del tour -->
      <div class="p-6 pt-0">
        <p class="text-lg text-[#222725] mb-2">
          <span class="font-semibold text-[#3C4A28]">Ubicación:</span> {{ tour.provincia }}
        </p>
        <p class="text-lg text-[#222725] mb-4">
          <span class="font-semibold text-[#3C4A28]">Duración:</span> {{ tour.duracion }}
        </p>
        <div v-if="tour && tour.fechasDisponibles && tour.fechasDisponibles.length > 0" class="mt-6">
          <!-- fechas -->
          <div v-if="isGuia && !isUser" class="text-lg text-[#222725] mb-4">
            <span class="font-semibold text-[#3C4A28]">Fechas disponibles:</span>
            <ul>
              <li v-for="(fecha, index) in formattedFechas" :key="index" class="mb-2">
                - {{ fecha }}
              </li>
            </ul>
          </div>

        </div>

        <p class="text-lg text-[#222725]">
          <span class="font-semibold text-[#3C4A28]">Política de cancelación:</span> {{ tour.politicaCancelacion }}
        </p>
      </div>
    </div>

    <div v-if="isUser && !isGuia" class="p-6 pt-0">
      <form @submit.prevent="reservarTour">
        <div class="mb-6">
          <div class="text-lg text-[#222725] mb-4">
            <span class="font-semibold text-[#A86A36]">Fecha disponible:</span>
            <div>
              <label v-for="(fecha, index) in formattedFechas" :key="index" class="block">
                <input type="checkbox" :value="fecha" v-model="fechasSeleccionadas" />
                {{ fecha }}
              </label>
            </div>

            <div v-if="fechasSeleccionadas.length === 0" class="text-[#7E2323] text-sm">
              *Debes seleccionar al menos una fecha.
            </div>
          </div>

          <div>
            <label for="cantidadPersonas" class="block text-[#A86A36] font-medium mb-2">
              Cantidad de personas:
            </label>
            <input id="cantidadPersonas" type="number" v-model="cantidadPersonas" min="1"
              class="w-full p-2 border border-gray-300 rounded-md" placeholder="Número de personas" />
            <div v-if="cantidadPersonas <= 0" class="text-[#7E2323] text-sm">
              *La cantidad de personas debe ser mayor a 0.
            </div>
          </div>
        </div>

        <span class="text-[#7E2323] text-sm">*Es importante que todas las reservas sean confirmadas directamente con el
          guía para coordinar detalles sobre pagos y posibles cancelaciones.</span>

        <hr class="m-4">

        <p class="text-xl text-center font-bold text-[#222725] mb-4 mt-4">
          <span class="text-lg text-[#3C4A28]">Precio:</span> ${{ costoTotal }}
        </p>


        <div v-if="reservaExitosa" class="mt-4 mb-4 p-4 bg-green-100 border-l-4 border-[#788A68] text-[#222725]">
          <p>¡Reserva realizada con éxito!</p>
          <p class="text-sm">Pronto recibirás un correo con los detalles de la reserva.</p>
        </div>

        <BotonPrincipal @click="reservarTour" :disabled="reservaEnProceso" class="w-full px-4 py-2">
          {{ reservaEnProceso ? 'Reservando...' : 'Reservar' }}
        </BotonPrincipal>

      </form>
    </div>
  </div>
</template>