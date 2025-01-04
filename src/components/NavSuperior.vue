<script setup>
const cerrarSesion = () => {
  // Eliminar el token del localStorage
  localStorage.removeItem('token');
  
  // Redirigir al usuario a la página de inicio de sesión
  window.location.href = '/login'; // Cambia a tu ruta de login
};
</script>
<template>
  <nav class="bg-transparent py-4 flex justify-between items-center">
    <div class="flex justify-center">
      <img src="/img/arcana_logo.png" alt="Logo" class="h-8">
    </div>
    <!-- Botón de cerrar sesión -->
    <div>
      <button @click="cerrarSesion" class="bg-red-500 text-white px-4 py-2 rounded">
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

