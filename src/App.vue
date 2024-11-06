<script setup>
import NavInferior from './components/NavInferior.vue';
import IrAtras from './components/IrAtras.vue';
import { RouterView } from 'vue-router';



</script>

<template>
 <Main> 
  <RouterView/> 
  <NavInferior />
 </Main>
</template>

