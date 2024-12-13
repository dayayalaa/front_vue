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
const origen = route.query.origen;
const destino = route.query.destino;

const fechaSalida = route.query.fechaSalida;
const fechaVuelta = route.query.fechaVuelta;

const cargandoVuelta = ref(true);
const cargando = ref(true);
const errorMensaje = ref('');
const vuelosIda = ref([]);
const vuelosVuelta = ref([]);
const hotelEconomico = ref(null);

const pasoActual = ref(1); // Paso actual del stepper (1: Ida, 2: Vuelta, 3: Hoteles, 4: Reserva)

onMounted(async () => {
  cargando.value = true;

  
  try {
    if (!origen || !destino || !fechaSalida || !fechaVuelta) {
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

    const origenCodificado = obtenerCodigoIATA(origen);
    const destinoCodificado = obtenerCodigoIATA(destino);
    const fechaSalidaCodificada = encodeURIComponent(fechaSalida);
    const fechaVueltaCodificada = encodeURIComponent(fechaVuelta);

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/vuelos/resultados/${origenCodificado}/${destinoCodificado}/${fechaSalidaCodificada}/${fechaVueltaCodificada}`);

    if (response.data) {
      vuelosIda.value = response.data.vuelosIda || [];
      vuelosVuelta.value = response.data.vuelosVuelta || [];
    } else {
      errorMensaje.value = 'No se encontraron vuelos.';
    }

    const hotelResponse = await axios.get('https://back-tesis-lovat.vercel.app/arcana/hoteles/precio/economico');

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
  const fechaSalida = new Date(vuelo.fechaSalida);
  const duracion = vuelo.duracion;
  fechaSalida.setMinutes(fechaSalida.getMinutes() + duracion);
  return {
    fecha: fechaSalida.toLocaleDateString('es-ES'),
    hora: fechaSalida.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
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
      <p><strong>Origen:</strong> {{ origen }}</p>
      <p><strong>Destino:</strong> {{ destino }}</p>

      <div v-if="cargando">

        <SpinnerCarga />
      </div>
      <div v-else-if="errorMensaje">
        <p>{{ errorMensaje }}</p>
      </div>
      <div v-else-if="vuelosIda.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosIda" :key="vuelo.numeroVuelo" class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6">

            <div class="w-full mb-6">
              <div class="flex justify-between mb-6">
                <div>
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.origen }}</p>
                  <p>Origen</p>
                </div>
                <div class="text-end">
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.destino }}</p>
                  <p>Destino</p>
                </div>
              </div>

              <div class="flex justify-between mb-6">

                <img :src="vuelo.imgAerolinea" alt="Logo de la aerolínea {{ vuelo.aerolinea }}" class="w-16 h-16 object-contain">

                <div class="text-end">
                  <p>Número de Vuelo:</p>
                  <p class="font-medium text-2xl">{{ vuelo.numeroVuelo }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <div class="flex justify-between items-center flex-col">
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).fecha }}</p>
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).hora }}</p>
                </div>

                <div class="flex-1 mx-2 relative">
                  <div class="absolute left-1/2 transform -translate-x-1/2 -top-3 text-[#222725]">
                    <IconoAvion />
                  </div>

                  <hr class="border-t border-dashed border-[#788B69]" />

                </div>

                <div class="flex justify-between items-center flex-col">
                  <p>{{ calcularLlegada(vuelo).fecha }}</p>
                  <p>{{ calcularLlegada(vuelo).hora }}</p>
                </div>
              </div>

              <p><strong>Duración:</strong> {{ vuelo.duracion }} Minutos</p>

              <div class="flex justify-between">
                <p><strong>Precio:</strong></p>
                <p class="font-black text-2xl text-[#4F6D3A]"> ${{ vuelo.precio }} ARS</p>
              </div>
            </div>

            <BotonPrincipal @click="avanzarPaso">Seleccionar vuelo de ida</BotonPrincipal>

          </div>
        </div>
      </div>
      <p v-else>No hay opciones de vuelos de ida disponibles.</p>
    </div>

    <!-- Step 2: Vuelos de Vuelta -->
    <div v-if="pasoActual === 2" class="mb-6">
      <TituloSecundario>Resultados de Vuelos de Vuelta</TituloSecundario>
      <p><strong>Origen:</strong> {{ destino }}</p>
      <p><strong>Destino:</strong> {{ origen }}</p>

      <div v-if="cargando">
        <SpinnerCarga />
      </div>
      <div v-else-if="errorMensaje">
        <p>{{ errorMensaje }}</p>
      </div>
      <div v-else-if="vuelosVuelta.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosVuelta" :key="vuelo.numeroVuelo" class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6">
            <div class="w-full mb-6">
              <div class="flex justify-between mb-6">
                <div>
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.origen }}</p>
                  <p>Origen</p>
                </div>
                <div class="text-end">
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.destino }}</p>
                  <p>Destino</p>
                </div>
              </div>

              <div class="flex justify-between mb-6">
                <img :src="vuelo.imgAerolinea" alt="Logo de la aerolínea {{ vuelo.aerolinea }}" class="w-16 h-16 object-contain">
                <div class="text-end">
                  <p>Número de Vuelo:</p>
                  <p class="font-medium text-2xl">{{ vuelo.numeroVuelo }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <div class="flex justify-between items-center flex-col">
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).fecha }}</p>
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).hora }}</p>
                </div>

                <div class="flex-1 mx-2 relative">
                  <div class="absolute left-1/2 transform -translate-x-1/2 -top-3 text-[#222725]">
                    <IconoAvion />
                  </div>
                  <hr class="border-t border-dashed border-[#788B69]" />
                </div>

                <div class="flex justify-between items-center flex-col">
                  <p>{{ calcularLlegada(vuelo).fecha }}</p>
                  <p>{{ calcularLlegada(vuelo).hora }}</p>
                </div>
              </div>

              <p><strong>Duración:</strong> {{ vuelo.duracion }} Minutos</p>

              <div class="flex justify-between">
                <p><strong>Precio:</strong></p>
                <p class="font-black text-2xl text-[#4F6D3A]"> ${{ vuelo.precio }} ARS</p>
              </div>
            </div>

            <BotonPrincipal @click="avanzarPaso">Seleccionar vuelo de vuelta</BotonPrincipal>
          </div>
        </div>
      </div>
      <p v-else>No hay opciones de vuelos de vuelta disponibles.</p>
    </div>

    <!-- Step 3: Hoteles -->
<div v-if="pasoActual === 3" class="mb-6">
  <TituloSecundario class="text-center">Hoteles</TituloSecundario>
  <div v-if="hotelEconomico && hotelEconomico.habitaciones && hotelEconomico.habitaciones.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Iterar sobre todas las habitaciones -->
    <div v-for="(habitacion, index) in hotelEconomico.habitaciones" :key="index" class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6">
      <img 
        :src="habitacion.imgHabitacion" 
        :alt="habitacion.tipo" 
        class="w-full h-64 object-cover rounded-t-lg" 
      />
      <div class="px-6 py-4">
        <TituloSecundario class="text-2xl" >{{ hotelEconomico.nombre }}</TituloSecundario>
        <p class="text-gray-600 text-sm mt-2">Tipo de habitación: {{ habitacion.tipo }}</p>
        <p class="text-gray-600 text-sm">Precio por noche: ${{ habitacion.precioPorNoche }}</p>
      </div>    

      <BotonPrincipal @click="avanzarPaso">Seleccionar habitación</BotonPrincipal>
    </div>
  </div>
</div>

<!-- Step 4: Guardados -->
<div v-if="pasoActual === 4" class="mb-6">
      <TituloSecundario class="text-center">Lista de Guardados</TituloSecundario>
      <p>Se implementará en una próxima actualización. En esta vista se verá todo lo que el usuario seleccionó y se podrá efectuar el pago.</p>
    </div>
  </div>
</template>

