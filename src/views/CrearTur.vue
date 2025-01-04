<script>
import axios from 'axios';

const lugaresArgentinos = [
  'Buenos Aires', 'Córdoba', 'Mendoza', 'Mar del Plata', 'Ushuaia', 
  'Bariloche', 'Salta', 'Rosario', 'Tucumán', 'Iguazú', 'Neuquén', 
  'Misiones', 'Posadas', 'San Fernando del Valle de Catamarca', 'San Juan', 
  'Río Gallegos', 'Río Grande', 'El Calafate', 'San Luis', 'Resistencia', 
  'Tremedal', 'General Roca'
];

export default {
  data() {
    return {
      loading: false,
      token: localStorage.getItem('token'), // Token almacenado en localStorage
      tourData: {
        titulo: '',
        descripcion: '',
        precio: '',
        provincia: '', // Inicializamos como cadena vacía
        duracion: '',
        fechasDisponibles: [],
        fotoPortada: '',
        politicaCancelacion: ''
      },
      provincias: lugaresArgentinos
    };
  },
  methods: {
    async crearTour() {
      console.log("Validando el formulario...");

      if (this.formIsValid()) {
        console.log("Formulario válido. Creando el tour...");
        
        try {
          this.loading = true;
          console.log("Guía ID obtenida del token:", this.token); 

          const datosTour = {
            ...this.tourData,
            guia: this.token  
          };

          console.log("Enviando datos del tour al backend...", datosTour);

          const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/tur', datosTour, {
            headers: { Authorization: `Bearer ${this.token}` }
          });

          console.log("Respuesta del backend:", response.data);

          this.loading = false;
          alert("Tour creado con éxito!");

        } catch (error) {
          console.error("Error ocurrido:", error);
          this.loading = false;

          if (error.response && error.response.status === 401) {
            alert("No autorizado, verifica tu sesión.");
          } else {
            alert("Hubo un problema al crear el tour.");
          }
        } finally {
          console.log("Finalización de la solicitud");
        }
      } else {
        console.log("Formulario no válido.");
      }
    },
    formIsValid() {
      // Validar que todos los campos estén llenos
      return this.tourData.titulo &&
             this.tourData.descripcion &&
             this.tourData.precio &&
             this.tourData.provincia &&
             this.tourData.duracion &&
             this.tourData.fechasDisponibles.length > 0;
    }
  }
};
</script>
<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <form @submit.prevent="crearTour" class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <div v-if="loading" class="text-center text-gray-500">Cargando...</div>
      <div v-else>
        <!-- Título del Tour -->
        <label for="titulo" class="block text-lg font-semibold text-gray-700">Título del Tour:</label>
        <input
          type="text"
          v-model="tourData.titulo"
          id="titulo"
          required
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Descripción del Tour -->
        <label for="descripcion" class="block text-lg font-semibold text-gray-700 mt-4">Descripción del Tour:</label>
        <textarea
          v-model="tourData.descripcion"
          id="descripcion"
          required
          rows="4"
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <!-- Precio del Tour -->
        <label for="precio" class="block text-lg font-semibold text-gray-700 mt-4">Precio del Tour:</label>
        <input
          type="number"
          v-model="tourData.precio"
          id="precio"
          required
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Provincia -->
        <label for="provincia" class="block text-lg font-semibold text-gray-700 mt-4">Provincia:</label>
        <select
          v-model="tourData.provincia"
          id="provincia"
          required
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled selected>Selecciona una provincia</option>
          <option v-for="provincia in provincias" :key="provincia" :value="provincia">
            {{ provincia }}
          </option>
        </select>

        <!-- Duración del Tour -->
        <label for="duracion" class="block text-lg font-semibold text-gray-700 mt-4">Duración del Tour:</label>
        <input
          type="text"
          v-model="tourData.duracion"
          id="duracion"
          required
          placeholder="Ejemplo: 2 horas 30 minutos"
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Fechas Disponibles -->
        <label for="fechasDisponibles" class="block text-lg font-semibold text-gray-700 mt-4">Fechas Disponibles:</label>
        <input
          type="date"
          v-model="tourData.fechasDisponibles"
          id="fechasDisponibles"
          required
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Foto de Portada -->
        <label for="fotoPortada" class="block text-lg font-semibold text-gray-700 mt-4">Foto de Portada:</label>
        <input
          type="text"
          v-model="tourData.fotoPortada"
          id="fotoPortada"
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="/ruta/a/imagen.png"
        />

        <!-- Política de Cancelación -->
        <label for="politicaCancelacion" class="block text-lg font-semibold text-gray-700 mt-4">Política de Cancelación:</label>
        <textarea
          v-model="tourData.politicaCancelacion"
          id="politicaCancelacion"
          rows="4"
          class="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <!-- Botón de Enviar -->
        <div class="mt-6">
          <button
            :disabled="loading"
            type="submit"
            class="w-full py-3 bg-green-500 text-white font-semibold text-lg rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-gray-400"
          >
            {{ loading ? 'Cargando...' : 'Crear Tour' }}
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
