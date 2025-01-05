<script setup>
import { useRouter } from 'vue-router';
import IconoAtras from './icons/IconoAtras.vue';
import ModalAjustes from './ModalAjustes.vue';

const router = useRouter();

const irAtras = () => {
  router.back();  
};
</script>

<template>
  <div class="w-full pt-4 pl-6">
    <button @click="irAtras" class="btn_back z-3">
      <IconoAtras />
    </button>

    <div>
      <ModalAjustes/>
    </div>
  </div>
</template>
