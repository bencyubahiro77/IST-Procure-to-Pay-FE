import axios from 'axios';
import { API_BASE_URL } from './api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for HttpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add Authorization header with token from localStorage
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRequest = error.config?.url?.includes('/login/');

      if (!isLoginRequest) {
        // Clear localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
