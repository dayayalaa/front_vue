<script setup>
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import IrAtras from '../components/IrAtras.vue';
import TituloTerciario from "../components/TituloTerciario.vue";

// Simulación de usuario autenticado
const user = ref({
  _id: "676ee0ee1b4bbdb2a9ba223b", // ID del usuario (simulado)
  role: "user", // Rol del usuario
});

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
const cantidadPersonas = ref(1); // Cantidad de personas (valor inicial: 1)
const reservaExitosa = ref(false); // Estado para mostrar la notificación

// Calcular el costo total
const costoTotal = computed(() => {
  return tour.value.precio * cantidadPersonas.value;
});

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
          console.log("Nombre del guía:", responseGuia.data.data.nombre);
          tour.value.guia = responseGuia.data.data;
          console.log("Guía nombre:", tour.value.guia.data.nombre);
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

// Función para reservar el tour
const reservarTour = async () => {
  const tourId = route.params.id;
  const userId = user.value?._id; // ID del usuario autenticado

  if (!userId) {
    alert("Debes iniciar sesión para reservar.");
    return;
  }

  const reserva = {
    userId: userId,
    tourId: tourId,
    fechaTour: tour.value.fechasDisponibles[0], // Usa la primera fecha disponible
    cantidadPersonas: cantidadPersonas.value, // Cantidad de personas seleccionada
  };

  try {
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/reservastour/tours', reserva);
    console.log("Reserva creada:", response.data);
    reservaExitosa.value = true; // Mostrar mensaje de éxito
  } catch (error) {
    console.error("Error al crear la reserva:", error);
    alert("Hubo un error al crear la reserva. Inténtalo de nuevo.");
  }
};
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="relative mb-4">
      <img :src="tour.fotoPortada" :alt="'Foto del tour ' + tour.titulo" class="w-full h-64 object-cover" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-75 h-1/3"></div>
      <IrAtras class="absolute top-0" />
      <h2 class="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-4xl text-[#3C4A28]">
        {{ tour.titulo }}
      </h2>
    </div>

    <div class="p-6">
      <TituloTerciario>Información</TituloTerciario>
      <p class="text-lg text-gray-700 mb-4">{{ tour.descripcion }}</p>

      <p><strong>Guía: </strong>
        <router-link v-if="tour.guia._id" :to="`/guias/${tour.guia._id}`" class="text-blue-500 hover:underline">
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
      <form @submit.prevent="reservarTour" class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Reservar Tour</h3>

        <div class="mb-4">
          <label for="cantidadPersonas" class="block text-gray-700 font-medium mb-2">
            Cantidad de personas:
          </label>
          <input
            type="number"
            id="cantidadPersonas"
            v-model="cantidadPersonas"
            min="1"
            max="10"
            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div class="mb-4">
          <p class="text-gray-700">
            <span class="font-semibold">Costo total:</span> ${{ costoTotal }}
          </p>
        </div>

        <button
          type="submit"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Reservar
        </button>

        <!-- Mensaje de confirmación -->
        <div v-if="reservaExitosa" class="mt-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <p>¡Reserva realizada con éxito!</p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Estilos para el mensaje de confirmación */
.bg-green-100 {
  background-color: #f0fff4;
}
.border-green-500 {
  border-color: #48bb78;
}
.text-green-700 {
  color: #2f855a;
}
</style>