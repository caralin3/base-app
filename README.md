# Base App workspace

A pnpm workspace for Expo apps that share one foundation.

```
apps/
  base-app/        # starter app — copy this to begin a new app
packages/
  tsconfig/        # shared TypeScript compiler options (@base-app/tsconfig)
```

Shared UI, theme, Firebase and env packages will move into `packages/` as the
apps are migrated off their long-lived branches.

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
any script in `apps/base-app/package.json` works. You can also `cd` into the app
and run `pnpm <script>` directly.

## Dependency versions

Versions that every app must agree on (Expo SDK, React, React Native and the
native libraries tied to them) live in the `catalog:` section of
`pnpm-workspace.yaml`. Reference them from a package with `"catalog:"` so an SDK
upgrade is a single edit.
