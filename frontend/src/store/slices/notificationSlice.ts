import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Notification } from '../../types';
import * as notificationService from '../../services/notificationService';
import { RootState } from '../store';

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  status: 'idle',
  error: null,
};

// --- ASYNC THUNKS ---
export const fetchNotifications = createAsyncThunk<Notification[]>(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications();
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk<number, number>(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Reducer to handle incoming notifications from WebSocket
    addNotification: (state, action: PayloadAction<Notification>) => {
      // Add to the top of the list to show newest first
      state.notifications.unshift(action.payload);
      state.unreadCount++;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action: PayloadAction<Notification[]>) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Marking a notification as read
      .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<number>) => {
        const notification = state.notifications.find(n => n.id === action.payload);
        if (notification && !notification.isRead) {
          notification.isRead = true;
          state.unreadCount--;
        }
      });
  },
});

export const { addNotification } = notificationSlice.actions;

// --- SELECTORS ---
export const selectAllNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnreadNotificationCount = (state: RootState) => state.notifications.unreadCount;
export const selectNotificationStatus = (state: RootState) => state.notifications.status;

export default notificationSlice.reducer;