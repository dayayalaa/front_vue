<script setup>
import { ref } from 'vue';
import IconoAjustes from './icons/IconoAjuste.vue'; 
import Ajustes from './Ajustes.vue'; 

const mostrarModal = ref(false);

const abrirModal = () => {
    mostrarModal.value = true;
};

const cerrarModal = () => {
    mostrarModal.value = false;
};
</script>

<template>
    <div>
      <!-- Ícono de ajustes -->
      <button @click="abrirModal" class="p-2 rounded-full hover:bg-gray-100">
        <IconoAjustes />
      </button>
  
      <!-- Modal ajustado -->
      <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 z-50">
        <div class="absolute top-0 right-0 h-full bg-white p-6 shadow-lg w-1/1">
          <!-- Botón para cerrar -->
          <button @click="cerrarModal" class="absolute top-2 right-2 text-[#788B69]">
            ✖
          </button>
          <Ajustes />
        </div>
      </div>
    </div>
  </template>
  
