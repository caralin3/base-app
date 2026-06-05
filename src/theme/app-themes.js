/**
 * Central app theme registry.
 * Update values here to rebrand each app without touching component code.
 */
const APP_THEMES = {
  'base-app': {
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
  },
  'binge-buddy': {
    light: {
      primary: '#2AD707',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      foreground: '#151718',
      muted: '#525252',
      border: '#D4D4D4',
      danger: '#DC2626',
    },
    dark: {
      primary: '#2AD707',
      background: '#121212',
      surface: '#2E2E2E',
      foreground: '#E5E5E5',
      muted: '#A3A3A3',
      border: '#474747',
      danger: '#F87171',
    },
  },
};

/**
 * @param {string | undefined} project
 */
function getAppTheme(project) {
  if (project && Object.prototype.hasOwnProperty.call(APP_THEMES, project)) {
    const themeKey = /** @type {keyof typeof APP_THEMES} */ (project);
    return APP_THEMES[themeKey];
  }

  return APP_THEMES['base-app'];
}

module.exports = {
  APP_THEMES,
  getAppTheme,
};
