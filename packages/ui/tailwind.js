const path = require('path');

const colors = require('./src/colors');

/**
 * Glob for the shared components, so Tailwind generates their classes.
 * Add it to the app's own `content` — Tailwind replaces, not merges, a preset's content.
 */
const content = path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}');

/**
 * Build the Tailwind preset for an app from its brand palette.
 * @param {import('./src/theme/types').AppTheme} appTheme
 * @returns {import('tailwindcss').Config}
 */
function createTailwindPreset(appTheme) {
  return {
    content: [],
    presets: [require('nativewind/preset')],
    darkMode: 'class',
    theme: {
      extend: {
        fontFamily: {
          inter: ['Inter'],
        },
        colors: {
          ...colors,
          // DEFAULT keeps the numeric scale (primary-300) next to the brand token (primary)
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
  };
}

module.exports = { content, createTailwindPreset };
