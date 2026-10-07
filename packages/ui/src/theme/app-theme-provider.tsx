import React, { createContext, useContext } from 'react';

import { type AppTheme } from './types';

const AppThemeContext = createContext<AppTheme | null>(null);

type AppThemeProviderProps = {
  theme: AppTheme;
  children: React.ReactNode;
};

/**
 * Supplies the app's brand palette to shared UI components.
 * Wrap the app root with this and pass the same theme used for the Tailwind preset.
 */
export function AppThemeProvider({ theme, children }: AppThemeProviderProps) {
  return (
    <AppThemeContext.Provider value={theme}>
      {children}
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  const theme = useContext(AppThemeContext);

  if (!theme) {
    throw new Error('useAppTheme must be used inside an AppThemeProvider');
  }

  return theme;
}
