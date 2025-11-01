import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './slices/authSlice';
import themeReducer from './slices/themeSlice';
import uiReducer from './slices/uiSlice';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import taskReducer from './slices/taskSlice';
import notificationReducer from './slices/notificationSlice'; // 1. IMPORT THE NEW REDUCER

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    ui: uiReducer,
    user: userReducer,
    chat: chatReducer,
    tasks: taskReducer,
    notifications: notificationReducer, // 2. ADD THE NOTIFICATION REDUCER
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;