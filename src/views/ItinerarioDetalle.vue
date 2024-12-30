<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import TituloSecundario from '../components/TituloSecundario.vue';
import IrAtras from '../components/IrAtras.vue';

// Importacion de iconos
import IconoLista from '../components/icons/IconoLista.vue';
import IconoCalendario from '../components/icons/IconoCalendario.vue';
import IconoMapa from '../components/icons/IconoMapa.vue';
import IconoMas from '../components/icons/IconoMas.vue';

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
    
    <TituloSecundario class="text-center text-4xl ">{{ itinerario.nombre }}</TituloSecundario>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img :src="itinerario.img" :alt="itinerario.nombre" class="w-full h-64 rounded-t-lg object-cover"/>
      <div class="px-6 py-4">
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ itinerario.description }}
        </p>
      </div>
      <div class="grid grid-cols-2 gap-6 py-4 border-t">
        <RouterLink to="/listas" class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
          <IconoLista class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
          <p class="text-sm text-gray-700">Checklist</p>
        </RouterLink>
        <RouterLink to="/hoteles" class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
          <IconoCalendario class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
          <p class="text-sm text-gray-700">Hoteles</p>
        </RouterLink>
        <RouterLink to="/guiasTarjetas" class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
          <IconoMapa class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
          <p class="text-sm text-gray-700">Guias</p>
        </RouterLink>
        <RouterLink to="/crear" class="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 text-[#3C4A28] hover:bg-[#f0f0f0]">
          <IconoMas class="w-12 h-12 mb-2 text-[#3C4A28] fill-current" />
          <p class="text-sm text-gray-700">Armar mi viaje</p>
        </RouterLink> 
      </div>
    </div>
  </div>
  <p v-else class="text-center text-gray-600">Itinerario no encontrado.</p>
</template>