<template>
    <div class="spinner"></div>
    <span>Cargando...</span>
  </template>
  
  <style scoped>
  .spinner {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: conic-gradient(#0000 10%, #2c4e2e);
    mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0);
    -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 9px), #000 0); 
    animation: spinner-rotation 1s infinite linear;
  }
  
  @keyframes spinner-rotation {
    to {
      transform: rotate(1turn);
    }
  }
  </style>
  