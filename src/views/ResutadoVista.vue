<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <h1 class="text-3xl font-bold text-center mb-6">Resultados de Vuelos</h1>

    <div v-if="cargando" class="flex justify-center items-center text-lg"><i class="fas fa-spinner fa-spin mr-2"></i>Cargando...</div>
    <div v-if="errorMensaje" class="text-red-500 text-center mt-4">{{ errorMensaje }}</div>

    <div v-if="vuelos.length > 0" class="mt-4">
      <h2 class="text-2xl font-semibold mb-4">Vuelos Encontrados</h2>
      
      <div v-for="vuelo in vuelos" :key="vuelo.price" class="bg-white border rounded-lg shadow-md p-6 mb-4">
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-xl">Tipo de Vuelo: <span class="text-blue-600">{{ vuelo.type }}</span></h3>
          <span class="text-xl font-semibold text-green-600">${{ vuelo.price.toLocaleString() }}</span>
        </div>
        
        <p class="text-gray-700">Duración Total: {{ vuelo.total_duration }} min</p>
        
        <h4 class="font-semibold mt-4">Detalles de los Vuelos:</h4>
        <div class="mt-2">
          <ul v-for="flight in vuelo.flights" :key="flight.flight_number" class="border-t border-gray-300 pt-2">
            <li class="py-2 flex items-start">
              <i class="fas fa-plane-departure mr-3 text-blue-500"></i>
              <div>
                <strong>Número de vuelo:</strong> {{ flight.flight_number }}<br>
                <strong>Aerolínea:</strong> {{ flight.airline }}<br>
                <strong>Salida:</strong> {{ flight.departure_airport.name }} a {{ flight.departure_airport.time }}<br>
                <strong>Llegada:</strong> {{ flight.arrival_airport.name }} a {{ flight.arrival_airport.time }}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="vuelos.length === 0 && !cargando" class="mt-4 text-center">
      <p>No se encontraron vuelos.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const vuelos = ref([]);
    const errorMensaje = ref('');
    const cargando = ref(true);

    const obtenerVuelos = async () => {
      const departure_idCodificado = 'BRC';
      const arrival_idCodificado = 'EZE';
      const outbound_dateCodificada = '2025-01-27';
      const return_dateCodificada = '2025-01-30';

      try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/vuelos/buscar/resultados`, {
          params: {
            engine: 'google_flights',
            departure_id: departure_idCodificado,
            arrival_id: arrival_idCodificado,
            outbound_date: outbound_dateCodificada,
            return_date: return_dateCodificada,
          },
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

    onMounted(obtenerVuelos);

    return {
      vuelos,
      errorMensaje,
      cargando,
    };
  },
};
</script>

<style scoped>
.bg-gray-50 {
    background-color: #f9fafb; /* Un fondo suave */
}
.shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra mediana */
}
.border {
    border-width: 1px;
}
.mb-4 {
    margin-bottom: 1rem; /* Separación entre bloques de vuelos */
}
.text-blue-600 {
    color: #2563eb; /* Un azul cálido para destacar */
}
.text-green-600 {
    color: #22c55e; /* Verde para el precio */
}
.text-gray-700 {
    color: #374151; /* Un gris más oscuro para el texto */
}
</style>