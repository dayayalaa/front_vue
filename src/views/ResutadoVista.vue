<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import TituloSecundario from '../components/TituloSecundario.vue';
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
const errorMensaje = ref('');
const cargando = ref(true);
const pasoActual = ref(1);

const departure_id = ref('');
const arrival_id = ref('');

const hoteles = ref([]);
const numAdultos = ref(2);

let departureTokenSeleccionado = "";

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

    console.log('Vuelos de vuelta:', response.data);

    if (Array.isArray(response.data) && response.data.length > 0) {
      vuelos.value = response.data;

      departureTokenSeleccionado = response.data[0]?.departure_token || "";

      if (departureTokenSeleccionado) {
        obtenerVueloDeVuelta(departureTokenSeleccionado);
      }

      response.data.forEach(vuelo => {
        // console.log("Departure Token:", vuelo.departure_token);
      });
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
  const arrival_id = urlParams.get('arrival_id');
  const check_in_date = urlParams.get('outbound_date');
  const check_out_date = urlParams.get('return_date');
  const adults = numAdultos.value;

  if (!arrival_id || !check_in_date || !check_out_date || !adults) {
    errorMensaje.value = 'Faltan parámetros requeridos para la búsqueda de hoteles.';
    console.log('Error: Faltan parámetros requeridos.');
    return;
  }

  const provincia = obtenerNombreAeropuerto(arrival_id);
  console.log('Provincia obtenida:', provincia);

  if (!provincia) {
    errorMensaje.value = 'No se encontró la provincia correspondiente al código de aeropuerto.';
    console.log('Error: Provincia no encontrada para el código de aeropuerto', arrival_id);
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

    console.log('Respuesta de la API:', response.data);

    if (response.status === 200 && response.data && response.data.hoteles && response.data.hoteles.length > 0) {
      hoteles.value = response.data.hoteles;
      console.log('Hoteles encontrados:', hoteles.value);
    } else {
      errorMensaje.value = 'No se encontraron hoteles disponibles.';
      console.log('No se encontraron hoteles.');
    }
  } catch (error) {
    console.error('Error al obtener hoteles:', error);
    errorMensaje.value = 'Hubo un error al obtener los hoteles. Por favor, intente más tarde.';
  } finally {
    cargando.value = false;
    console.log('Carga finalizada.');
  }
};

const stepClass = (step) => pasoActual.value === step ? 'text-[#788B69]' : 'text-gray-400';

onMounted(async () => {
  try {
    await obtenerVuelos();
    await obtenerHoteles();
  } catch (error) {
    console.error("Error en la carga inicial:", error);
    errorMensaje.value = 'Hubo un problema al cargar los datos. Intenta más tarde.';
  }
});

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

const almacenar = (vuelo, tipo, departure_token, hoteles) => {
  // vuelo de ida
  const vueloReserva = JSON.parse(localStorage.getItem('vueloReserva')) || {};
  vueloReserva[tipo] = vuelo;

  // vuelo de vuelta
  const vueltaReserva = JSON.parse(localStorage.getItem('vueltaReserva')) || {};
  vueltaReserva[tipo] = departure_token;

  // hotel
  const hotelReserva = JSON.parse(localStorage.getItem('hotelReserva')) || {};
  hotelReserva[tipo] = hoteles;

  // Combinar los objetos en uno solo
  const reservaTotal = {
    vueloReserva,
    vueltaReserva,
    hotelReserva
  };

  // Guardar el objeto combinado en localStorage
  localStorage.setItem('Reserva', JSON.stringify(reservaTotal));
};
const manejarReserva = (vuelo, tipo, departure_token, hoteles) => {
  console.log("Vuelo de ida seleccionado:", vuelo);
  console.log("Vuelo de vuelta seleccionado:", departure_token);
  console.log("Hotel seleccionado:", hoteles);

  // Ahora se pasa también el departure_token
  almacenar(vuelo, tipo, departure_token, hoteles);

  if (tipo === 'ida') {
    pasoActual.value = 2;
  } else if (tipo === 'vuelta') {
    pasoActual.value = 3;
  } else if (tipo === 'hoteles') {
    pasoActual.value = 4;
  }

  console.log("Paso actual:", pasoActual.value);
};

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
                <BotonPrincipal @click="manejarReserva(vuelo, 'ida', departure_token)">Reservar</BotonPrincipal>
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
                <BotonPrincipal @click="manejarReserva(vuelo, 'vuelta', departure_token)">Reservar</BotonPrincipal>
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
          <img :src="hotel.images && hotel.images.length > 0 ? hotel.images[0].original_image : 'ruta-a-imagen-de-respaldo.jpg'"
            alt="Imagen de {{ hotel.name }}" class="w-full h-auto object-cover rounded-md mb-4" />

          <!-- Nombre del hotel -->
          <h3 class="font-bold text-lg">{{ hotel.name }}</h3>

          <!-- Amenidades -->
          <p><strong>Amenidades:</strong>
            {{ hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities.join(', ') : 'No disponibles' }}
          </p>

          <!-- Precio -->
          <p><strong>Precio:</strong> {{ hotel.total_rate.before_taxes_fees }}</p>

          <!-- Botón de reserva -->
          <BotonPrincipal @click="manejarReserva(hoteles, 'hoteles')">Reservar</BotonPrincipal>
        </div>
      </div>
    </div>




    <!-- Step 4: Selección -->
