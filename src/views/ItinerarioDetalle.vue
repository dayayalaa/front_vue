<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const route = useRoute();
const itinerario = ref(null);

const itinerariosData = [
  { 
    id: 1, 
    img: '/img/86475-Jujuy.jpg', 
    nombre: 'Jujuy', 
    description: 'Descubre los paisajes vibrantes y coloridos de Jujuy, una provincia del noroeste argentino famosa por sus montañas, salinas y la cultura andina.' 
  },
  { 
    id: 2, 
    img: '/img/misiones.jpg', 
    nombre: 'Misiones', 
    description: 'Sumérgete en la exuberante naturaleza de Misiones, hogar de las impresionantes Cataratas del Iguazú, rodeadas por selvas subtropicales llenas de vida.' 
  },
  { 
    id: 3, 
    img: '/img/neuquen.jpg', 
    nombre: 'Neuquén', 
    description: 'Neuquén te invita a explorar sus paisajes de montañas y lagos, con una gran oferta de actividades al aire libre en la Patagonia argentina.' 
  },
  { 
    id: 4, 
    img: '/img/upsala-glacier.jpg', 
    nombre: 'Santa Cruz', 
    description: 'Admira la majestuosidad de los glaciares y las vastas estepas de Santa Cruz, una provincia patagónica ideal para los amantes de la naturaleza y la aventura.' 
  }
];

onMounted(() => {
  itinerario.value = itinerariosData.find(i => i.id === Number(route.params.id));
});
</script>

<template>
  <IrAtras />
  <div v-if="itinerario" class="max-w-3xl mx-auto px-4 py-6 mb-12">
    <TituloPrincipal class="text-center text-4xl font-semibold text-gray-800 mb-6">{{ itinerario.nombre }}</TituloPrincipal>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img :src="itinerario.img" :alt="itinerario.nombre" class="w-full h-64 object-cover rounded-t-lg" />
      <div class="px-6 py-4">
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ itinerario.description }}
        </p>
      </div>
      
     <!-- Guías de turismo local -->
     <section class="flex flex-col justify-center items-center mb-20">
      <RouterLink to="/guias"> 
        <BotonPrincipal>Guías locales</BotonPrincipal> 
      </RouterLink>
    </section>
    </div>
  </div>
  <p v-else class="text-center text-gray-600">Itinerario no encontrado.</p>
</template>

<style scoped>
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
