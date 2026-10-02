#!/usr/bin/env node

const { spawn } = require('child_process');

const validProjects = new Set(['base-app', 'binge-buddy', 'travel-buddy']);
const validEnvs = new Set(['development', 'preview', 'production']);

const args = process.argv.slice(2);

let projectFromArg;
let envFromArg;

if (args[0] && validProjects.has(args[0])) {
  projectFromArg = args.shift();
}

if (args[0] && validEnvs.has(args[0])) {
  envFromArg = args.shift();
}

const dryRunIndex = args.indexOf('--dry-run');
const isDryRun = dryRunIndex !== -1;

if (isDryRun) {
  args.splice(dryRunIndex, 1);
}

const childEnv = {
  ...process.env,
  EXPO_NO_DOTENV: '1',
};

if (projectFromArg) {
  childEnv.APP_PROJECT = projectFromArg;
}

if (envFromArg) {
  childEnv.APP_ENV = envFromArg;
}

if (isDryRun) {
  console.log(
    JSON.stringify(
      {
        APP_PROJECT: childEnv.APP_PROJECT,
        APP_ENV: childEnv.APP_ENV,
        command: ['expo', 'start', ...args].join(' '),
      },
      null,
      2
    )
  );
  process.exit(0);
}

const child = spawn('expo', ['start', ...args], {
  stdio: 'inherit',
  env: childEnv,
  shell: process.platform === 'win32',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});