<div v-if="pasoActual === 4" class="mb-6">
  <div v-if="cargando" class="flex justify-center">
    <SpinnerCarga />
  </div>

  <div v-else-if="errorMensaje" class="text-red-500">
    <p>{{ errorMensaje }}</p>
  </div>

  <div v-else>
    <TituloSecundario>Mis Reservas</TituloSecundario>
    
    <!-- Obtener reservas del localStorage -->
    <div v-if="reservas.length > 0" class="space-y-6">
      <div v-for="(reserva, index) in reservas" :key="index" class="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        
        <!-- Vuelo de ida -->
        <div v-if="reserva.ida" class="mb-6">
          <p><strong>Vuelo de Ida:</strong></p>
          <p><strong>Origen:</strong> {{ obtenerNombreAeropuerto(reserva.ida.departure_id) }}</p>
          <p><strong>Destino:</strong> {{ obtenerNombreAeropuerto(reserva.ida.arrival_id) }}</p>
          <p><strong>Aerolínea:</strong> {{ reserva.ida.airline }}</p>
          <p><strong>Número de vuelo:</strong> {{ reserva.ida.flight_number }}</p>
          <p><strong>Precio:</strong> ${{ reserva.ida.price.toLocaleString() }}</p>
        </div>

        <!-- Vuelo de vuelta -->
        <div v-if="reserva.vuelta" class="mb-6">
          <p><strong>Vuelo de Vuelta:</strong></p>
          <p><strong>Origen:</strong> {{ obtenerNombreAeropuerto(reserva.vuelta.departure_id) }}</p>
          <p><strong>Destino:</strong> {{ obtenerNombreAeropuerto(reserva.vuelta.arrival_id) }}</p>
          <p><strong>Aerolínea:</strong> {{ reserva.vuelta.airline }}</p>
          <p><strong>Número de vuelo:</strong> {{ reserva.vuelta.flight_number }}</p>
          <p><strong>Precio:</strong> ${{ reserva.vuelta.price.toLocaleString() }}</p>
        </div>

        <!-- Hoteles -->
        <div v-if="reserva.hoteles && reserva.hoteles.length > 0" class="mb-6">
          <p><strong>Hoteles:</strong></p>
          <div v-for="(hotel, i) in reserva.hoteles" :key="i" class="border-b border-gray-300 pb-4">
            <p><strong>Hotel:</strong> {{ hotel.name }}</p>
            <p><strong>Dirección:</strong> {{ hotel.address }}</p>
            <p><strong>Precio por noche:</strong> ${{ hotel.price.toLocaleString() }}</p>
          </div>
        </div>
        
      </div>
    </div>
    
    <!-- Mensaje si no hay reservas -->
    <div v-else>
      <p>No tienes reservas realizadas aún.</p>
    </div>
  </div>
</div>

  </div>
</template>
