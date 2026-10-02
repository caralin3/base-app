const colors = require('./src/components/ui/colors');
const { getAppTheme } = require('./src/theme/app-themes');

const appProject = process.env.APP_PROJECT ?? 'binge-buddy';
const appTheme = getAppTheme(appProject);

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: {
        ...colors,
        // Keep the numeric scales (e.g. primary-600, danger-600) alongside the
        // semantic theme tokens
        primary: { ...colors.primary, DEFAULT: appTheme.light.primary },
        'primary-dark': appTheme.dark.primary,
        background: appTheme.light.background,
        'background-dark': appTheme.dark.background,
        surface: appTheme.light.surface,
        'surface-dark': appTheme.dark.surface,
        foreground: appTheme.light.foreground,
        'foreground-dark': appTheme.dark.foreground,
        muted: appTheme.light.muted,
        'muted-dark': appTheme.dark.muted,
        border: appTheme.light.border,
        'border-dark': appTheme.dark.border,
        danger: { ...colors.danger, DEFAULT: appTheme.light.danger },
        'danger-dark': appTheme.dark.danger,
      },
    },
  },
  plugins: [],
};
