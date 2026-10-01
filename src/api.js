import axios from 'axios';

// Toma la variable de entorno en Vercel o usa localhost en desarrollo

const API_URL = "https://tienda-backend-5ilt.onrender.com";

export const api = axios.create({
  baseURL: API_URL
});