<script setup>
import { ref, onMounted, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import TituloPrincipal from './TituloPrincipal.vue';
import IrAtras from './IrAtras.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const lugar = ref(null);
const route = useRoute();
const lugarId = route.params.id;

onMounted(async () => {
  try {
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/lugares/${lugarId}`);
    const data = await response.json();
    if (response.ok) {
      lugar.value = data.data;
    } else {
      console.error('Error al obtener el lugar:', response.status);
    }
  } catch (error) {
    console.error('Error en la solicitud:', error);
  }
});


const descripcionConSaltos = computed(() => {
  return lugar.value?.descripcion?.replace(/\n/g, '<br>') || '';
});
</script>

<template>
  <div v-if="lugar" class="max-w-3xl mx-auto px-4 py-4 mb-12">
    <IrAtras />
    <TituloPrincipal>{{ lugar.nombre }}</TituloPrincipal>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img :src="lugar.imagen" :alt="lugar.nombre" class="w-full h-60 object-cover"/>
      <div class="px-6 py-4">
        <p class="text-gray-600 text-sm leading-relaxed" v-html="descripcionConSaltos"></p>
        <p class="mt-4"><strong>Ubicado en: </strong>{{ lugar.ubicacion }}</p>
      </div>

      <div class="text-center mb-4">
        <h2 class="mb-2">Planificá tu viaje con Arcana</h2>
        <RouterLink to="/crear">
          <BotonPrincipal>Planificar mi viaje</BotonPrincipal>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
