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

const fetchTour = async () => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${turId}`);
    Object.assign(tur, response.data);
    fotoPreview.value = tur.fotoPortada; 
  } catch (error) {
    console.error('Error al obtener el tour:', error);
  } finally {
    cargando.value = false;
  }
};

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    fotoArchivo.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      fotoPreview.value = e.target.result; 
    };
    reader.readAsDataURL(file);
  }
};

const agregarFecha = () => {
  if (fechaTemp.value) {
    tur.fechasDisponibles.push(fechaTemp.value);
    fechaTemp.value = ''; 
  }
};

const eliminarFecha = (index) => {
  tur.fechasDisponibles.splice(index, 1);
};

const updateTour = async () => {
  try {
    if (fotoArchivo.value) {
      const formData = new FormData();
      formData.append('file', fotoArchivo.value);

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
        //console.log('URL de la imagen recibida:', fotoResponse.data.secure_url);
        tur.fotoPortada = fotoResponse.data.secure_url;
        fotoPreview.value = fotoResponse.data.secure_url;
      } else {
        console.error('No se recibió la URL de la imagen en la respuesta.');
      }
    }

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
      router.push(`/vistaTur/${turId}`);
    }
  } catch (error) {
    console.error('Error al actualizar el tour:', error);
    if (error.response) {
      console.error('Respuesta del servidor:', error.response.data);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
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

    <SpinnerCarga v-if="cargando"/>

    <form v-else @submit.prevent="updateTour" class="space-y-4">
      <div>
        <label for="titulo" class="block font-medium">Título</label>
        <input id="titulo" v-model="tur.titulo" type="text" class="w-full p-2 border rounded" required />
      </div>

      <div>
        <label for="descripcion" class="block font-medium">Descripción</label>
        <textarea id="descripcion" v-model="tur.descripcion" class="w-full p-2 border rounded" rows="4" required></textarea>
      </div>

      <div>
        <label for="precio" class="block font-medium">Precio (ARS)</label>
        <input id="precio" v-model.number="tur.precio" type="number" class="w-full p-2 border rounded" required />
      </div>

      <div>
        <label for="provincia" class="block font-medium">Provincia</label>
        <select id="provincia" v-model="tur.provincia" class="w-full p-2 border rounded" required>
          <option value="" disabled selected>Seleccionar provincia</option>
          <option v-for="provincia in provincias" :key="provincia" :value="provincia">
            {{ provincia }}
          </option>
        </select>
      </div>

      <div>
        <label for="duracion" class="block font-medium">Duración</label>
        <input id="duracion" v-model="tur.duracion" type="text" class="w-full p-2 border rounded" placeholder="Ejemplo: 2 horas 30 minutos" required />
      </div>

      <div>
        <label for="fechas" class="block font-medium">Fechas Disponibles</label>
        <div class="flex items-center space-x-2">
          <input type="date" v-model="fechaTemp" class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          <BotonPrincipal type="button" @click="agregarFecha">Agregar</BotonPrincipal>
        </div>
        <ul class="mt-2 space-y-1">
          <li v-for="(fecha, index) in tur.fechasDisponibles" :key="index" class="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-md">
            {{ fecha }}
            <button type="button" @click="eliminarFecha(index)" class="text-red-500 hover:text-red-700 focus:outline-none">
              Eliminar
            </button>
          </li>
        </ul>
      </div>

      <div>
        <label for="fotoPortada" class="block font-medium">Foto de Portada</label>
        <input id="fotoPortada" type="file" @change="handleFileChange" class="w-full p-2 border rounded" accept="image/*" />
        <div v-if="fotoPreview" class="mt-4">
          <p class="font-medium">Vista previa:</p>
          <img :src="fotoPreview" alt="Foto de portada" class="w-full h-32 object-cover rounded border" />
        </div>
      </div>

      <div>
        <label for="politica" class="block font-medium">Política de Cancelación</label>
        <textarea id="politica" v-model="tur.politicaCancelacion" class="w-full p-2 border rounded" rows="4"></textarea>
      </div>

      <div class="flex justify-end">
        <BotonPrincipal type="submit">Guardar Cambios </BotonPrincipal>
      </div>
    </form>
  </div>
</template>