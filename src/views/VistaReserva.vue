<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const reservas = ref([]);
const cargando = ref(true);
const route = useRoute();
const provincia = route.query.provincia;
// console.log('Provincia:', provincia);

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = JSON.parse(window.atob(base64));
  return decoded;
};

const token = localStorage.getItem('token');

const usuarioId = decodeJWT(token).userId;

const obtenerReservasPorUsuario = async () => {
  // console.log('Id usuarios:', usuarioId);

  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/provincia/${provincia}/usuario/${usuarioId}`);

    // console.log('Respuesta:', response);
    reservas.value = response.data.data;
    // console.log('Respuesta:', reservas.value);

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

    <div v-if="reservas.length === 0" class="text-gray-500 mt-4">
      <p>No tienes reservas disponibles.</p>
    </div>
    <div class="space-y-6">
      <div v-for="reserva in reservas" :key="reserva._id"
        class="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
        <div>
          <TituloTerciario>Destino: {{ reserva.destino }}</TituloTerciario>
          <p><strong class="text-[#3C4A28]">Fecha: </strong>{{ formatDate(reserva.fechaTour) }}</p>
          <p><strong class="text-[#3C4A28]">Cantidad de personas: </strong>{{ reserva.cantidadPersonas }}</p>
          <div class="flex mb-6">
             <p><strong class="text-[#3C4A28]">Costo: </strong>{{ reserva.costo }} </p>
          <p v-if="reserva.estado" :class="{
              'text-[#A86A36]': reserva.estado === 'pendiente',
              'text-[#788A68]': reserva.estado === 'confirmada',
              'text-[#7E2323]': reserva.estado === 'cancelada'
            }" class="font-semibold ms-2">
            {{ reserva.estado.charAt(0).toUpperCase() + reserva.estado.slice(1) }}
          </p>
          </div>
         
          <router-link :to="`/reservaDetalle/${reserva._id}`"
            class="px-4 py-2 flex items-center bg-[#A86A36] text-white text-sm rounded">Ver detalles</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
