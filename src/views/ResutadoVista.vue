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
const errorMensaje = ref('');
const cargando = ref(true);
const pasoActual = ref(1);

const departure_id = ref('');
const arrival_id = ref('');

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

const stepClass = (step) => pasoActual.value === step ? 'text-blue-600' : 'text-gray-400';

onMounted(obtenerVuelos);

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

const almacenarVuelo = (vuelo, tipo) => {
  const vueloReserva = JSON.parse(localStorage.getItem('vueloReserva')) || {};

  vueloReserva[tipo] = vuelo;
  localStorage.setItem('vueloReserva', JSON.stringify(vueloReserva));
};

const manejarReserva = (vuelo, tipo) => {
  almacenarVuelo(vuelo, tipo);

  if (tipo === 'ida') {
    pasoActual.value = 2;
  }
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
            <div class="flex justify-center items-center mb-6">
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
                <BotonPrincipal @click="manejarReserva(vuelo, 'ida')">Reservar</BotonPrincipal>
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

      <div v-else-if="vuelos.length > 0" class="mt-8">
        <TituloSecundario>Resultado de viajes de vuelta</TituloSecundario>
        <p><strong>Origen:</strong> {{ obtenerNombreAeropuerto(arrival_id) }}</p>
        <p><strong>Destino:</strong> {{ obtenerNombreAeropuerto(departure_id) }}</p>

        <div v-for="vuelo in vuelos" :key="vuelo.price"
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
            <div class="flex justify-center items-center mb-6">
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
                <BotonPrincipal>Reservar</BotonPrincipal>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- Step 3: Hoteles -->
    <div v-if="pasoActual === 3" class="mb-6">
      <!-- Mostrar opciones de hoteles aquí -->
    </div>

    <!-- Step 4: Selección -->
    <div v-if="pasoActual === 4" class="mb-6">
      <!-- Opciones de selección para el usuario -->
    </div>
  </div>
</template>
