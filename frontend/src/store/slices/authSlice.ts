// File path: frontend/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginRequest, SignupRequest, AuthResponse } from '../../types';
import * as authService from '../../services/authService';
import { RootState } from '../store'; // Import RootState for the selector type

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialLoad: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const getInitialState = (): AuthState => {
  const token = localStorage.getItem('token');
  return {
    user: null,
    token,
    isAuthenticated: !!token,
    isLoading: false,
    error: null,
    initialLoad: 'idle',
  };
};

const initialState: AuthState = getInitialState();

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginRequest, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: SignupRequest, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    if (!localStorage.getItem('token')) {
      return rejectWithValue('No token found');
    }
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error: any) {
      localStorage.removeItem('token');
      return rejectWithValue(error.message || 'Failed to fetch user');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // SIGNUP
      .addCase(signup.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(signup.fulfilled, (state) => { state.isLoading = false; })
      .addCase(signup.rejected, (state, action) => { state.isLoading = false; state.error = action.payload as string; })
      // GET CURRENT USER
      .addCase(getCurrentUser.pending, (state) => { state.initialLoad = 'loading'; })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.initialLoad = 'succeeded';
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.initialLoad = 'failed';
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;

// --- SELECTORS ---
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectInitialLoad = (state: RootState) => state.auth.initialLoad;
export const selectIsAdmin = (state: RootState) => state.auth.user?.roles.some(role => role === 'ADMIN') || false;

// --- THIS IS THE FIX ---
// Add the missing selector for the authentication token.
export const selectToken = (state: RootState) => state.auth.token;

export default authSlice.reducer;