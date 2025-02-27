<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from './SpinnerCarga.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const route = useRoute();
const router = useRouter();

const turId = route.params.id;
const tur = reactive({
  titulo: '',
  descripcion: '',
  precio: 0,
  provincia: '',
  duracion: '',
  fechasDisponibles: [],
  fotoPortada: '',
  politicaCancelacion: '',
});

const fotoPreview = ref('');
const cargando = ref(true);
const fotoArchivo = ref(null);
const fechaTemp = ref('');
const mensajeError = ref('');
const mensajeExito = ref('');

const errors = reactive({
  titulo: '',
  descripcion: '',
  precio: '',
  provincia: '',
  duracion: '',
  fechasDisponibles: '',
  fotoPortada: '',
  politicaCancelacion: '',
});

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
  'Tucumán',
];


const fetchTour = async () => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${turId}`);
    const data = response.data;

 
    delete data.__v;
    delete data._id;

    Object.assign(tur, data);
    fotoPreview.value = tur.fotoPortada;
  } catch (error) {
    console.error('Error al obtener el tour:', error);
    mensajeError.value = 'Error al cargar el tour. Inténtalo de nuevo.';
  } finally {
    cargando.value = false;
  }
};


const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      errors.fotoPortada = 'El archivo debe ser una imagen.';
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      errors.fotoPortada = 'El archivo no debe exceder 5 MB.';
      return;
    }

    fotoArchivo.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.value = e.target.result;
      errors.fotoPortada = '';
    };
    reader.readAsDataURL(file);
  } else {
    errors.fotoPortada = '';
  }
};

const agregarFecha = () => {
  if (fechaTemp.value && !tur.fechasDisponibles.includes(fechaTemp.value)) {
    tur.fechasDisponibles.push(fechaTemp.value);
    fechaTemp.value = '';
    errors.fechasDisponibles = '';
  } else {
    errors.fechasDisponibles = 'La fecha no puede estar vacía o repetida.';
  }
};


const eliminarFecha = (index) => {
  tur.fechasDisponibles.splice(index, 1);
  if (tur.fechasDisponibles.length === 0) {
    errors.fechasDisponibles = 'Debe agregar al menos una fecha disponible.';
  }
};


const validarCampo = (campo, valor) => {
  if (!valor) {
    errors[campo] = `El campo ${campo} es obligatorio.`;
    return false;
  }

  switch (campo) {
    case 'precio':
      if (isNaN(valor)) {
        errors[campo] = 'El precio debe ser un número.';
        return false;
      }
      if (valor <= 0) {
        errors[campo] = 'El precio debe ser mayor que 0.';
        return false;
      }
      break;

    case 'duracion':
      if (!/^\d+\s*(horas?|días?)$/i.test(valor)) {
        errors[campo] = 'Ingrese una duración válida (ej: "2 horas" o "1 día").';
        return false;
      }
      break;

    case 'fechasDisponibles':
      if (tur.fechasDisponibles.length === 0) {
        errors[campo] = 'Debe agregar al menos una fecha disponible.';
        return false;
      }
      break;

    case 'fotoPortada':
      if (valor && !valor.startsWith('data:image')) {
        errors[campo] = 'El archivo debe ser una imagen válida.';
        return false;
      }
      break;

    default:
      break;
  }

  errors[campo] = '';
  return true;
};


const formIsValid = () => {
  let valido = true;

  for (const [campo, valor] of Object.entries(tur)) {
    
    if (campo === 'fotoPortada' || campo === '__v') {
      continue;
    }

    if (campo === 'fechasDisponibles' && tur.fechasDisponibles.length === 0) {
      errors.fechasDisponibles = 'Debe agregar al menos una fecha disponible.';
      console.error(`Error en ${campo}:`, errors.fechasDisponibles);
      valido = false;
    } else if (campo !== 'fechasDisponibles' && !validarCampo(campo, valor)) {
      console.error(`Error en ${campo}:`, errors[campo]);
      valido = false;
    }
  }

  console.log("Estado de errores:", errors);
  return valido;
};


const updateTour = async () => {
  if (!formIsValid()) {
    console.error("El formulario no es válido.");
    return;
  }

  try {
    cargando.value = true;

   
    if (fotoArchivo.value) {
      const formData = new FormData();
      formData.append('file', fotoArchivo.value);

      console.log("Subiendo imagen...");
      const fotoResponse = await axios.put(
        `https://back-tesis-lovat.vercel.app/arcana/imagen/updateTourPortada/${turId}`,
        formData,
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (fotoResponse.data && fotoResponse.data.secure_url) {
        tur.fotoPortada = fotoResponse.data.secure_url;
        fotoPreview.value = fotoResponse.data.secure_url;
        console.log("Imagen subida:", fotoResponse.data.secure_url);
      } else {
        console.error('No se recibió la URL de la imagen en la respuesta.');
      }
    }

    
    console.log("Enviando datos actualizados:", {
      titulo: tur.titulo,
      descripcion: tur.descripcion,
      precio: tur.precio,
      provincia: tur.provincia,
      duracion: tur.duracion,
      fechasDisponibles: tur.fechasDisponibles,
      politicaCancelacion: tur.politicaCancelacion,
      fotoPortada: tur.fotoPortada,
    });

    const response = await axios.put(
      `https://back-tesis-lovat.vercel.app/arcana/tur/${turId}`,
      {
        titulo: tur.titulo,
        descripcion: tur.descripcion,
        precio: tur.precio,
        provincia: tur.provincia,
        duracion: tur.duracion,
        fechasDisponibles: tur.fechasDisponibles,
        politicaCancelacion: tur.politicaCancelacion,
        fotoPortada: tur.fotoPortada,
      },
      {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      console.log("Tour actualizado exitosamente:", response.data);
      mensajeExito.value = 'Tour actualizado exitosamente!';
      setTimeout(() => {
        router.push(`/vistaTur/${turId}`);
      }, 1500);
    }
  } catch (error) {
    console.error('Error al actualizar el tour:', error);
    if (error.response && error.response.data) {
      mensajeError.value = error.response.data.message || 'Ocurrió un error al actualizar el tour.';
    } else {
      mensajeError.value = 'Error de conexión. Inténtalo de nuevo.';
    }
  } finally {
    cargando.value = false;
  }
};


