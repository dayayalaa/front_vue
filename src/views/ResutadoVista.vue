<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
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

const router = useRouter();

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

// console.log('--INICIO DE LA BUSQUDA--');

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

    // console.log('vuelta:', response);

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

    // console.log('vuelos:', response);

    if (Array.isArray(response.data) && response.data.length > 0) {
      vuelos.value = response.data;
      departureTokenSeleccionado = response.data[0]?.departure_token || "";

      if (departureTokenSeleccionado) {
        await obtenerVueloDeVuelta(departureTokenSeleccionado);
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

const obtenerHoteles = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const arrival_idCodificado = urlParams.get('arrival_id');
  const check_in_date = urlParams.get('outbound_date');
  const check_out_date = urlParams.get('return_date');
  const adults = numAdultos.value;

  if (!arrival_idCodificado || !check_in_date || !check_out_date || !adults) {
    errorMensaje.value = 'Faltan parámetros requeridos para la búsqueda de hoteles.';
    return;
  }

  const provincia = obtenerNombreAeropuerto(arrival_idCodificado);

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

    // console.log('hotel:', response);

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
  'Buenos Aires - Ezeiza': 'EZE',
  'Buenos Aires - Aeroparque': 'AEP',
  'San Carlos de Bariloche': 'BRC',
  'Comodoro Rivadavia': 'CRD',
  'Córdoba': 'COR',
  'Corrientes': 'CNQ',
  'El Calafate': 'FTE',
  'El Palomar': 'EPA',
  'Esquel': 'EQS',
  'Formosa': 'FMA',
  'Mar del Plata': 'MDQ',
  'Mendoza': 'MDZ',
  'Neuquén': 'NQN',
  'Posadas': 'PSS',
  'Puerto Iguazú': 'IGR',
  'Resistencia': 'RES',
  'Río Gallegos': 'RGL',
  'Río Grande': 'RGA',
  'Rosario': 'ROS',
  'Salta': 'SLA',
  'San Miguel de Tucumán': 'TUC',
  'San Salvador de Jujuy': 'JUJ',
  'Santa Rosa del Conlara': 'RLO',
  'Termas de Río Hondo': 'RHD',
  'Trelew': 'REL',
  'Ushuaia': 'USH'
};


  const aeropuerto = Object.keys(lugaresArgentinos).find(key => lugaresArgentinos[key] === codigo);
  return aeropuerto || 'Desconocido';
};

