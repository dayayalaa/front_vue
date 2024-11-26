<script setup>
import TituloSecundario from '../components/TituloSecundario.vue';
// import BotonPrincipal from '../components/BotonPrincipal.vue';
import MiItinerario from '../components/MiItinerario.vue';
import IrAtras from '../components/IrAtras.vue';

const userName = 'Juan Pérez';
</script>

<template>
  <IrAtras/>
  <div class="max-w-md mx-auto p-4 mb-20">
    
    <div class="relative mb-4">
      <img
        src="/img/neuquen.jpg"
        alt="Banner de perfil"
        class="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
      />

      <div class="absolute inset-x-0 top-16 flex justify-center"> 
        <img
          src="/img/viajero.jpg"
          alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
      </div>
    </div>
  
    <div class="text-center mb-4 mt-20">
      <TituloSecundario class="text-2xl">{{ userName }}</TituloSecundario>
      <p>Perfil de viajero</p>
    </div>

    <MiItinerario />

    <div class="flex justify-center mt-6">
      <!-- <BotonPrincipal>Ver mi mapa</BotonPrincipal> -->
    </div>
  </div>
</template>
