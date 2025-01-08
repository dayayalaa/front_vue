<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from "../components/TituloSecundario.vue";
import TituloTerciario from "../components/TituloTerciario.vue";

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
  guia: {}
});

const route = useRoute();

const formattedFecha = computed(() => {
  if (tour.value.fechasDisponibles.length > 0) {
    return new Date(tour.value.fechasDisponibles[0]).toLocaleDateString();
  }
  return "No disponible";
});

onMounted(async () => {
  const tourId = route.params.id;  
  if (!tourId) {
    console.error("ID no proporcionado.");
    return;
  }

  try {
    const responseTour = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);
    if (responseTour.data) {
      tour.value = responseTour.data;
      console.log("Tour cargado:", tour.value);

      const guiaId = tour.value.guia;
      console.log('Id del guia:', guiaId);

      if (guiaId) {
        const responseGuia = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${guiaId}`);
        
        if (responseGuia.data) {
          console.log("Info del guía:", responseGuia.data);
          console.log("Nombre del guía:", responseGuia.data.nombre);
          
          tour.value.guia = responseGuia.data;
          console.log("Guía nombre:", tour.value.guia.nombre);
        } else {
          console.error("No se encontraron datos para el guía.");
        }
      } else {
        console.error("No hay ID de guía disponible.");
      }
    } else {
      console.error("No se encontraron datos para este tour.");
    }
  } catch (error) {
    console.error('Error al obtener el tour o guía:', error);
  }
});



</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="relative mb-4">
      <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full object-contain" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-75 h-1/3"></div>
      <IrAtras class="absolute top-0" />
      <h2 class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-4xl text-[#3C4A28]">
        {{ tour.titulo }}
      </h2>
    </div>

    <div class="p-6">
      <TituloTerciario>Información</TituloTerciario>
      <p class="text-lg text-gray-700 mb-4">{{ tour.descripcion }}</p>

      <p><strong>Guía:</strong>
        <router-link v-if="tour.guia._id" :to="`/perfil/guia/${tour.guia._id}`" class="text-blue-500 hover:underline">
          {{ tour.guia.nombre }}
        </router-link>
        <span v-else>Guía no disponible</span>
      </p>

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
      <p class="text-lg text-gray-700">
        <span class="font-semibold">Política de cancelación:</span> {{ tour.politicaCancelacion }}
      </p>
    </div>

    <div v-if="isUser" class="mt-6">
      <button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
        @click="() => alert('Función de reserva en desarrollo...')">
        Reservar
      </button>
    </div>
  </div>
</template>
