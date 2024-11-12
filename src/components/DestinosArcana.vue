<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import TituloPrincipal from './TituloPrincipal.vue';
import IrAtras from './IrAtras.vue';

const lugar = ref(null);
const route = useRoute();
const lugarId = route.params.id;

onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/arcana/lugares/${lugarId}`);
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
</script>

<template>
  <IrAtras />
  <div v-if="lugar" class="max-w-3xl mx-auto px-4 py-6 mb-12">
    <TituloPrincipal class="text-center text-4xl font-semibold text-gray-800 mb-6">{{ lugar.nombre }}</TituloPrincipal>
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <img :src="lugar.imagen" :alt="lugar.nombre" class="w-full h-60 object-cover" />
      <div class="px-6 py-4">
        <p class="text-gray-600 text-sm leading-relaxed">
          {{ lugar.descripcion }}
        </p>
      </div>
    </div>
  </div>
</template>
