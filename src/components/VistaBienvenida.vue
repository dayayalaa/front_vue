<template>
  <!-- Mostrar el video de carga hasta que se cargue la app -->
  <div v-if="!isLoaded" class="fixed top-0 left-0 right-0 bottom-0 bg-[#3C4A28] flex justify-center items-center z-50">
    <video class="w-36 h-auto" autoplay muted @ended="onVideoEnded">
      <source src="/carga.mp4" type="video/mp4" />
      Tu navegador no soporta el formato de video.
    </video>
  </div>

  <!-- Aquí irá el contenido de la aplicación que aparece después del video -->
  <div v-if="isLoaded">
    <!-- Tu contenido principal de la app aquí -->
    <p>Contenido de la app cargado</p>
  </div>
</template>

<script setup>
  let isLoaded = false;

  // Función que se ejecuta cuando el video termina
  const onVideoEnded = () => {
    isLoaded = true;
  };
</script>

<style scoped>
/* Estilos para asegurar que el video ocupe toda la pantalla */
.video-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
}
</style>