onMounted(() => {
  fetchTour();
});
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <IrAtras />
    <h1 class="text-2xl font-bold mb-4">Editar Tour</h1>

    <SpinnerCarga v-if="cargando" />

    <form v-else @submit.prevent="updateTour" class="space-y-4">
      <!-- Título -->
      <div>
        <label for="titulo" class="block font-medium">Título</label>
        <input
          id="titulo"
          v-model="tur.titulo"
          type="text"
          @blur="validarCampo('titulo', tur.titulo)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          required
        />
        <p v-if="errors.titulo" class="text-red-500 text-sm mt-1">{{ errors.titulo }}</p>
      </div>

      <!-- Descripción -->
      <div>
        <label for="descripcion" class="block font-medium">Descripción</label>
        <textarea
          id="descripcion"
          v-model="tur.descripcion"
          @blur="validarCampo('descripcion', tur.descripcion)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          rows="4"
          required
        ></textarea>
        <p v-if="errors.descripcion" class="text-red-500 text-sm mt-1">{{ errors.descripcion }}</p>
      </div>

      <!-- Precio -->
      <div>
        <label for="precio" class="block font-medium">Precio (ARS)</label>
        <input
          id="precio"
          v-model.number="tur.precio"
          type="number"
          @blur="validarCampo('precio', tur.precio)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          required
        />
        <p v-if="errors.precio" class="text-red-500 text-sm mt-1">{{ errors.precio }}</p>
      </div>

      <!-- Provincia -->
      <div>
        <label for="provincia" class="block font-medium">Provincia</label>
        <select
          id="provincia"
          v-model="tur.provincia"
          @blur="validarCampo('provincia', tur.provincia)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          required
        >
          <option value="" disabled selected>Seleccionar provincia</option>
          <option v-for="provincia in provincias" :key="provincia" :value="provincia">
            {{ provincia }}
          </option>
        </select>
        <p v-if="errors.provincia" class="text-red-500 text-sm mt-1">{{ errors.provincia }}</p>
      </div>

      <!-- Duración -->
      <div>
        <label for="duracion" class="block font-medium">Duración</label>
        <input
          id="duracion"
          v-model="tur.duracion"
          type="text"
          @blur="validarCampo('duracion', tur.duracion)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          placeholder="Ejemplo: 2 horas 30 minutos"
          required
        />
        <p v-if="errors.duracion" class="text-red-500 text-sm mt-1">{{ errors.duracion }}</p>
      </div>

      <!-- Fechas Disponibles -->
      <div>
        <label for="fechas" class="block font-medium">Fechas Disponibles</label>
        <div class="flex items-center space-x-2">
          <input
            type="date"
            v-model="fechaTemp"
            class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          />
          <BotonPrincipal type="button" @click="agregarFecha">Agregar</BotonPrincipal>
        </div>
        <ul class="mt-2 space-y-1">
          <li
            v-for="(fecha, index) in tur.fechasDisponibles"
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
      <div>
        <label for="fotoPortada" class="block font-medium">Foto de Portada</label>
        <input
          id="fotoPortada"
          type="file"
          @change="handleFileChange"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          accept="image/*"
        />
        <div v-if="fotoPreview" class="mt-4">
          <p class="font-medium">Vista previa:</p>
          <img :src="fotoPreview" alt="Foto de portada" class="w-full h-32 object-cover rounded border border-gray-300" />
        </div>
        <p v-if="errors.fotoPortada" class="text-red-500 text-sm mt-1">{{ errors.fotoPortada }}</p>
      </div>

      <!-- Política de Cancelación -->
      <div>
        <label for="politica" class="block font-medium">Política de Cancelación</label>
        <textarea
          id="politica"
          v-model="tur.politicaCancelacion"
          @blur="validarCampo('politicaCancelacion', tur.politicaCancelacion)"
          class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#3C4A28]"
          rows="4"
        ></textarea>
        <p v-if="errors.politicaCancelacion" class="text-red-500 text-sm mt-1">{{ errors.politicaCancelacion }}</p>
      </div>

      <!-- Mensajes de éxito y error -->
      <p v-if="mensajeExito" class="text-green-500 text-sm mt-4">{{ mensajeExito }}</p>
      <p v-if="mensajeError" class="text-red-500 text-sm mt-4">{{ mensajeError }}</p>

      <div class="flex justify-center">
        <BotonPrincipal type="submit">Guardar Cambios</BotonPrincipal>
      </div>
    </form>
  </div>
</template>