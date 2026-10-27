import { defineConfig, devices } from '@playwright/test';

// Viewport matches the Halloween design boards (docs/design/halloween/canvas.json).
// Halloween screenshots, which have no baselines, go to tests/screens/halloween/.
export default defineConfig({
  testDir: 'tests/screens',
  use: {
    ...devices['Desktop Chrome'],
    viewport: { width: 1440, height: 980 },
  },
  expect: {
    toHaveScreenshot: { animations: 'disabled' },
  },
  projects: [{ name: 'chromium' }],
});
