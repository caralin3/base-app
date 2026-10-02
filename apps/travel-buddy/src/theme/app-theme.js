/**
 * Travel Buddy brand palette.
 * Shared by tailwind.config.js and the AppThemeProvider, so the Tailwind
 * classes and the runtime colors always match.
 * @type {import('@base-app/ui').AppTheme}
 */
const appTheme = {
  light: {
    primary: '#FF7B1A',
    background: '#FEFEFE',
    surface: '#FFF7ED',
    foreground: '#1F2937',
    muted: '#4C5567',
    border: '#FDBA74',
    danger: '#DC2626',
  },
  dark: {
    primary: '#FB923C',
    background: '#111827',
    surface: '#1F2937',
    foreground: '#F9FAFB',
    muted: '#9CA3AF',
    border: '#374151',
    danger: '#F87171',
  },
};

module.exports = appTheme;