const manejarReserva = (tipo, tokenSeleccionado, hotelSeleccionado) => {
  reserva.value = JSON.parse(localStorage.getItem('Reserva')) || {};

  switch (tipo) {
    case 'ida':
      if (tokenSeleccionado) {
        const vueloSeleccionado = vuelos.value.find(v => v.departure_token === tokenSeleccionado);
        if (vueloSeleccionado) {
          reserva.value.idaReserva = {
            token: tokenSeleccionado,
            details: vueloSeleccionado
          };
          // console.log('Vuelo de ida actualizado:', reserva.value.idaReserva);
        } else {
          console.error('No se encontró el vuelo de ida seleccionado.');
        }
      } else {
        console.error('No se seleccionó un vuelo de ida.');
      }
      break;

    case 'vuelta':
      if (vuelta.value.length > 0) {
        const vueloVueltaSeleccionado = vuelta.value.find(v => v.arrival_token === tokenSeleccionado);
        // console.log(arrival_id);
        // console.log('vuelo de vuelta:', vueloVueltaSeleccionado.arrival_id);
        // console.log('seleccion:', vueloVueltaSeleccionado);
        if (vueloVueltaSeleccionado) {
          reserva.value.vueltaReserva = {
            token: tokenSeleccionado,
            details: vueloVueltaSeleccionado,
            arrival_id: vueloVueltaSeleccionado.arrival_id
          };
          // console.log('Vuelo de vuelta actualizado:', reserva.value.vueltaReserva);
        } else {
          console.error('No se encontró el vuelo de vuelta seleccionado.');
        }
      } else {
        console.error('No se seleccionó un vuelo de vuelta.');
      }
      break;

    case 'hotel':
    // console.log('Seleccionando hotel:', hotelSeleccionado);
    // console.log('Property Token del hotel seleccionado:', hotelSeleccionado);

    if (hoteles.value.length > 0) {
        const hotelEncontrado = hoteles.value.find(h => h.property_token === tokenSeleccionado);
        if (hotelEncontrado) {
          reserva.value.hotelReserva = hotelEncontrado;
          // console.log('Hotel reservado actualizado:', reserva.value.hotelReserva);
        } else {
          console.error('No se encontró el hotel seleccionado. Verifica que el ID sea correcto.');
        }
      } else {
        console.error('No se seleccionó un hotel. Verifica la lista de hoteles disponibles.');
      }
      break;

    default:
      console.error('Tipo de reserva desconocido:', tipo);
      return;
  }

  localStorage.setItem('Reserva', JSON.stringify(reserva.value));
  // console.log('Reserva actualizada:', reserva.value);
  
  pasoActual.value += 1;
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
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
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      alert('Error al verificar el token. Intenta nuevamente.');
      return;
    }
  } else {
    alert('No se encontró el token de autenticación. Por favor, inicia sesión.');
    return;
  }

  if (!userId) {
    alert('Hubo un problema con la autenticación. Intenta nuevamente.');
    return;
  }
  if (!reserva.value || !reserva.value.vueltaReserva || !reserva.value.vueltaReserva.details) {
    alert('No se encontró la reserva de vuelta. Por favor, intenta nuevamente.');
    return;
  }

  const arrival_idCodificado = new URLSearchParams(window.location.search).get('arrival_id');
  const destinoId = decodeURIComponent(arrival_idCodificado);

  // console.log('Lugar:', destinoId);

  const destinoNombre = obtenerNombreAeropuerto(destinoId);

  // console.log('Lugar del viaje:', destinoNombre);


  const reservaParaEnviar = {
    userId: userId,
    vueloIda: reserva.value.idaReserva,
    vueloVuelta: reserva.value.vueltaReserva,
    hotel: reserva.value.hotelReserva,
    destino: destinoNombre,
    checklist: []
  };

  try {
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/reservas/crear', reservaParaEnviar);

    if (response.status === 200) {
      // console.log('¡Reserva confirmada exitosamente!');
      // localStorage.removeItem('reserva');
      // reserva.value = null;
      router.push('/pago');
    } else {
      // console.log('Hubo un problema al confirmar la reserva');
    }
  } catch (error) {
  if (error.response) {
    alert('Error en la respuesta del servidor: ' + error.response.status);
    console.error('Detalles del error:', error.response.data);
  } else if (error.request) {
    alert('No se recibió respuesta del servidor. Intenta nuevamente más tarde.');
    console.error('La solicitud fue hecha pero no se recibió respuesta:', error.request);
  } else {
    alert('Error al configurar la solicitud: ' + error.message);
    console.error('Error al configurar la solicitud:', error);
  }
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
                <BotonPrincipal @click="manejarReserva('ida', vuelo.departure_token)">Reservar</BotonPrincipal>
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
                <BotonPrincipal @click="manejarReserva('vuelta', vuelo.arrival_token)">Reservar</BotonPrincipal>
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
          <img :src="hotel.images?.length
            ? hotel.images[0].original_image || hotel.images[0].thumbnail || '/img/default_portada.png'
            : '/img/default_portada.png'
            " alt="Imagen de {{ hotel.name }}" class="w-full h-auto object-cover rounded-md mb-4" />


          <!-- Nombre del hotel -->
          <h3 class="font-bold text-lg text-[#A86A36]">{{ hotel.name }}</h3>
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
          <BotonPrincipal @click="manejarReserva('hotel', hotel.property_token)">Reservar</BotonPrincipal>
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
        <div
          v-if="reserva.vueltaReserva && reserva.vueltaReserva.details && reserva.vueltaReserva.details.flights && reserva.vueltaReserva.details.flights.length > 0"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
          <div v-for="vuelo in reserva.vueltaReserva.details.flights" :key="vuelo.flight_number">
            <p><strong>Aerolínea:</strong> {{ vuelo.airline }}</p>
            <p><strong>Número de vuelo:</strong> {{ vuelo.flight_number }}</p>
            <p><strong>Origen:</strong> {{ vuelo.departure_airport.name }}</p>
            <p><strong>Destino:</strong> {{ vuelo.arrival_airport.name }}</p>
            <p><strong>Fecha:</strong> {{ vuelo.departure_airport?.time }}</p>
          </div>
        </div>

        <TituloTerciario>Hotel:</TituloTerciario>
        <div v-if="reserva.hotelReserva && reserva.hotelReserva.images && reserva.hotelReserva.images.length > 0"
          class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6 flex items-center">
          <img :src="reserva.hotelReserva.images && reserva.hotelReserva.images.length > 0
            ? (reserva.hotelReserva.images[0].original_image || reserva.hotelReserva.images[0].thumbnail)
            : '/img/default_portada.png'
            " alt="Imagen de {{ reserva.hotelReserva.name }}" class="w-24 h-24 object-cover rounded-lg mr-4" />

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