<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NavInferior from './components/NavInferior.vue';
import { RouterView } from 'vue-router';

// Estado de autenticación
const isLoggedIn = ref(false);
const route = useRoute(); // Obtener la ruta actual

// Rutas donde no se debe mostrar NavInferior
const hiddenRoutes = ['/login', '/opcion', '/registroUsuario', '/registroGuia'];

// Comprobar si hay un token en localStorage al montar el componente
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token'); // Cambia 'token' por tu clave
});
</script>

<template>
  <main>
    <div class="mb-16">
      <RouterView />
    </div>
    <!-- Renderiza NavInferior solo si el usuario está autenticado y no está en las rutas ocultas -->
    <NavInferior v-if="isLoggedIn && !hiddenRoutes.includes(route.path)" />
  </main>
</template>