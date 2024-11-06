<script setup>
import { useRouter } from 'vue-router';
import IconoAtras from './icons/IconoAtras.vue';

const router = useRouter();

const irAtras = () => {
  router.back();  
};
</script>

<template>
  <button @click="irAtras" class="btn_back z-3 mt-3">
    <IconoAtras />
  </button>
</template>


