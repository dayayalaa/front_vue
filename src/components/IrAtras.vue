<script setup>
import { useRouter } from 'vue-router';
import IconoAtras from './icons/IconoAtras.vue';

const router = useRouter();

const irAtras = () => {
  router.back();  
};
</script>

<template>
  <div class="w-full pt-8 pl-6">
    <button @click="irAtras" class="btn_back z-3">
      <IconoAtras />
    </button>
  </div>
</template>
