<template>
    <div class="max-w-md mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">Armar mi viaje</h1>
  
      <!-- Tarjeta para elegir destino -->
      <div class="bg-white shadow-md rounded-lg p-4 mb-4">
        <h2 class="text-lg font-semibold mb-2">Elegir mi destino</h2>
        <div class="relative">
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Busca tu destino..."
            class="w-full p-2 border border-gray-300 rounded-lg pr-10"
          />
          <svg
            class="absolute top-1/2 right-2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-4.35-4.35M17 10a7 7 0 10-14 0 7 7 0 0014 0z"
            />
          </svg>
        </div>
      </div>
  
      <!-- Tarjeta para elegir por fecha -->
      <div class="bg-white shadow-md rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4">Elegir por fecha</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block mb-1">Fecha de Ida</label>
            <input
              type="date"
              class="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label class="block mb-1">Fecha de Vuelta</label>
            <input
              type="date"
              class="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
  
        <!-- Duración aproximada -->
        <h4 class="text-md font-semibold mt-4">O duración aproximada</h4>
        <div class="flex space-x-2 mt-2">
          <button class="border border-gray-400 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200">
            Una semana
          </button>
          <button class="border border-gray-400 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200">
            Un fin de semana
          </button>
          <button class="border border-gray-400 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-200">
            Una quincena
          </button>
        </div>
      </div>
  
      <!-- Botón de continuar -->
      <div class="mt-6 text-center">
        <button class="bg-blue-500 text-white rounded-lg px-6 py-2 hover:bg-blue-600">
          Continuar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        searchTerm: '',
      };
    },
  };
  </script>
  
