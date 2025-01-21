<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Axios from 'axios';

import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const router = useRouter();
const nombre = ref('');
const email = ref('');
const contrasenia = ref('');
const loading = ref(false);
const backendError = ref('');
const errors = ref({ nombre: '', email: '', contrasenia: '' });
const isPasswordVisible = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.value = { nombre: '', email: '', contrasenia: '' };

  if (!nombre.value) {
    errors.value.nombre = 'Por favor, ingresa tu nombre';
    isValid = false;
  }

  if (!email.value) {
    errors.value.email = 'Por favor, ingresa tu correo electrónico';
    isValid = false;
  } else {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email.value)) {
      errors.value.email = 'Por favor, ingresa un correo electrónico válido';
      isValid = false;
    }
  }

  if (!contrasenia.value) {
    errors.value.contrasenia = 'Por favor, ingresa una contraseña';
    isValid = false;
  } else if (contrasenia.value.length < 6) {
    errors.value.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }

  return isValid;
};

const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const registroUsuario = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  backendError.value = '';

  try {
    const response = await Axios.post('https://back-tesis-lovat.vercel.app/arcana/usuarios/usuarios', {
      nombre: nombre.value,
      email: email.value,
      contrasenia: contrasenia.value,
    });

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      router.push('/');
      nombre.value = '';
      email.value = '';
      contrasenia.value = '';
    }
  } catch (error) {
    console.error('Error ocurrido: ', error);
    if (error.response) {
      backendError.value = error.response.data.msg || 'Error al registrar el usuario';
    } else {
      backendError.value = 'Error desconocido de red: ' + error.message;
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex items-center justify-center ">
    <div class="flex items-center justify-center flex-col max-w-md w-full bg-white rounded-lg shadow-lg p-6">
      <TituloSecundario class="text-center mb-6">Crea una cuenta</TituloSecundario>

      <form @submit.prevent="registroUsuario" class="w-full">

        <!-- Nombre de Usuario -->
        <div class="mb-4">
          <label for="nombre" class="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
          <input type="text" id="nombre" v-model="nombre" placeholder="Ingresa tu nombre de usuario"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <p class="text-red-500 text-sm mt-1" v-if="errors.nombre">{{ errors.nombre }}</p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="Ingresa tu correo electrónico"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <p class="text-red-500 text-sm mt-1" v-if="errors.email">{{ errors.email }}</p>
        </div>

        <!-- Contraseña -->
        <div class="mb-4 relative">
          <label for="contrasenia" class="block text-sm font-medium text-gray-600">Contraseña</label>
          <input :type="isPasswordVisible ? 'text' : 'password'" id="contrasenia" v-model="contrasenia"
            placeholder="Ingresa tu contraseña"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <button type="button" @click="togglePasswordVisibility"
            class="absolute right-3 top-1/2 transform  flex items-center justify-center">
            <span v-if="isPasswordVisible">
              <i class="fas fa-eye text-gray-500"></i>
            </span>
            <span v-else>
              <i class="fas fa-eye-slash text-gray-500"></i>
            </span>
          </button>
          <p class="text-red-500 text-sm mt-1" v-if="errors.contrasenia">{{ errors.contrasenia }}</p>
        </div>

        <!-- Error Backend -->
        <p class="text-red-500 text-sm mt-1" v-if="backendError">{{ backendError }}</p>

        <!-- Botón de Registro -->
        <div class="flex justify-center">
          <BotonPrincipal :disabled="loading">{{ loading ? 'Registrando...' : 'Registrarse' }}</BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>
