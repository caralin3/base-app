const path = require('path');

/**
 * Glob for this package's components, so Tailwind generates their classes.
 * Add it to the app's `content` next to @base-app/ui's.
 */
const content = path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}');

module.exports = { content };
