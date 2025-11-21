import { createSlice } from '@reduxjs/toolkit';
import { dashboardSummary } from '@/store/actions/dashboardAction';
import type { DashboardState } from '@/types/dashboard.types';

const initialState: DashboardState = {
    summary: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(dashboardSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dashboardSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.summary = action.payload;
            })
            .addCase(dashboardSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;
