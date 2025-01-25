<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";
import IrAtras from "./IrAtras.vue";

const route = useRoute();
const lugares = ref([]);
const loading = ref(true);
const error = ref(false);

const provinciaNombre = route.params.id.toLowerCase().trim();
console.log("Nombre de la provincia:", provinciaNombre);

onMounted(async () => {
  try {
    const response = await axios.get(
      "https://back-tesis-lovat.vercel.app/arcana/destino/provincia",
      {
        params: { provincia: provinciaNombre },
      }
    );

    console.log("Respuesta completa:", response);

    if (response.data) {
      console.log("Lugar obtenido:", response.data);
      lugares.value = [response.data];
    } else {
      console.log("No se encontraron lugares para la provincia ingresada.");
      error.value = true;
    }
  } catch (err) {
    if (err.response) {
      console.error("Error de respuesta:", err.response.data);
      console.error("Código de estado:", err.response.status);
    } else if (err.request) {
      console.error("No se recibió respuesta del servidor");
    } else {
      console.error("Error:", err.message);
    }
    error.value = true;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
    <IrAtras/>
  <div class="max-w-4xl mx-auto p-6">
    <div v-if="loading" class="text-center text-gray-500">Cargando...</div>

    <div v-else-if="error" class="text-center text-red-500 font-semibold">
      No se encontraron lugares para la provincia ingresada.
    </div>

    <div v-else v-for="lugar in lugares" :key="lugar.place_id" class="mb-8 p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition">
      <h3 class="text-2xl font-semibold text-green-600">{{ lugar.title }}</h3>
      <p class="text-sm text-gray-600 mt-2">{{ lugar.address }}</p>

      <div class="mt-4">
        <img :src="lugar.thumbnail" alt="Imagen del lugar" class="rounded-lg shadow-sm w-full h-auto" />
      </div>

      <p v-if="lugar.description && lugar.description.snippet" class="mt-4 text-gray-700">
        <strong class="text-green-600">Descripción:</strong> {{ lugar.description.snippet }}
      </p>

      <div class="mt-4 space-x-4">
        <a :href="lugar.website" target="_blank" class="text-blue-500 hover:underline">Visitar página oficial</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #2c6f39;
}

h3 {
  color: #2f855a;
}

p {
  color: #4a5568;
}
</style>