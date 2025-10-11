// File path: frontend/src/hooks/useTheme.ts

import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import { selectEffectiveTheme } from '../store/slices/themeSlice';
import { createCollabrisTheme } from '../theme/theme';

export const useTheme = () => {
  const themeMode = useAppSelector(selectEffectiveTheme);

  // This hook now correctly uses your `createCollabrisTheme` function
  // to generate the appropriate theme based on the Redux state.
  const theme = useMemo(
    () => createCollabrisTheme(themeMode),
    [themeMode]
  );

  return [theme, themeMode];
};