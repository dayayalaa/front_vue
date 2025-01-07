<script setup>
import { useRouter, useRoute } from 'vue-router';
import IconoAtras from './icons/IconoAtras.vue';
import ModalAjustes from './ModalAjustes.vue';

const router = useRouter();
const route = useRoute();

const irAtras = () => {
  router.back();
};

const currentLocation = route.name || 'Sin título';
</script>

<template>
  <div class="flex justify-between items-center w-full p-4">

    <div class="flex items-center space-x-4">
      <button @click="irAtras" class="z-3">
        <IconoAtras />
      </button>

      <p class="text-sm text-[#788B69]">
        {{ currentLocation }}
      </p>
    </div>


    <div>
      <ModalAjustes />
    </div>
  </div>
</template>
