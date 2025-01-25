<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import axios from 'axios';

import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoAvion from '../components/icons/IconoAvion.vue';
import IconoDespegar from '../components/icons/IconoDespegar.vue';
import IconoAterrizaje from '../components/icons/IconoAterrizaje.vue';
import IconoInicio from '../components/icons/IconoInicio.vue';
import IconoLista from '../components/icons/IconoLista.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const vuelos = ref([]);
const vuelta = ref([]);
const hoteles = ref([]);
const errorMensaje = ref('');
const cargando = ref(true);
const pasoActual = ref(1);

const departure_id = ref('');
const arrival_id = ref('');
const numAdultos = ref(2);

let departureTokenSeleccionado = "";

// Obtener vuelo de vuelta
const obtenerVueloDeVuelta = async (departureToken) => {
  if (!departureToken) {
    console.error('Token de ida no válido');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const departure_idCodificado = urlParams.get('departure_id');
  const arrival_idCodificado = urlParams.get('arrival_id');
  const outbound_dateCodificada = urlParams.get('outbound_date');
  const return_dateCodificada = urlParams.get('return_date');

  try {
    cargando.value = true;
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/vuelos/buscar/resultados', {
      params: {
        engine: 'google_flights',
        departure_token: departureToken,
        departure_id: decodeURIComponent(departure_idCodificado),
        arrival_id: decodeURIComponent(arrival_idCodificado),
        outbound_date: outbound_dateCodificada,
        return_date: return_dateCodificada,
      }
    });

    if (response.data && response.data.length > 0) {
      vuelta.value = response.data;
    } else {
      errorMensaje.value = 'No se encontraron vuelos de vuelta.';
    }
  } catch (error) {
    console.error('Error al obtener vuelos de vuelta:', error);
    errorMensaje.value = 'Hubo un error al obtener los vuelos de vuelta.';
  } finally {
    cargando.value = false;
  }
};

// Obtener vuelos de ida
const obtenerVuelos = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  const departure_idCodificado = urlParams.get('departure_id');
  const arrival_idCodificado = urlParams.get('arrival_id');
  const outbound_dateCodificada = urlParams.get('outbound_date');
  const return_dateCodificada = urlParams.get('return_date');

  departure_id.value = decodeURIComponent(departure_idCodificado);
  arrival_id.value = decodeURIComponent(arrival_idCodificado);

  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/vuelos/buscar/resultados', {
      params: {
        engine: 'google_flights',
        departure_id: departure_id.value,
        arrival_id: arrival_id.value,
        outbound_date: outbound_dateCodificada,
        return_date: return_dateCodificada,
      }
    });

    if (Array.isArray(response.data) && response.data.length > 0) {
      vuelos.value = response.data;
      departureTokenSeleccionado = response.data[0]?.departure_token || "";

      if (departureTokenSeleccionado) {
        obtenerVueloDeVuelta(departureTokenSeleccionado);
      }
    } else {
      errorMensaje.value = 'No se encontraron vuelos.';
    }
  } catch (error) {
    console.error('Error en la llamada a la API:', error);
    errorMensaje.value = 'Error al obtener los datos. Intenta más tarde.';
  } finally {
    cargando.value = false;
  }
};

// Obtener hoteles
const obtenerHoteles = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const arrival_id = urlParams.get('arrival_id');
  const check_in_date = urlParams.get('outbound_date');
  const check_out_date = urlParams.get('return_date');
  const adults = numAdultos.value;

  if (!arrival_id || !check_in_date || !check_out_date || !adults) {
    errorMensaje.value = 'Faltan parámetros requeridos para la búsqueda de hoteles.';
    return;
  }

  const provincia = obtenerNombreAeropuerto(arrival_id);

  if (!provincia) {
    errorMensaje.value = 'No se encontró la provincia correspondiente al código de aeropuerto.';
    return;
  }

  try {
    cargando.value = true;

    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/hoteles', {
      params: {
        q: provincia,
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        adults: adults,
      }
    });

    if (response.status === 200 && response.data && response.data.hoteles && response.data.hoteles.length > 0) {
      hoteles.value = response.data.hoteles;
    } else {
      errorMensaje.value = 'No se encontraron hoteles disponibles.';
    }
  } catch (error) {
    console.error('Error al obtener hoteles:', error);
    errorMensaje.value = 'Hubo un error al obtener los hoteles. Por favor, intente más tarde.';
  } finally {
    cargando.value = false;
  }
};

