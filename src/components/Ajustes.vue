<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const activeLink = ref('');
const userId = ref(null);
const userRole = ref(null);

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
            <router-link to="/">Eliminar cuenta</router-link>
        </li>
    </ul>
</template>
