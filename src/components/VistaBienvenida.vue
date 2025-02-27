<script setup>
</script>

<template>
  <div class="fixed top-0 left-0 right-0 bottom-0 bg-[#3C4A28] flex justify-center items-center z-50">
    <video class="w-36 h-auto" autoplay muted @ended="onVideoEnded">
      <source src="/carga.mp4" type="video/mp4" />
      Tu navegador no soporta el formato de video.
    </video>
  </div>
</template>
