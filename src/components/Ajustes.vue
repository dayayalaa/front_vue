<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import axios from 'axios';

const router = useRouter();
const activeLink = ref('');
const userId = ref(null);
const userRole = ref(null);
const errorMessage = ref('');
const successMessage = ref('');
const showModal = ref(false);

const decodeJWT = (token) => {
    try {
        if (!token) throw new Error('Token no proporcionado');
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Token JWT inválido');

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        return null;
    }
};

onMounted(() => {
    const token = localStorage.getItem('token');

    if (token) {
        try {
            const decodedToken = decodeJWT(token);
            userId.value = decodedToken.userId;
            userRole.value = decodedToken.rols;

            if (userRole.value === 'guia') {
                activeLink.value = `/perfil/guia/${userId.value}`;
            } else {
                activeLink.value = `/perfil/${userId.value}`;
            }
        } catch (error) {
            console.error('Error decodificando el token:', error);
        }
    }
});

const cerrarSesion = () => {
    localStorage.removeItem('token');
    router.push('/login');
};

const eliminarCuenta = async () => {
    if (!userId.value) {
        errorMessage.value = 'No se encontró el ID del usuario.';
        return;
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            errorMessage.value = 'No estás autenticado.';
            return;
        }

        await axios.delete(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId.value}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        cerrarSesion();
        successMessage.value = 'Cuenta eliminada con éxito.';
    } catch (error) {
        errorMessage.value = 'Ocurrió un error al eliminar la cuenta.';
        console.error(error);
    } finally {
        showModal.value = false;
    }
};
</script>

<template>
    <ul>
        <li>
            <router-link v-if="activeLink" :to="activeLink">Perfil</router-link>
        </li>
        <li>
            <router-link v-if="userId" :to="{ name: 'EditarPerfil', params: { id: userId } }">
                Editar Perfil
            </router-link>
        </li>
        <li>
            <router-link to="/">Preguntas frecuentes</router-link>
        </li>    
        <li>
            <button @click.prevent="cerrarSesion" aria-label="Cerrar sesión">
                Cerrar sesión
            </button>
        </li>
        <li>
            <button @click.prevent="showModal = true" aria-label="Eliminar cuenta">
                Eliminar cuenta
            </button>
        </li>
    </ul>

    <!-- Modal overlay -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-4 rounded-lg shadow-lg w-full max-w-sm mx-4 md:max-w-md">
            <h2 class="text-lg font-semibold mb-4 text-center">Confirmación</h2>
            <p class="mb-6 text-center">
                ¿Estás seguro de que deseas eliminar tu cuenta?
            </p>
            <div class="flex flex-col gap-4">
                <button 
                    @click="showModal = false" 
                    class="bg-[#788B69] text-white py-2 rounded">
                    Cancelar
                </button>
                <button 
                    @click="eliminarCuenta" 
                    class="bg-red-500 text-white py-2 rounded">
                    Confirmar
                </button>
            </div>
        </div>
    </div>
</template>
