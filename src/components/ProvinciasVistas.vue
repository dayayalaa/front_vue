<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';
import IrAtras from './IrAtras.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const route = useRoute();
const router = useRouter();
const provinciaInfo = ref(null);
const guias = ref([]);
const guiasFiltrados = ref([]);
const lugaresTuristicos = ref([]);
const cargando = ref(true);

const provinciasPopulares = ref([]);

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

            const data_id = response.data.data_id;
            console.log('data_id:', data_id);
            obtenerImagenes(data_id);
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

const obtenerLugares = async () => {
    const provincia = route.params.id;
    console.log('Para lugar:', provincia)
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugar?provincia=${provincia}`);
        console.log('Lugares turísticos obtenidos:', response.data);

        if (response.data && Array.isArray(response.data)) {
            lugaresTuristicos.value = response.data;
        } else {
            console.error('Formato inesperado en la respuesta de la API');
            lugaresTuristicos.value = [];
        }
    } catch (error) {
        console.error('Error al obtener lugares turísticos:', error);
        lugaresTuristicos.value = [];
    }
};

const obtenerImagenes = async (data_id) => {
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${data_id}`);

        console.log('Respuesta de la API img:', response.data);

        if (response.data && response.data.images && Array.isArray(response.data.images)) {
            provinciaInfo.value.gallery = response.data.images; 
            console.log('Galería después de asignar:', provinciaInfo.value.gallery);
        } else {
            console.warn('No se encontraron imágenes en la respuesta o el formato es incorrecto');
        }
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
    }
};

const obtenerProvinciasPopulares = async () => {
    try {
        const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/destino/populares');
        provinciasPopulares.value = response.data;
        console.log(provinciasPopulares.value);
    } catch (error) {
        console.error('Error al obtener provincias populares:', error);
    }
};

onMounted(() => {
    obtenerProvincia();
    obtenerGuias();
    obtenerLugares();
    obtenerProvinciasPopulares();
});

const irADetalleGuia = (id) => {
    router.push(`/perfil/guia/${id}`);
};
</script>

<template>
    <IrAtras />
    <div class="w-full max-w-4xl mx-auto p-4">
        <!-- Indicador de carga -->
        <div v-if="cargando" class="text-center">
            <SpinnerCarga />
        </div>

        <!-- Mostrar la información de la provincia -->
        <div v-else-if="provinciaInfo" class="text-center">
            <TituloSecundario class="text-center">Descubre {{ provinciaInfo.title }}</TituloSecundario>
            <TituloTerciario class="text-gray-600 mt-4">{{ provinciaInfo.address }}</TituloTerciario>

            <!-- Galería de imágenes -->
            <div class="flex space-x-4 overflow-x-auto p-2 rounded-lg bg-gray-100">
    <div v-for="(imagen, index) in provinciaInfo.gallery" :key="index" class="flex-shrink-0 w-48">
        <img :src="imagen" :alt="'Imagen ' + index" class="w-full h-32 object-cover rounded-lg shadow-sm" />
    </div>
</div>


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
        <p v-else class="text-center text-gray-500">No se encontró información para la provincia {{ route.params.id }}.
        </p>

        <div class="flex justify-center items-center mt-8 mb-8">
            <router-link to="/crear">
                <BotonPrincipal>Crear viaje</BotonPrincipal>
            </router-link>
        </div>

        <!-- Lista de guías -->
        <div>
            <TituloSecundario class="text-center">Guías turísticos en {{ provinciaInfo?.title || route.params.id }}
            </TituloSecundario>
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
            <p v-else class="text-center text-gray-500">No se encontraron guías para la provincia {{ route.params.id }}.
            </p>
        </div>

        <!-- Vista de los lugares turísticos -->
        <div class="flex flex-col items-center mt-8">
            <!-- Título Secundario -->
            <TituloSecundario class="text-center mb-8">
                Lugares turísticos en {{ provinciaInfo?.title || route.params.id }}
            </TituloSecundario>

            <!-- Lugares turísticos -->
            <div v-if="lugaresTuristicos.length > 0">
                <div class="flex flex-wrap gap-4 justify-center">
                    <!-- Hacemos clickeable cada tarjeta de lugar -->
                    <router-link v-for="lugar in lugaresTuristicos" :key="lugar.id"
                        :to="{ name: 'LugaresVistas', params: { id: lugar.title } }"
                        class="bg-white shadow-lg rounded-lg p-2 flex flex-col items-center w-[150px] h-[200px] cursor-pointer hover:shadow-xl transition">
                        <img :src="lugar.thumbnail" :alt="lugar.title"
                            class="w-full h-[70%] object-cover rounded-md mb-2" />
                        <strong class="text-xs text-[#222725]">{{ lugar.title.slice(0, 30) }}{{ lugar.title.length > 30
                            ? '...' : '' }}</strong>
                        <p class="text-xs text-gray-600">{{ lugar.description }}</p>
                    </router-link>

                </div>
            </div>

            <!-- Mensaje si no se encuentran lugares turísticos -->
            <p v-else class="text-center text-gray-500 mt-4">
                No se encontraron lugares turísticos en {{ route.params.id }}.
            </p>
        </div>

        <!-- Provincias Populares -->
        <TituloSecundario class="text-center mt-8">
            Otros destinos
        </TituloSecundario>
        <div class="overflow-x-auto mt-8">
            <div class="flex gap-4 ml-3">
                <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
                    :to="{ name: 'lugarDetalle', params: { id: provincia.provincia } }"
                    class="w-[140px] h-[200px] flex-none">
                    <div class="relative w-full h-full">
                        <img :src="provincia.thumbnail" :alt="`Imagen de ${provincia.provincia}`"
                            class="w-full h-full object-cover rounded-lg" />
                        <p
                            class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
                            {{ provincia.provincia }}
                        </p>
                    </div>
                </RouterLink>
            </div>
        </div>

    </div>
</template>
