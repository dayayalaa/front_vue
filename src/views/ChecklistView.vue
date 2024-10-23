<template>
    <div class="max-w-md mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4 text-center">Checklist</h1>
      <h2 class="text-lg mb-4">No olvidarme de ...</h2>
  
      <!-- Formulario para agregar un nuevo checklist -->
      <div class="mb-4">
        <input
          v-model="newItem"
          type="text"
          placeholder="Agregar nuevo ítem"
          class="w-full p-2 border border-gray-300 rounded-lg mb-2"
        />
        <button
          @click="addItem"
          class="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600"
        >
          Agregar
        </button>
      </div>
  
      <!-- Lista de checklists -->
      <div v-for="(item, index) in checklistItems" :key="index" class="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center">
        <input
          type="checkbox"
          v-model="item.checked"
          class="mr-2"
        />
        <span :class="{ 'line-through text-gray-500': item.checked }">{{ item.text }}</span>
        <button
          @click="removeItem(index)"
          class="ml-auto text-red-500 hover:text-red-700"
        >
          Borrar
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newItem: '',
        checklistItems: [
          { text: 'Ejemplo de ítem 1', checked: false },
          { text: 'Ejemplo de ítem 2', checked: false },
          { text: 'Ejemplo de ítem 3', checked: false },
        ],
      };
    },
    methods: {
      addItem() {
        if (this.newItem.trim()) {
          this.checklistItems.push({ text: this.newItem.trim(), checked: false });
          this.newItem = ''; // Limpiar el campo de entrada
        }
      },
      removeItem(index) {
        this.checklistItems.splice(index, 1);
      },
    },
  };
  </script>
  

  