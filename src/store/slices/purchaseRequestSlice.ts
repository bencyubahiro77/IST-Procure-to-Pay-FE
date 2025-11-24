import { createSlice } from '@reduxjs/toolkit';
import type { PurchaseRequestState } from '@/types';
import {
    createPurchaseRequest,
    fetchPurchaseRequests,
    fetchPurchaseRequestById,
    updatePurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    submitReceipt,
    deletePurchaseRequest,
} from '@/store/actions/purchaseRequestActions';

const initialState: PurchaseRequestState = {
    requests: [],
    currentRequest: null,
    isLoading: false,
    error: null,
    total: 0,
    lastFetched: null,
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
};

const purchaseRequestSlice = createSlice({
    name: 'purchaseRequests',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentRequest: (state) => {
            state.currentRequest = null;
        },
    },
    extraReducers: (builder) => {
        // Create purchase request
        builder
            .addCase(createPurchaseRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPurchaseRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests.unshift(action.payload);
                state.total += 1;
                state.count += 1;
            })
            .addCase(createPurchaseRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch all purchase requests
        builder
            .addCase(fetchPurchaseRequests.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPurchaseRequests.fulfilled, (state, action) => {
                state.isLoading = false;
                state.requests = action.payload.results;
                state.count = action.payload.count;
                state.next = action.payload.next;
                state.previous = action.payload.previous;
                state.currentPage = action.payload.currentPage;
                state.total = action.payload.count;
                state.lastFetched = Date.now();
            })
            .addCase(fetchPurchaseRequests.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Fetch purchase request by ID
        builder
            .addCase(fetchPurchaseRequestById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPurchaseRequestById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentRequest = action.payload;
            })
            .addCase(fetchPurchaseRequestById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Update purchase request
        builder
            .addCase(updatePurchaseRequest.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePurchaseRequest.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.requests.findIndex((req) => req.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            })
            .addCase(updatePurchaseRequest.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });

        // Approve purchase request
        builder
            .addCase(approvePurchaseRequest.pending, (state) => {
                // Don't set isLoading here - let the component handle approval loading state
                state.error = null;
            })
            .addCase(approvePurchaseRequest.fulfilled, (state, action) => {
                // Don't set isLoading here - the refetch will handle table loading
                const index = state.requests.findIndex((req) => req.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            })
            .addCase(approvePurchaseRequest.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Reject purchase request
        builder
            .addCase(rejectPurchaseRequest.pending, (state) => {
                // Don't set isLoading here - let the component handle rejection loading state
                state.error = null;
            })
            .addCase(rejectPurchaseRequest.fulfilled, (state, action) => {
                // Don't set isLoading here - the refetch will handle table loading
                const index = state.requests.findIndex((req) => req.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            })
            .addCase(rejectPurchaseRequest.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Submit receipt
        builder
            .addCase(submitReceipt.pending, (state) => {
                // Don't set isLoading here - let the component handle upload loading state
                state.error = null;
            })
            .addCase(submitReceipt.fulfilled, (state, action) => {
                // Don't set isLoading here - the refetch will handle table loading
                const index = state.requests.findIndex((req) => req.id === action.payload.id);
                if (index !== -1) {
                    state.requests[index] = action.payload;
                }
                if (state.currentRequest?.id === action.payload.id) {
                    state.currentRequest = action.payload;
                }
            })
            .addCase(submitReceipt.rejected, (state, action) => {
                state.error = action.payload as string;
            });

        // Delete purchase request
        builder
            .addCase(deletePurchaseRequest.pending, (state) => {
                state.error = null;
            })
            .addCase(deletePurchaseRequest.fulfilled, (state, action) => {
                state.requests = state.requests.filter((req) => req.id !== action.payload);
                state.total -= 1;
            })
            .addCase(deletePurchaseRequest.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const { clearError, clearCurrentRequest } = purchaseRequestSlice.actions;
export {
    createPurchaseRequest,
    fetchPurchaseRequests,
    fetchPurchaseRequestById,
    updatePurchaseRequest,
    approvePurchaseRequest,
    rejectPurchaseRequest,
    submitReceipt,
    deletePurchaseRequest,
};
export default purchaseRequestSlice.reducer;
