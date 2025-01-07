<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router"; 
import axios from "axios";

const user = ref(null);
const isUser = computed(() => user.value?.role === 'user');

const tour = ref({
  titulo: "",
  descripcion: "",
  precio: 0,
  provincia: "",
  duracion: "",
  fechasDisponibles: [],
  fotoPortada: "",
  politicaCancelacion: "",
});

const route = useRoute();
const formattedFecha = computed(() => {
  if (tour.value.fechasDisponibles.length > 0) {
    return new Date(tour.value.fechasDisponibles[0]).toLocaleDateString();
  }
  return "";
});

onMounted(async () => {
  const tourId = route.params.id;
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);
    tour.value = response.data;
  } catch (error) {
    console.error("Error al obtener el tour:", error);
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto p-6">
    <h2 class="text-3xl font-semibold text-gray-900 mb-4">{{ tour.titulo }}</h2>
    <p class="text-lg text-gray-700 mb-4">{{ tour.descripcion }}</p>
    <p class="text-xl font-bold text-gray-900 mb-4">
      <span class="text-lg text-gray-500">Precio:</span> ${{ tour.precio }}
    </p>
    <p class="text-lg text-gray-700 mb-4">
      <span class="font-semibold">Provincia:</span> {{ tour.provincia }}
    </p>
    <p class="text-lg text-gray-700 mb-4">
      <span class="font-semibold">Duración:</span> {{ tour.duracion }}
    </p>
    <p class="text-lg text-gray-700 mb-4">
      <span class="font-semibold">Fecha disponible:</span> {{ formattedFecha }}
    </p>
    <div class="mb-4">
      <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full h-auto rounded-lg shadow-md" />
    </div>
    <p class="text-lg text-gray-700">
      <span class="font-semibold">Política de cancelación:</span> {{ tour.politicaCancelacion }}
    </p>

  
    <div v-if="isUser" class="mt-6">
      <button 
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        @click="() => alert('Función de reserva en desarrollo...')"
      >
        Reservar
      </button>
    </div>
  </div>
</template>