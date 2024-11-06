<script setup>
import { RouterLink } from 'vue-router';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import Subtitulo from '../components/Subtitulo.vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import TarjetaDestino from '../components/TarjetaDestino.vue';
import MiItinerario from '../components/MiItinerario.vue';

const destinos = [
  { id: 1, nombre: 'Jujuy', img: '/img/86475-Jujuy.jpg' },
  { id: 2, nombre: 'Misiones', img: '/img/misiones.jpg' },
  { id: 3, nombre: 'Neuquén', img: '/img/neuquen.jpg' },
  { id: 4, nombre: 'Santa Cruz', img: '/img/upsala-glacier.jpg' }
];
</script>

<template>
    <div >
    <!-- Sección principal de búsqueda -->
      <div class="flex flex-col justify-center items-center bg-cover bg-center h-64">
        <TituloPrincipal>¡Descubre nuevos destinos!</TituloPrincipal>
        <div class="mt-4">
          <label for="busqueda" class="hidden">Búsqueda:</label>
          <input 
            type="text" 
            id="busqueda" 
            class="border border-gray-300 p-2 rounded w-full"
            placeholder="Buscar destinos" 
            required 
          />
        </div>
      </div>

      <div>
    <MiItinerario />
  </div>

      <!-- Recomendaciones de Arcana -->
      <section class="flex flex-col justify-center items-center mb-20">
        <Subtitulo>Destinos Arcana</Subtitulo>
        <div class="flex flex-wrap gap-3 justify-center m-2">
          <TarjetaDestino 
            v-for="destino in destinos" 
            :key="destino.id" 
            :nombre="destino.nombre" 
            :imagen="destino.img" 
          />
        </div>
      </section>

      <!-- Guías de turismo local -->
      <section class="flex flex-col justify-center items-center mb-20">
        <Subtitulo>¡Conoce nuestros guías!</Subtitulo>
        <RouterLink to="/guias"> 
          <BotonPrincipal>Guías locales</BotonPrincipal> 
        </RouterLink>
      </section>

      <!-- Destinos populares -->
      <section class="flex flex-col justify-center items-center mb-20">
        <Subtitulo>Destinos populares</Subtitulo>
        <div class="flex flex-col gap-6 justify-center">
          <div v-for="destino in destinos" :key="destino.id" class="relative w-[300px] h-[150px]">
            <img 
              :src="destino.img" 
              :alt="`Imagen de ${destino.nombre}`" 
              class="w-full h-full object-cover rounded-lg" 
            />
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ destino.nombre }}
            </p>
          </div>
        </div>
      </section> 
    </div>
</template>
