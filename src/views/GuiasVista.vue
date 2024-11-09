<script setup>
import { ref } from 'vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';

const guias = ref([
  {
    id: 1,
    nombre: "Juan Pérez",
    provincia: "Buenos Aires",
    imagen: "./img/persona_1.jpeg", // Agregar la extensión de la imagen
  },
  {
    id: 2,
    nombre: "Ana López",
    provincia: "Córdoba",
    imagen: "/img/persona_2.jpeg", // Agregar la extensión de la imagen
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    provincia: "Mendoza",
    imagen: "/img/persona_3.jpeg" // Agregar la extensión de la imagen
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    provincia: "Salta",
    imagen: "/img/persona_4.jpeg", // Agregar la extensión de la imagen
  },
  {
    id: 5,
    nombre: "Roberto Díaz",
    provincia: "Santa Fe",
    imagen: "/img/persona_5.jpeg", // Agregar la extensión de la imagen
  },
  {
    id: 6,
    nombre: "María Rodríguez",
    provincia: "Misiones",
    imagen: "/img/persona_6.jpeg", // Agregar la extensión de la imagen
  },
]);
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 mb-20"> 
    <IrAtras/>
    <TituloPrincipal> Conocé a los guías locales </TituloPrincipal>
    <p class="text-center mb-6">
      Explorá Argentina con nuestros guías locales y descubrí los lugares de una forma más accesible.
    </p>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="guia in guias"
        :key="guia.id"
        class="bg-white shadow-md rounded-lg p-4 flex flex-col items-center"
      >
      
        <img
          :src="guia.imagen"
          :alt="'Foto de ' + guia.nombre"
          class="w-24 h-24 rounded-full mb-4 object-cover"
        />
        <strong class="text-lg">{{ guia.nombre }}</strong>
        <p class="text-gray-600">{{ guia.provincia }}</p>
      </div>
    </div>
  </div>
</template>
