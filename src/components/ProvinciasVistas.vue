<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';

const route = useRoute();
const router = useRouter();
const provinciaInfo = ref(null);
const guias = ref([]);
const guiasFiltrados = ref([]);
const cargando = ref(true);

const obtenerProvincia = async () => {
    const provinciaId = route.params.id;
    console.log('La provincia es:', provinciaId);

    if (!provinciaId) {
        console.error('No se ha especificado una provincia');
        provinciaInfo.value = null;
        return;
    }

    cargando.value = true;
    try {
        const response = await axios.get(
            `https://back-tesis-lovat.vercel.app/arcana/destino/provincia?provincia=${provinciaId}`
        );

        console.log('Estructura de response.data:', response.data);

        if (response && response.data) {
            provinciaInfo.value = {
                title: response.data.title,
                address: response.data.address,
                description: response.data.description?.snippet || 'No disponible',
                thumbnail: response.data.thumbnail,
            };
        } else {
            console.error('No se encontró la información esperada en la respuesta de la API');
            provinciaInfo.value = null;
        }

    } catch (error) {
        console.error('Error al obtener la información de la provincia:', error);
        provinciaInfo.value = null;
    } finally {
        cargando.value = false;
    }
};

const obtenerGuias = async () => {
    const provincia = route.params.id;
    try {
        const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/usuarios/guia');
        guias.value = response.data.data;

        console.log('Guías obtenidas:', guias.value);

        guiasFiltrados.value = guias.value.filter(guia => guia.provincia === provincia);

        console.log('Guías filtradas:', guiasFiltrados.value);
    } catch (error) {
        console.error('Error al obtener guías:', error);
    } finally {
        cargando.value = false;
    }
};


onMounted(() => {
    obtenerProvincia();
    obtenerGuias();
});

const irADetalleGuia = (id) => {
    router.push(`/detalles-guia/${id}`);
};
</script>

<template>
    <div class="w-full max-w-4xl mx-auto p-4">
        <!-- Indicador de carga -->
        <div v-if="cargando" class="text-center">
            <SpinnerCarga />
        </div>

        <!-- Mostrar la información de la provincia -->
        <div v-else-if="provinciaInfo" class="text-center">
            <TituloSecundario class="text-center">Descubre {{ provinciaInfo.title }}</TituloSecundario>
            <TituloTerciario class="text-gray-600 mt-4">{{ provinciaInfo.address }}</TituloTerciario>

            <img :src="provinciaInfo.thumbnail" :alt="'Imagen de ' + route.params.id"
                class="rounded-lg shadow-sm w-full h-auto" />

            <p v-if="provinciaInfo.description" class="mt-4 text-gray-700">
                <strong class="text-green-600">Descripción:</strong>
                {{ provinciaInfo.description }}
            </p>
            <p v-if="provinciaInfo.weather" class="mt-4 text-gray-700">
                <strong class="text-green-600">Clima:</strong> {{ provinciaInfo.weather.celsius }} ({{
                    provinciaInfo.weather.conditions }})
            </p>
        </div>

        <!-- Mensaje si no se encuentra información para la provincia -->
        <p v-else class="text-center text-gray-500">No se encontró información para la provincia {{ route.params.id }}.</p>

       <!-- Lista de guías -->
       <div v-if="guiasFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="guia in guiasFiltrados" :key="guia.id"
                class="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
                @click="irADetalleGuia(guia._id)">
                <img :src="guia.fotoPerfil" :alt="'Foto de ' + guia.nombre"
                    class="w-24 h-24 rounded-full mb-4 object-cover" />

                <strong class="text-lg text-[#222725]">{{ guia.nombre }}</strong>
                <p class="text-gray-600">{{ guia.provincia }}</p>
            </div>
        </div>

        <!-- Mensaje si no se encuentran guías -->
        <p v-else class="text-center text-gray-500">No se encontraron guías para la provincia {{ route.params.id }}.</p>

    </div>
</template>
