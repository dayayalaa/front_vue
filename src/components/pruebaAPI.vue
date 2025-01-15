
<script>
import axios from "axios";

export default {
  data() {
    return {
      provincia: "", 
      lugares: [],
      loading: false, 
      error: false,  
    };
  },
  methods: {
    async fetchLugares() {
      if (!this.provincia.trim()) {
        this.error = true;
        this.lugares = [];
        return;
      }

      try {
    
        this.loading = true;
        this.error = false;
        this.lugares = []; 
        const response = await axios.get(
          "https://back-tesis-lovat.vercel.app/arcana/prueba/lugares",
          {
            params: {
              provincia: this.provincia, 
            },
          }
        );

        console.log("Respuesta completa:", response);

        
        const placeResults = response.data.place_results;

        if (placeResults && Object.keys(placeResults).length > 0) {
          console.log("Lugares obtenidos:", placeResults);
          this.lugares = [placeResults]; 
        } else {
          console.log("No se encontraron lugares para la provincia ingresada.");
          this.error = true; 
        }
      } catch (error) {
        console.error("Error al obtener los lugares:", error);
        this.error = true; 
      } finally {
        this.loading = false; 
      }
    },
  },
};
</script>


<template>
  <div class="max-w-4xl mx-auto p-6">

    <div class="mb-6 flex items-center">
      <input
        v-model="provincia"
        type="text"
        placeholder="Ingresa una provincia"
        @keyup.enter="fetchLugares"
        class="p-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        @click="fetchLugares"
        class="ml-4 bg-green-600 text-white p-3 rounded-lg shadow-md hover:bg-green-700 transition"
      >
        Buscar
      </button>
    </div>

    <!-- Mensaje de carga o error -->
    <div v-if="loading" class="text-center text-gray-500">Cargando...</div>
    <div v-else-if="error" class="text-center text-red-500 font-semibold">No se encontraron lugares para la provincia ingresada.</div>

    <!-- Mostrar lugares si los datos existen -->
    <div v-else v-for="lugar in lugares" :key="lugar.place_id" class="mb-8 p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition">
      <h3 class="text-2xl font-semibold text-green-600">{{ lugar.title }}</h3>
      <p class="text-sm text-gray-600 mt-2">{{ lugar.address }}</p>

      <!-- Mostrar imagen -->
      <div class="mt-4">
        <img :src="lugar.thumbnail" alt="Imagen del lugar" class="rounded-lg shadow-sm w-full h-auto" />
      </div>

      <!-- Descripción del lugar -->
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
  background-color: #2c6f39; /* Sombra más oscura en hover */
}

h3 {
  color: #2f855a; /* Verde más fuerte */
}

p {
  color: #4a5568; /* Color gris oscuro para los textos */
}
</style>
