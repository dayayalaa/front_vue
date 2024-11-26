<script setup>
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import IrAtras from '../components/IrAtras.vue';

const route = useRoute();
const guiaId = ref(null);
const guia = ref(null);

const guias = [
  {
    id: 1,
    nombre: "Juan Pérez",
    provincia: "Buenos Aires",
    imagen: "/img/persona_1.jpeg",
    descripcion:
      "Guía especializado en tours urbanos en Buenos Aires. Con más de 10 años de experiencia, Juan ofrece recorridos únicos por barrios icónicos como San Telmo, La Boca y Recoleta, compartiendo historias fascinantes y detalles poco conocidos.",
  },
  {
    id: 2,
    nombre: "Ana López",
    provincia: "Córdoba",
    imagen: "/img/persona_2.jpeg",
    descripcion:
      "Experta en turismo de aventura en las sierras de Córdoba. Ana organiza actividades como trekking, escalada y paseos en bicicleta, asegurando una experiencia segura y emocionante mientras exploras la belleza natural de la región.",
  },
  {
    id: 3,
    nombre: "Carlos Gómez",
    provincia: "Mendoza",
    imagen: "/img/persona_3.jpeg",
    descripcion:
      "Conocedor de bodegas y turismo enológico en Mendoza. Carlos te lleva a explorar las mejores bodegas de la región, combinando catas de vino, paisajes increíbles y explicaciones sobre el proceso de producción del vino.",
  },
  {
    id: 4,
    nombre: "Lucía Fernández",
    provincia: "Salta",
    imagen: "/img/persona_4.jpeg",
    descripcion:
      "Especialista en recorridos por el norte argentino. Lucía ofrece experiencias culturales y paisajísticas, como visitas a los Valles Calchaquíes, excursiones a Cafayate y recorridos por el centro histórico de Salta.",
  },
  {
    id: 5,
    nombre: "Roberto Díaz",
    provincia: "Santa Fe",
    imagen: "/img/persona_5.jpeg",
    descripcion:
      "Guía de tours históricos en Santa Fe. Roberto se especializa en mostrar la rica historia de la ciudad, incluyendo el legado colonial, los hitos de la Constitución Nacional y recorridos por el casco antiguo.",
  },
  {
    id: 6,
    nombre: "María Rodríguez",
    provincia: "Misiones",
    imagen: "/img/persona_6.jpeg",
    descripcion:
      "Guía en las Cataratas del Iguazú y la selva misionera. María ofrece tours personalizados que incluyen caminatas por senderos de la selva, visitas a comunidades locales y experiencias inolvidables en una de las maravillas naturales del mundo.",
  },
];

onMounted(() => {
  guiaId.value = parseInt(route.params.id, 10);
  guia.value = guias.find((g) => g.id === guiaId.value);
});
</script>

<template>
  <IrAtras />
  <div class="max-w-2xl mx-auto p-4">
   
    <TituloPrincipal>Perfil Guía</TituloPrincipal>
    <div v-if="guia" class="bg-white shadow-md rounded-lg p-4">
      <img
        :src="guia.imagen"
        :alt="'Foto de ' + guia.nombre"
        class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <p class="text-center"><strong class="text-lg">{{ guia.nombre }}</strong></p>
      
      <p class="text-gray-600 text-center">{{ guia.provincia }}</p>
      <p class="mt-4">{{ guia.descripcion }}</p>
    </div>
    <div v-else class="text-center">
      <p class="text-red-500">Guía no encontrado</p>
    </div>
  </div>
</template>
