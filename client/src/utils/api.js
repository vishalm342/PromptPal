/**
 * API helper functions for making authenticated requests
 */
import axios from 'axios';

// API base URLs for production and development
const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001',
    AI_BASE_URL: 'http://localhost:5001'
  },
  production: {
    API_BASE_URL: 'https://promptpal-umwk.onrender.com',    // Node backend
    AI_BASE_URL: 'https://promptpal-ai.onrender.com'        // Flask backend
  }
};

// Detect environment
const isDevelopment =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

const environment = isDevelopment ? 'development' : 'production';

export const API_BASE_URL = config[environment].API_BASE_URL;
export const AI_BASE_URL = config[environment].AI_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
