<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';


const router = useRouter();
const nombre = ref('');
const email = ref('');
const contrasenia = ref('');
const provincia = ref('');
const cargando = ref(false);
const backendError = ref('');

const errorNombre = ref('');
const errorEmail = ref('');
const errorContrasenia = ref('');
const errorProvincia = ref('');

const isPasswordVisible = ref(false);

const lugaresArgentinos = [
  'Buenos Aires',
  'Catamarca',
  'Chaco',
  'Chubut',
  'Córdoba',
  'Corrientes',
  'Entre Ríos',
  'Formosa',
  'Jujuy',
  'La Pampa',
  'La Rioja',
  'Mendoza',
  'Misiones',
  'Neuquén',
  'Río Negro',
  'Salta',
  'San Juan',
  'San Luis',
  'Santa Cruz',
  'Santa Fe',
  'Santiago del Estero',
  'Tierra del Fuego',
  'Tucumán'
];


const togglePasswordVisibility = () => {
  isPasswordVisible.value = !isPasswordVisible.value;
};

const registroUsuario = async () => {
  if (!validateForm()) {
    return;
  }

  cargando.value = true;
  backendError.value = '';

  try {
    const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/usuarios/guias', {
      nombre: nombre.value,
      email: email.value,
      contrasenia: contrasenia.value,
      provincia: provincia.value,
    });

    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
      router.push('/');

      nombre.value = '';
      email.value = '';
      contrasenia.value = '';
      provincia.value = '';
    }
  } catch (error) {
    console.error('Detalles del error:', error);
    if (error.response && error.response.data.msg) {
      backendError.value = error.response.data.msg;
    } else {
      backendError.value = 'Error desconocido al registrar el usuario';
    }
  } finally {
    cargando.value = false;
  }
};

const validateForm = () => {
  let isValid = true;
  errorNombre.value = '';
  errorEmail.value = '';
  errorContrasenia.value = '';
  errorProvincia.value = '';

  if (!nombre.value) {
    errorNombre.value = 'Por favor, ingresa tu nombre';
    isValid = false;
  }

  if (!email.value) {
    errorEmail.value = 'Por favor, ingresa tu correo electrónico';
    isValid = false;
  }

  if (!contrasenia.value) {
    errorContrasenia.value = 'Por favor, ingresa una contraseña';
    isValid = false;
  } else if (contrasenia.value.length < 6) {
    errorContrasenia.value = 'La contraseña debe tener al menos 6 caracteres';
    isValid = false;
  }

  if (!provincia.value) {
    errorProvincia.value = 'Por favor, selecciona una provincia';
    isValid = false;
  }

  return isValid;
};
</script>

<template>
  <div class="flex items-center justify-center ">
    <div class="flex items-center justify-center flex-col max-w-md w-full bg-white rounded-lg shadow-lg p-6">

      <TituloSecundario class="text-center mb-6">Crea una cuenta de guía</TituloSecundario>

      <form @submit.prevent="registroUsuario" class="w-full">

        <!-- Nombre de Usuario -->
        <div class="mb-4">
          <label for="nombre" class="block text-sm font-medium text-gray-600">Nombre de Usuario</label>
          <input type="text" id="nombre" v-model="nombre" placeholder="Ingresa tu nombre de usuario"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <p class="text-red-500 text-sm mt-1" v-if="errorNombre">{{ errorNombre }}</p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-600">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" placeholder="Ingresa tu correo electrónico" autocomplete="email"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          <p class="text-red-500 text-sm mt-1" v-if="errorEmail">{{ errorEmail }}</p>
        </div>

        <!-- Contraseña -->
        <div class="mb-4 relative">
          <label for="contrasenia" class="block text-sm font-medium text-gray-600">Contraseña</label>
          <input :type="isPasswordVisible ? 'text' : 'password'" id="contrasenia" v-model="contrasenia"
            placeholder="Ingresa tu contraseña"  autocomplete="current-password"
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
          <p class="text-red-500 text-sm mt-1" v-if="errorContrasenia">{{ errorContrasenia }}</p>
        </div>

        <!-- Provincia -->
        <div class="mb-4">
          <label for="provincia" class="block text-sm font-medium text-gray-600">Provincia</label>
          <select id="provincia" v-model="provincia"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="" disabled selected>Selecciona tu provincia</option>
            <option v-for="lugar in lugaresArgentinos" :key="lugar" :value="lugar">
              {{ lugar }}
            </option>
          </select>
          <p class="text-red-500 text-sm mt-1" v-if="errorProvincia">{{ errorProvincia }}</p>
        </div>

        <!-- Botón de Registro -->
        <div class="flex justify-center">
          <BotonPrincipal :disabled="cargando">{{ cargando ? 'Registrando...' : 'Registrarse' }} </BotonPrincipal>
        </div>
      </form>
    </div>
  </div>
</template>
