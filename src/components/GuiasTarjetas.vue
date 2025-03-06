<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; 
import TituloSecundario from './TituloSecundario.vue';
import IrAtras from './IrAtras.vue';
import IconoBuscador from './icons/IconoBuscador.vue';
import SpinnerCarga from './SpinnerCarga.vue';

const router = useRouter();
const guias = ref([]);
const searchQuery = ref('');
const cargando = ref(true); 

const irADetalleGuia = (id) => {
  router.push({ name: 'GuiasPerfilVista', params: { id } });
};

const removeAccents = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

const filtroGuias = computed(() => {
  const query = removeAccents(searchQuery.value.toLowerCase());
  return guias.value.filter((guia) =>
    removeAccents(guia.nombre.toLowerCase()).includes(query) ||
    removeAccents(guia.provincia.toLowerCase()).includes(query)
  );
});

const resaltadoTexto = (text) => {
  const query = searchQuery.value.toLowerCase();
  if (query === '') return text;

  const index = text.toLowerCase().indexOf(query);
  if (index !== -1) {
    return text.slice(0, index) + 
           '<span class="font-bold text-[#597c50]">' + text.slice(index, index + query.length) + '</span>' +
           text.slice(index + query.length);
  }

  return text;
};

const obtenerGuias = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/usuarios/guia'); 
    guias.value = response.data.data;
  } catch (error) {
    console.error('Error al obtener guías:', error);
  } finally {
    cargando.value = false; 
  }
};

onMounted(() => {
  obtenerGuias();
});
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 mb-20">
    <IrAtras />
    <TituloSecundario> Conocé a los guías locales </TituloSecundario>
    <p class="mb-6">
      Explorá Argentina con nuestros guías locales y descubrí los lugares de una forma más accesible.
    </p>

    <!-- Campo de búsqueda -->
    <div class="mb-4 relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar guía"
        class="w-full p-3 pl-10 pr-14 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#3C4A28] transition duration-200 ease-in-out"
      />
      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#3C4A28] text-white rounded-full p-3">
        <IconoBuscador class="w-5 h-5" />
      </span>
    </div>

    <!-- Estado de carga -->
    <SpinnerCarga v-if="cargando"/>

    <!-- Lista de guías -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="guia in filtroGuias"
        :key="guia.id"
        class="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
        @click="irADetalleGuia(guia._id)" 
      >
        <img :src="guia.fotoPerfil" :alt="'Foto de ' + guia.nombre" class="w-24 h-24 rounded-full mb-4 object-cover" />

        <strong class="text-lg text-[#222725] font-sitka" v-html="resaltadoTexto(guia.nombre)"></strong>
        <p class="text-gray-600">{{ guia.provincia }}</p>
      </div>
    </div>
  </div>
</template>
