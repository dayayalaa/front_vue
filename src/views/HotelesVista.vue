<script setup>
import { ref, onMounted } from 'vue';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloSecundario.vue';

const hoteles = ref([]); 
onMounted(async () => {
  try {
    const response = await fetch('https://back-tesis-lovat.vercel.app/arcana/hoteles');
    const data = await response.json();
    if (response.ok) {
      hoteles.value = data;
    } else {
      console.error('Error al obtener los hoteles:', response.status);
    }
  } catch (error) {
    console.error('Error al hacer la solicitud:', error);
  }
});
</script>


<template>
  <IrAtras/>
    <div class="hoteles-container">
    <TituloSecundario>Hoteles</TituloSecundario>
      <div v-if="hoteles.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="hotel in hoteles" :key="hotel._id" class="bg-white rounded-lg shadow-md p-4">
          <img :src="hotel.habitaciones[0].imgHabitacion" alt="Imagen del hotel" class="w-full h-40 object-cover rounded-md mb-4">
         <TituloTerciario>{{ hotel.titulo }}</TituloTerciario>
          <p class="text-sm text-gray-600">{{ hotel.descripcion }}</p>
          <div class="mt-2">
            <p><strong>Ubicación:</strong> {{ hotel.ubicacion.direccion }}, {{ hotel.ubicacion.ciudad }}, {{ hotel.ubicacion.pais }}</p>
            <p><strong>Calificación:</strong> {{ hotel.calificacion }} estrellas</p>
          </div>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No hay hoteles disponibles.</p>
    </div>
  </template>
