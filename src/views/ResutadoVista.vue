<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoAvion from '../components/icons/IconoAvion.vue';

const route = useRoute();
const router = useRouter();
const origen = route.query.origen;
const destino = route.query.destino;
const fechaSalidaQuery = route.query.fechaSalida;
const fechaVuelta = route.query.fechaVuelta;
const vuelosIda = ref([]);
const vuelosVuelta = ref([]);
const cargando = ref(true);
const cargandoVuelta = ref(true);
const errorMensaje = ref('');

onMounted(async () => {
  try {
    if (!origen || !destino || !fechaSalidaQuery || !fechaVuelta) {
      cargando.value = false;
      cargandoVuelta.value = false;
      return;
    }

    const responseIda = await axios.get('http://localhost:3000/arcana/vuelos/ida', {
      params: { origen, destino, fechaSalida: fechaSalidaQuery }
    });
    vuelosIda.value = responseIda.data.vuelosAPI || [];

    const responseVuelta = await axios.get('http://localhost:3000/arcana/vuelos/vuelta', {
      params: { origen: destino, destino: origen, fechaVuelta }
    });
    vuelosVuelta.value = responseVuelta.data.vuelosAPI || [];
  } catch (error) {
    errorMensaje.value = 'Error al obtener los vuelos. Por favor, inténtalo de nuevo más tarde.';
    console.error('Error al obtener vuelos:', error);
  } finally {
    cargando.value = false;
    cargandoVuelta.value = false;
  }
});

const calcularLlegada = (vuelo) => {
  const fechaSalida = new Date(vuelo.departure_at);
  const duracion = vuelo.duration;
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
  <div class="max-w-md mx-auto p-4">
    <TituloPrincipal> Resultado de viajes de ida </TituloPrincipal>
    <p><strong>Origen:</strong> {{ origen }}</p>
    <p><strong>Destino:</strong> {{ destino }}</p>

    <div v-if="cargando">
      <p>Cargando opciones de vuelos...</p>
    </div>

    <div v-else-if="errorMensaje">
      <p>{{ errorMensaje }}</p>
    </div>

    <div v-else-if="Array.isArray(vuelosVuelta) && vuelosVuelta.length">
      <div class="grid grid-cols-1 gap-4">
        <div v-for="vuelo in vuelosVuelta" :key="vuelo.flight_number"
          class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center">
          <div class="w-full mb-6">
            <div class="flex justify-between mb-6">
              <div>
                <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.destination }}</p>
                <p>Origen</p>
              </div>
              <div class="text-end">
                <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.origen }}</p>
                <p>Destino</p>
              </div>
            </div>

            <div class="flex justify-between mb-6">
              <img :src="vuelo.logo" alt="Logo de la aerolínea {{ vuelo.airline }}" class="w-16 h-16 object-contain">
              <div class="text-end">
                <p>Número de Vuelo:</p>
                <p class="font-medium text-2xl">{{ vuelo.flight_number }}</p>
              </div>
            </div>

            <div class="flex justify-between items-center mb-6">
              <div class="flex justify-between items-center flex-col">
                <p>{{ obtenerFechaYHora(vuelo.departure_at).fecha }}</p>
                <p>{{ obtenerFechaYHora(vuelo.departure_at).hora }}</p>
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


            <p><strong>Duración:</strong> {{ vuelo.duration }} Minutos</p>
            <p><strong>Escala:</strong> {{ vuelo.transfers }}</p>

            <div class="flex justify-between">
              <p><strong>Precio:</strong></p>
              <p class="font-black text-2xl text-[#4F6D3A]"> ${{ vuelo.price }} ARS</p>
            </div>
          </div>

          <BotonPrincipal @click="seleccionarVueloIda(vuelo)"> Seleccionar vuelo </BotonPrincipal>
        </div>
      </div>
    </div>
    <p v-else>No hay opciones de vuelos de ida disponibles.</p>

    <div class="max-w-md mx-auto p-4 flex flex-col justify-center items-center">
      <h2 class="text-2xl font-bold mb-4 text-center">Agregar un hotel</h2>
      <BotonPrincipal @click="buscarHotel"> Buscar </BotonPrincipal>
    </div>
    <div class="max-w-md mx-auto p-4 flex flex-col justify-center items-center">
      <h2 class="text-2xl font-bold mb-4 text-center">Agregar una actividad</h2>
      <BotonPrincipal @click="buscarActividad"> Buscar </BotonPrincipal>
    </div>

    <h2 class="text-2xl font-bold mb-4 text-center">Resultados de Vuelos de Vuelta</h2>
    <p><strong>Origen:</strong> {{ destino }}</p>
    <p><strong>Destino:</strong> {{ origen }}</p>

    <div v-if="cargandoVuelta">
      <p>Cargando opciones de vuelos de vuelta...</p>
    </div>

    <div v-else-if="errorMensaje">
      <p>{{ errorMensaje }}</p>
    </div>

    <div v-else-if="Array.isArray(vuelosVuelta) && vuelosVuelta.length">
      <div class="grid grid-cols-1 gap-4">
        <div class="grid grid-cols-1 gap-4">
        <div v-for="vuelo in vuelosIda" :key="vuelo.flight_number"
          class="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between items-center">
          <div class="w-full mb-6">
            <div class="flex justify-between mb-6">
              <div>
                <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.origin }}</p>
                <p>Origen</p>
              </div>
              <div class="text-end">
                <p class="font-black text-4xl text-[#4F6D3A]">{{ vuelo.destination }}</p>
                <p>Destino</p>
              </div>
            </div>

            <div class="flex justify-between mb-6">
              <img :src="vuelo.logo" alt="Logo de la aerolínea {{ vuelo.airline }}" class="w-16 h-16 object-contain">
              <div class="text-end">
                <p>Número de Vuelo:</p>
                <p class="font-medium text-2xl">{{ vuelo.flight_number }}</p>
              </div>
            </div>

            <div class="flex justify-between items-center mb-6">
              <div class="flex justify-between items-center flex-col">
                <p>{{ obtenerFechaYHora(vuelo.departure_at).fecha }}</p>
                <p>{{ obtenerFechaYHora(vuelo.departure_at).hora }}</p>
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


            <p><strong>Duración:</strong> {{ vuelo.duration }} Minutos</p>
            <p><strong>Escala:</strong> {{ vuelo.transfers }}</p>

            <div class="flex justify-between">
              <p><strong>Precio:</strong></p>
              <p class="font-black text-2xl text-[#4F6D3A]"> ${{ vuelo.price }} ARS</p>
            </div>
          </div>

          <BotonPrincipal @click="seleccionarVueloIda(vuelo)"> Seleccionar vuelo </BotonPrincipal>
        </div>
      </div>
      </div>
    </div>
    <p v-else>No hay opciones de vuelos de vuelta disponibles.</p>
  </div>
</template>
