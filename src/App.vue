<script setup>
import NavInferior from './components/NavInferior.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <main>
    <div class="mb-16">
  <RouterView/>
</div>
    <NavInferior />
  </main>
</template>
