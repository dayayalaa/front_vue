<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import IconoBuscador from './icons/IconoBuscador.vue';

const router = useRouter();

const destinos = ref([]);
const provinciasDisponibles = ref([]);
const busqueda = ref('');
const cargando = ref(false);
const provinciaSeleccionada = ref('');
const mostrarSugerencias = ref(false);

const obtenerDestinos = async () => {
  if (!provinciaSeleccionada.value) {
    destinos.value = [];
    return;
  }

  cargando.value = true;
  try {
    const response = await axios.get(
      `https://back-tesis-lovat.vercel.app/arcana/destino/provincia?provincia=${provinciaSeleccionada.value}`
    );
    destinos.value = response.data.data || [];
  } catch {
    destinos.value = [];
  } finally {
    cargando.value = false;
  }
};

watch(provinciaSeleccionada, (nueva) => {
  if (nueva) obtenerDestinos();
});

const filtrarProvincias = computed(() => {
  const term = busqueda.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return provinciasDisponibles.value.filter((provincia) =>
    provincia.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term)
  );
});

onMounted(() => {
  provinciasDisponibles.value = [
    "Buenos Aires", "Catamarca", "Chaco", "Chubut", "CABA", "Córdoba", "Corrientes", "Entre Ríos",
    "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
    "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
  ];
});

const seleccionarProvincia = (provincia) => {
  busqueda.value = provincia;
  provinciaSeleccionada.value = provincia;
  mostrarSugerencias.value = false;
};

const resaltarCoincidencias = (texto, termino) => {
  if (!termino) return texto;
  return texto.replace(new RegExp(`(${termino})`, 'gi'), '<b class="text-[#3C4A28]">$1</b>');
};

const activarBusqueda = () => {
  provinciaSeleccionada.value = busqueda.value;
  router.push({ name: 'ProvinciasVistas', params: { id: provinciaSeleccionada.value } });
};

</script>

<template>
  <div class="relative w-full max-w-lg mx-auto px-4">
    <!-- Barra de búsqueda -->
    <label class="w-full flex items-center border border-[#3C4A28] rounded-full overflow-hidden">
      <input type="text" 
        v-model="busqueda" 
        placeholder="Buscar provincia"
        class="w-full p-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3C4A28] rounded-l-full placeholder-gray-500 transition duration-200 ease-in-out"
        @focus="mostrarSugerencias = true" 
        @blur="setTimeout(() => mostrarSugerencias = false, 200)" />

      <!-- Icono de búsqueda -->
      <div class="bg-[#3C4A28] text-white rounded-full p-3 ml-2 cursor-pointer" @click="activarBusqueda">
        <IconoBuscador class="w-6 h-6" />
      </div>
    </label>

    <!-- Indicador de carga -->
    <SpinnerCarga v-if="cargando" />

    <!-- Lista de sugerencias -->
    <div v-if="mostrarSugerencias && filtrarProvincias.length" 
      class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 z-10 max-h-80 overflow-y-auto sm:max-h-96">
      <div v-for="(provincia, index) in filtrarProvincias" :key="index"
        @click="seleccionarProvincia(provincia)"
        class="flex mb-3 p-2 hover:bg-gray-100 cursor-pointer transition duration-300 ease-in-out">
        <p v-html="resaltarCoincidencias(provincia, busqueda)" class="text-lg"></p>
      </div>
    </div>

    <!-- Mensaje cuando no hay resultados -->
    <p v-if="busqueda && !filtrarProvincias.length && !provinciasDisponibles.includes(busqueda) && !cargando"
      class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 text-center p-2 text-gray-500">
      No se encontró la provincia.
    </p>
  </div>
</template>
