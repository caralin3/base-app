const { content: coreContent } = require('@base-app/core/tailwind');
const {
  content: uiContent,
  createTailwindPreset,
} = require('@base-app/ui/tailwind');

const appTheme = require('./src/theme/app-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', uiContent, coreContent],
  presets: [createTailwindPreset(appTheme)],
  theme: {
    extend: {
      colors: {
        'primary-strong': appTheme.light.primaryStrong,
        'primary-strong-dark': appTheme.dark.primaryStrong,
        'on-primary': appTheme.light.onPrimary,
        'on-primary-dark': appTheme.dark.onPrimary,
        'border-subtle': appTheme.light.borderSubtle,
        'border-subtle-dark': appTheme.dark.borderSubtle,
        placeholder: appTheme.light.placeholder,
        'placeholder-dark': appTheme.dark.placeholder,
      },
      borderRadius: {
        // Icon chips, segmented items
        sm: '12px',
        // Inputs, buttons
        md: '16px',
        // Cards
        lg: '20px',
        // Bottom sheets, trip panel
        sheet: '28px',
      },
      fontSize: {
        // Screen titles
        display: ['30px', { fontWeight: '800' }],
        // Trip names, counters
        title: ['24px', { fontWeight: '700' }],
        // Card titles
        heading: ['17px', { fontWeight: '800' }],
        // List items, inputs
        body: ['15px', { fontWeight: '700' }],
        // Dates, metadata
        caption: ['13px', { fontWeight: '600' }],
        // Section labels
        overline: ['13px', { fontWeight: '800', letterSpacing: '1px' }],
      },
    },
  },
  plugins: [],
};
