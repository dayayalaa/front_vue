<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from './SpinnerCarga.vue';
import BotonPrincipal from './BotonPrincipal.vue';


const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split('')
            .map((c) => {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join('')
    );
    return JSON.parse(jsonPayload);
};


const nombre = ref('');
const email = ref('');
const descripcion = ref('');
const telefono = ref('');
const fotoPerfil = ref(null);
const fotoPortada = ref(null);
const provincia = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const contrasenia = ref('');
const confirmarContrasenia = ref('');
const cargando = ref(true);
const userId = ref(null);
const enviando = ref(false);

const fotoPerfilPreview = ref(null);
const archivoPerfil = ref(null);
const fotoPortadaPreview = ref(null);
const archivoPortada = ref(null);
const originalValues = ref({});

const abrirDialogoArchivoPerfil = () => {
    archivoPerfil.value.click();
};

const abrirDialogoArchivoPortada = () => {
    archivoPortada.value.click();
};

const router = useRouter();

const provincias = [
    'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba', 'Corrientes',
    'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa', 'La Rioja', 'Mendoza',
    'Misiones', 'Neuquén', 'Río Negro', 'Salta', 'San Juan', 'San Luis',
    'Santa Cruz', 'Santa Fe', 'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
];

const previewFotoPerfil = (event) => {
    const file = event.target.files[0];
    if (file) {
        fotoPerfilPreview.value = URL.createObjectURL(file);
        fotoPerfil.value = file;
    }
};


const previewFotoPortada = (event) => {
    const file = event.target.files[0];
    if (file) {
        fotoPortadaPreview.value = URL.createObjectURL(file);
        fotoPortada.value = file;
    }
};


const fetchUserData = async () => {
    const token = localStorage.getItem('token');

    try {
        const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const usuario = response.data.data;

        if (usuario) {
            nombre.value = usuario.nombre || '';
            email.value = usuario.email || '';
            descripcion.value = usuario.descripcion || '';
            telefono.value = usuario.telefono || '';
            provincia.value = usuario.provincia || '';
            fotoPerfilPreview.value = usuario.fotoPerfil || null;
            fotoPortadaPreview.value = usuario.fotoPortada || null;


            originalValues.value = {
                nombre: usuario.nombre || '',
                email: usuario.email || '',
                descripcion: usuario.descripcion || '',
                telefono: usuario.telefono || '',
                provincia: usuario.provincia || '',
            };
        } else {
            errorMessage.value = 'No se encontró la información del usuario.';
        }
        cargando.value = false;
    } catch (error) {
        errorMessage.value = 'Error al obtener los datos del usuario.';
        cargando.value = false;
    }
};


const actualizarFoto = async (tipo, archivo) => {
    if (!archivo) return;

    const token = localStorage.getItem('token');
    const datosAEnviar = new FormData();
    datosAEnviar.append('file', archivo);

    try {
        const respuesta = await axios.put(
            `https://back-tesis-lovat.vercel.app/arcana/imagen/update${tipo}/${userId.value}`,
            datosAEnviar,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (respuesta.status === 200) {
            successMessage.value = `Foto de ${tipo.toLowerCase()} actualizada exitosamente!`;
            fetchUserData();
        }
    } catch (error) {
        console.error(`Error al actualizar la foto de ${tipo.toLowerCase()}:`, error.response?.data || error.message);
        errorMessage.value = `Hubo un error al actualizar la foto de ${tipo.toLowerCase()}.`;
    }
};


const actualizarDatosPerfil = async () => {
    if (enviando.value) return;
    enviando.value = true;

    if (!validarEmail(email.value)) {
        errorMessage.value = 'Por favor, ingresa un correo electrónico válido.';
        enviando.value = false;
        return;
    }

    const token = localStorage.getItem('token');
    const datosAEnviar = {};

    if (nombre.value !== originalValues.value.nombre) datosAEnviar.nombre = nombre.value;
    if (email.value !== originalValues.value.email) datosAEnviar.email = email.value;
    if (descripcion.value !== originalValues.value.descripcion) datosAEnviar.descripcion = descripcion.value;
    if (telefono.value !== originalValues.value.telefono) datosAEnviar.telefono = telefono.value;
    if (provincia.value !== originalValues.value.provincia) datosAEnviar.provincia = provincia.value;

    try {
        if (Object.keys(datosAEnviar).length > 0) {
            const respuesta = await axios.put(
                `https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`,
                datosAEnviar,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (respuesta.status === 200) {
                successMessage.value = 'Datos del perfil actualizados exitosamente!';
                fetchUserData();
            }
        }


        if (fotoPerfil.value) await actualizarFoto('Perfil', fotoPerfil.value);
        if (fotoPortada.value) await actualizarFoto('Portada', fotoPortada.value);
    } catch (error) {
        console.error('Error al actualizar los datos del perfil:', error);
        errorMessage.value = error.response?.data?.message || 'Hubo un error al actualizar los datos del perfil.';
    } finally {
        enviando.value = false;
    }
};


const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};


onMounted(() => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = decodeJWT(token);
            userId.value = decodedToken.userId;

            if (userId.value) {
                fetchUserData();
            } else {
                errorMessage.value = 'No se encontró un userId en el token.';
                cargando.value = false;
            }
        } catch (error) {
            errorMessage.value = 'Error al decodificar el token.';
            cargando.value = false;
        }
    } else {
        errorMessage.value = 'No se encontró un token válido.';
        cargando.value = false;
    }
});
</script>

