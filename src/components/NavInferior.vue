<template>
    <nav class="fixed bottom-0 w-full bg-[#788B69] border-4 border-[#222725] rounded-tl-xl rounded-tr-xl">
      <div class="flex items-center justify-center h-16 w-full">
        <ul class="flex justify-around w-full">
          <li class="relative flex-grow text-center"> <!-- Usar flex-grow para evitar movimiento lateral -->
            <router-link
              to="/"
              class="text-[#222725] hover:text-[#222725] relative block"
              :class="{ 'text-white': isActive('/') }"
              @click="setActive('/')">
              <span class="text-lg">Home</span>
              <span
                v-if="isActive('/')"
                class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out">
                <span class="w-20 h-20 bg-[#222725] rounded-full absolute translate-y-[-20px] transition-all duration-300 ease-in-out"></span>
                <span class="text-lg text-[#788B69] relative z-10 translate-y-[-20px] transition-all duration-300 ease-in-out">Home</span> <!-- Texto sobre el círculo -->
              </span>
            </router-link>
          </li>
          <li class="relative flex-grow text-center">
            <router-link
              to="/crear"
              class="text-[#222725] hover:text-[#222725] relative block"
              :class="{ 'text-white': isActive('/crear') }"
              @click="setActive('/crear')"> 
              <span class="text-lg">Crear</span>
              <span
                v-if="isActive('/crear')"
                class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out">
                <span class="w-20 h-20 bg-[#222725] rounded-full absolute translate-y-[-20px] transition-all duration-300 ease-in-out"></span>
                <span class="text-lg text-[#788B69] relative z-10 translate-y-[-20px] transition-all duration-300 ease-in-out">Crear</span>
              </span>
            </router-link>
          </li>
          <li class="relative flex-grow text-center">
            <router-link
              to="/about"
              class="text-[#222725] hover:text-[#222725] relative block"
              :class="{ 'text-white': isActive('/about') }"
              @click="setActive('/about')"> 
              <span class="text-lg">Perfil</span>
              <span
                v-if="isActive('/about')"
                class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out">
                <span class="w-20 h-20 bg-[#222725] rounded-full absolute translate-y-[-20px] transition-all duration-300 ease-in-out"></span>
                <span class="text-lg text-[#788B69] relative z-10 translate-y-[-20px] transition-all duration-300 ease-in-out">Perfil</span>
              </span>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: "Navbar",
    data() {
      return {
        activeLink: '/', 
      };
    },
    methods: {
      setActive(link) {
        this.activeLink = link; 
      },
      isActive(link) {
        return this.activeLink === link; 
      },
    },
  };
  </script>
  
  <style scoped>
  li {
    flex: 1; 
    min-width: 100px; 
  }
  </style>
  