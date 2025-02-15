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
        estado: 'pendiente',
      });

      console.log("Respuesta al agregar:", response.data);

      await loadChecklistItems();

      nuevoItem.value = '';
    } catch (err) {
      error.value = 'Error al agregar el ítem. Intenta nuevamente.';
      console.error('Error al agregar item:', err.message);
    }
  }
}

async function loadChecklistItems() {
  try {
    const id = route.params.id;
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);
    itinerario.value = response.data;
    checklistItems.value = itinerario.value.checklist;

    console.log('Lista de ítems actualizada:', checklistItems.value);
  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
    console.error('Error al cargar los ítems:', err.message);
  }
}


async function removeItem(itemId) {
  console.log('🗑 Item a eliminar:', itemId);

  if (!itemId) {
    console.error("Error: itemId no está definido.");
    return;
  }

  try {
    const id = route.params.id;
    const response = await axios.delete(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}/checklist/eliminar`, {
      data: { id, itemId }
    });

    console.log('📌 Respuesta de la API después de eliminar:', response.data);

    await loadChecklistItems();

  } catch (err) {
    console.error('❌ Error al eliminar item:', err.message);
  }
}


onMounted(async () => {
  try {
    const id = route.params.id;
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}`);

    itinerario.value = response.data;
    checklistItems.value = itinerario.value.checklist;
    isLoading.value = false;

    console.log('lista: ', checklistItems.value);

  } catch (err) {
    error.value = err.message || 'Ocurrió un error al cargar el itinerario.';
    isLoading.value = false;
  }
});

async function toggleItemStatus(item) {
    try {
        const id = route.params.id;
        const nuevoEstado = item.estado === 'pendiente' ? 'realizado' : 'pendiente';

        console.log('item:', item._id);
        console.log("Estado a enviar:", nuevoEstado);

        const itemIndex = checklistItems.value.findIndex(checklistItem => checklistItem._id === item._id);
        if (itemIndex !== -1) {
            checklistItems.value[itemIndex] = { ...checklistItems.value[itemIndex], estado: nuevoEstado };
        }

        const response = await axios.put(`https://back-tesis-lovat.vercel.app/arcana/reservas/${id}/checklist/actualizar`, {
            id: id,
            itemId: item._id,
            titulo: item.titulo,
            estado: nuevoEstado
        });

      if (response.data && response.data.checklist) {
            checklistItems.value = response.data.checklist;
            console.log("Lista actualizada:", checklistItems.value);
        }
         else {
            console.error("Error: Respuesta del servidor inesperada", response.data);
            if (itemIndex !== -1) {
                checklistItems.value[itemIndex] = { ...checklistItems.value[itemIndex], estado: item.estado === 'pendiente' ? 'realizado' : 'pendiente' };
            }
        }
    } catch (err) {
        console.error("Error al cambiar el estado del item:", err.message);
        error.value = 'Error al cambiar el estado del ítem. Intenta nuevamente.';

        const itemIndex = checklistItems.value.findIndex(checklistItem => checklistItem._id === item._id);
        if (itemIndex !== -1) {
            checklistItems.value[itemIndex] = { ...checklistItems.value[itemIndex], estado: item.estado === 'pendiente' ? 'realizado' : 'pendiente' };
        }
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
      <input
        type="checkbox"
        :checked="item.estado === 'realizado'"
        @change="() => toggleItemStatus(item)"
        class="mr-2"
      />

      <span :class="{ 'line-through': item.estado === 'realizado' }">
        {{ item.titulo }}
      </span>

      <button @click.stop="removeItem(item._id)"
        class="ml-auto flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition">
        <IconoBorrar class="w-6 h-6" />
      </button>
    </div>
  </div>
</template>