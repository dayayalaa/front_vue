<script setup>
import { useRoute } from 'vue-router';
import NavInferior from './components/NavInferior.vue';
import { RouterView } from 'vue-router';

const hiddenRoutes = ['/login', '/opcion', '/registroUsuario', '/registroGuia'];
const route = useRoute();
</script>

<template>
  <main>
    <div class="mb-16">
      <RouterView />
    </div>
    <NavInferior v-if="!hiddenRoutes.includes(route.path)" />
  </main>
</template>
