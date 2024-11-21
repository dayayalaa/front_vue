<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import Subtitulo from '../components/Subtitulo.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoAvion from '../components/icons/IconoAvion.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';

const route = useRoute();
const router = useRouter();
const origen = route.query.origen;
const destino = route.query.destino;
const cargandoVuelta = ref(true); 
const fechaSalida = route.query.fechaSalida;
const fechaVuelta = route.query.fechaVuelta;

const vuelosIda = ref([]);
const vuelosVuelta = ref([]);
const cargando = ref(true);
const errorMensaje = ref('');
const hotelEconomico = ref(null);

onMounted(async () => {
  cargando.value = true; 
  
  
  try {
    if (!origen || !destino || !fechaSalida || !fechaVuelta) {
      cargando.value = false;
      errorMensaje.value = 'Por favor, verifica que todos los parámetros se hayan ingresado correctamente.';
      return;
    }
    const origenCodificado = encodeURIComponent(origen);
    const destinoCodificado = encodeURIComponent(destino);
    const fechaSalidaCodificada = encodeURIComponent(fechaSalida);
    const fechaVueltaCodificada = encodeURIComponent(fechaVuelta);

    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/vuelos/resultados/${origenCodificado}/${destinoCodificado}/${fechaSalidaCodificada}/${fechaVueltaCodificada}`);
    console.log(response.data);

    if (response.data && Array.isArray(response.data.vuelosIda)) {
      vuelosIda.value = response.data.vuelosIda;
    } else {
      errorMensaje.value = 'No se encontraron vuelos de ida.';
    }

    if (response.data && Array.isArray(response.data.vuelosVuelta)) {
      vuelosVuelta.value = response.data.vuelosVuelta;
    } else {
      errorMensaje.value = 'No se encontraron vuelos de vuelta.';
    }

    const hotelResponse = await axios.get('https://back-tesis-lovat.vercel.app/arcana/hoteles/precio/economico');
    console.log(hotelResponse.data);
    
    if (hotelResponse.data) {
      hotelEconomico.value = hotelResponse.data;
    } else {
      errorMensaje.value = 'No se encontraron hoteles económicos.';
    }

  } catch (error) {
    errorMensaje.value = 'Error al obtener los vuelos. Por favor, inténtalo de nuevo más tarde.';
    console.error('Error al obtener vuelos:', error);
  } finally {
    cargando.value = false;
  }
});


const calcularLlegada = (vuelo) => {
  const fechaSalida = new Date(vuelo.fechaSalida);
  const duracion = vuelo.duracion;
  fechaSalida.setMinutes(fechaSalida.getMinutes() + duracion);
  return {
    fecha: fechaSalida.toLocaleDateString('es-ES'),
    hora: fechaSalida.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};

const obtenerFechaYHora = (fecha) => {
  const date = new Date(fecha);
  return {
    fecha: date.toLocaleDateString('es-ES'),
    hora: date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};
</script>

<template>
  <!---Resultado Vuelos-->
  <IrAtras />
  <div class="max-w-md mx-auto p-4 mb-6">
    <div>
      <TituloPrincipal>Resultado de viajes de ida</TituloPrincipal>
      <p><strong>Origen:</strong> {{ origen }}</p>
      <p><strong>Destino:</strong> {{ destino }}</p>

      <div v-if="cargando">
      <SpinnerCarga/>
      </div>

      <div v-else-if="errorMensaje">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="Array.isArray(vuelosIda) && vuelosIda.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosIda" :key="vuelo.numeroVuelo"
            class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6"> 
            <div class="w-full mb-6">
              <div class="flex justify-between mb-6">
                <div>
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.origen }}</p>
                  <p>Origen</p>
                </div>
                <div class="text-end">
                  <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.destino }}</p>
                  <p>Destino</p>
                </div>
              </div>

              <div class="flex justify-between mb-6">
                <img :src="vuelo.imgAerolinea" alt="Logo de la aerolínea {{ vuelo.aerolinea }}"
                  class="w-16 h-16 object-contain">
                <div class="text-end">
                  <p>Número de Vuelo:</p>
                  <p class="font-medium text-2xl">{{ vuelo.numeroVuelo }}</p>
                </div>
              </div>

              <div class="flex justify-between items-center mb-6">
                <div class="flex justify-between items-center flex-col">
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).fecha }}</p>
                  <p>{{ obtenerFechaYHora(vuelo.fechaSalida).hora }}</p>
                </div>

                <div class="flex-1 mx-2 relative">
                  <div class="absolute left-1/2 transform -translate-x-1/2 -top-3 text-[#222725]">
                    <IconoAvion />
                  </div>
                  <hr class="border-t border-dashed border-[#788B69]">
                </div>

                <div class="flex justify-between items-center flex-col">
                  <p>{{ calcularLlegada(vuelo).fecha }}</p>
                  <p>{{ calcularLlegada(vuelo).hora }}</p>
                </div>
              </div>

              <p><strong>Duración:</strong> {{ vuelo.duracion }} Minutos</p>
              <p><strong>Escala:</strong> {{ vuelo.escala }}</p>

              <div class="flex justify-between">
                <p><strong>Precio:</strong></p>
                <p class="font-black text-2xl text-[#4F6D3A]"> ${{ vuelo.precio }} ARS</p>
              </div>
            </div>

            <BotonPrincipal @click="seleccionarVueloIda(vuelo)">Seleccionar vuelo</BotonPrincipal>
          </div>
        </div>
      </div>
      <p v-else>No hay opciones de vuelos de ida disponibles.</p>
    </div>

    <!-- Hoteles -->
    <div class="max-w-3xl mx-auto px-4 py-6 mb-12">
      <TituloPrincipal class="text-center text-3xl ">Hoteles</TituloPrincipal>
      <div v-if="hotelEconomico" class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <img 
          :src="hotelEconomico.habitaciones[0].imgHabitacion" 
          :alt="hotelEconomico.nombre" 
          class="w-full h-64 object-cover rounded-t-lg" 
        />
        <div class="px-6 py-4">
          <Subtitulo class="text-2xl" >{{ hotelEconomico.nombre }}</Subtitulo>
          <p class="text-gray-600 text-sm mt-2">Tipo de habitación: {{ hotelEconomico.habitaciones[0].tipo }}</p>
          <p class="text-gray-600 text-sm">Precio por noche: ${{ hotelEconomico.habitaciones[0].precioPorNoche }}</p>
        </div>
        <section class="flex justify-center items-center mb-6">
          <RouterLink to="/hoteles">
            <BotonPrincipal>Buscar más opciones</BotonPrincipal>
          </RouterLink>
        </section>
      </div>

      <p v-else class="text-center text-gray-600 italic">No se encontró un hotel económico.</p>
    </div>

    <!-- Resultados vuelos de vuelta -->
    <div class="mb-6">
      <Subtitulo class="text-2xl text-center">Resultados de Vuelos de Vuelta </Subtitulo>
      <p><strong>Origen:</strong> {{ destino }}</p>
      <p><strong>Destino:</strong> {{ origen }}</p>

     
      <div v-if="cargando">
      <SpinnerCarga/>
      </div>
   

      <div v-else-if="errorMensaje">
        <p>{{ errorMensaje }}</p>
      </div>

      <div v-else-if="Array.isArray(vuelosVuelta) && vuelosVuelta.length">
        <div class="grid grid-cols-1 gap-4">
          <div v-for="vuelo in vuelosVuelta" :key="vuelo.numeroVuelo"
            class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center mb-6">
          </div>
        </div>
      </div>
      <p v-else>No se encontraron vuelos de vuelta.</p>
    </div>
  </div>
</template>
