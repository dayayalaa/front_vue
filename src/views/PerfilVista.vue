<script setup>
import { ref } from 'vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';

// Datos reactivos
const bannerImage = ref('https://via.placeholder.com/600x200'); 
const profilePicture = ref('https://via.placeholder.com/150'); 
const userName = ref('Juan Pérez');

// Función para subir banner
function uploadBanner(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      bannerImage.value = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
}

// Función para subir foto de perfil
function uploadProfilePicture(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profilePicture.value = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
}
</script>


<template>
  <div class="max-w-md mx-auto p-4">
    <div class="relative mb-4">
      <input
        type="file"
        accept="image/*"
        @change="uploadBanner"
        id="banner-input"
        class="hidden"
      />
      <label for="banner-input" class="cursor-pointer block">
        <img
          :src="bannerImage"
          alt="Banner de perfil"
          class="w-full h-32 object-cover rounded-lg border-2 border-gray-300"
        />
      </label>
      <BotonPrincipal @click="editBanner" class="absolute top-2 right-2">
        Editar Banner
      </BotonPrincipal>

      <div class="absolute left-1/2 transform -translate-x-1/2 top-16"> 
        <input
          type="file"
          accept="image/*"
          @change="uploadProfilePicture"
          id="profile-picture-input"
          class="hidden"
        />
        <label for="profile-picture-input" class="cursor-pointer">
          <img
            :src="profilePicture"
            alt="Foto de perfil"
            class="w-32 h-32 rounded-full border-4 border-white shadow-md"
          />
        </label>
      </div>
    </div>

    <!-- Información del usuario al final -->
    <div class="text-center mb-4 mt-32"> 
      <TituloPrincipal class="text-2xl font-bold">Perfil de Usuario</TituloPrincipal>
      <p>¡Bienvenido, {{ userName }}!</p>
    </div>
  </div>
</template>

