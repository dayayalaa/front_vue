<script setup>
import { ref, onMounted, computed, useId } from 'vue';
import IconoInicio from './icons/IconoInicio.vue';
import IconoMas from './icons/IconoMas.vue';
import IconoUsuario from './icons/IconoUsuario.vue';

const activeLink = ref('/');
const circlePosition = ref(0);
const itemWidth = 120;

const isActive = (link) => {
  if (link === '/') {
    return activeLink.value === '/';
  } else if (link.startsWith('/perfil/')) {
    return activeLink.value.startsWith('/perfil/');
  } else if (link === '/crear' || link === '/crearTur') {
    return activeLink.value === '/crear' || activeLink.value === '/crearTur';
  } else {
    return activeLink.value === link;
  }
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

  // console.log('User Id:', userId.value);

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
  if (!userId.value) return { name: 'Home' };
  return userRole.value === 'guia'
    ? { name: 'inicioGuia' }
    : { name: 'Home' };
});

const getCrearLink = computed(() => {
  if (!userId.value) return { name: 'Crear' };
  return userRole.value === 'guia'
    ? { name: 'crearTur' }
    : { name: 'Crear' };
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

  if (userRole.value === 'guia') {
    setActive('/inicioguia'); 
  } else {
    setActive('/');  
  }
});
</script>

<template>
  <nav class="fixed bottom-0 w-full bg-[#222725] border-4 border-[#222725] rounded-tl-xl rounded-tr-xl z-50">
    <div class="flex items-center justify-center h-14 w-full relative">
      <ul class="flex justify-around w-full">
        <li class="relative flex-grow text-center">
          <router-link :to="getInicioLink" class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive(userRole === 'guia' ? '/inicioguia' : '/'), 'text-[#788B69]': !isActive('/') }"
            @click="setActive(userRole === 'guia' ? '/inicioguia' : '/')">
            <IconoInicio v-if="!isActive(userRole === 'guia' ? '/inicioguia' : '/')" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
        <li class="relative flex-grow text-center">
          <router-link :to="getCrearLink" class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive(userRole === 'guia' ? '/crearTur' : '/crear'), 'text-[#788B69]': !isActive(userRole === 'guia' ? '/crearTur' : '/crear') }"
            @click="setActive(userRole === 'guia' ? '/crearTur' : '/crear')">
            <IconoMas v-if="!isActive(userRole === 'guia' ? '/crearTur' : '/crear')" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
        <li class="relative flex-grow text-center" v-if="userId">
          <router-link :to="getProfileLink" class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive(`/perfil/${userId}`), 'text-[#788B69]': !isActive(`/perfil/${userId}`) }"
            @click="setActive(`/perfil/${userId}`)">
            <IconoUsuario v-if="!isActive(`/perfil/${userId}`)"
              class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
      </ul>

      <span
        class="w-16 h-16 bg-[#4F6D3A] border-[#222725] border-4 rounded-full absolute transition-all duration-300 ease-in-out"
        :style="{ transform: `translateX(${circlePosition}px) translateY(-30%)` }">
        <router-link v-if="isActive(userRole === 'guia' ? '/inicioguia' : '/')" :to="getInicioLink">
          <IconoInicio class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
        <router-link v-if="isActive(userRole === 'guia' ? '/crearTur' : '/crear')" :to="getCrearLink">
          <IconoMas class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
        <router-link v-if="isActive(`/perfil/${userId}`)" :to="getProfileLink">
          <IconoUsuario class="h-8 w-8 text-white absolute inset-0 m-auto" />
        </router-link>
      </span>
    </div>
  </nav>
</template>
