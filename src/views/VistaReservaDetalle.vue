<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import TituloSecundario from '../components/TituloSecundario.vue';
import TituloTerciario from '../components/TituloTerciario.vue';
import IrAtras from '../components/IrAtras.vue';
import SpinnerCarga from '../components/SpinnerCarga.vue';
import BotonPrincipal from '../components/BotonPrincipal.vue';

const route = useRoute();
const router = useRouter();
const reservaId = route.params.id;
const tourData = ref(null);
const cargando = ref(true);

const guiaName = ref('');
const guiaProfileImage = ref('');
const guiaDescription = ref('');
const guiaEmail = ref('');
const guiaTelefono = ref('');
const guiaProvincia = ref('');
const guiasId = ref('');


const fetchGuiaData = async (guiaId) => {
  try {
    if (!guiaId) {
      throw new Error('ID del guía no válido');
    }

    // console.log('GuiaId:', guiaId);

    const url = `https://back-tesis-lovat.vercel.app/arcana/usuarios/${guiaId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los datos del guía: ${response.statusText}`);
    }

    const data = await response.json();
    const { nombre, fotoPerfil, descripcion, email, telefono, provincia, _id } = data.data;

    guiaName.value = nombre;
    guiaProfileImage.value = fotoPerfil;
    guiaDescription.value = descripcion;
    guiaEmail.value = email;
    guiaTelefono.value = telefono;
    guiaProvincia.value = provincia;
    guiasId.value = _id;

    // console.log('datos del guia:', data);
    // console.log('mail del guia:', data.data.email);

  } catch (error) {
    console.error('Error al obtener los datos del guía:', error);
  } finally {
    cargando.value = false;
  }
};

const fetchTour = async (tourId) => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/tur/${tourId}`);

    // console.log('datos del tour: ', response);
    const guiaId = response.data.guia;
    // console.log('ID del guía:', guiaId);

    if (guiaId) {
      fetchGuiaData(guiaId);
    }

  } catch (error) {
    console.error("Error al obtener los detalles del tour:", error);
  }
};

const fetchTourDetails = async () => {
  try {
    const response = await axios.get(`https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/${reservaId}`);

    tourData.value = response.data.data;
    const tourId = tourData.value.tourId._id;
    // console.log('tourData:', tourData.value);
    // console.log('Id del tour:', tourId);
    // console.log('Id usuario:', tourData.value.userId._id);
    // console.log('Mail usuario:', tourData.value.userId.email);

    fetchTour(tourId);

  } catch (error) {
    console.error("Error al obtener los detalles del tour:", error);
  } finally {
    cargando.value = false;
  }
};

const mailCancelacion = async () => {
  try {
    // console.log('Email usuario:', tourData.value.userId.email);
    // console.log('Email guía:', guiaEmail.value);
    const usuarioEmail = tourData.value.userId.email;
    const guiaEmailValue = guiaEmail.value;

    if (!guiaEmailValue) {
      console.error('Correo del guía no disponible');
      return;
    }

    const reserva = {
      userId: tourData.value.userId._id,  
      tourId: tourData._rawValue.tourId._id,  
      cantidadPersonas: tourData.value.cantidadPersonas,
      fechaTour: tourData.value.fechaTour,  
      destino: tourData.value.destino,  
      precio: tourData._rawValue.tourId.precio,  
    };

    // console.log('Datos para enviar el correo:');
    // console.log('Email usuario:', usuarioEmail);
    // console.log('Email guía:', guiaEmailValue);
    // console.log('Detalles de la reserva:', reserva);

    if (!usuarioEmail || !guiaEmailValue || !tourData.value) {
      console.error('Faltan datos para enviar el correo');
      return;
    }

    const correoResponse = await axios.post('https://back-tesis-lovat.vercel.app/arcana/mail/cancelacion', {
      usuarioEmail,
      guiaEmailValue,
      reserva,
    });

    // console.log('Mail: ', correoResponse);

    if (correoResponse.status === 200) {
      // console.log('Correo de cancelación enviado');
    } else {
      console.error('Error al enviar correo de cancelación');
    }
  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
  }
}


const cancelarReserva = async () => {
  try {
    const response = await axios.put(`https://back-tesis-lovat.vercel.app/arcana/reservastour/tours/${reservaId}/cancelar`);

    if (response.status === 200) {
      tourData.value.estado = 'cancelada';
      mailCancelacion();
    }
  } catch (error) {
    console.error("Error al cancelar la reserva:", error);
  }
};

