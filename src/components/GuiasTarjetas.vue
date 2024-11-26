<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import TituloPrincipal from './TituloPrincipal.vue';
import IrAtras from './IrAtras.vue';
import IconoBuscador from './icons/IconoBuscador.vue';

const router = useRouter();
const guias = ref([
  { id: 1, nombre: "Juan Pérez", provincia: "Buenos Aires", imagen: "./img/persona_1.jpeg" },
  { id: 2, nombre: "Ana López", provincia: "Córdoba", imagen: "/img/persona_2.jpeg" },
  { id: 3, nombre: "Carlos Gómez", provincia: "Mendoza", imagen: "/img/persona_3.jpeg" },
  { id: 4, nombre: "Lucía Fernández", provincia: "Salta", imagen: "/img/persona_4.jpeg" },
  { id: 5, nombre: "Roberto Díaz", provincia: "Santa Fe", imagen: "/img/persona_5.jpeg" },
  { id: 6, nombre: "María Rodríguez", provincia: "Misiones", imagen: "/img/persona_6.jpeg" },
]);

const searchQuery = ref('');
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
</script>

<template>
  <div class="max-w-2xl mx-auto p-4 mb-20">
    <IrAtras />
    <TituloPrincipal> Conocé a los guías locales </TituloPrincipal>
    <p class="text-center mb-6">
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
      <!-- Redondel verde con ícono de lupa -->
      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#3C4A28] text-white rounded-full p-3">
        <IconoBuscador class="w-5 h-5" />
      </span>
    </div>

    <!-- Lista de guías -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div
        v-for="guia in filtroGuias"
        :key="guia.id"
        class="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
        @click="irADetalleGuia(guia.id)"
      >
        <img
          :src="guia.imagen"
          :alt="'Foto de ' + guia.nombre"
          class="w-24 h-24 rounded-full mb-4 object-cover"/>

        <strong class="text-lg text-[#222725]" v-html="resaltadoTexto(guia.nombre)"></strong>
        <p class="text-gray-600">{{ guia.provincia }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

input:focus {
  outline: none;
}

.grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
}

.shadow-lg:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.hover\:shadow-xl:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.bg-white {
  background-color: white;
}


</style>
