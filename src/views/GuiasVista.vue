<script setup>
import { ref } from 'vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';

const guias = ref([
  {
    id: 1,
    nombre: "Juan Pérez",
    provincia: "Buenos Aires",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 2,
    nombre: "Ana López",
    provincia: "Córdoba",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    provincia: "Mendoza",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    provincia: "Salta",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 5,
    nombre: "Roberto Díaz",
    provincia: "Santa Fe",
    imagen: "https://via.placeholder.com/100",
  },
  {
    id: 6,
    nombre: "María Rodríguez",
    provincia: "Misiones",
    imagen: "https://via.placeholder.com/100",
  },
]);
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 mb-20"> 
    <TituloPrincipal> Conoce a los guías locales </TituloPrincipal>
    <p class="text-center mb-6">
      Explora Argentina con nuestros guías locales y descubrí los lugares de una forma más accesible.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="guia in guias"
        :key="guia.id"
        class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
      >
      <div class="w-24 h-24 rounded-full mb-4 bg-gray-500"></div>
        <!-- <img
          :src="guia.imagen"
          alt="Foto del guía"
          class="w-24 h-24 rounded-full mb-4"
        /> -->
        <strong class="text-lg">{{ guia.nombre }}</strong>
        <p class="text-gray-600">{{ guia.provincia }}</p>
      </div>
    </div>
  </div>
</template>
