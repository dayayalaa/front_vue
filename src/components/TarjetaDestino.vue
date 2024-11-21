<script setup>
import { defineProps } from 'vue';
  
  const props = defineProps({
    nombre: {
      type: String,
      required: true
    },
    imagen: {
      type: String,
      required: true
    }
  });
</script>

<template>
    <div class="relative w-[150px] h-[200px]">
      <img 
        :src="imagen" 
        :alt="`Imagen de ${nombre}`" 
        class="w-full h-full object-cover rounded-lg" 
      />
      <p class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
        {{ nombre }}
      </p>
    </div>
  </template>
  

  
