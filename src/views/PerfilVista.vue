<script setup>
import TituloPrincipal from '../components/TituloPrincipal.vue';


const userName = 'Juan Pérez';
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <div class="relative mb-4">
      <img
        src="/img/neuquen.jpg"
        alt="Banner de perfil"
        class="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
      />
      
      <div class="absolute left-1/2 transform -translate-x-1/2 top-16"> 
        <img
          src="/img/viajero.jpg"
          alt="Foto de perfil"
          class="w-32 h-32 rounded-full border-4 border-white shadow-md"
        />
      </div>
    </div>
    <div class="text-center mb-4 mt-32"> 
      <TituloPrincipal class="text-2xl font-bold">Perfil de Usuario</TituloPrincipal>
      <p>¡Bienvenido, {{ userName }}!</p>
    </div>
  </div>
</template>
