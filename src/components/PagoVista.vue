<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';  // Importar el router si necesitas redirigir

// Defino los estados necesarios
const pasoActual = ref(5); // Paso actual está en la sección de pago
const reserva = JSON.parse(localStorage.getItem('Reserva')) || null; // Obtener reservas del almacenamiento local

// Formulario de pago
const nombreTarjeta = ref('');
const numeroTarjeta = ref('');
const fechaExpiracion = ref('');
const cvvTarjeta = ref('');

// Función para calcular el total
const calcularTotal = () => {
    const precioVueloIda = parseFloat(reserva.idaReserva.details.price || 0);
    const precioVueloVuelta = parseFloat(reserva.vueltaReserva.details.price || 0);
    const precioHotel = parseFloat(reserva.hotelReserva.total_rate.
        extracted_before_taxes_fees || 0);
    return precioVueloIda + precioVueloVuelta + precioHotel;
};

// Función para manejar el pago
const realizarPago = async () => {
    try {
        const pagoDatos = {
            nombre: nombreTarjeta.value,
            numero: numeroTarjeta.value,
            fechaExpiracion: fechaExpiracion.value,
            cvv: cvvTarjeta.value,
            total: calcularTotal()
        };

        console.log('Datos de pago:', pagoDatos);

        // Aquí se realizaría la llamada a la API de pago
        // Ejemplo: const response = await axios.post('/api/pagar', pagoDatos);

        alert('Pago realizado exitosamente.');

        // Limpiar los campos
        nombreTarjeta.value = '';
        numeroTarjeta.value = '';
        fechaExpiracion.value = '';
        cvvTarjeta.value = '';

        // Redirigir después del pago exitoso, si es necesario
        // const router = useRouter();
        // router.push('/confirmacion'); // Esto debería ser la ruta a la página de confirmación
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        alert('Ocurrió un error al procesar el pago. Intenta nuevamente.');
    }
};
</script>

<template>
    <div>
        <h1>Página de Pago</h1>
        <div v-if="pasoActual === 5">
            <TituloSecundario>Detalles de Pago</TituloSecundario>
            <div v-if="!reserva" class="text-gray-500">
                <p>No hay reservas para mostrar.</p>
            </div>
            <div v-else>
                <TituloTerciario>Resumen de la Reserva</TituloTerciario>
                <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                    <p><strong>Vuelo de Ida:</strong> {{ reserva.idaReserva.details.flights[0].airline }}</p>
                    <p><strong>Precio de Ida:</strong> ${{ reserva.idaReserva.details.price?.toLocaleString() }}</p>
                    <p><strong>Vuelo de Vuelta:</strong> {{ reserva.vueltaReserva.details.flights[0].airline }}</p>
                    <p><strong>Precio de Vuelta:</strong> ${{ reserva.vueltaReserva.details.price?.toLocaleString() }}
                    </p>
                    <p><strong>Hotel:</strong> {{ reserva.hotelReserva.name }}</p>
                    <p><strong>Precio del Hotel:</strong> ${{ reserva.hotelReserva.total_rate.
                        extracted_before_taxes_fees?.toLocaleString() }}</p>
                </div>
                <div class="bg-white border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                    <h3 class="font-bold text-lg">Total:</h3>
                    <p class="text-xl font-semibold text-green-600">${{ calcularTotal().toLocaleString() }}</p>
                </div>
                <form @submit.prevent="realizarPago">
                    <div class="mb-4">
                        <label for="nombre" class="block text-sm font-medium text-gray-700">Nombre en la tarjeta</label>
                        <input id="nombre" v-model="nombreTarjeta" type="text"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div class="mb-4">
                        <label for="numero" class="block text-sm font-medium text-gray-700">Número de tarjeta</label>
                        <input id="numero" v-model="numeroTarjeta" type="text"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div class="mb-4">
                        <label for="fecha" class="block text-sm font-medium text-gray-700">Fecha de expiración</label>
                        <input id="fecha" v-model="fechaExpiracion" type="text" placeholder="MM/AA"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div class="mb-4">
                        <label for="cvv" class="block text-sm font-medium text-gray-700">CVV</label>
                        <input id="cvv" v-model="cvvTarjeta" type="text"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div class="mt-4">
                        <BotonPrincipal type="submit">Confirmar Pago</BotonPrincipal>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
