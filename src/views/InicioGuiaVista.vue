<script setup>
import { useRouter } from 'vue-router'; 
import NavSuperior from '../components/NavSuperior.vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import MiReservasUsuario from '../components/MiReservasUsuario.vue';
import IrAtras from '../components/IrAtras.vue';


const router = useRouter();
const goToCreateTour = () => {
  router.push('/crearTur');
};
</script>

<template>
  <div>
    <NavSuperior />
    <IrAtras />
    <div class="text-center mt-4">
      <TituloPrincipal>Bienvenido, guía</TituloPrincipal>
    </div>

   
    <section class="mt-6 text-center">
      <h2 class="text-xl font-semibold">Lugares más visitados</h2>
      <p>📍 Aquí podrías mostrar destinos populares</p>
    </section>

  
    <div class="flex justify-center mt-6 mb-8">
      <BotonPrincipal class="w-3/4 py-3 text-sm" @click="goToCreateTour">
        Crear Tour
      </BotonPrincipal>
    </div>


    <section class="mt-6">
      <MiReservasUsuario />
    </section>
  </div>
</template>
