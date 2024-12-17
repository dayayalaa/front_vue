<script setup>
import { ref } from 'vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const nombre = ref('');
const email = ref('');
const contrasenia = ref('');

const registroUsuario = () => {
  console.log('Usuario registrado:', nombre.value, email.value, contrasenia.value);
};
</script>

<template>
    <div class="flex items-center justify-center h-screen bg-gray-50 pt-6 pb-8">
      <div class="flex items-center justify-center flex-col max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        <TituloSecundario class="text-center mb-6">Crea una cuenta</TituloSecundario>
        
        <!-- Formulario de Registro -->
        <form @submit.prevent="registroUsuario" class="w-full">
          <!-- Nombre de Usuario -->
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
            <input
              type="text"
              id="nombre"
              v-model="nombre"
              placeholder="Ingresa tu nombre de usuario"
              class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Email -->
          <div class="mb-4">
            <label for="email" class="block text-sm font-medium text-gray-600">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              v-model="email"
              placeholder="Ingresa tu correo electrónico"
              class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Contraseña -->
          <div class="mb-4">
            <label for="contrasenia" class="block text-sm font-medium text-gray-600">Contraseña</label>
            <input
              type="password"
              id="contrasenia"
              v-model="contrasenia"
              placeholder="Ingresa tu contraseña"
              class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
  
          <!-- Botón de Registro -->
          <div class="flex justify-center">
            <BotonPrincipal>Registrarse</BotonPrincipal>
          </div>
        </form>
      </div>
    </div>
  </template>