import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User, AuthState } from '@/types';
import { login, logout, checkAuth } from '@/store/actions/authActions';

// Initialize state from localStorage if available
const getInitialState = (): AuthState => {
  try {
    const userStr = localStorage.getItem('user');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (userStr && isAuthenticated) {
      const user: User = JSON.parse(userStr);
      return {
        user,
        isAuthenticated,
        isLoading: false,
        error: null,
      };
    }
  } catch (error) {
    console.error('Failed to restore auth state from localStorage:', error);
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  };
};

const initialState: AuthState = getInitialState();

// Export actions for use in components
export { login, logout, checkAuth };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Persist to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('isAuthenticated', 'true');
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check Auth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // Clear only auth-related localStorage items (preserve theme)
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
