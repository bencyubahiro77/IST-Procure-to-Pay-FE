import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import purchaseRequestsReducer from './slices/purchaseRequestSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    purchaseRequests: purchaseRequestsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
