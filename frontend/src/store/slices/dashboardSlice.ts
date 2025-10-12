// File Path: frontend/src/store/slices/dashboardSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getAdminDashboardStats } from '../../services/dashboardService';

// This defines the full shape of the stats object for the Admin Dashboard
interface AdminStats {
    totalUsers: number | string;
    totalProjects: number | string;
    totalTeams: number | string;
    roleDistribution: any[]; // Kept as 'any' for simplicity for now
    userGrowth: any[];
}

interface DashboardState {
  adminStats: AdminStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  adminStats: null,
  loading: false,
  error: null,
};

// Async thunk to fetch the initial stats
export const fetchAdminStats = createAsyncThunk(
    'dashboard/fetchAdminStats',
    async (_, { rejectWithValue }) => {
        try {
            const data = await getAdminDashboardStats();
            return data as AdminStats;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        // --- THIS IS THE FIX ---
        // This reducer now accepts a partial object and merges it into the state.
        // This allows a single action to handle updates for users, projects, or teams.
        updateAdminStats: (state, action: PayloadAction<Partial<AdminStats>>) => {
            if (state.adminStats) {
                // Merge the incoming payload with the existing stats
                Object.assign(state.adminStats, action.payload);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdminStats.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAdminStats.fulfilled, (state, action) => {
                state.loading = false;
                state.adminStats = action.payload;
            })
            .addCase(fetchAdminStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { updateAdminStats } = dashboardSlice.actions;

export const selectAdminStats = (state: { dashboard: DashboardState }) => state.dashboard.adminStats;
export const selectDashboardLoading = (state: { dashboard: DashboardState }) => state.dashboard.loading;

export default dashboardSlice.reducer;