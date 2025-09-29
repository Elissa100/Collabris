import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoadingState, ErrorState, Notification } from '../../types';

interface UiState {
  loading: LoadingState;
  errors: ErrorState;
  notifications: Notification[];
  sidebarOpen: boolean;
  mobileSidebarOpen: boolean;
  pageTitle: string;
  breadcrumbs: BreadcrumbItem[];
}

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

const initialState: UiState = {
  loading: {},
  errors: {},
  notifications: [],
  sidebarOpen: true,
  mobileSidebarOpen: false,
  pageTitle: 'Collabris',
  breadcrumbs: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    clearLoading: (state, action: PayloadAction<string>) => {
      delete state.loading[action.payload];
    },
    setError: (state, action: PayloadAction<{ key: string; value: string | null }>) => {
      state.errors[action.payload.key] = action.payload.value;
    },
    clearError: (state, action: PayloadAction<string>) => {
      delete state.errors[action.payload];
    },
    clearAllErrors: (state) => {
      state.errors = {};
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleMobileSidebar: (state) => {
      state.mobileSidebarOpen = !state.mobileSidebarOpen;
    },
    setMobileSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileSidebarOpen = action.payload;
    },
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.pageTitle = action.payload;
    },
    setBreadcrumbs: (state, action: PayloadAction<BreadcrumbItem[]>) => {
      state.breadcrumbs = action.payload;
    },
  },
});

export const {
  setLoading,
  clearLoading,
  setError,
  clearError,
  clearAllErrors,
  addNotification,
  removeNotification,
  clearAllNotifications,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setPageTitle,
  setBreadcrumbs,
} = uiSlice.actions;

// Selectors
export const selectUi = (state: { ui: UiState }) => state.ui;
export const selectLoading = (key: string) => (state: { ui: UiState }) => state.ui.loading[key] || false;
export const selectError = (key: string) => (state: { ui: UiState }) => state.ui.errors[key] || null;
export const selectNotifications = (state: { ui: UiState }) => state.ui.notifications;
export const selectSidebarOpen = (state: { ui: UiState }) => state.ui.sidebarOpen;
export const selectMobileSidebarOpen = (state: { ui: UiState }) => state.ui.mobileSidebarOpen;
export const selectPageTitle = (state: { ui: UiState }) => state.ui.pageTitle;
export const selectBreadcrumbs = (state: { ui: UiState }) => state.ui.breadcrumbs;

// Helper action creators
export const showNotification = (notification: Omit<Notification, 'id'>) => addNotification(notification);
export const showSuccessNotification = (title: string, message: string) => 
  addNotification({ type: 'success', title, message });
export const showErrorNotification = (title: string, message: string) => 
  addNotification({ type: 'error', title, message });
export const showWarningNotification = (title: string, message: string) => 
  addNotification({ type: 'warning', title, message });
export const showInfoNotification = (title: string, message: string) => 
  addNotification({ type: 'info', title, message });

export type { BreadcrumbItem };
export default uiSlice.reducer;
