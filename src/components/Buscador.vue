<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Importa el router
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import IconoBuscador from './icons/IconoBuscador.vue';

const router = useRouter(); // Obtén acceso al router

const destinos = ref([]);
const provinciasDisponibles = ref([]); // Provincias disponibles
const busqueda = ref('');
const cargando = ref(false);
const provinciaSeleccionada = ref('');
const mostrarResultados = ref(false); // Controla cuando se muestran los resultados
const mostrarSugerencias = ref(false); // Controla cuando se muestran las sugerencias de provincias

// Función para obtener destinos por provincia
const obtenerDestinos = async () => {
  if (!provinciaSeleccionada.value) {
    console.error('No se ha especificado una provincia');
    destinos.value = [];
    return;
  }

  cargando.value = true;
  console.log("Buscar por provincia:", provinciaSeleccionada.value);

  try {
    const response = await axios.get(
      `https://back-tesis-lovat.vercel.app/arcana/destino/provincia?provincia=${provinciaSeleccionada.value}`
    );
    console.log("Respuesta completa:", response);
    destinos.value = response.data.data || [];
  } catch (error) {
    console.error('Error al obtener los destinos:', error);
    destinos.value = [];
  } finally {
    cargando.value = false;
  }
};

// Se ejecuta cada vez que cambia la provincia seleccionada
watch(provinciaSeleccionada, obtenerDestinos);

// Filtrar provincias disponibles basadas en la búsqueda
const filtrarProvincias = computed(() => {
  const term = busqueda.value.toLowerCase().trim();
  return provinciasDisponibles.value.filter((provincia) =>
    provincia.toLowerCase().includes(term)
  );
});

// Simulación de provincias disponibles
onMounted(() => {
  provinciasDisponibles.value = [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "CABA", "Córdoba", "Corrientes", "Entre Ríos",
    "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego",
    "Tucumán"
  ];
});

// Resalta las coincidencias en los resultados
const resaltarCoincidencias = (texto, termino) => {
  if (!termino) return texto;
  const regex = new RegExp(`(${termino})`, 'gi');
  return texto.replace(regex, '<b class="text-[#3C4A28]">$1</b>'); // Resalta en color verde
};

// Función para activar la búsqueda y redirigir a la provincia
const activarBusqueda = () => {
  provinciaSeleccionada.value = busqueda.value;
  mostrarResultados.value = true; // Mostrar los resultados después de hacer clic en "Buscar"
  mostrarSugerencias.value = false; // Ocultar las sugerencias después de la búsqueda
  
  // Redirigir a la ruta de la provincia usando router.push
  router.push({ name: 'ProvinciasVistas', params: { id: provinciaSeleccionada.value } });
};

// Mostrar las sugerencias de provincias cuando el input recibe el foco
const mostrarSugerenciasAlHacerClick = () => {
  mostrarSugerencias.value = true;
};

const ocultarSugerencias = () => {
  mostrarSugerencias.value = false;
};
</script>

<template>
  <div class="relative w-full max-w-lg mx-auto px-4">
    <!-- Barra de búsqueda -->
    <label class="w-full flex items-center border border-[#3C4A28] rounded-full overflow-hidden">
      <input type="text" v-model="busqueda" placeholder="Buscar provincia"
        class="w-full p-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3C4A28] rounded-l-full placeholder-gray-500 transition duration-200 ease-in-out"
        @focus="mostrarSugerenciasAlHacerClick" @blur="ocultarSugerencias" />

      <!-- Icono de búsqueda -->
      <div class="bg-[#3C4A28] text-white rounded-full p-3 ml-2 cursor-pointer" @click="activarBusqueda">
        <IconoBuscador class="w-6 h-6" />
      </div>
    </label>

    <!-- Indicador de carga -->
    <SpinnerCarga v-if="cargando" />

    <!-- Sugerencias de provincias (se muestra al hacer clic en el input) -->
    <div v-if="mostrarSugerencias && filtrarProvincias.length > 0 && !mostrarResultados" 
      class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-80 overflow-y-auto sm:max-h-96">
      <div v-for="(provincia, index) in filtrarProvincias" :key="index"
        @click="busqueda = provincia; provinciaSeleccionada = provincia; mostrarResultados = true; mostrarSugerencias = false"
        class="flex mb-3 p-2 hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out">
        <p v-html="resaltarCoincidencias(provincia, busqueda)" class="text-lg"></p>
      </div>
    </div>

    <!-- Mensaje cuando no hay provincias coincidentes -->
    <p v-if="busqueda && filtrarProvincias.length === 0" class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 text-center p-2 text-gray-500">
      No se encontraron provincias.
    </p>

    <!-- Resultados filtrados por provincia -->
    <div v-if="mostrarResultados" class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-80 overflow-y-auto sm:max-h-96">
      <div v-for="resultado in destinos" :key="resultado._id"
        class="flex mb-3 p-2 hover:bg-gray-100 transition duration-300 ease-in-out">
        <router-link v-if="resultado._id" :to="{ name: 'lugarDetalle', params: { id: resultado._id } }"
          class="flex w-full hover:scale-105 transform transition duration-300 ease-in-out">
          <img v-if="resultado.imagen && resultado.imagen.length > 0" :src="resultado.imagen[0]" :alt="resultado.nombre"
            class="w-20 h-20 object-cover rounded-lg mr-4" />
          <div class="flex flex-col justify-center">
            <p v-html="resaltarCoincidencias(resultado.nombre, busqueda)" class="font-semibold text-lg"></p>
            <p class="text-sm text-gray-500">{{ resultado.ubicacion || 'Sin especificar' }}</p>
            <p class="text-xs text-gray-400 mt-1" v-if="resultado.descripcion">
              {{ resultado.descripcion.slice(0, 80) }}...
            </p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <p v-if="busqueda && destinos.length === 0 && !cargando" 
       class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 text-center p-2 text-gray-500">
      No se encontro la provincia.
    </p>
  </div>
</template>
