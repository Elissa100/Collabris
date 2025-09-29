import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode } from '../../types';

interface ThemeState {
  mode: ThemeMode;
  systemPrefersDark: boolean;
}

// Get initial theme from localStorage or system preference
const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('themeMode') as ThemeMode;
  if (saved && ['light', 'dark', 'system'].includes(saved)) {
    return saved;
  }
  return 'system';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
  systemPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('themeMode', action.payload);
    },
    setSystemPrefersDark: (state, action: PayloadAction<boolean>) => {
      state.systemPrefersDark = action.payload;
    },
    toggleTheme: (state) => {
      if (state.mode === 'light') {
        state.mode = 'dark';
      } else if (state.mode === 'dark') {
        state.mode = 'light';
      } else {
        // If system, toggle to opposite of current system preference
        state.mode = state.systemPrefersDark ? 'light' : 'dark';
      }
      localStorage.setItem('themeMode', state.mode);
    },
  },
});

export const { setThemeMode, setSystemPrefersDark, toggleTheme } = themeSlice.actions;

// Selectors
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectEffectiveTheme = (state: { theme: ThemeState }) => {
  if (state.theme.mode === 'system') {
    return state.theme.systemPrefersDark ? 'dark' : 'light';
  }
  return state.theme.mode;
};

export default themeSlice.reducer;
