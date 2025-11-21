import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';
import type { LoginRequest, RegisterRequest, User, UserRole } from '@/types';
import { decodeJWT, isTokenExpired } from '@/utils/jwtDecoder';

// Login with email and password
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
      const { access_token } = response.data;

      // Decode JWT token to extract user information
      const decodedToken = decodeJWT(access_token);

      if (!decodedToken) {
        return rejectWithValue('Invalid token received');
      }

      // Extract user data from decoded token
      const user: User = {
        id: decodedToken.sub || '',
        email: decodedToken.email || '',
        full_name: decodedToken.full_name || '',
        role: (decodedToken.role || 'staff') as UserRole,
      };

      // Store token, user data, and authentication status in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');

      return { access_token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);

// Register
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterRequest, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Registration failed');
    }
  }
);

// Check authentication status from localStorage
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      if (!token || !userStr || isAuthenticated !== 'true') {
        // Clear localStorage if any required item is missing
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        return rejectWithValue('Not authenticated');
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Clear localStorage if token is expired
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        return rejectWithValue('Token expired');
      }

      const user: User = JSON.parse(userStr);
      return { user, access_token: token };
    } catch {
      // Clear localStorage on any error
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      return rejectWithValue('Not authenticated');
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Clear localStorage
      localStorage.clear()
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
