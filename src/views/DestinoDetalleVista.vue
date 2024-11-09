<template>
  <section class="flex flex-col justify-center items-center mb-20">
    <Subtitulo>{{ destino?.nombre }}</Subtitulo>
    <div class="relative w-full max-w-2xl">
      <img 
        :src="destino?.img" 
        :alt="`Imagen de ${destino?.nombre}`" 
        class="w-full h-[300px] object-cover rounded-lg"
      />
      <p class="mt-4 text-center text-xl">{{ destino?.description }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Subtitulo from '../components/Subtitulo.vue';

// JSON de Destinos
const destinosArcana = [
  { 
    id: 1, 
    img: '/img/arcana1.jpg', 
    nombre: 'Destino Arcana 1', 
    description: 'Descripción del destino Arcana 1.' 
  },
  { 
    id: 2, 
    img: '/img/arcana2.jpg', 
    nombre: 'Destino Arcana 2', 
    description: 'Descripción del destino Arcana 2.' 
  },
  { 
    id: 3, 
    img: '/img/arcana3.jpg', 
    nombre: 'Destino Arcana 3', 
    description: 'Descripción del destino Arcana 3.' 
  },
  { 
    id: 4, 
    img: '/img/arcana4.jpg', 
    nombre: 'Destino Arcana 4', 
    description: 'Descripción del destino Arcana 4.' 
  }
];

const destinosPopulares = [
  { 
    id: 1, 
    img: '/img/86475-Jujuy.jpg', 
    nombre: 'Jujuy', 
    description: 'Descubre los paisajes vibrantes y coloridos de Jujuy.' 
  },
  { 
    id: 2, 
    img: '/img/misiones.jpg', 
    nombre: 'Misiones', 
    description: 'Sumérgete en la exuberante naturaleza de Misiones.' 
  },
  { 
    id: 3, 
    img: '/img/neuquen.jpg', 
    nombre: 'Neuquén', 
    description: 'Explora Neuquén, con paisajes de montañas y lagos.' 
  },
  { 
    id: 4, 
    img: '/img/upsala-glacier.jpg', 
    nombre: 'Santa Cruz', 
    description: 'Admira los glaciares y las vastas estepas de Santa Cruz.' 
  }
];

const route = useRoute();
const destino = ref(null);

onMounted(() => {
  const { id, type } = route.params;
  const destinoId = parseInt(id);

  if (type === 'arcana') {
    destino.value = destinosArcana.find(d => d.id === destinoId);
  } else if (type === 'popular') {
    destino.value = destinosPopulares.find(d => d.id === destinoId);
  }
});
</script>
