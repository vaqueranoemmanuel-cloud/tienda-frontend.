import axios from 'axios';

const api = axios.create({
  // Reemplaza esta URL por la URL real de tu backend desplegado en Render:
  baseURL: 'https://tienda-backend-5ilt.onrender.com' 
});

export default api;