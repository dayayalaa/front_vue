<script setup>
import NavInferior from './components/NavInferior.vue';
import ArmarMiViaje from './views/ArmarViajeView.vue';
import { RouterView } from 'vue-router';
import Checklist from './views/ChecklistView.vue';

</script>

<template>
 <Main>
  <RouterView/> 
<ArmarMiViaje></ArmarMiViaje>
<Checklist></Checklist>
  <NavInferior />
 </Main>


</template>

