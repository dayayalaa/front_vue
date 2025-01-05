<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';

const route = useRoute();
const guia = ref(null);

const obtenerGuia = async (id) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${id}`);
    guia.value = response.data.data; 
  } catch (error) {
    console.error('Error al obtener los detalles del guía:', error);
  }
};

onMounted(() => {
  const id = route.params.id; 
  obtenerGuia(id); 
});
</script>

<template>
  <IrAtras />
  <div class="max-w-2xl mx-auto p-4">
    <TituloSecundario>Perfil Guía</TituloSecundario>
    <div v-if="guia" class="bg-white shadow-md rounded-lg p-4">

      <!-- Imagen de portada del perfil -->
    <div class="relative mb-4">
      <img :src="guia.fotoPortada" alt="Banner de perfil"
        class="w-full h-32 object-cover rounded-lg border-2 border-gray-300" />

      <div class="absolute inset-x-0 top-16 flex justify-center">
        <img :src="guia.fotoPerfil" alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md" />
      </div>
    </div>
      
    <!-- Nombre del guía -->
    <div class="text-center mb-4 mt-20">
      <TituloSecundario class="text-2xl">{{ loading ? 'Cargando...' : guia.nombre }}</TituloSecundario>
      <p><strong>Provincia:</strong> {{ guia.provincia }}</p>
      <p>{{ guia.descripcion }}</p>
      <TituloTerciario>Datos de contacto</TituloTerciario>
      <ul>
        <li>{{ guia.email }}</li>
        <li>{{ guia.telefono }}</li>
      </ul>
    </div>

    <!-- Sección de tours -->
    <div v-if="guia.tours && guia.tours.length > 0" class="mt-6">
      <TituloSecundario class="text-xl">Tours Disponibles</TituloSecundario>
      <ul class="space-y-4 mt-4">
        <li v-for="tour in guia.tours" :key="tour.id" class="bg-white p-4 rounded-lg shadow-md">
          <strong class="text-lg">{{ tour.nombre }}</strong>
          <p class="text-gray-600">{{ tour.descripcion }}</p>
        </li>
      </ul>
    </div>

    </div>


    <div v-else class="text-center">
      <p class="text-red-500">Guía no encontrado</p>
    </div>
  </div>
</template>
