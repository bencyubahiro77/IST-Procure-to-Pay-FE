import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/config/axios';
import { API_ENDPOINTS } from '@/config/api';
import type {
    CreatePurchaseRequestPayload,
    UpdatePurchaseRequestPayload,
    ApprovePurchaseRequestPayload,
    RejectPurchaseRequestPayload,
    SubmitReceiptPayload,
    PurchaseRequest
} from '@/types';

// Create a new purchase request
export const createPurchaseRequest = createAsyncThunk(
    'purchaseRequests/create',
    async (payload: CreatePurchaseRequestPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('title', payload.title);
            formData.append('description', payload.description);
            formData.append('amount', payload.amount);
            formData.append('items', JSON.stringify(payload.items));

            if (payload.proforma) {
                formData.append('proforma', payload.proforma);
            }

            const response = await axiosInstance.post(API_ENDPOINTS.PURCHASE_REQUESTS, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to create purchase request');
        }
    }
);

// Fetch all purchase requests (filtered by role)
export const fetchPurchaseRequests = createAsyncThunk(
    'purchaseRequests/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.PURCHASE_REQUESTS);
            const data = response.data;

            if (Array.isArray(data)) {
                return data as PurchaseRequest[];
            } else if (data && Array.isArray(data.results)) {
                return data.results as PurchaseRequest[];
            }

            return [] as PurchaseRequest[];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch purchase requests');
        }
    }
);

// Fetch a single purchase request
export const fetchPurchaseRequestById = createAsyncThunk(
    'purchaseRequests/fetchById',
    async (id: string | number, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`${API_ENDPOINTS.PURCHASE_REQUESTS}${id}/`);
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to fetch purchase request');
        }
    }
);

// Update a purchase request (staff only, if pending)
export const updatePurchaseRequest = createAsyncThunk(
    'purchaseRequests/update',
    async (payload: UpdatePurchaseRequestPayload, { rejectWithValue }) => {
        try {
            const { id, ...data } = payload;
            const response = await axiosInstance.put(`${API_ENDPOINTS.PURCHASE_REQUESTS}${id}/`, data);
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to update purchase request');
        }
    }
);

// Approve a purchase request
export const approvePurchaseRequest = createAsyncThunk(
    'purchaseRequests/approve',
    async (payload: ApprovePurchaseRequestPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${API_ENDPOINTS.PURCHASE_REQUESTS}${payload.id}/approve/`,
                { comments: payload.comments }
            );
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to approve purchase request');
        }
    }
);

// Reject a purchase request
export const rejectPurchaseRequest = createAsyncThunk(
    'purchaseRequests/reject',
    async (payload: RejectPurchaseRequestPayload, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.patch(
                `${API_ENDPOINTS.PURCHASE_REQUESTS}${payload.id}/reject/`,
                { comments: payload.comments }
            );
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to reject purchase request');
        }
    }
);

// Submit receipt for a purchase request
export const submitReceipt = createAsyncThunk(
    'purchaseRequests/submitReceipt',
    async (payload: SubmitReceiptPayload, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('receipt', payload.receipt);

            const response = await axiosInstance.post(
                `${API_ENDPOINTS.PURCHASE_REQUESTS}${payload.id}/submit-receipt/`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data as PurchaseRequest;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.detail || 'Failed to submit receipt');
        }
    }
);
