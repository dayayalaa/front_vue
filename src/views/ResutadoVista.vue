<template>
    <div class="max-w-md mx-auto p-4">
        <h2 class="text-2xl font-bold mb-4 text-center">Resultados de Vuelos de ida</h2>
        <p><strong>Origen:</strong> {{ origen }}</p>
        <p><strong>Destino:</strong> {{ destino }}</p>

        <div v-if="cargando">
            <p>Cargando opciones de vuelos...</p>
        </div>

        <div v-else-if="Array.isArray(vuelos) && vuelos.length">
            <div class="grid grid-cols-1 gap-4">
                <div v-for="vuelo in vuelos" :key="vuelo.flight_number" class="bg-white shadow-md rounded-lg p-4">
                    <p><strong>Aerolínea:</strong> {{ vuelo.airline }}</p>
                    <p><strong>Número de Vuelo:</strong> {{ vuelo.flight_number }}</p>
                    <p><strong>Precio:</strong> {{ vuelo.price }} ARS</p>
                    <p><strong>Origen:</strong> {{ vuelo.origin }}</p>
                    <p><strong>Destino:</strong> {{ vuelo.destination }}</p>
                    <p><strong>Salida:</strong> {{ vuelo.departure_at }}</p>
                    <p><strong>Regreso:</strong> {{ vuelo.return_at }}</p>
                    <p><strong>Duración:</strong> {{ vuelo.duration }} horas</p>
                </div>
            </div>
        </div>
        <p v-else>No hay opciones de vuelos disponibles.</p>

        <h2 class="text-2xl font-bold mb-4 text-center">Resultados de Vuelos de vuelta</h2>
        <p><strong>Origen:</strong> {{ destino }}</p>
        <p><strong>Destino:</strong> {{ origen }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const origen = route.query.origen;
const destino = route.query.destino;
const fechaSalida = route.query.fechaSalida;
const vuelos = ref([]);
const cargando = ref(true);

onMounted(async () => {
    try {
        if (!origen || !destino || !fechaSalida) {
            cargando.value = false;
            return;
        }

        const response = await axios.get('http://localhost:3000/arcana/vuelos/ida', {
            params: {
                origen,
                destino,
                fechaSalida,
            }
        });
        
        // Accede a los vuelos en la estructura correcta según tu backend
        vuelos.value = response.data.vuelosAPI || [];
    } catch (error) {
        console.error('Error al obtener vuelos:', error);
    } finally {
        cargando.value = false;
    }
});
</script>
