import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';
import type { LoginRequest, User, UserResponse } from '@/types';

// Login with username and password
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      // Step 1: Login and get tokens
      const loginResponse = await axiosInstance.post(API_ENDPOINTS.LOGIN, credentials);
      const { access, refresh } = loginResponse.data;

      if (!access) {
        return rejectWithValue('No access token received');
      }

      // Store tokens
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);

      // Step 2: Fetch user data
      const userResponse = await axiosInstance.get<UserResponse>(API_ENDPOINTS.GET_CURRENT_USER);
      const userData = userResponse.data;

      // Transform to User type
      const user: User = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        profile: userData.profile,
      };

      // Store user data and authentication status
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isAuthenticated', 'true');

      return { access, refresh, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.detail || 'Login failed');
    }
  }
);


// Check authentication status
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const userStr = localStorage.getItem('user');
      const isAuthenticated = localStorage.getItem('isAuthenticated');

      if (!token || !userStr || isAuthenticated !== 'true') {
        // Clear localStorage if any required item is missing
        localStorage.clear()
        return rejectWithValue('Not authenticated');
      }

      // Try to fetch fresh user data from API
      try {
        const userResponse = await axiosInstance.get<UserResponse>(API_ENDPOINTS.GET_CURRENT_USER);
        const userData = userResponse.data;

        const user: User = {
          id: userData.id,
          username: userData.username,
          email: userData.email,
          profile: userData.profile,
        };

        // Update localStorage with fresh data
        localStorage.setItem('user', JSON.stringify(user));

        return { user, access_token: token };
      } catch (apiError) {
        // If API call fails (e.g., token expired), clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        return rejectWithValue('Session expired');
      }
    } catch (error) {
      // Clear localStorage on any error
      localStorage.clear()
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
      localStorage.clear();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);
