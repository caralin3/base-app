/**
 * Binge Buddy brand palette.
 * Shared by tailwind.config.js and the AppThemeProvider, so the Tailwind
 * classes and the runtime colors always match.
 * @type {import('@base-app/ui').AppTheme}
 */
const appTheme = {
  light: {
    primary: '#2AD707',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    foreground: '#1C1C1E',
    muted: '#525252',
    border: '#D8D8D8',
    danger: '#DC2626',
  },
  dark: {
    primary: '#2AD707',
    background: '#121212',
    surface: '#2E2E2E',
    foreground: '#E5E5E5',
    muted: '#A3A3A3',
    border: '#7D7D7D',
    danger: '#F87171',
  },
};

module.exports = appTheme;