const stepClass = (step) => pasoActual.value === step ? 'text-[#788B69]' : 'text-gray-400';

const obtenerNombreAeropuerto = (codigo) => {
  const lugaresArgentinos = {
    'Buenos Aires - Aeropuerto Internacional Ministro Pistarini': 'EZE',
    'Buenos Aires - Aeroparque Jorge Newbery': 'AEP',
    'Córdoba': 'COR',
    'Mendoza': 'MDZ',
    'Mar del Plata': 'MDQ',
    'Ushuaia': 'USH',
    'Bariloche': 'BRC',
    'Salta': 'SLA',
    'Rosario': 'ROS',
    'Tucumán': 'TUC',
    'Iguazú': 'IGR',
    'Neuquén': 'NQN',
    'Misiones': 'MIR',
    'Posadas': 'PSS',
    'San Fernando del Valle de Catamarca': 'CTC',
    'San Juan': 'UAQ',
    'Río Gallegos': 'RGL',
    'Río Grande': 'RGA',
    'El Calafate': 'FTE',
    'San Luis': 'LUQ',
    'Resistencia': 'RES',
  };

  const aeropuerto = Object.keys(lugaresArgentinos).find(key => lugaresArgentinos[key] === codigo);
  return aeropuerto || 'Desconocido';
};

// Manejar reserva
const manejarReserva = (tipo, tokenSeleccionado, idHotelSeleccionado) => {
  const reserva = JSON.parse(localStorage.getItem('Reserva')) || {};

  // Limpiar datos anteriores de la reserva
  delete reserva.vueloIda;
  delete reserva.vueloVuelta;
  delete reserva.hotel;

  switch (tipo) {
    case 'ida':
      if (tokenSeleccionado) {
        const vueloSeleccionado = vuelos.value.find(v => v.departure_token === tokenSeleccionado);
        if (vueloSeleccionado) {
          reserva.idaReserva = {
            token: tokenSeleccionado,
            details: vueloSeleccionado
          };
        } else {
          console.error('No se encontró el vuelo de ida seleccionado.');
        }
      } else {
        console.error('No se seleccionó un vuelo de ida.');
      }
      break;

    case 'vuelta':
      if (vuelta.value.length > 0) {
        const vueloVueltaSeleccionado = vuelta.value[0]; // Seleccionar el vuelo de vuelta deseado
        reserva.vueltaReserva = vueloVueltaSeleccionado;
      } else {
        console.error('No se seleccionó un vuelo de vuelta.');
      }
      break;

    case 'hotel':
      if (hoteles.value.length > 0) {
        const hotelSeleccionado = hoteles.value.find(h => h.id === idHotelSeleccionado); // Aquí se busca el hotel seleccionado por el id
        if (hotelSeleccionado) {
          reserva.hotelReserva = hotelSeleccionado;
        } else {
          console.error('No se encontró el hotel seleccionado.');
        }
      } else {
        console.error('No se seleccionó un hotel.');
      }
      break;

    default:
      console.error('Tipo de reserva desconocido:', tipo);
      return;
  }

  localStorage.setItem('Reserva', JSON.stringify(reserva));
  console.log('Reserva actualizada:', reserva);
  pasoActual.value += 1;
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

const reserva = ref(JSON.parse(localStorage.getItem('Reserva')) || null);
watch(reserva, (newReserva) => {
  localStorage.setItem('Reserva', JSON.stringify(newReserva));
});

const actualizarReservaDesdeLocalStorage = () => {
  reserva.value = JSON.parse(localStorage.getItem('Reserva')) || null;
};

const confirmarReserva = async () => {
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      userId = decodedToken.userId;
      console.log('User ID extraído del token:', userId);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      alert('Error al verificar el token. Intenta nuevamente.');
      return;
    }
  } else {
    console.log('No se encontró el token en el localStorage');
    alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
    return;
  }

  if (!userId) {
    console.log('No se pudo obtener el userId del token');
    alert('Hubo un problema con la autenticación. Intenta nuevamente.');
    return;
  }

  const reserva = {
    userId: userId,
    vueloIda: this.reserva.idaReserva.details.flights[0],
    vueloVuelta: this.reserva.vueltaReserva,
    hotel: this.reserva.hotelReserva
  };

  try {
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/reserva', reserva);

    if (response.status === 200) {
      alert('¡Reserva confirmada exitosamente!');
    } else {
      alert('Hubo un problema al confirmar la reserva');
    }
  } catch (error) {
    console.error('Error al confirmar la reserva:', error);
    alert('Hubo un error en la conexión. Intenta nuevamente más tarde.');
  }
};

