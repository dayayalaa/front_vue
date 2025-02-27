<script setup>
import { ref, onMounted } from 'vue';
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
const isUser = ref(false);
const isGuia = ref(false);


const decodeJWT = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};


const checkUserRole = () => {
  const token = localStorage.getItem('token');
  //console.log('Token:', token);

  if (token) {
    try {
      const decodedToken = decodeJWT(token);
      //console.log('Decoded Token:', decodedToken);

     
      if (typeof decodedToken.rols === 'string') {
        isGuia.value = decodedToken.rols === 'guia';
        isUser.value = decodedToken.rols === 'user';
       // console.log('isUser:', isUser.value, 'isGuia:', isGuia.value);
      } else {
        console.error('El campo "rols" no es una cadena:', decodedToken.rols);
      }
    } catch (error) {
      console.error('Error decodificando el token:', error);
    }
  }
};

const obtenerProvincia = async () => {
    const provinciaId = route.params.id;
   // console.log('La provincia es:', provinciaId);

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

       // console.log('Estructura de response.data:', response.data);

        if (response && response.data) {
            provinciaInfo.value = {
                title: response.data.title,
                address: response.data.address,
                description: response.data.description?.snippet || 'No disponible',
                thumbnail: response.data.thumbnail,
            };

            const data_id = response.data.data_id;
           // console.log('data_id:', data_id);
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

       // console.log('Guías obtenidas:', guias.value);

        guiasFiltrados.value = guias.value.filter(guia => guia.provincia === provincia);

        //console.log('Guías filtradas:', guiasFiltrados.value);
    } catch (error) {
        console.error('Error al obtener guías:', error);
    } finally {
        cargando.value = false;
    }
};

const obtenerLugares = async () => {
    const provincia = route.params.id;
    //console.log('Para lugar:', provincia)
    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugar?provincia=${provincia}`);
       // console.log('Lugares turísticos obtenidos:', response.data);

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

       // console.log('Respuesta de la API img:', response.data);

        if (response.data && response.data.images && Array.isArray(response.data.images)) {
            provinciaInfo.value.gallery = response.data.images;
            //console.log('Galería después de asignar:', provinciaInfo.value.gallery);
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
    // console.log('Provincias Populares:', response.data);
    
    provinciasPopulares.value = response.data;
    response.data.forEach(provincia => {
      if (provincia.data_id) {
        obtenerImagenesP(provincia);
      } else {
        provincia.thumbnail = '/img/default_portada.png';
      }
    });
  } catch (error) {
    console.error('Error al obtener provincias populares:', error);
  }
};

const obtenerImagenesP = async (provincia) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${provincia.data_id}`);
    if (response.data && response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
      const validImage = response.data.images.find(image => isValidImage(image));
      provincia.thumbnail = validImage || '/img/default_portada.png';
    } else {
      console.warn('No se encontraron imágenes, se asignará una imagen predeterminada');
      provincia.thumbnail = '/img/default_portada.png';
    }

    provinciasPopulares.value = [...provinciasPopulares.value];
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    provincia.thumbnail = '/img/default_portada.png';
  }
};

const isValidImage = (image) => {
  return image && image.startsWith('http');
};

onMounted(() => {
    obtenerProvincia();
    obtenerGuias();
    obtenerLugares();
    obtenerProvinciasPopulares();
    checkUserRole();  
});

const irADetalleGuia = (id) => {
    router.push(`/perfil/guia/${id}`);
};
</script>

<template>
    <IrAtras />
    <div class="w-full max-w-4xl mx-auto">
        <SpinnerCarga v-if="cargando"/>
        
        <div v-else-if="provinciaInfo" class="text-center">
            <TituloSecundario class="text-center">Descubre {{ provinciaInfo.title }}</TituloSecundario>
            <TituloTerciario class="text-gray-600 mt-4">{{ provinciaInfo.address }}</TituloTerciario>

            <div class="flex flex-col justify-center items-center p-4">
                <div class="h-[250px] w-[300px] mt-6">
                    <img :src="provinciaInfo.gallery[0]" :alt="provinciaInfo.title"
                        class="w-full h-full object-cover rounded-lg" />
                </div>

                <p v-if="provinciaInfo.description" class="mt-4 text-gray-700 text-left">
                    <strong class="text-green-600">Descripción:</strong>
                    {{ provinciaInfo.description }}
                </p>
            </div>
        
            <div class="flex space-x-4 overflow-x-auto rounded-lg mt-6 mb-6 p-2">
                <div v-for="(imagen, index) in provinciaInfo.gallery.slice(1)" :key="index" class="flex-shrink-0 w-48">
                    <img :src="imagen" :alt="'Imagen ' + (index + 1)"
                        class="w-full h-60 object-cover rounded-lg shadow-sm" />
                </div>
            </div>
        </div>
       
        <p v-else class="text-center text-gray-500">No se encontró información para la provincia {{ route.params.id }}.</p>

       
        <div v-if="isUser">
            <TituloSecundario class="text-center mt-8">
                Guías turísticos en {{ provinciaInfo?.title || route.params.id }}
            </TituloSecundario>
            <div v-if="guiasFiltrados.length > 0" class="grid grid-cols-1 sm:grid-cols-2 gap-4 mx-4 my-6">
                <div v-for="guia in guiasFiltrados" :key="guia.id"
                    class="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition-shadow duration-300"
                    @click="irADetalleGuia(guia._id)">
                    <img :src="guia.fotoPerfil" :alt="'Foto de ' + guia.nombre"
                        class="w-24 h-24 rounded-full mb-4 object-cover" />

                    <strong class="text-lg text-[#222725]">{{ guia.nombre }}</strong>
                    <p class="text-gray-600">{{ guia.provincia }}</p>
                </div>
            </div>

            <p v-else class="text-center text-gray-500">No se encontraron guías para la provincia {{ route.params.id }}.</p>
        </div>

        <div v-if="isUser" class="flex justify-center items-center mt-8 mb-8">
            <router-link to="/crear">
                <BotonPrincipal >Crear viaje</BotonPrincipal>
            </router-link>
        </div>

        <!-- Provincias Populares -->
        <TituloSecundario class="text-center mt-8">
            Otros destinos
        </TituloSecundario>
        <div class="overflow-x-auto mt-8">
            <div class="flex gap-4 ml-3 mb-8">
                <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
                    :to="{ name: 'ProvinciasVistas', params: { id: provincia.provincia } }"
                    class="w-[140px] h-[200px] flex-none">
                    <div class="relative w-full h-full">
                        <img :src="provincia.thumbnail" :alt="'Imagen de ' + provincia.provincia"
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

