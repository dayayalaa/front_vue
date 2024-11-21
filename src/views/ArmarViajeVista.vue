<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoDespegar from '../components/icons/IconoDespegar.vue';
import IconoAterrizaje from '../components/icons/IconoAterrizaje.vue';
import IrAtras from '../components/IrAtras.vue';
const router = useRouter();
const origen = ref('');
const destino = ref('');
const fechaSalida = ref('');
const fechaVuelta = ref('');
const origenError = ref('');
const destinoError = ref('');
const fechaVueltaError = ref('');
const sugerenciasOrigen = ref([]);
const sugerenciasDestino = ref([]);
const lugaresArgentinos = [
  'Buenos Aires - Aeroparque Jorge Newbery',
  'Buenos Aires - Aeropuerto Internacional Ministro Pistarini',
  'Córdoba',
  'Mendoza',
  'Mar del Plata',
  'Ushuaia',
  'Bariloche',
  'Salta',
  'Rosario',
  'Tucumán',
  'Iguazú',
  'Neuquén',
  'Misiones',
  'Posadas',
  'San Fernando del Valle de Catamarca',
  'San Juan',
  'Río Gallegos',
  'Río Grande',
  'El Calafate',
  'San Luis',
  'Resistencia',
  'Tremedal',
  'General Roca',
];
const quitarAcentos = (texto) => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
const filtrarSugerencias = (campo) => {
  if (campo === 'origen') {
    sugerenciasOrigen.value = lugaresArgentinos.filter(lugar =>
      quitarAcentos(lugar.toLowerCase()).includes(quitarAcentos(origen.value.toLowerCase()))
    );
    sugerenciasDestino.value = []; 
  } else {
    sugerenciasDestino.value = lugaresArgentinos.filter(lugar =>
      quitarAcentos(lugar.toLowerCase()).includes(quitarAcentos(destino.value.toLowerCase()))
    );
    sugerenciasOrigen.value = []; 
  }
};
const seleccionarSugerencia = (sugerencia, tipo) => {
  if (tipo === 'origen') {
    origen.value = sugerencia;
    sugerenciasOrigen.value = []; 
  } else {
    destino.value = sugerencia;
    sugerenciasDestino.value = []; 
  }
};
const irARuta = () => {
  origenError.value = '';
  destinoError.value = '';
  fechaVueltaError.value = '';
  if (!origen.value) {
    origenError.value = 'El origen es requerido.';
  }
  if (!destino.value) {
    destinoError.value = 'El destino es requerido.';
  }
  if (!fechaSalida.value || !fechaVuelta.value) {
    return;
  }
  const fechaSalidaObj = new Date(fechaSalida.value);
  const fechaVueltaObj = new Date(fechaVuelta.value);
  if (fechaVueltaObj < fechaSalidaObj) {
    fechaVueltaError.value = 'La fecha de vuelta no puede ser anterior a la de salida.';
    return;
  }
  if (!origen.value || !destino.value) {
    return;
  }
  router.push({
    path: '/resultados',
    query: {
      origen: origen.value,
      destino: destino.value,
      fechaSalida: fechaSalida.value,
      fechaVuelta: fechaVuelta.value,
    }
  });
};
</script>

<template>
  <IrAtras/>
  <div class="flex items-center justify-center pt-16 pb-8"> 
    <div class="max-w-md p-4 bg-white rounded shadow-lg">
      <TituloPrincipal>Buscar vuelos</TituloPrincipal>
      <form @submit.prevent="irARuta">
        <div class="mb-4 relative">
          <label for="origen" class="block text-sm font-medium">Origen:</label>
          <IconoDespegar class="absolute left-3 top-8" />
          <input type="text" id="origen" v-model="origen" @input="filtrarSugerencias('origen')" class="border border-gray-300 pl-10 p-2 rounded w-full" required>
          <p v-if="origenError" class="text-red-500 text-sm">{{ origenError }}</p>
          <ul v-if="sugerenciasOrigen.length > 0" class="border border-gray-300 mt-1">
            <li v-for="(sugerencia, index) in sugerenciasOrigen" :key="index" @click="seleccionarSugerencia(sugerencia, 'origen')" class="p-2 cursor-pointer hover:bg-gray-200">{{ sugerencia }}</li>
          </ul>
        </div>
        <div class="mb-4 relative">
          <label for="destino" class="block text-sm font-medium">Destino:</label>
          <IconoAterrizaje class="absolute left-3 top-8" />
          <input type="text" id="destino" v-model="destino" @input="filtrarSugerencias('destino')" class="border border-gray-300 pl-10 p-2 rounded w-full" required>
          <p v-if="destinoError" class="text-red-500 text-sm">{{ destinoError }}</p>
          <ul v-if="sugerenciasDestino.length > 0" class="border border-gray-300 mt-1">
            <li v-for="(sugerencia, index) in sugerenciasDestino" :key="index" @click="seleccionarSugerencia(sugerencia, 'destino')" class="p-2 cursor-pointer hover:bg-gray-200">{{ sugerencia }}</li>
          </ul>
        </div>
        <div class="mb-4">
          <label for="fechaSalida" class="block text-sm font-medium">Fecha de Ida:</label>
          <input type="date" id="fechaSalida" v-model="fechaSalida" class="border border-gray-300 p-2 rounded w-full" required>
        </div>
        <div class="mb-4">
          <label for="fechaVuelta" class="block text-sm font-medium">Fecha de Vuelta:</label>
          <input type="date" id="fechaVuelta" v-model="fechaVuelta" class="border border-gray-300 p-2 rounded w-full" required>
          <p v-if="fechaVueltaError" class="text-red-500 text-sm">{{ fechaVueltaError }}</p>
        </div>
        <div class="flex justify-center">
          <BotonPrincipal type="submit">Buscar Vuelos</BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>