onMounted(() => {
  fetchTourDetails();
});
</script>


<template>
  <IrAtras />
  <div class="max-w-4xl mx-auto">
    <SpinnerCarga v-if="cargando" />

    <div v-if="tourData" class="relative mb-2">
      <TituloSecundario class="text-center text-4xl">{{ tourData.titulo }}</TituloSecundario>
      <img :src="tourData.tourId?.fotoPortada" :alt="'Foto del tour ' + tourData.titulo"
        class="w-full h-64 object-cover" />
      <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#fcf9f4] to-transparent opacity-95 h-1/3"></div>
    </div>

    <div v-if="tourData" class="p-6">
      <TituloSecundario class="text-lg"><strong>Descripción:</strong></TituloSecundario>
      <p class="text-lg text-[#222725] mb-4">{{ tourData.descripcion }}</p>

      <div class="mt-6">
        <p class="text-lg text-[#222725] mb-2">
          <span class="font-semibold text-[#3C4A28]">Destino:</span> {{ tourData.destino }}
        </p>
        <p class="text-lg text-[#222725] mb-4">
          <span class="font-semibold text-[#3C4A28]">Fecha del Tour:</span> {{ new
            Date(tourData.fechaTour).toLocaleDateString() }}
        </p>
        <p class="text-lg text-[#222725] mb-4">
          <span class="font-semibold text-[#3C4A28]">Fecha de Reserva:</span> {{ new
            Date(tourData.fechaReserva).toLocaleDateString() }}
        </p>
        <p class="text-lg text-[#222725] mb-4">
          <span class="font-semibold text-[#3C4A28]">Cantidad de Personas:</span> {{ tourData.cantidadPersonas }}
        </p>

        <p class="text-xl font-bold text-[#222725] mb-4">
          <span class="text-lg text-[#3C4A28]">Precio:</span>
          ${{ tourData?.tourId?.precio?.toLocaleString() || 'N/A' }}
        </p>
      </div>

      <div>
        <!-- Información del guía -->
        <TituloTerciario><strong>Guía:</strong></TituloTerciario>

        <div class="bg-white p-4 shadow-md rounded-lg max-w-md mx-auto flex items-center justify-between mb-4">
          <img :src="guiaProfileImage" alt="Foto del guía" class="w-32 h-32 rounded-full object-cover mr-4" />

          <div class="space-y-2 flex flex-col">
            <p v-if="guiaName" class="font-bold text-lg">{{ guiaName ?? 'Nombre no disponible' }}</p>
            <p v-if="guiaEmail" class="text-gray-500">Email: {{ guiaEmail }}</p>
            <p v-if="guiaTelefono" class="text-gray-500">Teléfono: {{ guiaTelefono }}</p>
            <p v-if="guiaProvincia" class="text-gray-500">Provincia: {{ guiaProvincia }}</p>

            <div class="flex justify-end">
              <router-link :to="`/guias/${guiasId}`">
                <BotonPrincipal>Ver más</BotonPrincipal>
              </router-link>
            </div>
          </div>
        </div>

      </div>

      <div class="text-xl font-bold text-[#222725] mb-4 flex">
        <p class="text-lg text-[#3C4A28]">Estado: </p>
        <p v-if="tourData.estado" :class="{
          'text-[#A86A36]': tourData.estado === 'pendiente',
          'text-[#788A68]': tourData.estado === 'confirmada',
          'text-[#7E2323]': tourData.estado === 'cancelada'
        }" class="font-semibold ms-2">
          {{ tourData.estado.charAt(0).toUpperCase() + tourData.estado.slice(1) }}
        </p>
      </div>

      <div v-if="tourData.estado == 'pendiente'" class="flex justify-center mt-4">
        <BotonPrincipal @click="cancelarReserva" class="w-full px-4 py-2 bg-[#7E2323]">
          Cancelar Reserva
        </BotonPrincipal>
      </div>

    </div>

    <div v-else>
      <p class="text-center text-[#7E2323] font-semibold">No se pudo cargar la información del tour.</p>
    </div>
  </div>
</template>
