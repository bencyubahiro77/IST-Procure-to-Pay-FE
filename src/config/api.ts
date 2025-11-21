export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  GET_CURRENT_USER: '/auth/me',
  REQUEST_RESET_OTP: '/auth/req-pass-reset-otp',
  VERIFY_RESET_OTP: '/auth/verify-reset-otp',
  RESET_PASSWORD: '/auth/reset-password',

  // Users
  REGISTER: '/user/register',

  // Purchase Requests
  PURCHASE_REQUESTS: '/api/requests/',

  // Dashboard
  GET_DASHBOARD_SUMMARY: '/dashboard/summary',

  // System
  HEALTH: '/health',
};
