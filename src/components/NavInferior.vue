<script setup>
import { ref, onMounted, computed } from 'vue';
import IconoInicio from './icons/IconoInicio.vue';
import IconoMas from './icons/IconoMas.vue';
import IconoUsuario from './icons/IconoUsuario.vue';

const activeLink = ref('/');
const circlePosition = ref(0);
const itemWidth = 120; // Ancho de cada botón

const isActive = (link) => {
  return activeLink.value === link;
};

const userId = ref('');
const userRole = ref('');

const getIndex = (link) => {
  if (link === '/' || link === '/inicioguia') return 0;
  if (link === '/crear' || link === '/crearTur') return 1;
  if (link.startsWith('/perfil/')) return 2;
  return 0;
};

const setActive = (link) => {
  if (link.startsWith('/perfil/') && !userId.value) {
    console.error('No user ID available');
    return;
  }

  activeLink.value = link;
  const index = getIndex(link);

  let newPosition = index * itemWidth + (itemWidth / 2) - 180;
  const maxPosition = (itemWidth * 2) - 130;
  newPosition = Math.min(newPosition, maxPosition);
  newPosition = Math.max(newPosition, -180);

  circlePosition.value = newPosition;
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''));

  return JSON.parse(jsonPayload);
};

const getProfileLink = computed(() => {
  if (!userId.value) return { name: 'Perfil' };
  return userRole.value === 'guia'
    ? { name: 'GuiaPerfil', params: { id: userId.value } }
    : { name: 'Perfil', params: { id: userId.value } };
});

const getInicioLink = computed(() => {
  return { name: userRole.value === 'guia' ? 'inicioGuia' : 'Home' };
});

const getCrearLink = computed(() => {
  return { name: userRole.value === 'guia' ? 'crearTur' : 'Crear' };
});

onMounted(() => {
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      userId.value = decodedToken.userId;
      userRole.value = decodedToken.rols;
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }

  // Inicializar el enlace activo
  setActive(userRole.value === 'guia' ? '/inicioguia' : '/');
});
</script>

<template>
  <nav class="fixed bottom-0 w-full bg-[#222725] border-4 border-[#222725] rounded-tl-xl rounded-tr-xl z-50">
    <div class="flex items-center justify-center h-14 w-full relative">
      <ul class="flex justify-around w-full">
        <!-- Ícono de Inicio -->
        <li class="relative flex-grow text-center">
          <router-link :to="getInicioLink" class="relative block" :class="{
            'text-[#222725]': isActive('/'),
            'text-[#788B69]': !isActive('/')
          }" @click="setActive('/')">
            <IconoInicio :class="isActive('/') ? 'w-8 h-8' : 'w-8 h-8'"
              class="mx-auto transition-colors duration-300" />
          </router-link>
        </li>


        <!-- Ícono de Crear -->
        <li class="relative flex-grow text-center">
          <router-link :to="getCrearLink" class="relative block"
            :class="{ 'text-[#222725]': isActive('/crear') || isActive('/crearTur'), 'text-[#788B69]': !isActive('/crear') && !isActive('/crearTur') }"
            @click="setActive('/crear')">
            <IconoMas :class="isActive('/crear') || isActive('/crearTur') ? 'w-8 h-8' : 'w-8 h-8'"
              class="mx-auto transition-colors duration-300" />
          </router-link>
        </li>

        <!-- Ícono de Perfil -->
        <li class="relative flex-grow text-center" v-if="userId">
          <router-link :to="getProfileLink" class="relative block"
            :class="{ 'text-[#222725]': isActive(`/perfil/${userId}`), 'text-[#788B69]': !isActive(`/perfil/${userId}`) }"
            @click="setActive(`/perfil/${userId}`)">
            <IconoUsuario :class="isActive(`/perfil/${userId}`) ? 'w-8 h-8' : 'w-8 h-8'"
              class="mx-auto transition-colors duration-300" />
          </router-link>
        </li>
      </ul>

      <div
        class="absolute w-16 h-16 bg-[#4F6D3A] border-[#222725] border-8 rounded-full transition-all duration-300 ease-in-out"
        :style="{ transform: `translateX(${circlePosition}px) translateY(-20%)`, boxSizing: 'content-box' }">
        <router-link v-if="isActive('/') || isActive('/inicioguia')" :to="getInicioLink">
          <IconoInicio class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
        <router-link v-if="isActive('/crear') || isActive('/crearTur')" :to="getCrearLink">
          <IconoMas class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
        <router-link v-if="isActive(`/perfil/${userId}`)" :to="getProfileLink">
          <IconoUsuario class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
      </div>
    </div>
  </nav>
</template>
