<script setup>
import { ref, reactive } from 'vue';
import TituloPrincipal from '../components/TituloPrincipal.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';
import IconoBorrar from '../components/icons/IconoBorrar.vue';
import IrAtras from '../components/IrAtras.vue';

const nuevoItem = ref('');  
const checklistItems = reactive([
  { texto: 'Cepillo de dientes', checked: false },
  { texto: 'Protector solar', checked: false },
  { texto: 'Pasaporte', checked: false },
]);

function addItem() {
  if (nuevoItem.value.trim()) {  
    checklistItems.push({ texto: nuevoItem.value.trim(), checked: false });
    nuevoItem.value = '';  
  }
}

function removeItem(index) {
  checklistItems.splice(index, 1);
}
</script>


<template>
<IrAtras/>
  <div class="max-w-md mx-auto p-4">
    
    <TituloPrincipal> Checklist </TituloPrincipal>
    <p class="text-lg mb-4 text-left">No olvidarme de ...</p>
    <div class="mb-4">
      <input
        v-model="nuevoItem"
        type="text"
        placeholder="Agregar nuevo ítem"
        class="w-full p-2 border border-gray-300 rounded-lg mb-2"
      />
      <BotonPrincipal
        @click="addItem">
        Agregar
      </BotonPrincipal>
    </div>
    <div
      v-for="(item, index) in checklistItems"
      :key="index"
      class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center"
    >
      <input
        type="checkbox"
        v-model="item.checked"
        class="mr-2"
      />
      <span :class="{ 'line-through text-gray-500': item.checked }">{{ item.texto }}</span>
      <button
       @click="removeItem(index)"
       class="ml-auto flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-700 transition">
       <IconoBorrar class="w-6 h-6" />
       </button>
    </div>
  </div>
</template>
