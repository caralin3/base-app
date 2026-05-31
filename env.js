/* global */
/*
 * Env file to load and validate env variables
 * Be cautious; this file should not be imported into your source folder.
 * We split the env variables into two parts:
 * 1. Client variables: These variables are used in the client-side code (src folder).
 * 2. Build-time variables: These variables are used in the build process (app.config.ts file).
 * Import this file into the `app.config.ts` file to use environment variables during the build process. The client variables can then be passed to the client-side using the extra field in the `app.config.ts` file.
 * To access the client environment variables in your `src` folder, you can import them from `@env`. For example: `import Env from '@env'`.
 */
/**
 * 1st part: Import packages and Load your env variables
 * we use dotenv to load the correct variables from scoped .env files based on APP_PROJECT and APP_ENV
 * APP_PROJECT/APP_ENV can be passed inline, for example: APP_PROJECT=binge-buddy APP_ENV=preview pnpm build:android
 */
const fs = require('fs');
const path = require('path');
const z = require('zod');

const packageJSON = require('./package.json');
const APP_ENV = z
  .enum(['development', 'preview', 'production'])
  .parse(process.env.APP_ENV ?? process.env.EAS_BUILD_PROFILE ?? 'development');
const APP_PROJECT = z
  .enum(['base-app', 'binge-buddy'])
  .parse(process.env.APP_PROJECT ?? 'binge-buddy');
const isEasBuild = Boolean(process.env.EAS_BUILD || process.env.CI);

const envFileName = `.env.${APP_PROJECT}.${APP_ENV}.local`;
const envPath = path.resolve(process.cwd(), envFileName);

if (fs.existsSync(envPath)) {
  require('dotenv').config({
    path: envPath,
  });
} else if (!isEasBuild) {
  throw new Error(
    `Missing env file: ${envFileName}. Set APP_PROJECT and APP_ENV to match an existing scoped env file.`
  );
}

/**
 * 2nd part: Define app identity variables from env
 * Such as: bundle id, package name, app name.
 */

const BUNDLE_ID = process.env.BUNDLE_ID; // ios bundle id
const PACKAGE = process.env.PACKAGE; // android package name
const NAME = process.env.NAME; // app name
const SLUG = process.env.SLUG; // app slug
const SCHEME = process.env.SCHEME; // app scheme

/**
 * 2nd part: Define your env variables schema
 * we use zod to define our env variables schema
 *
 * we split the env variables into two parts:
 *    1. client: These variables are used in the client-side code (`src` folder).
 *    2. buildTime: These variables are used in the build process (app.config.ts file). You can think of them as server-side variables.
 *
 * Main rules:
 *    1. If you need your variable on the client-side, you should add it to the client schema; otherwise, you should add it to the buildTime schema.
 *    2. Whenever you want to add a new variable, you should add it to the correct schema based on the previous rule, then you should add it to the corresponding object (_clientEnv or _buildTimeEnv).
 *
 * Note: `z.string()` means that the variable exists and can be an empty string, but not `undefined`.
 * If you want to make the variable required, you should use `z.string().min(1)` instead.
 * Read more about zod here: https://zod.dev/?id=strings
 *
 */

const client = z.object({
  APP_ENV: z.enum(['development', 'preview', 'production']),
  APP_PROJECT: z.enum(['base-app', 'binge-buddy']),
  NAME: z.string(),
  SCHEME: z.string(),
  SLUG: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),

  // ADD YOUR CLIENT ENV VARS HERE
  FIREBASE_API_KEY: z.string(),
  FIREBASE_ANDROID_APP_ID: z.string(),
  FIREBASE_IOS_APP_ID: z.string().optional(),
  FIREBASE_PROJECT_ID: z.string(),
  TMDB_API_URL: z.string(),
  TMDB_IMAGE_URL: z.string(),
  TMDB_API_KEY: z.string(),
  TMDB_ACCESS_TOKEN: z.string(),
});

const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string().optional(),
  EAS_PROJECT_ID: z.string().optional(),
  // ADD YOUR BUILD TIME ENV VARS HERE
  GOOGLE_SERVICES_FILE: z.string().optional(),
});

/**
 * @type {Record<keyof z.infer<typeof client> , unknown>}
 */
const _clientEnv = {
  APP_ENV,
  APP_PROJECT,
  NAME: NAME,
  SCHEME: SCHEME,
  SLUG: SLUG,
  BUNDLE_ID: BUNDLE_ID,
  PACKAGE: PACKAGE,
  VERSION: packageJSON.version,

  // ADD YOUR ENV VARS HERE TOO
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_ANDROID_APP_ID: process.env.FIREBASE_ANDROID_APP_ID,
  FIREBASE_IOS_APP_ID: process.env.FIREBASE_IOS_APP_ID,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  TMDB_API_URL: process.env.TMDB_API_URL,
  TMDB_IMAGE_URL: process.env.TMDB_IMAGE_URL,
  TMDB_API_KEY: process.env.TMDB_API_KEY,
  TMDB_ACCESS_TOKEN: process.env.TMDB_ACCESS_TOKEN,
};

/**
 * @type {Record<keyof z.infer<typeof buildTime> , unknown>}
 */
const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER: process.env.EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID,
  // ADD YOUR ENV VARS HERE TOO
  GOOGLE_SERVICES_FILE: process.env.GOOGLE_SERVICES_FILE,
};

/**
 * 3rd part: Merge and Validate your env variables
 * We use zod to validate our env variables based on the schema we defined above
 * If the validation fails we throw an error and log the error to the console with a detailed message about missed variables
 * If the validation passes we export the merged and parsed env variables to be used in the app.config.ts file as well as a ClientEnv object to be used in the client-side code
 **/
const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,

    `\n❌ Missing variables in ${envFileName}. Make sure all required variables are defined in ${envFileName} or provided through the EAS build environment.`,
    `\n💡 Tip: If you recently updated ${envFileName} and the error still persists, try restarting the server with the -c flag to clear the cache.`
  );
  throw new Error(
    'Invalid environment variables, Check terminal for more details '
  );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = {
  Env,
  ClientEnv,
};
