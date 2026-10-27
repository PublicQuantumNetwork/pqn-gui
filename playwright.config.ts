import { defineConfig, devices } from '@playwright/test';
import {
  MOCK_API_ADDRESS,
  THEMES,
  type ThemeServer,
} from './tests/screens/themes';

// Viewport matches the Halloween design boards (docs/design/halloween/canvas.json).

/** Build and serve one theme with its own env, build directory and port. */
function themeServerCommand(theme: ThemeServer): string {
  const env = `NEXT_PUBLIC_API_ADDRESS=${MOCK_API_ADDRESS} BUILD_DIR=${theme.buildDir}`;
  // An unset NEXT_PUBLIC_SEASONAL_THEME is the Default Theme, so for such
  // themes it is unset explicitly rather than inherited from the environment.
  const themeEnv = theme.seasonalTheme
    ? `NEXT_PUBLIC_SEASONAL_THEME=${theme.seasonalTheme}`
    : 'env -u NEXT_PUBLIC_SEASONAL_THEME';
  const next = './node_modules/.bin/next';
  // `next build` rewrites the tracked next-env.d.ts to point at this build
  // directory, which would leave the tree dirty after a test run. Snapshot it
  // before the build and copy the committed bytes back afterwards whether or
  // not the build succeeded (a failed build must not start a stale server),
  // before `next start`, which does not need the file.
  const build =
    [
      'nextEnvSnapshot=$(mktemp)',
      'cp next-env.d.ts "$nextEnvSnapshot"',
      `${themeEnv} ${env} ${next} build`,
    ].join(' && ') +
    '; ' +
    [
      'buildStatus=$?',
      'cp "$nextEnvSnapshot" next-env.d.ts',
      'rm -f "$nextEnvSnapshot"',
      'exit "$buildStatus"',
    ].join('; ');
  return `( ${build} ) && ${themeEnv} ${env} ${next} start -p ${theme.port} -H 127.0.0.1`;
}

export default defineConfig({
  testDir: 'tests/screens',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 980 },
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled' },
  },
  // Screenshots are named "<theme>/<screen>.png" (see captureScreen), so the
  // Default baselines live in tests/screens/default/ and a theme without
  // baselines is captured into tests/screens/<theme>/ (gitignored).
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  projects: [{ name: 'chromium' }],
  webServer: THEMES.map((theme) => ({
    url: `http://127.0.0.1:${theme.port}/`,
    command: themeServerCommand(theme),
    // The build is part of the wait: give it room.
    timeout: 300_000,
    // Always rebuild and restart: a reused server could be running a stale
    // build of src/, silently voiding the baseline comparison.
    reuseExistingServer: false,
  })),
});
