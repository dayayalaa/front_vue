<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

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
const contrasenia = ref('');
const confirmarContrasenia = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(true);
const userId = ref(null);

const fotoPerfilPreview = ref(null);  
const fotoPortadaPreview = ref(null);  

const router = useRouter();

// Función para manejar la vista previa de las imágenes
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
            headers: { Authorization: `Bearer ${token}` }
        });
        const usuario = response.data.data;

        if (usuario) {
            nombre.value = usuario.nombre || '';
            email.value = usuario.email || '';
            descripcion.value = usuario.descripcion || '';
            telefono.value = usuario.telefono || '';
            provincia.value = usuario.provincia || '';
        } else {
            errorMessage.value = 'No se encontró la información del usuario.';
        }
        loading.value = false;
    } catch (error) {
        errorMessage.value = 'Error al obtener los datos del usuario.';
        loading.value = false;
    }
};

const provincias = [
    'Buenos Aires', 'Córdoba', 'Mendoza', 'Mar del Plata', 'Ushuaia',
    'Bariloche', 'Salta', 'Rosario', 'Tucumán', 'Iguazú', 'Neuquén',
    'Misiones', 'Posadas', 'San Fernando del Valle de Catamarca', 'San Juan',
    'Río Gallegos', 'Río Grande', 'El Calafate', 'San Luis', 'Resistencia',
    'Tremedal', 'General Roca'
];

const actualizarPerfil = async () => {
    if (contrasenia.value !== confirmarContrasenia.value) {
        errorMessage.value = 'Las contraseñas no coinciden.';
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        errorMessage.value = 'No se encontró un token válido.';
        return;
    }

    try {
        const formData = new FormData();
        formData.append('nombre', nombre.value);
        formData.append('email', email.value);
        formData.append('descripcion', descripcion.value);
        formData.append('telefono', telefono.value);
        formData.append('provincia', provincia.value);

        // Solo agregar la foto de perfil si el usuario la ha cambiado
        if (fotoPerfil.value) {
            formData.append('fotoPerfil', fotoPerfil.value);
        } 

        // Solo agregar la foto de portada si el usuario la ha cambiado
        if (fotoPortada.value) {
            formData.append('fotoPortada', fotoPortada.value);
        }

        // Solo agregar la contraseña si el usuario la ha cambiado
        if (contrasenia.value) {
            formData.append('contrasenia', contrasenia.value);
        }

        // Verifica los datos antes de enviarlos
        console.log('Datos a enviar:', {
            nombre: nombre.value,
            email: email.value,
            descripcion: descripcion.value,
            telefono: telefono.value,
            provincia: provincia.value,
            fotoPerfil: fotoPerfil.value,
            fotoPortada: fotoPortada.value,
            contrasenia: contrasenia.value
        });

        const response = await axios.put(
            `https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            }
        );

        console.log('Respuesta del servidor:', response); // Verifica la respuesta del servidor

        successMessage.value = 'Perfil actualizado con éxito.';
        const usuario = response.data.data;
        if (usuario.tipo === 'guia') {
            router.push(`/perfil/guia/${userId.value}`);
        } else {
            router.push(`/perfil/${userId.value}`);
        }
    } catch (error) {
        console.error('Error al actualizar perfil:', error); // Verifica si hay algún error
        errorMessage.value = 'Error al actualizar el perfil.';
    }
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
                loading.value = false;
            }
        } catch (error) {
            errorMessage.value = 'Error al decodificar el token.';
            loading.value = false;
        }
    } else {
        errorMessage.value = 'No se encontró un token válido.';
        loading.value = false;
    }
});
</script>

<template>
    <div class="container mx-auto p-6">
        <h2 class="text-2xl font-bold mb-4 text-center">Editar Perfil</h2>
        <div v-if="loading" class="text-center text-gray-500">Cargando...</div>
        <form v-else @submit.prevent="actualizarPerfil" enctype="multipart/form-data" class="bg-white p-6 shadow-md rounded-lg">

            <div class="mb-4">
                <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre <span class="text-red-500">*</span></label>
                <input v-model="nombre" type="text" id="nombre" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                <div v-if="!nombre" class="text-red-500 text-sm">El nombre es obligatorio.</div>
            </div>

            <div class="mb-4">
                <label for="email" class="block text-sm font-medium text-gray-700">Email <span class="text-red-500">*</span></label>
                <input v-model="email" type="email" id="email" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
                <div v-if="!email" class="text-red-500 text-sm">El email es obligatorio.</div>
            </div>

            <div class="mb-4">
                <label for="descripcion" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea v-model="descripcion" id="descripcion" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
            </div>

            <div class="mb-4">
                <label for="telefono" class="block text-sm font-medium text-gray-700">Teléfono</label>
                <input v-model="telefono" type="tel" id="telefono" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <div v-if="telefono && telefono.length < 10" class="text-red-500 text-sm">El teléfono debe tener al menos 10 caracteres.</div>
            </div>

            <div class="mb-4">
                <label for="provincia" class="block text-sm font-medium text-gray-700">Provincia <span class="text-red-500">*</span></label>
                <select v-model="provincia" id="provincia" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="" disabled>Selecciona una provincia</option>
                    <option v-for="p in provincias" :key="p" :value="p">{{ p }}</option>
                </select>
                <div v-if="!provincia" class="text-red-500 text-sm">Debe seleccionar una provincia.</div>
            </div>

            <div class="mb-4">
                <label for="fotoPerfil" class="block text-sm font-medium text-gray-700">Foto de Perfil</label>
                <input type="file" id="fotoPerfil" accept="image/*" @change="previewFotoPerfil" class="mt-1" />
                <div v-if="fotoPerfilPreview" class="mt-2">
                    <img :src="fotoPerfilPreview" alt="Vista previa Foto de Perfil" class="w-32 h-32 object-cover rounded-full" />
                </div>
            </div>

            <div class="mb-4">
                <label for="fotoPortada" class="block text-sm font-medium text-gray-700">Foto de Portada</label>
                <input type="file" id="fotoPortada" accept="image/*" @change="previewFotoPortada" class="mt-1" />
                <div v-if="fotoPortadaPreview" class="mt-2">
                    <img :src="fotoPortadaPreview" alt="Vista previa Foto de Portada" class="w-full h-48 object-cover rounded-lg" />
                </div>
            </div>

            <div class="mb-4">
                <label for="contrasenia" class="block text-sm font-medium text-gray-700">Contraseña</label>
                <input v-model="contrasenia" type="password" id="contrasenia" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
            </div>

            <div class="mb-4">
                <label for="confirmarContrasenia" class="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                <input v-model="confirmarContrasenia" type="password" id="confirmarContrasenia" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
                <div v-if="contrasenia && confirmarContrasenia && contrasenia !== confirmarContrasenia" class="text-red-500 text-sm">Las contraseñas no coinciden.</div>
            </div>

            <div v-if="errorMessage" class="text-red-500 text-center mt-4">{{ errorMessage }}</div>
            <div v-if="successMessage" class="text-green-500 text-center mt-4">{{ successMessage }}</div>

            <div class="mt-6 text-center">
                <button type="submit" class="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                    Actualizar Perfil
                </button>
            </div>
        </form>
    </div>
</template>
