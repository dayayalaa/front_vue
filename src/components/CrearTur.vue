<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';

const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
};

const router = useRouter();
const loading = ref(false);
const token = localStorage.getItem('token');
const userId = ref(null);

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
const provincias = [
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

onMounted(() => {
  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      userId.value = decodedToken.userId;
      // console.log('ID del usuario extraído del token:', userId.value);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
    }
  }
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
  } else {
    errors.value[campo] = '';
    return true;
  }
};

const formIsValid = () => {
  let valido = true;

  //validacion
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
  if (!formIsValid()) {
    alert('Por favor corrige los errores antes de continuar.');
    return;
  }

  try {
    loading.value = true;
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

    // console.log('Respuesta del backend:', response.data);
    const tourId = response.data.tour._id; 
    router.push({ name: 'vistaTur', params: { id: tourId } });
  } catch (error) {
    console.error('Error creando el tour:', error);
    alert('Ocurrió un error al crear el tour.');
  } finally {
    loading.value = false;
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
      <input
        id="titulo"
        type="text"
        v-model="tourData.titulo"
        @blur="validarCampo('titulo', tourData.titulo)"
        placeholder="Ingresa el título del tour"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <p v-if="errors.titulo" class="text-red-500 text-sm mt-1">{{ errors.titulo }}</p>
    </div>

    <!-- Descripción -->
    <div class="mb-4">
      <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
      <textarea
        id="descripcion"
        v-model="tourData.descripcion"
        @blur="validarCampo('descripcion', tourData.descripcion)"
        placeholder="Describe el tour"
        rows="4"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
    </div>

    <!-- Precio -->
    <div class="mb-4">
      <label for="precio" class="block text-sm font-medium text-gray-700">Precio</label>
      <input
        id="precio"
        type="number"
        v-model="tourData.precio"
        @blur="validarCampo('precio', tourData.precio)"
        placeholder="Ingresa el precio"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <p v-if="errors.precio" class="text-red-500 text-sm mt-1">{{ errors.precio }}</p>
    </div>

    <!-- Provincia -->
    <div class="mb-4">
      <label for="provincia" class="block text-sm font-medium text-gray-700">Provincia</label>
      <select
        id="provincia"
        v-model="tourData.provincia"
        @blur="validarCampo('provincia', tourData.provincia)"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>Selecciona una provincia</option>
        <option v-for="provincia in provincias" :key="provincia" :value="provincia">
          {{ provincia }}
        </option>
      </select>
      <p v-if="errors.provincia" class="text-red-500 text-sm mt-1">{{ errors.provincia }}</p>
    </div>

    <!-- Duración -->
    <div class="mb-4">
      <label for="duracion" class="block text-sm font-medium text-gray-700">Duración (en horas o días)</label>
      <input
        id="duracion"
        type="text"
        v-model="tourData.duracion"
        @blur="validarCampo('duracion', tourData.duracion)"
        placeholder="Duración del tour"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <p v-if="errors.duracion" class="text-red-500 text-sm mt-1">{{ errors.duracion }}</p>
    </div>

    <!-- Fechas Disponibles -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700">Fechas Disponibles</label>
      <div class="flex items-center space-x-2">
        <input
          type="date"
          v-model="fechaTemp"
          class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          @click="agregarFecha"
          class="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 focus:outline-none"
        >
          Agregar
        </button>
      </div>
      <ul class="mt-2 space-y-1">
        <li
          v-for="(fecha, index) in tourData.fechasDisponibles"
          :key="index"
          class="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md"
        >
          {{ fecha }}
          <button
            type="button"
            @click="eliminarFecha(index)"
            class="text-red-500 hover:text-red-700 focus:outline-none"
          >
            Eliminar
          </button>
        </li>
      </ul>
      <p v-if="errors.fechasDisponibles" class="text-red-500 text-sm mt-1">{{ errors.fechasDisponibles }}</p>
    </div>

   <!-- Foto de Portada -->
    <div class="mb-4">
      <label for="fotoPortada" class="block text-sm font-medium text-gray-700">Foto de Portada</label>
      <input
        id="fotoPortada"
        type="file"
        @change="actualizarFoto"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
      <p v-if="errors.fotoPortada" class="text-red-500 text-sm mt-1">{{ errors.fotoPortada }}</p>
    </div>

    <!-- Política de Cancelación -->
    <div class="mb-4">
      <label for="politicaCancelacion" class="block text-sm font-medium text-gray-700">Política de Cancelación</label>
      <textarea
        id="politicaCancelacion"
        v-model="tourData.politicaCancelacion"
        @blur="validarCampo('politicaCancelacion', tourData.politicaCancelacion)"
        placeholder="Describe la política de cancelación"
        rows="4"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
      <p v-if="errors.politicaCancelacion" class="text-red-500 text-sm mt-1">{{ errors.politicaCancelacion }}</p>
    </div>

    <!-- Botón de Crear -->
    <button
      type="button"
      @click="crearTour"
      :disabled="loading"
      class="w-full px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 focus:outline-none disabled:opacity-50"
    >
      {{ loading ? 'Creando...' : 'Crear Tour' }}
    </button>
  </div>
</template>



