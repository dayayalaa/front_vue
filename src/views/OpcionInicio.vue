<script setup>
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from '../components/TituloSecundario.vue';
import IconoUsuario from '../components/icons/IconoUsuario.vue';
import IconoMapa from '../components/icons/IconoMapa.vue';
</script>

<template>
    <IrAtras/>
    <div class="flex items-center justify-center h-screen bg-gray-50 pt-6 pb-8">
      <div class="flex items-center justify-center flex-col max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        
            <TituloSecundario class="text-center mb-4">Crea un perfil</TituloSecundario>
            <p class="text-center mb-6 text-gray-700">¿Qué tipo de perfil quieres crear?</p>
            
            <!-- Botón de Turista -->
            <a 
                class="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 mb-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                href="/registroUsuario"
                aria-label="Selecciona el perfil de Turista"
            >
                <IconoUsuario  
                    width="100" 
                    height="100"
                    />
                <span class="text-lg font-semibold text-gray-800">Turista</span>
            </a>
            
            <!-- Botón de Guía -->
            <a 
                class="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-gray-100"
                href="/registroGuia"
                aria-label="Selecciona el perfil de Guía"
            >
                <IconoMapa
                    width="100" 
                    height="100"
                    />
                <span class="text-lg font-semibold text-gray-800">Guía</span>
            </a>
        </div>
    </div>
</template>
