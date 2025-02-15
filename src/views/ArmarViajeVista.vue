<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';

const router = useRouter();
const arrival_id = ref('');
const departure_id = ref('');
const outbound_date = ref('');
const return_date = ref('');
const arrival_idError = ref('');
const departure_idError = ref('');
const return_dateError = ref('');

const lugaresArgentinos = {
  'Buenos Aires - Aeropuerto Internacional Ministro Pistarini': 'EZE',
  'Buenos Aires - Aeroparque Jorge Newbery': 'AEP',
  'San Carlos de Bariloche - Aeropuerto Internacional Teniente Luis Candelaria': 'BRC',
  'Comodoro Rivadavia - Aeropuerto Internacional General Enrique Mosconi': 'CRD',
  'Córdoba - Aeropuerto Internacional Ingeniero Ambrosio Taravella': 'COR',
  'Corrientes - Aeropuerto Internacional Doctor Fernando Piragine Niveyro': 'CNQ',
  'El Calafate - Aeropuerto Internacional Comandante Armando Tola': 'FTE',
  'El Palomar - Aeropuerto El Palomar': 'EPA',
  'Esquel - Aeropuerto Internacional Brigadier General Antonio Parodi': 'EQS',
  'Formosa - Aeropuerto Internacional de Formosa': 'FMA',
  'Mar del Plata - Aeropuerto Internacional Ástor Piazzolla': 'MDQ',
  'Mendoza - Aeropuerto Internacional Gobernador Francisco Gabrielli': 'MDZ',
  'Neuquén - Aeropuerto Internacional Presidente Perón': 'NQN',
  'Posadas - Aeropuerto Libertador General José de San Martín': 'PSS',
  'Puerto Iguazú - Aeropuerto Internacional Cataratas del Iguazú': 'IGR',
  'Resistencia - Aeropuerto Internacional de Resistencia': 'RES',
  'Río Gallegos - Aeropuerto Internacional Piloto Civil Norberto Fernández': 'RGL',
  'Río Grande - Aeropuerto Internacional Hermes Quijada': 'RGA',
  'Rosario - Aeropuerto Internacional Rosario - Islas Malvinas': 'ROS',
  'Salta - Aeropuerto Internacional Martín Miguel de Güemes': 'SLA',
  'San Miguel de Tucumán - Aeropuerto Internacional Teniente Benjamín Matienzo': 'TUC',
  'San Salvador de Jujuy - Aeropuerto Internacional Gobernador Horacio Guzmán': 'JUJ',
  'Santa Rosa del Conlara - Aeropuerto Valle del Conlara': 'RLO',
  'Termas de Río Hondo - Aeropuerto Internacional Termas de Río Hondo': 'RHD',
  'Trelew - Aeropuerto Almirante Marcos A. Zar': 'REL',
  'Ushuaia - Aeropuerto Internacional Ushuaia - Malvinas Argentinas': 'USH'
};


const irARuta = () => {
  arrival_idError.value = '';
  departure_idError.value = '';
  return_dateError.value = '';

  if (!arrival_id.value) {
    arrival_idError.value = 'Por favor selecciona un lugar de llegada.';
  }
  if (!departure_id.value) {
    departure_idError.value = 'Por favor selecciona un lugar de salida.';
  }
  if (!outbound_date.value || !return_date.value) {
    return;
  }

  const outbound_dateObj = new Date(outbound_date.value);
  const return_dateObj = new Date(return_date.value);

  if (return_dateObj < outbound_dateObj) {
    return_dateError.value = 'La fecha de vuelta no puede ser anterior a la de salida.';
    return;
  }

  if (outbound_dateObj < new Date()) {
    return_dateError.value = 'La fecha de salida no puede ser en el pasado.';
    return;
  }

  if (arrival_idError.value || departure_idError.value) {
    return;
  }

  router.push({
    path: '/resultados',
    query: {
      engine: 'google_flights',
      arrival_id: lugaresArgentinos[arrival_id.value],
      departure_id: lugaresArgentinos[departure_id.value],
      outbound_date: outbound_date.value,
      return_date: return_date.value,
    },
  });
};
</script>

<template>
  <IrAtras />
  <div class="flex items-center justify-center pt-6 pb-8">
    <div class="max-w-md p-4 bg-white rounded shadow-lg">
      <TituloSecundario>Buscar vuelos</TituloSecundario>
      <form @submit.prevent="irARuta">
        <div class="mb-4">
          <label for="departure_id" class="block text-sm font-medium">Lugar de salida:</label>
          <select id="departure_id" v-model="departure_id" class="border border-gray-300 p-2 rounded w-full" required>
            <option value="" disabled>Selecciona un lugar</option>
            <option v-for="(iata, lugar) in lugaresArgentinos" :key="iata" :value="lugar">{{ lugar }}</option>
          </select>
          <p v-if="departure_idError" class="text-red-500 text-sm">{{ departure_idError }}</p>
        </div>
        <div class="mb-4">
          <label for="arrival_id" class="block text-sm font-medium">Lugar de llegada:</label>
          <select id="arrival_id" v-model="arrival_id" class="border border-gray-300 p-2 rounded w-full" required>
            <option value="" disabled>Selecciona un lugar</option>
            <option v-for="(iata, lugar) in lugaresArgentinos" :key="iata" :value="lugar">{{ lugar }}</option>
          </select>
          <p v-if="arrival_idError" class="text-red-500 text-sm">{{ arrival_idError }}</p>
        </div>
        <div class="mb-4">
          <label for="outbound_date" class="block text-sm font-medium">Fecha de ida:</label>
          <input type="date" id="outbound_date" v-model="outbound_date" class="border border-gray-300 p-2 rounded w-full" required>
        </div>
        <div class="mb-4">
          <label for="return_date" class="block text-sm font-medium">Fecha de vuelta:</label>
          <input type="date" id="return_date" v-model="return_date" class="border border-gray-300 p-2 rounded w-full" required>
          <p v-if="return_dateError" class="text-red-500 text-sm">{{ return_dateError }}</p>
        </div>
        <div class="flex justify-center">
          <BotonPrincipal type="submit">Buscar vuelos</BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>
