import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, PaginatedResponse } from '../../types';
import * as userService from '../../services/userService';
import { RootState } from '../store';

interface UserState {
  users: User[];
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // The service returns a PaginatedResponse, so we extract the content
      const response: PaginatedResponse<User> = await userService.getAllUsers();
      return response.content;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, { id: number; userData: Partial<User> }, { rejectValue: string }>(
  'users/updateProfile',
  async ({ id, userData }, { rejectWithValue }) => {
    try {
      const updatedUser = await userService.updateUser(id, userData);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update user profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update user profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser && state.selectedUser.id === action.payload.id) {
            state.selectedUser = action.payload;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = userSlice.actions;

// Selectors
export const selectAllUsers = (state: RootState) => state.user.users;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;