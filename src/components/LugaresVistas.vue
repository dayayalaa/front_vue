<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from './SpinnerCarga.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';
import IrAtras from './IrAtras.vue';

const route = useRoute();
const lugarInfo = ref(null);
const cargando = ref(true);
const errorMessage = ref('');

const obtenerLugar = async () => {
    const lugarId = route.params.id;

    console.log('El lugarId recibido es:', lugarId);

    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/infoLugar/?provincia=${lugarId}`);

        console.log('Respuesta de la API para lugar:', response.data);

        if (response.data) {
            let lugarEncontrado = null;

            if (response.data.local_results && Array.isArray(response.data.local_results)) {
                console.log('Lista de lugares en local_results:', response.data.local_results);
                lugarEncontrado = response.data.local_results.find(lugar => {
                    console.log(`Comparando lugar.title: ${lugar.title} con lugarId: ${lugarId}`);
                    return lugar.title === lugarId;
                });
            }

            if (!lugarEncontrado && response.data.place_results) {
                console.log('Lugar único en place_results:', response.data.place_results);
                lugarEncontrado = response.data.place_results;
            }

            if (lugarEncontrado) {
                lugarInfo.value = lugarEncontrado;
                console.log('Lugar encontrado:', lugarInfo.value);

                const data_id = lugarEncontrado.data_id;
                console.log('data_id recibido:', data_id);

                obtenerImagenes(data_id);
            } else {
                errorMessage.value = 'No se encontró información para este lugar.';
                console.warn('No se encontró un lugar con el lugarId:', lugarId);
            }
        } else {
            errorMessage.value = 'No se encontró información para este lugar.';
            console.warn('La respuesta de la API no contiene los resultados esperados');
        }
    } catch (error) {
        console.error('Error al obtener lugar:', error);
        errorMessage.value = 'Hubo un problema al obtener la información. Inténtalo más tarde.';
    } finally {
        cargando.value = false;
        console.log('Carga finalizada');
    }
};


const obtenerImagenes = async (data_id) => {
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${data_id}`);

        console.log('Respuesta de la API para imágenes:', response.data);

        if (response.data && response.data.images && Array.isArray(response.data.images)) {
            lugarInfo.value.gallery = response.data.images;
            console.log('Galería después de asignar las imágenes:', lugarInfo.value.gallery);
        } else {
            console.warn('No se encontraron imágenes en la respuesta o el formato es incorrecto');
        }
    } catch (error) {
        console.error('Error al obtener imágenes:', error);
    }
};

onMounted(() => {
    obtenerLugar();
});
</script>

<template>
    <IrAtras />
    <div class="w-full max-w-4xl mx-auto p-4">

        <div v-if="cargando" class="text-center">
            <SpinnerCarga />
        </div>

        <div v-if="lugarInfo && !errorMessage" class="text-center">
            <TituloSecundario class="text-center">Descubre {{ lugarInfo.title }}</TituloSecundario>

            <div class="flex flex-col justify-center items-center">

                <span v-for="(type, index) in lugarInfo.types" :key="index">
                    {{ type }}<span v-if="index < lugarInfo.types.length - 1">, </span>
                </span>

                <div class="h-[250px] w-[300px] mt-6">
                    <img :src="lugarInfo.gallery[0]" :alt="lugarInfo.title"
                        class="w-full h-full object-cover rounded-lg" />
                </div>

                <p class="text-sm text-gray-700 mt-6">{{ lugarInfo.description }}</p>
            </div>

            <div class="flex space-x-4 overflow-x-auto p-2 rounded-lg bg-gray-100 mt-6 mb-6">
                <div v-for="(imagen, index) in lugarInfo.gallery.slice(1)" :key="index" class="flex-shrink-0 w-48">
                    <img :src="imagen" :alt="'Imagen ' + (index + 1)"
                        class="w-full h-32 object-cover rounded-lg shadow-sm" />
                </div>
            </div>

            <TituloTerciario>Contacto</TituloTerciario>
            <p class="text-sm text-gray-700">Télefono: {{ lugarInfo.phone }}</p>
            <p class="text-sm text-gray-700">{{ lugarInfo.address }}</p>

            <a v-if="lugarInfo.website !== 'No disponible'" :href="lugarInfo.website" target="_blank"
                class="text-blue-500 text-sm underline">Sitio web</a>

        </div>

        <p v-else class="text-center text-gray-500 mt-4">{{ errorMessage }}</p>
    </div>
</template>
