<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import IconoArcana from '../components/icons/IconoArcana.vue';

const email = ref('');
const contrasenia = ref('');
const isPasswordVisible = ref(false);
const router = useRouter();
const loading = ref(false);
const errorMessage = ref('');

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const inicioSesion = async () => {
    loading.value = true; 
    errorMessage.value = ''; 

    // Validar campos
    if (!email.value || !contrasenia.value) {
        errorMessage.value = 'Por favor, completa todos los campos.';
        loading.value = false;
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        errorMessage.value = 'Por favor, ingresa un correo electrónico válido.';
        loading.value = false;
        return;
    }

    try {
        const response = await fetch('https://back-tesis-lovat.vercel.app/arcana/usuarios/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, contrasenia: contrasenia.value }),
        });

        const data = await response.json();

        if (response.ok) {
    if (data.token) {
        localStorage.setItem('token', data.token);
        try {
            await router.push('/'); 
        } catch (error) {
            console.error('Error durante la redirección:', error);
            errorMessage.value = 'Hubo un error al intentar redirigir.';
        }
    } else {
        errorMessage.value = 'Token no válido recibido.';
    }
} else {
    errorMessage.value = data.msg || 'Error al iniciar sesión.';
}

    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        errorMessage.value = 'No se pudo conectar con el servidor.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="flex items-center justify-center h-screen pt-6 pb-8">
        <div class="flex items-center justify-center flex-col max-w-md p-4 bg-white rounded shadow-lg">
            <IconoArcana fill="#222725" width="150" height="150" />
            <TituloSecundario class="text-center">Iniciar Sesión</TituloSecundario>
            <form @submit.prevent="inicioSesion">
                <div>
                    <label for="email" class="block text-sm font-medium">Email:</label>
                    <input type="email" id="email" placeholder="Correo electrónico"
                        class="border border-gray-300 p-2 rounded w-full" v-model="email" />
                </div>
                <div class="mt-3 relative">
                    <label for="contrasenia" class="block text-sm font-medium">Contraseña:</label>
                    <input :type="isPasswordVisible ? 'text' : 'password'" id="contrasenia" placeholder="Contraseña"
                        class="border border-gray-300 p-2 rounded w-full" v-model="contrasenia" />
                    <button type="button" @click="togglePasswordVisibility" class="absolute right-3 top-10">
                        <span v-if="isPasswordVisible" aria-label="Contraseña visible">👁️</span>
                        <span v-else aria-label="Contraseña oculta">👁️‍🗨️</span>
                    </button>
                </div>

                <div class="flex flex-col justify-center mt-5">
                    <div class="flex justify-center mb-2">
                        <BotonPrincipal :disabled="loading">{{ loading ? 'Cargando...' : 'Iniciar Sesión' }}</BotonPrincipal>
                    </div>
                    <p v-if="errorMessage" class="text-red-500 text-center">{{ errorMessage }}</p>
                    <a href="/opcion" class="text-center text-[#788B69]">
                        ¿No tienes cuenta?
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>
