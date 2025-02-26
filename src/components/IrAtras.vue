<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import IconoAtras from './icons/IconoAtras.vue';
import ModalAjustes from './ModalAjustes.vue';

const router = useRouter();
const route = useRoute();

const routeNames = {
  Home: 'Inicio',
  Crear: 'Crear Viaje',
  Resultados: 'Resultados de Búsqueda',
  Perfil: 'Perfil',
  GuiaPerfil: 'Perfil',
  EditarPerfil: 'Editar Perfil',
  GuiasTarjetas: 'Guías Disponibles',
  GuiasPerfilVista: 'Perfil',
  Listas: 'Lugares',
  ItinerarioDetalle: 'Mi itinerario',
  opcionesHoteles: 'Hoteles',
  login: 'Iniciar Sesión',
  opcion: 'Elige tu Rol',
  registroUsuario: 'Registro de Usuario',
  registroGuia: 'Registro de Guía',
  crearTur: 'Crear Tour',
  vistaTur: 'Detalle del Tour',
  editarTur: 'Editar Tour',
  ajustes: 'Ajustes',
  pago: 'Pago',
  ProvinciasVistas: 'Provincias',
  LugaresVistas: 'Lugares',
  inicioGuia: 'Inicio',
  vistaReserva: 'Reservas',
  reservaDetalle: 'Detalle de Reserva',
};

const currentLocation = computed(() => {
  return routeNames[route.name] || 'Sin título';
});

const breadcrumbs = computed(() => {
  const segments = route.path.split('/').filter(segment => segment !== '');
  const breadcrumbItems = [];

  breadcrumbItems.push({ path: '/', name: 'Inicio' });

  let currentPath = '';
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const routeName = routeNames[route.name] || segment;

    if (!breadcrumbItems.some(item => item.name === routeName)) {
      breadcrumbItems.push({ path: currentPath, name: routeName });
    }
  });

  return breadcrumbItems;
});

const irAtras = () => {
  router.back();
};
</script>

<template>
  <div class="flex justify-between items-center w-full p-4">
    <div class="flex items-center space-x-4">
      <button @click="irAtras" class="z-3">
        <IconoAtras />
      </button>

      <div class="flex items-center space-x-2">
        <span v-for="(crumb, index) in breadcrumbs" :key="index">
          <span v-if="index > 0" class="text-gray-400">/ </span>
          <span class="text-sm text-[#788B69]">{{ crumb.name }}</span>
        </span>
      </div>
    </div>

    <div>
      <ModalAjustes />
    </div>
  </div>
</template>