<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoBorrar from '../components/icons/IconoBorrar.vue';
import IrAtras from '../components/IrAtras.vue';

const route = useRoute();
const itinerario = ref(null);
const isLoading = ref(true);
const error = ref(null);
const nuevoItem = ref('');
const checklistItems = ref([]);

async function addItem() {
  if (nuevoItem.value.trim()) {
    try {
      const id = route.params.id;
      const response = await axios.post(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}/checklist/agregar`, {
        id: id,
        titulo: nuevoItem.value.trim(),
        estado: false,
      });

      checklistItems.value.push({
        titulo: nuevoItem.value.trim(),
        estado: false
      });

      nuevoItem.value = '';
    } catch (err) {
      error.value = 'Error al agregar el ítem. Intenta nuevamente.';
      console.error('Error al agregar item:', err.message);
    }
  }
}

async function removeItem(itemId) {
  try {
    const id = route.params.id;
    const response = await axios.delete(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}/checklist/eliminar`, {
      data: { id, itemId }
    });

    checklistItems.value = checklistItems.value.filter(item => item._id !== itemId);
  } catch (err) {
    error.value = 'Error al eliminar el ítem.';
    console.error('Error al eliminar item:', err.message);
  }
}

onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);

    itinerario.value = response.data;
    checklistItems.value = itinerario.value.checklist;
    isLoading.value = false;
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
    isLoading.value = false;
  }
});

async function toggleItemStatus(item) {
  try {
    const id = route.params.id;

    console.log("ID de la reserva:", id);
    console.log("Ítem a cambiar:", item);
    console.log("Estado antes de cambiar:", item.estado);

    const response = await axios.put(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}/checklist/actualizar`, {
      itemId: item._id,
      titulo: item.titulo,
      estado: !item.estado
    });

    console.log("Respuesta del servidor:", response.data);
    checklistItems.value = response.data.checklist;
  } catch (err) {
    console.error("Error al cambiar el estado del item:", err.message);
    error.value = 'Error al cambiar el estado del ítem. Intenta nuevamente.';
  }
}
</script>

<template>
  <IrAtras />
  <div class="max-w-md mx-auto p-4">
    <TituloSecundario> Checklist </TituloSecundario>
    <p class="text-lg mb-4 text-left">No olvidarme de ...</p>

    <div class="mb-4">
      <input v-model="nuevoItem" type="text" placeholder="Agregar nuevo ítem"
        class="w-full p-2 border border-gray-300 rounded-lg mb-2" />
      <BotonPrincipal @click="addItem">Agregar</BotonPrincipal>
    </div>

    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="isLoading" class="text-blue-500 mb-4">Cargando checklist...</div>


    <div v-for="item in checklistItems" :key="item._id"
      class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
      <input type="checkbox" v-model="item.estado" @change="toggleItemStatus(item)" class="mr-2" />
      <span :class="{ 'line-through': item.estado }">{{ item.titulo }}</span>

      <button @click="removeItem(item._id)"
        class="ml-auto flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition">
        <IconoBorrar class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>
