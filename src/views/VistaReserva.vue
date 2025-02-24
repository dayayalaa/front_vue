<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const reservas = ref([]);
const cargando = ref(true);

const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(window.atob(base64));
    return decoded;
};

const token = localStorage.getItem('token');

const usuarioId = decodeJWT(token).userId;

const obtenerReservasPorUsuario = async () => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/provincia/${provincia}/usuario/${usuarioId}`);

    reservas.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener las reservas:', error);
  } finally {
    cargando.value = false;
  }
};

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('es-ES', options);
};

onMounted(() => {
  obtenerReservasPorUsuario();
});
</script>

<template>
    <IrAtras />
  <div class="p-4">
    <SpinnerCarga v-if="cargando" />
    <TituloSecundario class="text-3xl font-semibold mb-4">Reservas de Tours</TituloSecundario>

    <div v-if="cargando" class="flex justify-center items-center">
      <svg class="animate-spin h-8 w-8 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4V2m0 20v-2m4.28-6.28l1.42 1.42M4.28 4.28l1.42 1.42m12.56 12.56l1.42 1.42m-17.84 0l1.42-1.42M20 12h2m-20 0H2m16.72-4.28l1.42-1.42M4.28 12.28l1.42-1.42" />
      </svg>
    </div>

    <div v-else>
      <div v-if="reservas.length === 0" class="text-gray-500 mt-4">
        <p>No tienes reservas disponibles.</p>
      </div>

      <table v-else class="min-w-full table-auto mt-4">
        <thead>
          <tr>
            <th class="px-4 py-2 text-left">Tour</th>
            <th class="px-4 py-2 text-left">Fecha Reserva</th>
            <th class="px-4 py-2 text-left">Fecha Tour</th>
            <th class="px-4 py-2 text-left">Destino</th>
            <th class="px-4 py-2 text-left">Cantidad Personas</th>
            <th class="px-4 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva._id" class="border-b">
            <td class="px-4 py-2">{{ reserva.tourId.titulo }}</td>
            <td class="px-4 py-2">{{ formatDate(reserva.fechaReserva) }}</td>
            <td class="px-4 py-2">{{ formatDate(reserva.fechaTour) }}</td>
            <td class="px-4 py-2">{{ reserva.destino }}</td>
            <td class="px-4 py-2">{{ reserva.cantidadPersonas }}</td>
            <td class="px-4 py-2">
              <span :class="`text-sm font-semibold py-1 px-3 rounded ${getEstadoClass(reserva.estado)}`">{{ reserva.estado }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>