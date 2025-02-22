<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const route = useRoute();
const guia = ref(null);
const tours = ref([]);
const cargando = ref(true);
const error = ref(false);

const obtenerGuia = async (id) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${id}`);
    guia.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener los detalles del guía:', error);
    error.value = true;
  }
};

const obtenerTours = async (id) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/segunGuia?id=${id}`);
    tours.value = response.data;
  } catch (error) {
    console.error('Error al obtener los tours del guía:', error);
    error.value = true;
  } finally {
    cargando.value = false;
  }
};

onMounted(() => {
  const id = route.params.id;
  obtenerGuia(id);
  obtenerTours(id);
});
</script>

<template>
  <IrAtras />
  <div class="max-w-2xl mx-auto p-4">
    <SpinnerCarga v-if="cargando" />
  

    <div v-if="guia && !error" class="bg-white shadow-md rounded-lg p-4">
      <div class="relative mb-4">
        <img :src="guia.fotoPortada" alt="Banner de perfil"
          class="w-full h-32 object-cover rounded-lg border-2 border-gray-300" />
        <div class="absolute inset-x-0 top-16 flex justify-center">
          <img :src="guia.fotoPerfil" alt="Foto de perfil"
            class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md" />
        </div>
      </div>

      <div class="text-center mb-4 mt-20">
        <TituloSecundario class="text-2xl">{{ guia.nombre }}</TituloSecundario>
        <p><strong class="text-[#788A68]">Provincia:</strong> {{ guia.provincia }}</p>
        <p>{{ guia.descripcion }}</p>
        <hr class="m-4">

        <TituloTerciario class="mt-4"><strong>Datos de contacto</strong></TituloTerciario>
        <ul class="m-0 p-0">
          <li v-if="guia.email"><strong class="text-[#788A68]">Email: </strong>{{ guia.email }}</li>
          <li v-if="guia.telefono"><strong class="text-[#788A68]">Teléfono: </strong>{{ guia.telefono }}</li>
        </ul>
      </div>

      <hr class="m-4">
      
      <div v-if="tours.length > 0" class="mt-6">
        <TituloSecundario class="text-xl">Tours Disponibles</TituloSecundario>
        <ul class="space-y-4 mt-4">
          <li v-for="tour in tours" :key="tour._id" class="bg-white p-4 rounded-lg shadow-md">
            <strong class="text-lg text-[#A86A36]">{{ tour.titulo }}</strong>
            <p class="text-gray-600">{{ tour.descripcion }}</p>
            <p><strong>Precio:</strong> {{ tour.precio }} ARS</p>
            <p><strong>Duración:</strong> {{ tour.duracion }}</p>
            <div class="mt-4 text-right">
              <router-link :to="`/vistaTur/${tour._id}`"
                class="px-4 py-2 bg-[#A86A36] text-white rounded">
                Ver más
              </router-link>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <div v-else-if="error" class="text-center">
      <p class="text-red-500">Guía no encontrado</p>
    </div>
  </div>
</template>
