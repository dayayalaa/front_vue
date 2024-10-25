import axios from 'axios';

const API_URL = 'http://localhost:3000/arcana';

export const fetchVuelos = async () => {
  try {
    const response = await axios.get(`${API_URL}/vuelos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los datos de vuelos:', error);
    throw error;
  }
};
