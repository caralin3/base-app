/**
 * Travel Buddy brand palette.
 * Shared by tailwind.config.js and the AppThemeProvider, so the Tailwind
 * classes and the runtime colors always match.
 * Extends the shared palette with Travel Buddy-only tokens.
 * @typedef {import('@base-app/ui').ThemePalette & {
 *   primaryStrong: string;
 *   onPrimary: string;
 *   borderSubtle: string;
 *   placeholder: string;
 * }} TravelBuddyPalette
 * @type {{ light: TravelBuddyPalette; dark: TravelBuddyPalette }}
 */
const appTheme = {
  light: {
    // Decoration only: 2.6:1 on white
    primary: '#FF7B1A',
    // Buttons, text, checkbox outlines
    primaryStrong: '#C2410C',
    // Text on primaryStrong: 5.2:1
    onPrimary: '#FFFFFF',
    background: '#FEFEFE',
    // Cards, chips
    surface: '#FFF7ED',
    foreground: '#1F2937',
    // Secondary text
    muted: '#4C5567',
    // Decorative lines, dashed routes
    border: '#FDBA74',
    // Hairlines, tab bar
    borderSubtle: '#F3E3D3',
    // Input hints, done items: 4.8:1
    placeholder: '#6B7280',
    danger: '#DC2626',
  },
  dark: {
    primary: '#FB923C',
    primaryStrong: '#FB923C',
    // Dark text on orange
    onPrimary: '#111827',
    background: '#111827',
    surface: '#1F2937',
    foreground: '#F9FAFB',
    muted: '#9CA3AF',
    border: '#374151',
    borderSubtle: '#2B3544',
    placeholder: '#9CA3AF',
    danger: '#F87171',
  },
};

module.exports = appTheme;
