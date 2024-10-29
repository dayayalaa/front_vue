<template>
  <main>
    <div class="flex flex-col justify-center items-center">
      <h1 class="text-xl font-bold">¡Descubre nuevos destinos!</h1>
      <div class="mb-4">
        <label for="busqueda" class="block text-sm font-medium">Búsqueda:</label>
        <input type="text" id="busqueda" class="border border-gray-300 p-2 rounded w-full" placeholder="Buscar destinos" required>
      </div>

      <div class="w-full">
        <h2 class="text-lg font-semibold mb-2 ml-2.5">Mí itinerario:</h2>

        <div class="overflow-x-auto whitespace-nowrap">
          <div class="flex gap-6">
            <div class="w-[150px] h-[150px] bg-gray-700 rounded-lg shadow-lg">
              <p class="text-white text-center">Contenido 1</p>
            </div>

            <div class="w-[150px] h-[150px] bg-gray-700 rounded-lg shadow-lg">
              <p class="text-white text-center">Contenido 2</p>
            </div>

            <div class="w-[150px] h-[150px] bg-gray-700 rounded-lg shadow-lg">
              <p class="text-white text-center">Contenido 3</p>
            </div>

            <div class="w-[150px] h-[150px] bg-gray-700 rounded-lg shadow-lg">
              <p class="text-white text-center">Contenido 4</p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </main>
</template>
