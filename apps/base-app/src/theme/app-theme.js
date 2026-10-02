/**
 * Base App brand palette.
 * Shared by tailwind.config.js and the AppThemeProvider, so the Tailwind
 * classes and the runtime colors always match.
 * @type {import('@base-app/ui').AppTheme}
 */
const appTheme = {
  light: {
    primary: '#2563EB',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    foreground: '#0F172A',
    muted: '#475569',
    border: '#CBD5E1',
    danger: '#DC2626',
  },
  dark: {
    primary: '#93C5FD',
    background: '#0B1220',
    surface: '#111827',
    foreground: '#E5E7EB',
    muted: '#94A3B8',
    border: '#334155',
    danger: '#F87171',
  },
};

module.exports = appTheme;
