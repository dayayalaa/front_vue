<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import NavSuperior from '../components/NavSuperior.vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import MiReservasUsuario from '../components/MiReservasUsuario.vue';

const router = useRouter();
const userId = ref(null);
const userName = ref('Usuario');
const userProfileImage = ref('');
const userCoverImage = ref('');
const descripcion = ref('');
const email = ref('');
const telefono = ref('');
const provincia = ref('');
const loading = ref(true);

const fetchUserData = async () => {
  if (!userId.value) return;

  try {
    console.log('Obteniendo datos del usuario con ID:', userId.value);
    const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del usuario: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);

    if (!data.data) {
      throw new Error('La API no devolvió datos válidos.');
    }

    const { nombre, fotoPerfil, fotoPortada, descripcion: desc, email: correo, telefono: tel, provincia: prov } = data.data;
    userName.value = nombre || 'Usuario';
    userProfileImage.value = fotoPerfil || '';
    userCoverImage.value = fotoPortada || '';
    descripcion.value = desc || '';
    email.value = correo || '';
    telefono.value = tel || '';
    provincia.value = prov || '';

    console.log('Nombre del usuario:', userName.value);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('');
    return JSON.parse(decodeURIComponent(jsonPayload));
  } catch (error) {
    console.error('Error decodificando el token:', error);
    return null;
  }
};

const provinciasPopulares = ref([]);

const obtenerProvinciasPopulares = async () => {
  try {
    const response = await axios.get('https://back-tesis-lovat.vercel.app/arcana/destino/populares');
    // console.log('Respuesta completa de la API:', response.data);

    provinciasPopulares.value = response.data;
    response.data.forEach(provincia => {
      if (provincia.data_id) {
        // console.log('data_id encontrado:', provincia.data_id);
        obtenerImagenes(provincia);
      } else {
        console.log('No se encontró data_id en la provincia:', provincia.provincia);
      }
    });
  } catch (error) {
    console.error('Error al obtener provincias populares:', error);
  }
};

const obtenerImagenes = async (provincia) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/destino/lugarImagen?data_id=${provincia.data_id}`);
    // console.log('Respuesta de la API img:', response.data);

    if (response.data && response.data.images && Array.isArray(response.data.images) && response.data.images.length > 0) {
      const validImage = response.data.images.find(image => isValidImage(image));
      provincia.thumbnail = validImage || '/img/default_portada.png';
    } else {
      console.warn('No se encontraron imágenes, se asignará una imagen predeterminada');
      provincia.thumbnail = '/img/default_portada.png';
    }

    // console.log(`Imagen para ${provincia.provincia}:`, provincia.thumbnail);

    provinciasPopulares.value = [...provinciasPopulares.value];
  } catch (error) {
    console.error('Error al obtener imágenes:', error);
    provincia.thumbnail = '/img/default_portada.png';
  }
};

const isValidImage = (image) => {
  return image && image.startsWith('http');
};

onMounted(async () => {
  const token = localStorage.getItem('token');

  if (token) {
    const decodedToken = decodeJWT(token);
    if (decodedToken && decodedToken.userId) {
      userId.value = decodedToken.userId;
      await fetchUserData();
    }
  } else {
    loading.value = false;
  }
  obtenerProvinciasPopulares();
});
</script>

<template>
  <div>
    <NavSuperior />

    <section class="text-center mt-4">
      <TituloPrincipal>Bienvenido, {{ userName }}</TituloPrincipal>
    </section>

    <section class="flex flex-col justify-center items-center mb-16">
      <TituloSecundario>Estos son los lugares más visitados</TituloSecundario>

      <div v-if="provinciasPopulares.length > 0" class="flex flex-wrap gap-5 justify-center m-2">
        <RouterLink v-for="provincia in provinciasPopulares" :key="provincia.provincia"
          :to="{ name: 'ProvinciasVistas', params: { id: provincia.provincia } }">
          <div class="relative w-[140px] h-[200px]">

            <img :src="provincia.thumbnail" :alt="`Imagen de ${provincia.provincia}`"
              class="w-full h-full object-cover rounded-lg" />
            <p
              class="absolute bottom-0 left-0 w-full h-20 bg-black bg-opacity-70 text-white text-center p-2 rounded-b-lg">
              {{ provincia.provincia }}
            </p>
          </div>
        </RouterLink>
      </div>
      
      <div v-else>
        <p class="m-6">No hay provincias populares disponibles en este momento.</p>
      </div>
    </section>

    <section class="flex justify-center mb-8">
      <BotonPrincipal class="w-3/4 py-3 text-sm" @click="router.push('/crear-tour')">
        Crear Tour
      </BotonPrincipal>
    </section>

    <section>
      <TituloSecundario class="text-center">Reservas</TituloSecundario>
      <MiReservasUsuario />
    </section>
  </div>
</template>
