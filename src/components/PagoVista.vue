<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const reserva = JSON.parse(localStorage.getItem('Reserva')) || null;

const calcularTotal = () => {
    const precioVueloIda = parseFloat(reserva.idaReserva.details.price || 0);
    const precioVueloVuelta = parseFloat(reserva.vueltaReserva.details.price || 0);
    const precioHotel = parseFloat(reserva.hotelReserva.total_rate.extracted_before_taxes_fees || 0);
    return precioVueloIda + precioVueloVuelta + precioHotel;
};

const enviarCorreoConfirmacion = async () => {
    try {
        const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/reservaViaje', {
            email: reserva.usuario.email, 
            nombre: reserva.usuario.nombre,
            detalles: {
                vueloIda: reserva.idaReserva.details.flights[0].airline,
                vueloVuelta: reserva.vueltaReserva.details.flights[0].airline,
                hotel: reserva.hotelReserva.name,
                total: calcularTotal(),
            },
        });

        if (response.data.success) {
            console.log('Correo de confirmación enviado correctamente.');
        } else {
            console.error('Error al enviar el correo:', response.data.message);
        }
    } catch (error) {
        console.error('Error al enviar el correo de confirmación:', error);
    }
};

const realizarPago = async () => {
    try {
        const items = [
            {
                title: 'Reserva de Vuelo Ida',
                price: parseFloat(reserva.idaReserva.details.price),
                quantity: 1,
            },
            {
                title: 'Reserva de Vuelo Vuelta',
                price: parseFloat(reserva.vueltaReserva.details.price),
                quantity: 1,
            },
            {
                title: 'Reserva de Hotel',
                price: parseFloat(reserva.hotelReserva.total_rate.extracted_before_taxes_fees),
                quantity: 1,
            },
        ];

       // console.log('Los elementos son:', items);

        const response = await axios.post('https://back-tesis-lovat.vercel.app/arcana/pago/mercado', {
            items: items,
        });

        //console.log('Verificacion:', response);

        if (response.data?.init_point) {
            // Llamamos a la función para enviar el correo de confirmación antes de redirigir
            await enviarCorreoConfirmacion();

            // Redirigimos a Mercado Pago
            window.location.href = response.data.init_point;
        } else {
            throw new Error('No se recibió init_point de la respuesta.');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        //alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
    }
};
</script>

<template>
    <div>
        <IrAtras />
        <div class="flex flex-col justify-center items-center">
            <TituloSecundario>Detalles de Pago</TituloSecundario>

            <div v-if="!reserva" class="text-gray-500">
                <p>No hay reservas para mostrar.</p>
            </div>

            <div v-else>
                <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                    <TituloTerciario>Resumen de la Reserva</TituloTerciario>
                    <p><strong>Vuelo de Ida:</strong> {{ reserva.idaReserva.details.flights[0].airline }}</p>
                    <p><strong>Precio de Ida:</strong> ${{ reserva.idaReserva.details.price?.toLocaleString() }}</p>
                    <hr class="m-4">
                    <p><strong>Vuelo de Vuelta:</strong> {{ reserva.vueltaReserva.details.flights[0].airline }}</p>
                    <p><strong>Precio de Vuelta:</strong> ${{ reserva.vueltaReserva.details.price?.toLocaleString() }}</p>
                    <hr class="m-4">
                    <p><strong>Hotel:</strong> {{ reserva.hotelReserva.name }}</p>
                    <p><strong>Precio del Hotel:</strong> ${{ reserva.hotelReserva.total_rate.extracted_before_taxes_fees?.toLocaleString() }}</p>
                    <hr class="m-6">
                    <h3 class="font-bold text-lg">Total:</h3>
                    <p class="text-xl font-semibold text-green-600">${{ calcularTotal().toLocaleString() }}</p>
                </div>

                <!-- Solo el botón de pago -->
                <div class="flex flex-col justify-center items-center">
                    <TituloSecundario>Confirmar Pago</TituloSecundario>
                    <div class="mt-4">
                        <BotonPrincipal @click="realizarPago">Confirmar Pago</BotonPrincipal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
