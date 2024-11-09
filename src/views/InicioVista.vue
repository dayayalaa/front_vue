<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import Subtitulo from '../components/Subtitulo.vue';
import TarjetaDestino from '../components/TarjetaDestino.vue';
import MiItinerario from '../components/MiItinerario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const destinosPopulares = ref([
  { id: 1, nombre: 'Córdoba', img: '/img/cordoba.png' },
  { id: 2, nombre: 'Iguazú', img: '/img/iguazu.png' },
  { id: 3, nombre: 'Bariloche', img: '/img/bariloche.png' },
  { id: 4, nombre: 'Mendoza', img: '/img/mendoza.png' }
 
]);

const destinosArcana = ref([
  { id: 1, nombre: 'El Calafate', img: '/img/calafate.png' },
  { id: 2, nombre: 'Ushuaia', img: '/img/ushuaia.png' },
  { id: 3, nombre: 'La Pampa', img: '/img/lapampa.png' },
  { id: 4, nombre: 'Buenos Aires', img: '/img/buenosAires.png' },
]);

</script>



<template>
  <div>
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
      <MiItinerario/>
    </div>

      <!-- Sección de Destinos Arcana -->
      <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>Destinos Arcana</Subtitulo>
      <div class="flex flex-wrap gap-3 justify-center m-2">
        <RouterLink 
          v-for="destino in destinosArcana" 
          :key="destino.id" 
          :to="{ name: 'destinoArcana', params: { id: destino.id, type: 'arcana' } }" 
        >
          <TarjetaDestino 
            :nombre="destino.nombre" 
            :imagen="destino.img" 
          />
        </RouterLink>
      </div>
    </section>

       <!-- Guías de turismo local -->
       <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>¡Conoce nuestros guías!</Subtitulo>
      <RouterLink to="/guias"> 
        <BotonPrincipal>Guías locales</BotonPrincipal> 
      </RouterLink>
    </section>


    <!-- Sección de Destinos Populares -->
    <section class="flex flex-col justify-center items-center mb-20">
      <Subtitulo>Destinos Populares</Subtitulo>
      <div class="flex flex-col gap-6 justify-center">
        <RouterLink 
          v-for="destino in destinosPopulares" 
          :key="destino.id" 
          :to="{ name: 'destinoPopular', params: { id: destino.id, type: 'popular' } }"  
        >
          <div class="relative w-[300px] h-[150px]">
            <img 
              :src="destino.img" 
              :alt="`Imagen de ${destino.nombre}`" 
              class="w-full h-full object-cover rounded-lg" 
            />
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ destino.nombre }}
            </p>
          </div>
        </RouterLink>
      </div>
    </section>
  </div>
</template>

