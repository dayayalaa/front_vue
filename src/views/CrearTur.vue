<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

// Referencias de los campos del formulario
const titulo = ref('');
const descripcion = ref('');
const precio = ref('');
const provincia = ref('');
const duracion = ref('');
const fechasDisponibles = ref([]);
const fotoPortada = ref('/img/default_portada.png');
const politicaCancelacion = ref('');
const loading = ref(false);
const backendError = ref('');
const errors = ref({
  titulo: '',
  descripcion: '',
  precio: '',
  provincia: '',
  duracion: '',
  fechasDisponibles: '',
});

// Lista de lugares argentinos
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

const validateForm = () => {
  let isValid = true;
  errors.value = {
    titulo: '',
    descripcion: '',
    precio: '',
    provincia: '',
    duracion: '',
    fechasDisponibles: '',
  };

  if (!titulo.value) {
    errors.value.titulo = 'Por favor, ingresa el título del tour';
    isValid = false;
  }

  if (!descripcion.value) {
    errors.value.descripcion = 'Por favor, ingresa una descripción';
    isValid = false;
  }

  if (!precio.value || isNaN(precio.value)) {
    errors.value.precio = 'Por favor, ingresa un precio válido';
    isValid = false;
  }

  if (!provincia.value) {
    errors.value.provincia = 'Por favor, selecciona una provincia';
    isValid = false;
  }

  if (!duracion.value) {
    errors.value.duracion = 'Por favor, ingresa la duración';
    isValid = false;
  }

  if (!fechasDisponibles.value.length) {
    errors.value.fechasDisponibles = 'Por favor, ingresa las fechas disponibles';
    isValid = false;
  }

  return isValid;
};

// Función para obtener el ID del guía desde el token
const obtenerGuia = async () => {
  const token = localStorage.getItem('token');  // O lo que sea tu mecanismo para obtener el token

  if (!token) {
    backendError.value = 'No se ha encontrado el token de autenticación';
    return;
  }

  try {
    const response = await Axios.get('https://back-tesis-lovat.vercel.app/arcana/verifica-token', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Asignamos el ID del usuario autenticado (guía)
    if (response.data && response.data.user) {
      return response.data.user._id;  // Devolvemos el ID del usuario (guía)
    }
  } catch (error) {
    console.error('Error al verificar el token: ', error);
    backendError.value = 'Error al verificar el token de autenticación';
    return null;
  }
};

const crearTour = async () => {
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  backendError.value = '';

  try {
    const guiaId = await obtenerGuia();

    if (!guiaId) {
      backendError.value = 'No se ha encontrado el ID del guía';
      return;
    }

    const response = await Axios.post('https://back-tesis-lovat.vercel.app/arcana/tur', {
      guia: guiaId,  // Ahora se incluye el ID del guía automáticamente
      titulo: titulo.value,
      descripcion: descripcion.value,
      precio: precio.value,
      provincia: provincia.value,
      duracion: duracion.value,
      fechasDisponibles: fechasDisponibles.value,
      fotoPortada: fotoPortada.value,
      politicaCancelacion: politicaCancelacion.value,
    });

    if (response.data) {
      // Resetear campos después de éxito
      titulo.value = '';
      descripcion.value = '';
      precio.value = '';
      provincia.value = '';
      duracion.value = '';
      fechasDisponibles.value = [];
      fotoPortada.value = '';
      politicaCancelacion.value = '';

      router.push('/tus-turs');
    }
  } catch (error) {
    console.error('Error ocurrido: ', error);
    if (error.response) {
      backendError.value = error.response.data.msg || 'Error al crear el tour';
    } else {
      backendError.value = 'Error desconocido de red: ' + error.message;
    }
  } finally {
    loading.value = false;
  }
};

// Obtener el ID del guía al cargar el componente
onMounted(() => {
  obtenerGuia();
});
</script>

<template>
  <IrAtras />
  <div class="flex items-center justify-center h-screen bg-gray-50 pt-6 pb-8">
    <div class="flex items-center justify-center flex-col max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
      <TituloSecundario class="text-center mb-6">Crear un Tour</TituloSecundario>

      <form @submit.prevent="crearTour" class="w-full">
        <!-- Título del Tour -->
        <div class="mb-4">
          <label for="titulo" class="block text-sm font-medium text-gray-600">Título del Tour</label>
          <input
            type="text"
            id="titulo"
            v-model="titulo"
            placeholder="Ingresa el título del tour"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-red-500">{{ errors.titulo }}</p>
        </div>

        <!-- Descripción del Tour -->
        <div class="mb-4">
          <label for="descripcion" class="block text-sm font-medium text-gray-600">Descripción</label>
          <textarea
            id="descripcion"
            v-model="descripcion"
            placeholder="Ingresa una descripción del tour"
            rows="4"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <p class="text-red-500">{{ errors.descripcion }}</p>
        </div>

        <!-- Precio -->
        <div class="mb-4">
          <label for="precio" class="block text-sm font-medium text-gray-600">Precio</label>
          <input
            type="number"
            id="precio"
            v-model="precio"
            placeholder="Ingresa el precio del tour"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-red-500">{{ errors.precio }}</p>
        </div>

        <!-- Provincia -->
        <div class="mb-4">
          <label for="provincia" class="block text-sm font-medium text-gray-600">Provincia</label>
          <select
            id="provincia"
            v-model="provincia"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona una provincia</option>
            <option v-for="lugar in lugaresArgentinos" :key="lugar" :value="lugar">{{ lugar }}</option>
          </select>
          <p class="text-red-500">{{ errors.provincia }}</p>
        </div>

        <!-- Duración -->
        <div class="mb-4">
          <label for="duracion" class="block text-sm font-medium text-gray-600">Duración</label>
          <input
            type="text"
            id="duracion"
            v-model="duracion"
            placeholder="Ingresa la duración del tour (ej. 2 horas)"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-red-500">{{ errors.duracion }}</p>
        </div>

        <!-- Fechas Disponibles -->
        <div class="mb-4">
          <label for="fechasDisponibles" class="block text-sm font-medium text-gray-600">Fechas Disponibles</label>
          <input
            type="date"
            id="fechasDisponibles"
            v-model="fechasDisponibles"
            multiple
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-red-500">{{ errors.fechasDisponibles }}</p>
        </div>

        <!-- Foto de portada -->
        <div class="mb-4">
          <label for="fotoPortada" class="block text-sm font-medium text-gray-600">Foto de Portada</label>
          <input
            type="file"
            id="fotoPortada"
            @change="handleFileChange"
            class="border border-gray-300 p-3 rounded w-full mt-2"
          />
        </div>

        <!-- Política de cancelación -->
        <div class="mb-4">
          <label for="politicaCancelacion" class="block text-sm font-medium text-gray-600">Política de cancelación</label>
          <textarea
            id="politicaCancelacion"
            v-model="politicaCancelacion"
            placeholder="Ingresa la política de cancelación"
            rows="3"
            class="border border-gray-300 p-3 rounded w-full mt-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Error de backend -->
        <p class="text-red-500 text-center">{{ backendError }}</p>

        <!-- Botón para enviar el formulario -->
        <div class="mb-4">
          <BotonPrincipal :loading="loading" texto="Crear Tour" />
        </div>
      </form>
    </div>
  </div>
</template>
