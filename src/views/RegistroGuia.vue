<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const router = useRouter();
const nombre = ref('');
const email = ref('');
const contrasenia = ref('');
const provincia = ref('');

const errorNombre = ref('');
const errorEmail = ref('');
const errorContrasenia = ref('');
const errorProvincia = ref('');

const lugaresArgentinos = [
  'Buenos Aires - Aeroparque Jorge Newbery',
  'Buenos Aires - Aeropuerto Internacional Ministro Pistarini',
  'Córdoba',
  'Mendoza',
  'Mar del Plata',
  'Ushuaia',
  'Bariloche',
  'Salta',
  'Rosario',
  'Tucumán',
  'Iguazú',
  'Neuquén',
  'Misiones',
  'Posadas',
  'San Fernando del Valle de Catamarca',
  'San Juan',
  'Río Gallegos',
  'Río Grande',
  'El Calafate',
  'San Luis',
  'Resistencia',
  'Tremedal',
  'General Roca',
];

const registroUsuario = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  backendError.value = '';

  try {
    const response = await Axios.post('https://back-tesis-lovat.vercel.app/arcana/usuarios/guias', {
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
    console.error('Detalles del error:', error); 
    if (error.response && error.response.data.msg) {
      backendError.value = error.response.data.msg;
    } else {
      backendError.value = 'Error desconocido al registrar el usuario';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
    <IrAtras/>
  <div class="flex items-center justify-center h-screen bg-gray-50 pt-6 pb-8">
      <div class="flex items-center justify-center flex-col max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        
      <TituloSecundario class="text-center mb-6">Crea una cuenta de guía</TituloSecundario>
      
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
            
          />
          <p class="text-red-500 text-sm mt-1" v-if="errorNombre">{{ errorNombre }}</p> <!-- Mensaje de error -->
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
            
          />
          <p class="text-red-500 text-sm mt-1" v-if="errorEmail">{{ errorEmail }}</p> <!-- Mensaje de error -->
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
            
          />
          <p class="text-red-500 text-sm mt-1" v-if="errorContrasenia">{{ errorContrasenia }}</p> <!-- Mensaje de error -->
        </div>

        <!-- Provincia -->
        <div class="mb-4">
          <label for="provincia" class="block text-sm font-medium text-gray-600">Provincia</label>
          <select
            id="provincia"
            v-model="provincia"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
            
          >
            <option value="" disabled selected>Selecciona tu provincia</option>
            <option v-for="lugar in lugaresArgentinos" :key="lugar" :value="lugar">
              {{ lugar }}
            </option>
          </select>
          <p class="text-red-500 text-sm mt-1" v-if="errorProvincia">{{ errorProvincia }}</p> <!-- Mensaje de error -->
        </div>

        <!-- Botón de Registro -->
        <div class="flex justify-center">
          <BotonPrincipal>Registrarse</BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>