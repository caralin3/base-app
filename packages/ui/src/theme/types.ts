export type ThemePalette = {
  primary: string;
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  danger: string;
};

export type AppTheme = {
  light: ThemePalette;
  dark: ThemePalette;
};
