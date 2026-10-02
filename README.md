# Base App workspace

A pnpm workspace for Expo apps that share one foundation.

```
apps/
  base-app/        # starter app — copy this to begin a new app
  binge-buddy/     # Binge Buddy
  travel-buddy/    # Travel Buddy
packages/
  tsconfig/        # shared TypeScript compiler options (@base-app/tsconfig)
  ui/              # shared components, theme provider, Tailwind preset (@base-app/ui)
```

Firebase and env packages will follow in `packages/`.

## Theming an app

Each app owns its brand palette (`apps/<app>/src/theme/app-theme.js`) and passes
it to `@base-app/ui` in two places, so Tailwind classes and runtime colors match:

```js
// tailwind.config.js
const {
  content: uiContent,
  createTailwindPreset,
} = require('@base-app/ui/tailwind');
const appTheme = require('./src/theme/app-theme');

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', uiContent], // uiContent is required
  presets: [createTailwindPreset(appTheme)],
};
```

```tsx
// src/app/_layout.tsx
<AppThemeProvider theme={appTheme}>{/* app */}</AppThemeProvider>
```

Native libraries the UI package uses are `peerDependencies` pinned through the
catalog, so the app and the package always share one copy.

## Setup

```bash
pnpm install
```

Each app reads its env from git-ignored files in its own folder:
`apps/<app>/.env.<development|preview|production>.local`, picked by `APP_ENV`
(default `development`). The committed `.env.development`, `.env.preview` and
`.env.production` files list the required keys. On EAS, the same variables come
from the build profile's environment instead.

## Common commands

Run from the repo root:

| Command                           | What it does                     |
| --------------------------------- | -------------------------------- |
| `pnpm base-app start`             | Start the Metro dev server       |
| `pnpm base-app ios`               | Build and run on iOS             |
| `pnpm base-app android`           | Build and run on Android         |
| `pnpm base-app build:preview:ios` | EAS preview build                |
| `pnpm type-check`                 | Type-check every app and package |
| `pnpm lint`                       | Lint every app and package       |

`pnpm base-app <script>` is shorthand for `pnpm --filter base-app <script>`, so
any script in `apps/base-app/package.json` works. `pnpm binge-buddy <script>`
and `pnpm travel-buddy <script>` do the same for the other apps. You can also `cd` into the app
and run `pnpm <script>` directly.

## CI

`.github/workflows/ci.yml` runs `pnpm lint` and `pnpm type-check` on every pull
request and on pushes to `main`.

## Dependency versions

Versions that every app must agree on (Expo SDK, React, React Native and the
native libraries tied to them) live in the `catalog:` section of
`pnpm-workspace.yaml`. Reference them from a package with `"catalog:"` so an SDK
upgrade is a single edit.
