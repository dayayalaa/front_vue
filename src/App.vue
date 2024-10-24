<script setup>
import NavInferior from './components/NavInferior.vue';
import ArmarMiViaje from './views/ArmarViajeVista.vue';
import { RouterView } from 'vue-router';
import Checklist from './views/ListaVista.vue';

</script>

<template>
 <Main>
  <RouterView/> 

  <NavInferior />
 </Main>


</template>

