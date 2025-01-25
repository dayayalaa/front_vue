<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const lugar = ref(null);
const cargando = ref(true);

const lugarId = route.params.id;

onMounted(async () => {
  try {
    const response = await fetch(
      `https://back-tesis-lovat.vercel.app/arcana/destino/provincia${provincia}`
    );
    if (!response.ok) {
      throw new Error('Error al obtener los detalles del lugar');
    }
    const data = await response.json();
    lugar.value = data;
  } catch (err) {
    console.error("Error:", err);
  } finally {
    cargando.value = false;
  }
});
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <div v-if="cargando" class="text-center">Cargando...</div>
    <div v-else-if="lugar" class="bg-white rounded-lg shadow-lg p-6">
      <h1 class="text-2xl font-semibold mb-4">{{ provincia.nombre }}</h1>
      <img 
        v-if="lugar.imagen"
        :src="lugar.imagen"
        :alt="lugar.nombre"
        class="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p class="text-gray-700">{{ lugar.descripcion }}</p>
      <p class="text-sm text-gray-500 mt-2">{{ lugar.ubicacion }}</p>
    </div>
    <div v-else class="text-center text-red-500">No se encontró la provincia.</div>
  </div>
</template>