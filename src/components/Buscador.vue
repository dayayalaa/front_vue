<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";
import SpinnerCarga from "./SpinnerCarga.vue"; 
import IconoBuscador from "./icons/IconoBuscador.vue"; 


const provincia = ref("");
const loading = ref(false);
const error = ref(false);
const router = useRouter(); 


const fetchLugares = async () => {
  if (!provincia.value.trim()) {
    error.value = true;
    return;
  }

  try {
    loading.value = true;
    error.value = false;

   
    router.push({ name: "provinciaVista", params: { id: provincia.value } });
  } catch (err) {
    console.error("Error al redirigir:", err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="relative buscador w-full max-w-lg mx-auto px-4">
    <!-- Campo de búsqueda -->
    <label class="flex items-center border border-[#3C4A28] rounded-full overflow-hidden">
      <input
        type="text"
        v-model="provincia"
        @keyup.enter="fetchLugares"
        placeholder="Ingresa una provincia"
        class="w-full p-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-[#3C4A28] rounded-l-full placeholder-gray-500 transition duration-200 ease-in-out"
      />
      <div @click="fetchLugares" class="bg-[#3C4A28] text-white rounded-full p-3 ml-2 cursor-pointer">
        <IconoBuscador class="w-6 h-6" />
      </div>
    </label>
    <SpinnerCarga v-if="loading" />
    <p v-if="error && !loading" class="absolute w-full bg-white border border-gray-200 rounded shadow-lg mt-1 text-center p-2 text-gray-500">
      Ingresa una provincia válida.
    </p>
  </div>
</template>

<style scoped>
.absolute {
  z-index: 10;
}

.max-h-80 {
  max-height: 20rem;
}

.sm\\:max-h-96 {
  max-height: 24rem;
}

.overflow-y-auto {
  overflow-y: auto;
}

@media (max-width: 768px) {
  .buscador .w-full {
    width: 95%;
  }
  .p-3 {
    padding: 0.75rem;
  }
}
</style>