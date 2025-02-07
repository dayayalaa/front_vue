<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';
import IrAtras from './IrAtras.vue';

const route = useRoute();
const lugarInfo = ref([]);
const cargando = ref(true);
const errorMessage = ref('');  

const obtenerLugar = async () => {
    const lugarId = route.params.id;
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugar/?provincia=${lugarId}`);
        if (response.data && response.data.length > 0) {
            lugarInfo.value = response.data;
        } else {
            errorMessage.value = 'No se encontró información para este lugar.';
        }
    } catch (error) {
        console.error('Error al obtener lugar:', error);
        errorMessage.value = 'Hubo un problema al obtener la información. Inténtalo más tarde.';
    } finally {
        cargando.value = false;
    }
};

onMounted(() => {
    obtenerLugar();
});
</script>

<template>
    <IrAtras />
    
    <!-- Spinner de carga -->
    <div v-if="cargando" class="text-center">
        <SpinnerCarga />
    </div>

    <!-- Información del lugar -->
    <div v-else-if="lugarInfo.length > 0 && !errorMessage" class="text-center">
        <TituloSecundario class="text-center">Descubre {{ route.params.id }}</TituloSecundario>
        <TituloTerciario class="text-gray-600 mt-4">¿Qué hacer?</TituloTerciario>

        <div class="grid grid-cols-2 gap-4 mt-4">
            <div v-for="(lugar, index) in lugarInfo" :key="index" class="flex flex-col items-center">
                <!-- Validación para la imagen -->
                <img v-if="lugar.thumbnail" 
                     :src="lugar.thumbnail" 
                     :alt="lugar.title" 
                     class="w-[120px] h-[150px] object-cover rounded-md mb-2" />
                <strong class="text-xs text-[#222725] text-center">{{ lugar.title.slice(0, 30) }}{{ lugar.title.length > 30 ? '...' : '' }}</strong>
                <p class="text-xs text-gray-600 text-center">{{ lugar.description }}</p>
            </div>
        </div>
    </div>

    <!-- Mensaje de error o lugar no encontrado -->
    <p v-else class="text-center text-gray-500">{{ errorMessage || 'No se encontró información para este lugar.' }}</p>
</template>
