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
const loading = ref(false);
const backendError = ref('');

const errorNombre = ref('');
const errorEmail = ref('');
const errorContrasenia = ref('');
const errorProvincia = ref('');

const isPasswordVisible = ref(false); 

const lugaresArgentinos = [
  'Buenos Aires',
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
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/usuarios/guias', {
      nombre: nombre.value,
      email: email.value,
      contrasenia: contrasenia.value,
      provincia: provincia.value,  // Incluye la provincia aquí
    });

    // Verifica si el token fue recibido
    if (response.data && response.data.token) {
      console.log('Token recibido:', response.data.token);  // Verifica el token recibido en consola

      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Redirige al home después del registro
      router.push('/'); 
      
      // Limpia los campos del formulario
      nombre.value = '';
      email.value = '';
      contrasenia.value = '';
      provincia.value = '';  // Limpia la provincia también
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

const validateForm = () => {
  let isValid = true;
  errorNombre.value = '';
  errorEmail.value = '';
  errorContrasenia.value = '';
  errorProvincia.value = '';

  // Valida el nombre
  if (!nombre.value) {
    errorNombre.value = 'Por favor, ingresa tu nombre';
    isValid = false;
  }

  // Valida el email
  if (!email.value) {
    errorEmail.value = 'Por favor, ingresa tu correo electrónico';
    isValid = false;
  }

  // Valida la contraseña
  if (!contrasenia.value) {
    errorContrasenia.value = 'Por favor, ingresa una contraseña';
    isValid = false;
  } else if (contrasenia.value.length < 6) {
    errorContrasenia.value = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }

  // Valida la provincia
  if (!provincia.value) {
    errorProvincia.value = 'Por favor, selecciona una provincia';
    isValid = false;
  }

  return isValid;
};
</script>

<template>
  <IrAtras />
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
          <p class="text-red-500 text-sm mt-1" v-if="errorNombre">{{ errorNombre }}</p>
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
          <p class="text-red-500 text-sm mt-1" v-if="errorEmail">{{ errorEmail }}</p>
        </div>

        <!-- Contraseña -->
        <div class="mb-4 relative">
          <label for="contrasenia" class="block text-sm font-medium text-gray-600">Contraseña</label>
          <input
            :type="isPasswordVisible ? 'text' : 'password'"
            id="contrasenia"
            v-model="contrasenia"
            placeholder="Ingresa tu contraseña"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-3 top-10"
          >
            <span v-if="isPasswordVisible">👁️</span>
            <span v-else>👁️‍🗨️</span>
          </button>
          <p class="text-red-500 text-sm mt-1" v-if="errorContrasenia">{{ errorContrasenia }}</p>
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
          <p class="text-red-500 text-sm mt-1" v-if="errorProvincia">{{ errorProvincia }}</p>
        </div>

        <!-- Botón de Registro -->
        <div class="flex justify-center">
          <BotonPrincipal :disabled="loading">{{ loading ? 'Registrando...' : 'Registrarse' }}</BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>
