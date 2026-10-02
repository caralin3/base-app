const {
  content: uiContent,
  createTailwindPreset,
} = require('@base-app/ui/tailwind');

const appTheme = require('./src/theme/app-theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', uiContent],
  presets: [createTailwindPreset(appTheme)],
  plugins: [],
};
