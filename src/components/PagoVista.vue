<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import IrAtras from '../components/IrAtras.vue';
import TituloSecundario from './TituloSecundario.vue';
import TituloTerciario from './TituloTerciario.vue';
import BotonPrincipal from './BotonPrincipal.vue';

const reserva = JSON.parse(localStorage.getItem('Reserva')) || null;
// console.log('Datos reserva', reserva);

const calcularTotal = () => {
    const precioVueloIda = parseFloat(reserva.idaReserva.details.price || 0);
    const precioVueloVuelta = parseFloat(reserva.vueltaReserva.details.price || 0);
    const precioHotel = parseFloat(reserva.hotelReserva.total_rate.extracted_before_taxes_fees || 0);
    return precioVueloIda + precioVueloVuelta + precioHotel;
};

const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

const enviarCorreoConfirmacion = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.error('Error: No hay token de autenticación.');
        return;
    }

    try {
        const decodedToken = decodeJWT(token);
        const userId = decodedToken.userId;

        if (!userId) {
            console.error('Error: No se encontró el ID del usuario en el token.');
            return;
        }

        const response = await fetch(`https://back-tesis-lovat.vercel.app/arcana/usuarios/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos del usuario');
        }

        const userData = await response.json();

        const usuario = {
            email: userData.data.email,
            name: userData.data.nombre,
        };

        const reserva = localStorage.getItem('Reserva') ? JSON.parse(localStorage.getItem('Reserva')) : null;

        if (!reserva) {
            console.error('Error: No hay una reserva activa.');
            return;
        }
        const correoData = {
            email: usuario.email,
            name: usuario.name,
            destino: reserva.vueltaReserva?.details?.flights?.[0]?.departure_airport?.name || 'Destino desconocido',
            salida: reserva.idaReserva?.details?.flights?.[0]?.departure_airport?.name || 'Origen desconocido',
            aerolineaIda: reserva.idaReserva?.details?.flights?.[0]?.airline || 'No disponible',
            aerolineaVuelta: reserva.vueltaReserva?.details?.flights?.[0]?.airline || 'No disponible',
            fechaIda: reserva.idaReserva?.details?.flights?.[0]?.departure_airport?.time || 'Fecha no disponible',
            fechaVuelta: reserva.vueltaReserva?.details?.flights?.[0]?.departure_airport?.time || 'Fecha no disponible',
            precioIda: parseFloat(reserva.idaReserva?.details?.price) || 0,
            precioVuelta: parseFloat(reserva.vueltaReserva?.details?.price) || 0,
            hotel: reserva.hotelReserva?.name || 'No disponible',
            precioHotel: parseFloat(reserva.hotelReserva?.total_rate?.extracted_before_taxes_fees) || 0,
            total: calcularTotal(),
        };


        // console.log('Datos que se enviarán:', correoData);

        const correoResponse = await axios.post('https://back-tesis-lovat.vercel.app/arcana/mail/reservaViaje', correoData);

        // console.log('Correo de salida:', correoResponse.data);

        if (correoResponse.data?.message) {
            // console.log('Correo de confirmación enviado correctamente.');
        } else {
            console.error('Error al enviar el correo:', correoResponse.data.error);
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

        // console.log('Verificacion:', response);

        if (response.data?.init_point) {
            await enviarCorreoConfirmacion();

            window.location.href = response.data.init_point;
        } else {
            throw new Error('No se recibió init_point de la respuesta.');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
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
                    <p><strong>Precio de Vuelta:</strong> ${{ reserva.vueltaReserva.details.price?.toLocaleString() }}
                    </p>
                    <hr class="m-4">
                    <p><strong>Hotel:</strong> {{ reserva.hotelReserva.name }}</p>
                    <p><strong>Precio del Hotel:</strong> ${{
                        reserva.hotelReserva.total_rate.extracted_before_taxes_fees?.toLocaleString() }}</p>
                    <hr class="m-6">
                    <p class="text-xl font-semibold text-[#788A68] text-center"><strong
                            class="font-bold text-lg text-black">Total: </strong>${{ calcularTotal().toLocaleString() }}
                    </p>
                </div>

                <!-- Solo el botón de pago -->
                <div class="flex flex-col justify-center items-center">
                    <div class="mt-4">
                        <BotonPrincipal @click="realizarPago">Confirmar Pago</BotonPrincipal>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
