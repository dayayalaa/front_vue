<script setup>
import TituloPrincipal from '../components/TituloPrincipal.vue';
import IconoMas from '../components/icons/IconoMas.vue';


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

    <div class="w-full mb-16">
        <div class="flex justify-between m-3">
          <h2 class="text-lg font-semibold mb-2 ml-2.5">Mí itinerario:</h2>
          <a href="#">Ver más</a>
        </div>

        <div class="overflow-x-auto">
          <div class="flex gap-4 ml-3">
            <div class="w-[150px] h-[150px] flex-none">
              <img src="/img/86475-Jujuy.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            </div>

            <div class="w-[150px] h-[150px] flex-none">
              <img src="/img/misiones.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            </div>

            <div class="w-[150px] h-[150px] flex-none">
              <img src="/img/neuquen.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            </div>

            <div class="w-[150px] h-[150px] flex-none">
              <img src="/img/upsala-glacier.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            </div>

            <div
              class="w-[150px] h-[150px] flex-none rounded-lg border border-gray-600 flex items-center justify-center">
              <IconoMas class="w-20 h-20 text-gray-600" />
            </div>
          </div>
        </div>
      </div>
  </div>
</template>