<template>
    <IrAtras />
    <div class="container mx-auto p-6">
        <h2 class="text-2xl font-bold mb-4 text-center">Editar Perfil</h2>
        <SpinnerCarga v-if="cargando" />

        <form v-else @submit.prevent="actualizarDatosPerfil" enctype="multipart/form-data"
            class="bg-white p-6 shadow-md rounded-lg">
            <!-- Campos del formulario -->
            <div class="mb-4">
                <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre <span
                        class="text-red-500">*</span></label>
                <input v-model="nombre" type="text" id="nombre"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required />
                <div v-if="!nombre" class="text-red-500 text-sm">El nombre es obligatorio.</div>
            </div>

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email <span
                        class="text-red-500">*</span></label>
                <input v-model="email" type="email" id="email" autocomplete="username"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    required />
                <div v-if="!validarEmail(email)" class="text-red-500 text-sm">Ingresa un correo electrónico válido.
                </div>
            </div>

            <div class="mb-4">
                <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea v-model="descripcion" id="descripcion"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <div class="mb-4">
                <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input v-model="telefono" type="tel" id="telefono"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <div v-if="telefono && telefono.length < 10" class="text-red-500 text-sm">El teléfono debe tener al
                    menos 10 caracteres.</div>
            </div>

            <div class="mb-4">
                <label for="provincia" class="block text-sm font-medium text-gray-700">Provincia <span
                        class="text-red-500">*</span></label>
                <select v-model="provincia" id="provincia"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Selecciona una provincia</option>
                    <option v-for="p in provincias" :key="p" :value="p">{{ p }}</option>
                </select>
                <div v-if="!provincia" class="text-red-500 text-sm">Debe seleccionar una provincia.</div>
            </div>

            <div class="mb-4">
                <label for="fotoPerfil" class="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                <button type="button" class="bg-[#788A68] text-[#F7F5EB] font-bold py-2 px-4 rounded mt-1"
                    @click="abrirDialogoArchivoPerfil">
                    Seleccionar archivo
                </button>
                <input type="file" ref="archivoPerfil" accept="image/*" @change="previewFotoPerfil" class="hidden" />
                <p class="text-sm text-gray-500">El tamaño máximo es de 5 MB.</p>
                <div v-if="fotoPerfilPreview" class="mt-2">
                    <img :src="fotoPerfilPreview" alt="Vista previa Foto de Perfil"
                        class="w-32 h-32 object-cover rounded-full" />
                </div>
            </div>

            <div class="mb-4">
                <label for="fotoPortada" class="block text-sm font-medium text-gray-700">Foto de Portada</label>
                <button type="button" class="bg-[#788A68] text-[#F7F5EB] font-bold py-2 px-4 rounded mt-1"
                    @click="abrirDialogoArchivoPortada">
                    Seleccionar archivo
                </button>
                <input ref="archivoPortada" type="file" accept="image/*" class="hidden" @change="previewFotoPortada" />
                <p class="text-sm text-gray-500">El tamaño máximo es de 5 MB.</p>
                <div v-if="fotoPortadaPreview" class="mt-2">
                    <img :src="fotoPortadaPreview" alt="Vista previa Foto de Portada"
                        class="w-full h-48 object-cover rounded-lg" />
                </div>
            </div>


            <!-- Contraseña -->
            <div class="mb-4">
                <label for="contrasenia" class="block text-sm font-medium text-gray-700">Contraseña</label>
                <input v-model="contrasenia" type="password" id="contrasenia" autocomplete="new-password"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div class="mb-4">
                <label for="confirmarContrasenia" class="block text-sm font-medium text-gray-700">Confirmar
                    Contraseña</label>
                <input v-model="confirmarContrasenia" type="password" id="confirmarContrasenia"
                    autocomplete="new-password"
                    class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <div v-if="contrasenia && confirmarContrasenia && contrasenia !== confirmarContrasenia"
                    class="text-red-500 text-sm">Las contraseñas no coinciden.</div>
            </div>


            <!-- Mensajes de error y éxito -->
            <div v-if="errorMessage" class="mt-4 mb-4 p-4 bg-red-100 border-l-4 border-[#7E2323] text-[#222725]">
                <p>{{ errorMessage }}</p>
            </div>

            <!-- Mensaje de éxito -->
            <div v-if="successMessage" class="mt-4 mb-4 p-4 bg-green-100 border-l-4 border-[#788A68] text-[#222725]">
                <p>{{ successMessage }}</p>
            </div>

            <!-- Botón de Actualizar Perfil -->
            <div class="mt-6 text-center flex justify-center">
                <BotonPrincipal :disabled="enviando">
                    {{ enviando ? 'Actualizando...' : 'Actualizar Perfil' }}
                </BotonPrincipal>
            </div>
        </form>
    </div>
</template>