onMounted(async () => {
  try {
    await obtenerVuelos();
    await obtenerHoteles();
  } catch (error) {
    errorMensaje.value = 'Hubo un problema al cargar los datos. Intenta más tarde.';
  }
});

onMounted(() => {
  window.addEventListener('storage', actualizarReservaDesdeLocalStorage);
});

onBeforeUnmount(() => {
  window.removeEventListener('storage', actualizarReservaDesdeLocalStorage);
});
</script>


<template>
  <IrAtras />

  <div class="max-w-3xl mx-auto px-4 py-6">
    <!-- Stepper -->
    <div class="flex justify-between mb-6">
      <div :class="stepClass(1)" @click="pasoActual = 1">
        <IconoDespegar />
      </div>
      <div :class="stepClass(2)" @click="pasoActual = 2">
        <IconoAterrizaje />
      </div>
      <div :class="stepClass(3)" @click="pasoActual = 3">
        <IconoInicio class="w-6 h-6" />
      </div>
      <div :class="stepClass(4)" @click="pasoActual = 4">
        <IconoLista class="w-6 h-6" />
      </div>
    </div>

    <!-- Step 1: Vuelos de Ida -->
    <div v-if="pasoActual === 1" class="mb-6">
      <div v-if="cargando" class="flex justify-center">
        <SpinnerCarga />
      </div>

      <div v-else-if="errorMensaje" class="text-red-500">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="vuelos.length > 0" class="mt-8">
        <TituloSecundario>Resultado de viajes de ida</TituloSecundario>
        <p><strong>Origen:</strong> {{ obtenerNombreAeropuerto(departure_id) }}</p>
        <p><strong>Destino:</strong> {{ obtenerNombreAeropuerto(arrival_id) }}</p>

        <div v-for="vuelo in vuelos" :key="vuelo.price"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div class="w-full mb-6">
            <div class="flex justify-between mb-6">
              <div>
                <p class="font-black text-4xl text-[#4F6D3A]">{{ departure_id }}</p>
                <p>Origen</p>
                <div class="text-gray-500 text-sm mt-2">
                  <p>{{ vuelo.flights[0].departure_airport?.time }}</p>
                </div>
              </div>
              <div class="text-end">
                <p class="font-black text-4xl text-[#4F6D3A]">{{ arrival_id }}</p>
                <p>Destino</p>
                <div class="text-gray-500 text-sm mt-2">
                  <p>{{ vuelo.flights[0].arrival_airport?.time }}</p>
                </div>
              </div>
            </div>
          </div>


          <div>
            <!-- Ilustracion avion -->
            <div class="flex justify-center items-center mb-6 relative">
              <div class="flex-1 bg-gray-400 h-[1px]"></div>
              <IconoAvion class="mx-4" />
              <div class="flex-1 bg-gray-400 h-[1px]"></div>
            </div>

            <!-- Aerolínea -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex flex-col">
                <img :src="vuelo.airline_logo" alt="Logo de la aerolínea {{ vuelo.airline }}"
                  class="w-16 h-16 object-contain">
                <p class="text-gray-500 text-sm mt-2">{{ vuelo.flights[0].airline }}</p>
              </div>

              <div class="text-end">
                <p>Número de Vuelo:</p>
                <p class="font-medium text-2xl">{{ vuelo.flights[0].flight_number }}</p>
              </div>
            </div>



            <div class="flex flex-col justify-between h-full">
              <!-- Escala -->
              <div v-if="vuelo.flights.length > 1">
                <p>Escala:</p>
                <p class="font-medium text-2xl">
                  {{ vuelo.flights.length - 1 }}
                </p>
              </div>
              <div v-else>
                <p>No hay escala</p>
              </div>

              <!-- Precio y botón de reserva -->
              <div class="mt-4 flex justify-between items-center">
                <span class="text-xl font-semibold text-green-600">${{ vuelo.price?.toLocaleString() }}</span>
                <BotonPrincipal @click="manejarReserva('ida')">Reservar</BotonPrincipal>
              </div>
            </div>


          </div>
        </div>
      </div>

    </div>

    <!-- Step 2: Vuelos de Vuelta -->
    <div v-if="pasoActual === 2" class="mb-6">
      <div v-if="cargando" class="flex justify-center">
        <SpinnerCarga />
      </div>

      <div v-else-if="errorMensaje" class="text-red-500">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="vuelta.length > 0" class="mt-8">
        <TituloSecundario>Resultado de viajes de vuelta</TituloSecundario>
        <p><strong>Origen:</strong> {{ obtenerNombreAeropuerto(arrival_id) }}</p>
        <p><strong>Destino:</strong> {{ obtenerNombreAeropuerto(departure_id) }}</p>

        <div v-for="vuelo in vuelta" :key="vuelo.price"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div class="w-full mb-6">
            <div class="flex justify-between mb-6">
              <div>
                <p class="font-black text-4xl text-[#4F6D3A]">{{ arrival_id }}</p>
                <p>Origen</p>
                <div class="text-gray-500 text-sm mt-2">
                  <p>{{ vuelo.flights[0].departure_airport?.time }}</p>
                </div>
              </div>
              <div class="text-end">
                <p class="font-black text-4xl text-[#4F6D3A]">{{ departure_id }}</p>
                <p>Destino</p>
                <div class="text-gray-500 text-sm mt-2">
                  <p>{{ vuelo.flights[0].arrival_airport?.time }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <!-- Ilustracion avion -->
            <div class="flex justify-center items-center mb-6 relative">
              <div class="flex-1 bg-gray-400 h-[1px]"></div>
              <IconoAvion class="mx-4" />
              <div class="flex-1 bg-gray-400 h-[1px]"></div>
            </div>

            <!-- Aerolínea -->
            <div class="flex justify-between items-center mb-6">
              <div class="flex flex-col">
                <img :src="vuelo.airline_logo" alt="Logo de la aerolínea {{ vuelo.airline }}"
                  class="w-16 h-16 object-contain">
                <p class="text-gray-500 text-sm mt-2">{{ vuelo.flights[0].airline }}</p>
              </div>

              <div class="text-end">
                <p>Número de Vuelo:</p>
                <p class="font-medium text-2xl">{{ vuelo.flights[0].flight_number }}</p>
              </div>
            </div>

            <div class="flex flex-col justify-between h-full">
              <!-- Escala -->
              <div v-if="vuelo.flights.length > 1">
                <p>Escala:</p>
                <p class="font-medium text-2xl">
                  {{ vuelo.flights.length - 1 }}
                </p>
              </div>
              <div v-else>
                <p>No hay escala</p>
              </div>

              <!-- Precio y botón de reserva -->
              <div class="mt-4 flex justify-between items-center">
                <span class="text-xl font-semibold text-green-600">
                  ${{ vuelo.price?.toLocaleString() }}
                </span>
                <BotonPrincipal @click="manejarReserva('vuelta')">Reservar</BotonPrincipal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 3: Hoteles -->
    <div v-if="pasoActual === 3" class="mb-6">
      <div class="mb-4 border-t-2 border-b-2 border-[#788B69]">
        <div class="flex items-center justify-center space-x-4 mt-4 mb-4">
          <label for="adults" class="block text-sm font-medium text-gray-700">
            <i class="fas fa-user text-[#3C4A28] text-2xl"></i>
          </label>
          <input id="adults" v-model="numAdultos" type="number" min="1" max="10"
            class="w-[70px] text-center h-10 rounded-md border-gray-300 shadow-sm appearance-none" placeholder="0" />

          <button @click="obtenerHoteles" class="h-10 px-4 py-2 bg-[#3C4A28] text-white rounded-md">
            Buscar Hoteles
          </button>
        </div>
      </div>

      <div v-if="cargando" class="flex justify-center">
        <SpinnerCarga />
      </div>

      <div v-else-if="errorMensaje" class="text-red-500">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="hoteles.length > 0" class="mt-8">
        <TituloSecundario>Hoteles Disponibles</TituloSecundario>
        <div v-for="hotel in hoteles" :key="hotel.name"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <!-- Imagen del hotel -->
          <img
            :src="hotel.images && hotel.images.length > 0 ? hotel.images[0].original_image : 'ruta-a-imagen-de-respaldo.jpg'"
            alt="Imagen de {{ hotel.name }}" class="w-full h-auto object-cover rounded-md mb-4" />

          <!-- Nombre del hotel -->
          <h3 class="font-bold text-lg">{{ hotel.name }}</h3>
          <div>
            <p><strong>Puntuación:</strong> {{ hotel.location_rating }}</p>
            <div class="flex">
              <span v-for="n in 5" :key="n" class="text-xl"
                :class="{ 'text-yellow-500': n <= hotel.location_rating, 'text-gray-300': n > hotel.location_rating }">★</span>
            </div>
          </div>

          <!-- Amenidades -->
          <p><strong>Amenidades:</strong>
            {{ hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities.join(', ') : 'No disponibles' }}
          </p>

          <!-- Precio -->
          <p><strong>Precio:</strong> {{ hotel.total_rate.before_taxes_fees }}</p>

          <!-- Botón de reserva -->
          <BotonPrincipal @click="manejarReserva('hotel')">Reservar</BotonPrincipal>
        </div>
      </div>
    </div>

    <!-- Step 4: Selección -->
    <div v-if="pasoActual === 4" class="mb-6">
      <TituloSecundario>Resumen de la Reserva</TituloSecundario>

      <div v-if="!reserva" class="text-gray-500">
        <p>No se ha realizado ninguna reserva.</p>
      </div>

      <div v-else>
        <TituloTerciario>Vuelo de Ida:</TituloTerciario>
        <div
          v-if="reserva.idaReserva && reserva.idaReserva.details && reserva.idaReserva.details.flights && reserva.idaReserva.details.flights.length > 0"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <p><strong>Vuelo:</strong> {{ reserva.idaReserva.details.flights[0].airline }}</p>
          <p><strong>Número de vuelo:</strong> {{ reserva.idaReserva.details.flights[0].flight_number }}</p>
          <p><strong>Origen:</strong> {{ reserva.idaReserva.details.flights[0].departure_airport.name }}</p>
          <p><strong>Destino:</strong> {{ reserva.idaReserva.details.flights[0].arrival_airport.name }}</p>
          <p><strong>Fecha:</strong> {{ reserva.idaReserva.details.flights[0].departure_airport?.time }}</p>
        </div>

        <TituloTerciario>Vuelo de Vuelta:</TituloTerciario>
        <div v-if="reserva.vueltaReserva && reserva.vueltaReserva.length > 0"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div v-for="vuelo in reserva.vueltaReserva" :key="vuelo.price">
            <p><strong>Aerolínea:</strong> {{ vuelo.flights[0].airline }}</p>
            <p><strong>Número de vuelo:</strong> {{ vuelo.flights[0].flight_number }}</p>
            <p><strong>Origen:</strong> {{ vuelo.flights[0].departure_airport.name }}</p>
            <p><strong>Destino:</strong> {{ vuelo.flights[0].arrival_airport.name }}</p>
            <p><strong>Fecha:</strong> {{ vuelo.flights[0].departure_airport?.time }}</p>
          </div>
        </div>

        <TituloTerciario>Hotel:</TituloTerciario>
        <div v-if="reserva.hotelReserva && reserva.hotelReserva.images && reserva.hotelReserva.images.length > 0"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 flex items-center">
          <img
            :src="reserva.hotelReserva.images && reserva.hotelReserva.images.length > 0 ? reserva.hotelReserva.images[0].original_image : 'ruta-a-imagen-de-respaldo.jpg'"
            alt="Imagen de {{ reserva.hotelReserva.name }}" class="w-24 h-24 object-cover rounded-lg mr-4" />

          <div>
            <p class="font-semibold">{{ reserva.hotelReserva.name }}</p>

            <!-- Estrellas -->
            <div>
              <p><strong>Puntuación:</strong> {{ reserva.hotelReserva.location_rating }}</p>
              <div class="flex">
                <span v-for="n in 5" :key="n" class="text-xl"
                  :class="{ 'text-yellow-500': n <= reserva.hotelReserva.location_rating, 'text-gray-300': n > reserva.hotelReserva.location_rating }">★</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div class="mt-4">
        <BotonPrincipal @click="confirmarReserva">Confirmar Reserva</BotonPrincipal>
      </div>
    </div>

  </div>
</template>
