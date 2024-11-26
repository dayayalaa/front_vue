<script setup>
import NavInferior from './components/NavInferior.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <main>
    <RouterView/> 
    <NavInferior />
  </main>
</template>
