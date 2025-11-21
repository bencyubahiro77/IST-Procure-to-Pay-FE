import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';

export const dashboardSummary = createAsyncThunk(
    'dashboard/summary',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.GET_DASHBOARD_SUMMARY);
            return response.data;
        } catch {
            return rejectWithValue("Error getting summary")
        }
    }
)
