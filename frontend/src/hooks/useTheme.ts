import { useMemo } from 'react';
import { useAppSelector } from '../store/store';
import { selectEffectiveTheme } from '../store/slices/themeSlice';
import { createCollabrisTheme } from '../theme/theme';

export const useTheme = () => {
  const themeMode = useAppSelector(selectEffectiveTheme);

  // Generate the MUI theme object based on mode (light/dark/system)
  const theme = useMemo(() => createCollabrisTheme(themeMode), [themeMode]);

  return [theme, themeMode] as const;
};
