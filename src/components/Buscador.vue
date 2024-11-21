<script setup>
import { ref, computed, onMounted } from 'vue';
import SpinnerCarga from './SpinnerCarga.vue'; 

import IconoBuscador from './icons/IconoBuscador.vue';

const destinos = ref([]);
const busqueda = ref(''); 
const cargando = ref(true);

onMounted(async () => {
  console.log("Cargando destinos...");
  try {
    const response = await fetch('https://back-tesis-lovat.vercel.app/arcana/lugares/');
    if (!response.ok) {
      throw new Error('Error al obtener los destinos');
    }
    const data = await response.json();
    console.log("Datos obtenidos:", data);
    destinos.value = data.data || []; 
  } catch (error) {
    console.error('Error al obtener los destinos:', error);
    destinos.value = []; 
  } finally {
    cargando.value = false; 
  }
});

const resultadosFiltrados = computed(() => {
  if (!busqueda.value) return [];

  const term = busqueda.value.toLowerCase().trim();
  return destinos.value.filter(destino => {
    const nombreCoincide = destino.nombre && destino.nombre.toLowerCase().includes(term);
    const ubicacionCoincide = destino.ubicacion && destino.ubicacion.toLowerCase().includes(term);
    return nombreCoincide || ubicacionCoincide;  // Devuelve si coincide en cualquiera de los dos
  });
});

const resaltarCoincidencias = (texto, termino) => {
  if (!termino) return texto;

  const regex = new RegExp(`(${termino})`, 'gi');
  return texto.replace(regex, '<b>$1</b>');
};
</script>

<template>
  <div class="relative buscador w-full max-w-lg mx-auto px-4">
    <label class="w-full flex items-center border border-[#3C4A28] rounded-full overflow-hidden">
      <input 
        type="text"
        v-model="busqueda"
        placeholder="Buscar destinos"
        class="w-full p-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3C4A28] rounded-l-full placeholder-gray-500 transition duration-200 ease-in-out" />

      <div class="bg-[#3C4A28] text-white rounded-full p-3 ml-2">
        <IconoBuscador class="w-6 h-6" />
      </div>
    </label>

    <!-- Cargando -->
    <SpinnerCarga v-if="cargando" />
    <!---Resultado-->
    <div v-if="resultadosFiltrados.length > 0" 
         class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-80 overflow-y-auto sm:max-h-96">
      <div v-for="resultado in resultadosFiltrados" :key="resultado._id" class="flex mb-3 p-2 hover:bg-gray-100">
        <router-link v-if="resultado._id" :to="{ name: 'lugarDetalle', params: { id: resultado._id } }" class="flex w-full">
          <img 
            v-if="resultado.imagen && resultado.imagen.length > 0"
            :src="resultado.imagen[0]"
            :alt="resultado.nombre"
            class="w-12 h-12 object-cover rounded mr-3"
          />
          <div>
            <p v-html="resaltarCoincidencias(resultado.nombre, busqueda)" class="font-semibold"></p>
            <p class="text-sm text-gray-500">{{ resultado.descripcion || 'Sin descripción' }}</p>
          </div>
        </router-link>
      </div>
    </div>
    <p v-if="busqueda && resultadosFiltrados.length === 0 && !cargando" 
      class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 text-center p-2 text-gray-500">
      No se encontraron resultados.
    </p>
  </div>
</template>

<style >
.absolute {
  z-index: 10; 
}


.max-h-80 {
  max-height: 20rem; 
}

.sm\\:max-h-96 {
  max-height: 24rem; 
}

.overflow-y-auto {
  overflow-y: auto; 
}

@media (max-width: 768px) {
  .buscador .w-full {
    width: 95%; 
  }
  .p-3 {
    padding: 0.75rem; 
  }
}
</style>
