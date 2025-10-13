// File path: frontend/src/hooks/useTheme.ts
import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import { selectEffectiveTheme } from '../store/slices/themeSlice';
// FIX: This now imports the one and only function exported from your theme.ts
import { createCollabrisTheme } from '../theme/theme';

export const useTheme = () => {
  const themeMode = useAppSelector(selectEffectiveTheme);

  // This hook now correctly calls your existing `createCollabrisTheme` function
  // to generate the appropriate MUI theme object based on the current mode ('light' or 'dark').
  const theme = useMemo(
    () => createCollabrisTheme(themeMode),
    [themeMode]
  );

  // It returns the theme object and the theme mode string.
  return [theme, themeMode] as const;
};