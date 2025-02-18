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
  }, 5600); 
});

function onAfterEnter() {
  console.log('La transición ha finalizado');
}
</script>

<template>
  <main>
    <transition name="fade" @after-enter="onAfterEnter">
      <div v-if="loading" class="fixed inset-0 bg-green-500 flex justify-center items-center z-50">
        <VistaBienvenida />
      </div>
    </transition>

    <div v-if="!loading" class="mb-16">
      <RouterView />
    </div>

    <NavInferior v-if="!hiddenRoutes.includes(route.path) && !loading" />
  </main>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 1.5s ease-in-out; 
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
