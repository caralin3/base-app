# Base App workspace

A pnpm workspace for Expo apps that share one foundation.

```
apps/
  base-app/        # starter app — copy this to begin a new app
  travel-buddy/    # Travel Buddy
packages/
  tsconfig/        # shared TypeScript compiler options (@base-app/tsconfig)
  ui/              # shared components, theme provider, Tailwind preset (@base-app/ui)
```

Binge Buddy still lives on the `binge-buddy-app` branch and will move to
`apps/binge-buddy`. Firebase and env packages will follow in `packages/`.

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

Each app reads its env from scoped, git-ignored files in its own folder:
`apps/<app>/.env.<project>.<development|preview|production>.local`. The
committed `.env.development`, `.env.preview` and `.env.production` files list
the required keys.

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
any script in `apps/base-app/package.json` works. `pnpm travel-buddy <script>`
does the same for Travel Buddy. You can also `cd` into the app
and run `pnpm <script>` directly.

## Dependency versions

Versions that every app must agree on (Expo SDK, React, React Native and the
native libraries tied to them) live in the `catalog:` section of
`pnpm-workspace.yaml`. Reference them from a package with `"catalog:"` so an SDK
upgrade is a single edit.
