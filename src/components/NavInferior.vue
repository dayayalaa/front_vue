<script setup>
import { ref, onMounted } from 'vue';
import IconoInicio from './icons/IconoInicio.vue';
import IconoMas from './icons/IconoMas.vue';
import IconoUsuario from './icons/IconoUsuario.vue';


const activeLink = ref('/');
const circlePosition = ref(0);
const itemWidth = 120; 


const setActive = (link) => {
  activeLink.value = link;
  const index = getIndex(link);
  circlePosition.value = index * itemWidth + (itemWidth / 2) - 180; 
};

const isActive = (link) => activeLink.value === link;

const getIndex = (link) => {
  if (link === '/') return 0;
  if (link === '/crear') return 1;
  if (link === '/perfil') return 2;
  return -1;
};


onMounted(() => {
  setActive(activeLink.value);
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
        <li class="relative flex-grow text-center">
          <router-link
            to="/perfil"
            class="relative block"
            :class="{ 'text-[#4F6D3A]': isActive('/perfil'), 'text-[#788B69]': !isActive('/perfil') }"
            @click="setActive('/perfil')">
           
            <IconoUsuario v-if="!isActive('/perfil')" class="h-8 w-8 mx-auto transition-colors duration-300" />
          </router-link>
        </li>
      </ul>
      <!-- Círculo -->
      <span class="w-16 h-16 bg-[#4F6D3A] border-[#222725] border-4 rounded-full absolute transition-all duration-300 ease-in-out"
        :style="{ transform: `translateX(${circlePosition}px) translateY(-30%)` }">
        <router-link v-if="isActive('/')" to="/">
          <IconoInicio class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
        <router-link v-if="isActive('/crear')" to="/crear">
          <IconoMas class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
        <router-link v-if="isActive('/perfil')" to="/perfil">
          <IconoUsuario class="h-8 w-8 text-white absolute inset-0 m-auto"/>
        </router-link>
      </span>
    </div>
  </nav>
</template>

<style >
li {
  flex: 1; 
  min-width: 100px; 
}
</style>
