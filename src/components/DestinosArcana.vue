<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TituloPrincipal from './TituloPrincipal.vue';
import IrAtras from './IrAtras.vue';

const destinosArcana = ref([
  { 
    id: 1, 
    nombre: 'El Calafate', 
    img: '/img/calafate.png', 
    descripcion: 'Conoce El Calafate, un paraíso natural en la Patagonia Argentina, famoso por su cercanía al majestuoso Glaciar Perito Moreno, uno de los pocos glaciares del mundo que sigue avanzando. Disfruta de su paisaje de montañas, lagos y bosques, y vive una experiencia única de trekking en hielo.'
  },
  { 
    id: 2, 
    nombre: 'Ushuaia', 
    img: '/img/ushuaia.png', 
    descripcion: 'Explora Ushuaia, la ciudad más austral del mundo, situada en la Tierra del Fuego. Conocida como el "fin del mundo", Ushuaia ofrece una combinación única de belleza natural, con paisajes de montañas, bosques y glaciares, y actividades como navegación por el Canal Beagle y excursiones por la Cordillera de los Andes.'
  },
  { 
    id: 3, 
    nombre: 'La Pampa', 
    img: '/img/lapampa.png', 
    descripcion: 'Descubre los paisajes rurales y la vasta llanura de La Pampa, una provincia argentina que es el corazón agrícola del país. Visita sus pequeños pueblos, vive la tradición del gaucho y disfruta de su tranquila vida rural, perfecta para quienes buscan conectarse con la naturaleza y la cultura argentina.'
  },
  { 
    id: 4, 
    nombre: 'Buenos Aires', 
    img: '/img/buenosAires.png', 
    descripcion: 'La vibrante capital de Argentina, Buenos Aires, es una metrópoli cosmopolita famosa por su arquitectura europea, su oferta cultural de teatros y museos, y su animada vida nocturna. Desde el tango en San Telmo hasta los modernos bares en Palermo, Buenos Aires es una ciudad llena de contrastes y sorpresas.'
  }
]);

const route = useRoute();
const destinoId = route.params.id;
const destino = ref(null);

onMounted(() => {
  destino.value = destinosArcana.value.find(d => d.id === parseInt(destinoId));
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
  margin-bottom: 3rem; /* Espacio adicional en la parte inferior */
}
</style>
