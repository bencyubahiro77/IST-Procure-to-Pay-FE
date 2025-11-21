export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/accounts/login/',
  LOGOUT: '/auth/logout',
  GET_CURRENT_USER: '/api/accounts/me/',

  // Purchase Requests
  PURCHASE_REQUESTS: '/api/requests/',

  // System
  HEALTH: '/health',
};
