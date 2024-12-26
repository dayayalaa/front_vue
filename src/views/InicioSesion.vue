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

const togglePasswordVisibility = () => {
    isPasswordVisible.value = !isPasswordVisible.value;
};

const inicioSesion = async () => {
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
            localStorage.setItem('token', data.token);
            router.push('/'); 
        } else {
            alert(data.msg);
        }
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        alert('Error al intentar iniciar sesión');
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
                    <input type="text" 
                        id="email" 
                        placeholder="Correo electrónico"
                        class="border border-gray-300 p-2 rounded w-full" 
                        v-model="email" />
                </div>
                <div class="mt-3 relative">
                    <label for="contrasenia" class="block text-sm font-medium">Contraseña:</label>
                    <input :type="isPasswordVisible ? 'text' : 'password'" 
                        id="contrasenia" 
                        placeholder="Contraseña"
                        class="border border-gray-300 p-2 rounded w-full" 
                        v-model="contrasenia" />
                    <!-- Icono de ojo para mostrar/ocultar contraseña -->
                    <button type="button" @click="togglePasswordVisibility" class="absolute right-3 top-10">
                        <span v-if="isPasswordVisible">👁️</span>
                        <span v-else>👁️‍🗨️</span>
                    </button>
                </div>

                <div class="flex flex-col justify-center mt-5">
                    <BotonPrincipal @click="inicioSesion">Iniciar Sesión</BotonPrincipal>
                    <a href="/opcion" class="text-center text-[#788B69]">
                        ¿No tienes cuenta?
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>