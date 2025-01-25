<script setup>
import { ref } from 'vue';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import RegistroUsuario from './RegistroUsuario.vue'; 
import RegistroGuia from './RegistroGuia.vue';  

const tipoRegistro = ref('usuario'); 
</script>

<template>
  <IrAtras/>
  <TituloSecundario class="text-center mb-6" >Registro</TituloSecundario>
  
  <div class="flex flex-col max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
    <form>
    
      <div class="flex flex-col max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
  <form>
    
    <div class="flex space-x-4 mb-6">
  <button
    :class="{'bg-[#3C4A28] text-white border-2 border-[#2a4b1a]': tipoRegistro === 'usuario', 'bg-[#3C4A28] bg-opacity-50 text-white': tipoRegistro !== 'usuario'}"
    @click.prevent="tipoRegistro = 'usuario'"
    class="py-3 px-6 rounded-full w-full transition-colors duration-200"
  >
    Usuario
  </button>
  <button
    :class="{'bg-[#3C4A28] text-white border-2 border-[#2a4b1a]': tipoRegistro === 'guia', 'bg-[#3C4A28] bg-opacity-50 text-white': tipoRegistro !== 'guia'}"
    @click.prevent="tipoRegistro = 'guia'"
    class="py-3 px-6 rounded-full w-full transition-colors duration-200"
  >
    Guía
  </button>
</div>

  </form>
</div>
      
      <div v-if="tipoRegistro === 'usuario'">
        <RegistroUsuario />
      </div>
      
      <div v-if="tipoRegistro === 'guia'">
        <RegistroGuia />
      </div>
      
    </form>
  </div>
</template>

