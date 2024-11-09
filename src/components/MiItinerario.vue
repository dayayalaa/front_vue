<script setup>
import { RouterLink } from 'vue-router';
import IconoMas from '../components/icons/IconoMas.vue';

const itinerarios = [
  { id: 1, img: '/img/86475-Jujuy.jpg',      alt: 'Imagen de Jujuy' },
  { id: 2, img: '/img/misiones.jpg',         alt: 'Imagen de Misiones' },
  { id: 3, img: '/img/neuquen.jpg',          alt: 'Imagen de Neuquén' },
  { id: 4, img: '/img/upsala-glacier.jpg',   alt: 'Imagen de Santa Cruz' }
];
</script>

<template>
  <div class="w-full mb-16">
    <div class="flex justify-between m-3">
      <h2 class="text-lg font-semibold mb-2 ml-2.5">Mi itinerario:</h2>
      <a href="#" class="text-blue-500 hover:underline">Ver más</a>
    </div>

    <div class="overflow-x-auto">
      <div class="flex gap-4 ml-3">
        <!-- Recorrer itinerarios y hacer clic para ir al detalle -->
        <router-link
          v-for="itinerario in itinerarios"
          :key="itinerario.id"
          :to="{ name: 'ItinerarioDetalle', params: { id: itinerario.id }}"
          class="w-[150px] h-[150px] flex-none"
        >
          <img :src="itinerario.img" :alt="itinerario.alt" class="w-full h-full object-cover rounded-lg" />
        </router-link>

        <!-- Ícono de agregar nuevo itinerario -->
        <div class="w-[150px] h-[150px] flex-none rounded-lg border border-gray-600 flex items-center justify-center">
          <IconoMas class="w-20 h-20 text-gray-600" />
        </div>
      </div>
    </div>
  </div>
</template>
