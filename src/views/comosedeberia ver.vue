<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

const route = useRoute();
const router = useRouter();
const arrival_id = route.query.arrival_id;
const departure_id = route.query.departure_id;

const outbound_date = route.query.outbound_date;
const return_date = route.query.return_date;

const cargandoVuelta = ref(true);
const cargando = ref(true);
const errorMensaje = ref('');
const vuelosIda = ref([]);
const vuelosVuelta = ref([]);
const hotelEconomico = ref(null);

const pasoActual = ref(1); // Paso actual del stepper (1: Ida, 2: Vuelta, 3: Hoteles, 4: Reserva)

onMounted(async () => {
  cargando.value = true;
  console.log("Parametros:", { arrival_id, departure_id, outbound_date, return_date });

  try {
    if (!arrival_id || !departure_id || !outbound_date || !return_date) {
      cargando.value = false;
      errorMensaje.value = 'Por favor, verifica que todos los parámetros se hayan ingresado correctamente.';
      return;
    }

    // Función para obtener el código IATA
    function obtenerCodigoIATA(nombre) {
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

      return lugaresArgentinos[nombre] || nombre;
    }

    const arrival_idCodificado = obtenerCodigoIATA(arrival_id);
    const departure_idCodificado = obtenerCodigoIATA(departure_id);
    const outbound_dateCodificada = encodeURIComponent(outbound_date);
    const return_dateCodificada = encodeURIComponent(return_date);

    console.log("Códigos IATA:", { arrival_idCodificado, departure_idCodificado });

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/vuelos/buscar/resultados?engine=google_flights&departure_id=${arrival_idCodificado}&arrival_id=${departure_idCodificado}&outbound_date=${outbound_dateCodificada}&return_date=${return_dateCodificada}`);
    console.log("Respuesta de vuelos:", response.data);
    console.log("Códigos IATA:", { arrival_idCodificado, departure_idCodificado });
    console.log("Vuelos de ida:", vuelosIda.value);
    console.log("Vuelos de vuelta:", vuelosVuelta.value);

    if (response.data) {
      vuelosIda.value = response.data.vuelosIda || [];
      vuelosVuelta.value = response.data.vuelosVuelta || [];
      console.log("Vuelos de ida:", vuelosIda.value);
      console.log("Vuelos de vuelta:", vuelosVuelta.value);
    } else {
      errorMensaje.value = 'No se encontraron vuelos.';
    }

    const hotelResponse = await axios.get('https://back-tesis-lovat.vercel.app/arcana/hoteles/precio/economico');
    console.log("Respuesta de hoteles:", hotelResponse.data);

    if (hotelResponse.data) {
      hotelEconomico.value = hotelResponse.data;
    } else {
      errorMensaje.value = 'No se encontraron hoteles económicos.';
    }

  } catch (error) {
    errorMensaje.value = 'Error al obtener los datos. Intenta más tarde.';
    console.error(error);
  } finally {
    cargando.value = false;
  }
});

const calcularLlegada = (vuelo) => {
  const outbound_date = new Date(vuelo.outbound_date);
  const duracion = vuelo.duracion;
  outbound_date.setMinutes(outbound_date.getMinutes() + duracion);
  return {
    fecha: outbound_date.toLocaleDateString('es-ES'),
    hora: outbound_date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};

const obtenerFechaYHora = (fecha) => {
  const date = new Date(fecha);
  return {
    fecha: date.toLocaleDateString('es-ES'),
    hora: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};

const avanzarPaso = () => {
  if (pasoActual.value < 4) {
    pasoActual.value++;
  }
};
</script>

<template>
  <IrAtras />

  <div class="max-w-3xl mx-auto px-4 py-6">

    <!-- Stepper -->
    <div class="flex justify-between mb-6">
      <div :class="{'text-blue-600': pasoActual === 1, 'text-gray-400': pasoActual !== 1}" @click="pasoActual = 1">
        <IconoDespegar />
      </div>
      <div :class="{'text-blue-600': pasoActual === 2, 'text-gray-400': pasoActual !== 2}" @click="pasoActual = 2">
        <IconoAterrizaje /> 
      </div>
      <div :class="{'text-blue-600': pasoActual === 3, 'text-gray-400': pasoActual !== 3}" @click="pasoActual = 3">
        <IconoInicio class="w-6 h-6" />
      </div>
      <div :class="{'text-blue-600': pasoActual == 4, 'text-gray-400': pasoActual !== 4}" @click="pasoActual = 4">
        <IconoLista class="w-6 h-6" />
      </div>
    </div>

    <!-- Step 1: Vuelos de Ida -->
    <div v-if="pasoActual === 1" class="mb-6">

      <TituloSecundario>Resultado de viajes de ida</TituloSecundario>
      <p><strong>Origen:</strong> {{ departure_id.name }}</p>
      <p><strong>Destino:</strong> {{ arrival_id.name }}</p>

      <div v-if="cargando">
        <SpinnerCarga />
      </div>
      <div v-else-if="errorMensaje">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="vuelosIda.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosIda" :key="vuelo.flight_number" class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6">
            <div class="w-full mb-6">
              <div class="flex justify-between mb-6">
                <div>
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.departure_airport.name }}</p>
                  <p>Origen</p>
                </div>
                <div class="text-end">
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.arrival_airport.name }}</p>
                  <p>Destino</p>
                </div>
              </div>

              <div class="flex justify-between mb-6">
                <img :src="vuelo.airline_logo" alt="Logo de la aerolínea {{ vuelo.airline }}" class="w-16 h-16 object-contain">
                <p>{{ vuelo.airline }}</p>
                <div class="text-end">
                  <p>Número de Vuelo:</p>
                  <p class="font-medium text-2xl">{{ vuelo.flight_number }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <div class="flex justify-between items-center flex-col">
                  <p>{{ obtenerFechaYHora(vuelo.departure_airport.time).fecha }}</p>
                  <p>{{ vuelo.duration }} minutos</p>
                </div>

                <div class="flex-1 mx-2 relative">
                  <div class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gray-400 h-[1px] top-[15px]"></div>
                </div>

                <div class="flex justify-between items-center flex-col">
                  <p>{{ obtenerFechaYHora(vuelo.arrival_airport.time).fecha }}</p>
                  <p>{{ vuelo.duration }} minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2: Vuelos de Vuelta -->
    <div v-if="pasoActual === 2" class="mb-6">
      <!-- Mostrar los vuelos de vuelta aquí -->
    </div>
  </div>
</template>
