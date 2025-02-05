<script setup>
import { ref, onMounted, computed } from 'vue';
import IconoInicio from './icons/IconoInicio.vue';
import IconoMas from './icons/IconoMas.vue';
import IconoUsuario from './icons/IconoUsuario.vue';

const activeLink = ref('/');
const circlePosition = ref(0);
const itemWidth = 120;

const setActive = (link) => {
  if (link === `/perfil/${userId.value}` && !userId.value) {
    console.error('No user ID available');
    return;
  }
  activeLink.value = link;
  const index = getIndex(link);
  circlePosition.value = index * itemWidth + (itemWidth / 2) - 180;
};

const isActive = (link) => activeLink.value === link;

const userId = ref('');
const userRole = ref('');

const getIndex = (link) => {
  if (link === '/') return 0;
  if (link === '/crear') return 1;
  if (link.startsWith('/perfil/')) return 2;
  return -1;
};

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload); 
};

const getProfileLink = computed(() => {
  return userRole.value === 'guia' 
    ? { name: 'GuiaPerfil', params: { id: userId.value } } 
    : { name: 'Perfil', params: { id: userId.value } };
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
  
  setActive('/');
});
</script>

<template>
  <nav class="fixed bottom-0 w-full bg-[#222725] border-4 border-[#222725] rounded-tl-xl rounded-tr-xl z-50">
    <div class="flex items-center justify-center h-14 w-full relative">
      <ul class="flex justify-around w-full">
        <li class="relative flex-grow text-center">
          <router-link
            to="/"
            class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive('/'), 'text-[#788B69]': !isActive('/') }"
            @click="setActive('/')">
            <IconoInicio v-if="!isActive('/')" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
        <li class="relative flex-grow text-center">
          <router-link
            to="/crear"
            class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive('/crear'), 'text-[#788B69]': !isActive('/crear') }"
            @click="setActive('/crear')">
            <IconoMas v-if="!isActive('/crear')" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
        <li class="relative flex-grow text-center" v-if="userId">
          <router-link
            :to="getProfileLink"
            class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive(`/perfil/${userId}`), 'text-[#788B69]': !isActive(`/perfil/${userId}`) }"
            @click="setActive(`/perfil/${userId}`)">
            <IconoUsuario v-if="!isActive(`/perfil/${userId}`)" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
      </ul>
      
      <span class="w-16 h-16 bg-[#4F6D3A] border-[#222725] border-4 rounded-full absolute transition-all duration-300 ease-in-out"
        :style="{ transform: `translateX(${circlePosition}px) translateY(-30%)` }">
        <router-link v-if="isActive('/')" to="/">
          <IconoInicio class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
        <router-link v-if="isActive('/crear')" to="/crear">
          <IconoMas class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
        <router-link v-if="isActive(`/perfil/${userId}`)" :to="getProfileLink">
          <IconoUsuario class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
      </span>
    </div>
  </nav>
</template>
