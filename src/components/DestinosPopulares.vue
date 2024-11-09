<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TituloPrincipal from './TituloPrincipal.vue';
import IrAtras from './IrAtras.vue';

const destinosPopulares = ref([
  { 
    id: 1, 
    nombre: 'Córdoba', 
    img: '/img/cordoba.png', 
    descripcion: 'Explora la histórica Córdoba, una ciudad llena de encanto colonial y moderna vibrante vida estudiantil. Conocida por su arquitectura jesuítica, como la Manzana Jesuítica, y su cercanía a las sierras, Córdoba es ideal para los amantes de la historia, la naturaleza y la aventura, con opciones para trekking y actividades al aire libre.' 
  },
  { 
    id: 2, 
    nombre: 'Iguazú', 
    img: '/img/iguazu.png', 
    descripcion: 'Maravíllate con las imponentes Cataratas del Iguazú, una de las siete maravillas naturales del mundo. En el Parque Nacional Iguazú, podrás caminar por pasarelas que ofrecen vistas espectaculares de las cataratas y explorar la selva misionera, hogar de una rica biodiversidad. La experiencia se completa con la posibilidad de realizar paseos en barco y visitas a la Garganta del Diablo.' 
  },
  { 
    id: 3, 
    nombre: 'Bariloche', 
    img: '/img/bariloche.png', 
    descripcion: 'Conoce la hermosa ciudad de Bariloche, ubicada en la Patagonia Argentina, rodeada por los lagos Nahuel Huapi y Moreno. Famosa por su arquitectura alpina y sus paisajes de montañas cubiertas de nieve, Bariloche es un destino ideal para los amantes del esquí en invierno y el senderismo en verano. También es conocida por su exquisita chocolate, una delicia que no te puedes perder.' 
  },
  { 
    id: 4, 
    nombre: 'Mendoza', 
    img: '/img/mendoza.png', 
    descripcion: 'Disfruta de los viñedos en Mendoza, la región vitivinícola más importante de Argentina, famosa por sus vinos Malbec. Recorrerás pintorescos viñedos y bodegas, donde podrás degustar algunos de los mejores vinos del mundo. Además, Mendoza ofrece paisajes deslumbrantes como los Andes, perfectos para hacer trekking, montañismo o explorar la Alta Montaña y el Aconcagua, la montaña más alta de América.' 
  }
]);

const route = useRoute();
const destinoId = route.params.id;
const destino = ref(null);

onMounted(() => {
  // Buscar el destino por su ID
  destino.value = destinosPopulares.value.find(d => d.id === parseInt(destinoId));
});
</script>

<template>
  <IrAtras />
  <div v-if="destino" class="max-w-3xl mx-auto px-4 py-6 mb-12">
    <!-- Titulo Principal -->
    <TituloPrincipal class="text-center text-4xl font-semibold text-gray-800 mb-6">{{ destino.nombre }}</TituloPrincipal>

    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <!-- Imagen principal del destino -->
      <img :src="destino.img" :alt="destino.nombre" class="w-full h-60 object-cover" />
      
      <!-- Descripción del destino -->
      <div class="px-6 py-4">
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ destino.descripcion }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Estilos globales opcionales para mantener un diseño consistente */
.container {
  max-width: 1200px;
}

.bg-white {
  background-color: #ffffff;
}

.text-gray-600 {
  color: #4B5563;
}

.text-sm {
  font-size: 0.875rem;
}

.text-center {
  text-align: center;
}

.font-semibold {
  font-weight: 600;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-12 {
  margin-bottom: 3rem; 
}
</style>
