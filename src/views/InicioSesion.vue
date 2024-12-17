<script setup>
import BotonPrincipal from '../components/BotonPrincipal.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import IconoArcana from '../components/icons/IconoArcana.vue';

</script>

<template>
    <div class="flex items-center justify-center h-screen pt-6 pb-8">
        <div class="flex items-center justify-center flex-col max-w-md p-4 bg-white rounded shadow-lg">
            <IconoArcana fill="#222725" width="150" height="150" />
            <TituloSecundario class="text-center">Iniciar Sesión</TituloSecundario>
            <form @submit.prevent="inicioSesion">
                <div>
                    <label for="origen" class="block text-sm font-medium">Email:</label>
                    <input type="text" placeholder="Correo electrónico"
                        class="border border-gray-300 pl-10 p-2 rounded w-full" v-model="email" />
                </div>
                <div class="mt-3">
                    <label for="origen" class="block text-sm font-medium">Contraseña:</label>
                    <input type="contrasenia" placeholder="Contraseña"
                        class="border border-gray-300 pl-10 p-2 rounded w-full" v-model="contrasenia" />
                </div>

                <div class="flex flex-col justify-center mt-5">
                    <BotonPrincipal>Iniciar Sesión</BotonPrincipal>
                    <a href="" class="text-center text-[#788B69]">
                        ¿No tienes cuenta?
                    </a>
                </div>
            </form>
        </div>
    </div>
</template>