<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const router = useRouter();
const cargando = ref(false);
const token = localStorage.getItem('token');
const userId = ref(null);
const mensajeError = ref('');
const mensajeExito = ref('');

// console.log('Id del guia:', userId);

const fetchUserData = async () => {
  try {
    // console.log('Obteniendo datos del usuario con ID:', userId.value);
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los datos del usuario: ${response.statusText}`);
    }
    const dataGuia = await response.json();
    // console.log('Datos del Guia:', dataGuia);

    const provinciaGuia = dataGuia.data?.provincia;
    if (provinciaGuia) {
      // console.log('Provincia del Guia:', provinciaGuia);
      tourData.provincia = provinciaGuia;
      // console.log('tourData.provincia:', tourData.provincia);
    } else {
      console.error('No se encontró la provincia del guía');
      tourData.provincia = 'Provincia desconocida';
    }
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
  } finally {
    cargando.value = false;
  }
};


const fileInput = ref(null);
const abrirSelector = () => {
  fileInput.value.click();
};

const tourData = ref({
  titulo: '',
  descripcion: '',
  precio: '',
  provincia: '',
  duracion: '',
  fechasDisponibles: [],
  fotoPortada: '',
  politicaCancelacion: ''
});

const errors = ref({
  titulo: '',
  descripcion: '',
  precio: '',
  provincia: '',
  duracion: '',
  fechasDisponibles: '',
  fotoPortada: '',
  politicaCancelacion: ''
});

const fechaTemp = ref('');

onMounted(() => {
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      userId.value = decodedToken.userId;
    } catch (error) {
      //console.error('Error al decodificar el token:', error);
    }
  }
  fetchUserData(userId);
});

const agregarFecha = () => {
  if (fechaTemp.value && !tourData.value.fechasDisponibles.includes(fechaTemp.value)) {
    tourData.value.fechasDisponibles.push(fechaTemp.value);
    fechaTemp.value = '';
    errors.value.fechasDisponibles = '';
  } else {
    errors.value.fechasDisponibles = 'La fecha no puede estar vacía o repetida.';
  }
};

const eliminarFecha = (index) => {
  tourData.value.fechasDisponibles.splice(index, 1);
};

const validarCampo = (campo, valor) => {
  if (!valor) {
    errors.value[campo] = `El campo ${campo} es obligatorio.`;
    return false;
  }

  switch (campo) {
    case 'precio':
      if (isNaN(valor)) {
        errors.value[campo] = 'El precio debe ser un número.';
        return false;
      }
      if (valor <= 0) {
        errors.value[campo] = 'El precio debe ser mayor que 0.';
        return false;
      }
      break;

    case 'duracion':
      if (!/^\d+\s*(horas?|días?)$/i.test(valor)) {
        errors.value[campo] = 'Ingrese una duración válida (ej: "2 horas" o "1 día").';
        return false;
      }
      break;

    case 'fechasDisponibles':
      if (tourData.value.fechasDisponibles.length === 0) {
        errors.value[campo] = 'Debe agregar al menos una fecha disponible.';
        return false;
      }
      break;

    case 'fotoPortada':
      if (valor && !valor.startsWith('data:image')) {
        errors.value[campo] = 'El archivo debe ser una imagen válida.';
        return false;
      }
      break;

    default:
      break;
  }

  errors.value[campo] = '';
  return true;
};

const formIsValid = () => {
  let valido = true;

  for (const [campo, valor] of Object.entries(tourData.value)) {
    if (campo === 'fotoPortada') {
      continue;
    }

    if (campo === 'fechasDisponibles' && tourData.value.fechasDisponibles.length === 0) {
      errors.value[campo] = 'Debe agregar al menos una fecha disponible.';
      valido = false;
    } else if (campo !== 'fechasDisponibles' && !validarCampo(campo, valor)) {
      valido = false;
    }
  }

  return valido;
};

const actualizarFoto = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      errors.value.fotoPortada = 'El archivo debe ser una imagen.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.value.fotoPortada = 'El archivo no debe exceder 5 MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      tourData.value.fotoPortada = reader.result;
      errors.value.fotoPortada = '';
    };
    reader.readAsDataURL(file);
  } else {
    errors.value.fotoPortada = '';
  }
};

const crearTour = async () => {
  if (!formIsValid()) return;

  try {
    cargando.value = true;
    const datosTour = {
      ...tourData.value,
      fotoPortada: tourData.value.fotoPortada || '/img/default_portada.png',
      guia: userId.value
    };

    const response = await axios.post(
      'https://back-tesis-lovat.vercel.app/arcana/tur',
      datosTour,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const tourId = response.data.tour._id;
    mensajeExito.value = 'Tour creado exitosamente!';
    setTimeout(() => {
      router.push({ name: 'vistaTur', params: { id: tourId } });
    }, 1500);
  } catch (error) {
    console.error('Error creando el tour:', error);
    if (error.response && error.response.data) {
      mensajeError.value = error.response.data.message || 'Ocurrió un error al crear el tour.';
    } else {
      mensajeError.value = 'Error de conexión. Inténtalo de nuevo.';
    }
  } finally {
    cargando.value = false;
  }
};
</script>

<template>
  <IrAtras />
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4 text-gray-800">Crear Tour</h1>

    <!-- Título -->
    <div class="mb-4">
      <label for="titulo" class="block text-sm font-medium text-gray-700">Título del Tour</label>
      <input id="titulo" type="text" v-model="tourData.titulo" @blur="validarCampo('titulo', tourData.titulo)"
        placeholder="Ingresa el título del tour"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      <p v-if="errors.titulo" class="text-red-500 text-sm mt-1">{{ errors.titulo }}</p>
    </div>

    <!-- Descripción -->
    <div class="mb-4">
      <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea id="descripcion" v-model="tourData.descripcion"
        @blur="validarCampo('descripcion', tourData.descripcion)" placeholder="Describe el tour" rows="4"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
      <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
    </div>

    <!-- Precio -->
    <div class="mb-4">
      <label for="precio" class="block text-sm font-medium text-gray-700">Precio</label>
      <input id="precio" type="number" v-model="tourData.precio" @blur="validarCampo('precio', tourData.precio)"
        placeholder="Ingresa el precio"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
      <p v-if="errors.precio" class="text-red-500 text-sm mt-1">{{ errors.precio }}</p>
    </div>

    <!-- Provincia -->
    <div class="mb-4">
      <label for="provincia" class="block text-sm font-medium text-gray-700">Provincia</label>
      <input id="provincia" type="text"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
        v-model="tourData.provincia" readonly />
      <p v-if="errors.provincia" class="text-[#7E2323] text-sm mt-1">No se encontró la provincia</p>
    </div>


    <!-- Duración -->
    <div class="mb-4">
      <label for="duracion" class="block text-sm font-medium text-gray-700">Duración (en horas o días)</label>
      <input id="duracion" type="text" v-model="tourData.duracion" @blur="validarCampo('duracion', tourData.duracion)"
        placeholder="Ej: '2 horas' o '1 día'"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#788A68] focus:border-[#788A68]" />
      <p v-if="errors.duracion" class="text-red-500 text-sm mt-1">{{ errors.duracion }}</p>
    </div>

    <!-- Fechas Disponibles -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Fechas Disponibles</label>
      <div class="flex items-center space-x-2">
        <input type="date" v-model="fechaTemp"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#788A68] focus:border-[#788A68]" />
        <BotonPrincipal type="button" @click="agregarFecha" class="px-4 py-2 text-white">
          Agregar
        </BotonPrincipal>
      </div>
      <ul class="mt-2 space-y-1">
        <li v-for="(fecha, index) in tourData.fechasDisponibles" :key="index"
          class="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
          {{ fecha }}
          <button type="button" @click="eliminarFecha(index)"
            class="text-red-500 hover:text-red-700 focus:outline-none">
            Eliminar
          </button>
        </li>
      </ul>
      <p v-if="errors.fechasDisponibles" class="text-red-500 text-sm mt-1">{{ errors.fechasDisponibles }}</p>
    </div>

    <!-- Foto de Portada -->
    <div class="mb-4">
      <label for="fotoPortada" class="block text-sm font-medium text-gray-700">Foto de Portada</label>
      <input id="fotoPortada" ref="fileInput" type="file" accept="image/*" @change="actualizarFoto" class="hidden" />

      <button @click="abrirSelector" class="bg-[#788A68] text-[#F7F5EB] font-bold py-2 px-4 rounded mt-1">
        Seleccionar imagen
      </button>
      <p v-if="errors.fotoPortada" class="text-red-500 text-sm mt-1">{{ errors.fotoPortada }}</p>
    </div>

    <!-- Política de Cancelación -->
    <div class="mb-4">
      <label for="politicaCancelacion" class="block text-sm font-medium text-gray-700">Política de Cancelación</label>
      <textarea id="politicaCancelacion" v-model="tourData.politicaCancelacion"
        @blur="validarCampo('politicaCancelacion', tourData.politicaCancelacion)"
        placeholder="Escribe la política de cancelación" rows="4"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea>
      <p v-if="errors.politicaCancelacion" class="text-red-500 text-sm mt-1">{{ errors.politicaCancelacion }}</p>
    </div>

    <!-- Mensajes de éxito y error -->
    <p v-if="mensajeExito" class="text-green-500 text-sm mt-4">{{ mensajeExito }}</p>
    <p v-if="mensajeError" class="text-red-500 text-sm mt-4">{{ mensajeError }}</p>

    <div class="flex justify-center">
      <BotonPrincipal @click="crearTour" :disabled="cargando">{{ cargando ? 'Creando Tour...' : 'Crear Tour' }}
      </BotonPrincipal>
    </div>
  </div>
</template>