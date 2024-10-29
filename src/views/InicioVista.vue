<script setup>
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoMas from '../components/icons/IconoMas.vue'
</script>

<template>
  <main>
    <div class="fondo">

      <div class="flex flex-col justify-center items-center bg-cover bg-center h-64">
       <div>
        <h1 class="text-xl font-bold">¡Descubre nuevos destinos!</h1>
        <div class="mt-4">
          <label for="busqueda" class="hidden">Búsqueda:</label>
          <input type="text" id="busqueda" class="border border-gray-300 p-2 rounded w-full"
            placeholder="Buscar destinos" required>
        </div>
       </div>
      </div>

      <!-- Itinerario guardados del usuario -->
      <div class="w-full mb-16">
        <div class="flex justify-between m-3">
          <h2 class="text-lg font-semibold mb-2 ml-2.5">Mí itinerario:</h2>
          <a href="#">Ver más</a>
        </div>
<<<<<<< HEAD
      
=======

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

    <div class="w-[150px] h-[150px] flex-none rounded-lg border border-gray-600 flex items-center justify-center">
      <IconoMas class="w-20 h-20 text-gray-600" />
    </div>
  </div>
</div>

>>>>>>> 87441689789f07b4f80401477045073e51668101
      </div>

      <!-- Recomendaciones de Arcana -->
      <div class="flex flex-col justify-center items-center mb-20">
        <h2 class="text-xl font-bold mb-4">Destinos Arcana</h2>

        <div class="flex flex-wrap gap-6 justify-center">
          <div class="relative w-[150px] h-[250px]">
            <img src="/img/86475-Jujuy.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Jujuy</p>
          </div>

          <div class="relative w-[150px] h-[250px]">
            <img src="/img/misiones.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Misiones</p>
          </div>

          <div class="relative w-[150px] h-[250px]">
            <img src="/img/neuquen.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Neuquén</p>
          </div>

          <div class="relative w-[150px] h-[250px]">
            <img src="/img/upsala-glacier.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Santa Cruz</p>
          </div>
        </div>
      </div>

      <!-- Giuas de turismo local -->
      <div class="flex flex-col justify-center items-center mb-20">
        <h2 class="text-xl font-bold mb-4">¡Conoce nuestros guías!</h2>
        <BotonPrincipal>Guías locales</BotonPrincipal>
      </div>

      <!-- Más reservados por la gente -->
      <div class="flex flex-col justify-center items-center mb-20">
        <h2 class="text-xl font-bold mb-4">Destinos populares</h2>

        <div class="flex flex-col gap-6 justify-center">
          <div class="relative w-[350px] h-[150px]">
            <img src="/img/86475-Jujuy.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Jujuy</p>
          </div>

          <div class="relative w-[350px] h-[150px]">
            <img src="/img/misiones.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Misiones</p>
          </div>

          <div class="relative w-[350px] h-[150px]">
            <img src="/img/neuquen.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Neuquén</p>
          </div>

          <div class="relative w-[350px] h-[150px]">
            <img src="/img/upsala-glacier.jpg" alt="" class="w-full h-full object-cover rounded-lg">
            <p class="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              Santa Cruz</p>
          </div>
        </div>
      </div>

    </div>
    
  </main> 
</template>

<style>
.fondo{
  background-image: url('/img/fondo-3.png'); 
  background-repeat: no-repeat;
  background-size: cover;
}
</style>