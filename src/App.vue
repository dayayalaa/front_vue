<script setup>
import { ref, onMounted } from 'vue'; 
import { useRoute } from 'vue-router';
import NavInferior from './components/NavInferior.vue';
import { RouterView } from 'vue-router';
import VistaBienvenida from './components/VistaBienvenida.vue';

const hiddenRoutes = ['/login', '/opcion', '/registroUsuario', '/registroGuia'];
const route = useRoute();
const loading = ref(true);  

onMounted(() => {
  setTimeout(() => {
    loading.value = false;
  }, 3000);
});
</script>

<template>
  <main>
    <div v-if="loading" class="fixed inset-0 bg-green-500 flex justify-center items-center z-50 opacity-100 transition-opacity duration-1000 ease-in-out">
      <VistaBienvenida />
    </div>

    <div v-if="!loading" class="mb-16">
      <RouterView />
    </div>

    <NavInferior v-if="!hiddenRoutes.includes(route.path) && !loading" />
  </main>
</template>
