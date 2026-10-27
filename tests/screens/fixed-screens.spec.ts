import { captureScreen, expect, test, themeUrl } from './harness';
import { THEMES } from './themes';

// The survey page's timeout (src/app/survey/page.tsx): 5 minutes until the
// timeout card appears.
const SURVEY_TIMEOUT_MS = 5 * 60 * 1000;

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test('Maintenance', async ({ page }) => {
      await page.goto(themeUrl(theme, '/maintenance'));
      await expect(
        page.getByText('All games are in maintenance mode')
      ).toBeVisible();
      await captureScreen(page, theme, 'maintenance');
    });

    test('Survey', async ({ page }) => {
      await page.goto(themeUrl(theme, '/survey'));
      await expect(
        page.getByText('Please take a moment to fill out this short survey.')
      ).toBeVisible();
      await expect(
        page.frameLocator('iframe').getByText('Survey form (mock)')
      ).toBeVisible();
      await captureScreen(page, theme, 'survey');
    });

    test('Timeout card', async ({ page }) => {
      // Fake time drives the survey page's 5-minute timeout; the clock pauses
      // once the card is up, freezing its countdown for the screenshot.
      const start = Date.now();
      await page.clock.install({ time: start });
      await page.goto(themeUrl(theme, '/survey'));
      await expect(
        page.getByText('Please take a moment to fill out this short survey.')
      ).toBeVisible();
      // The survey text is server-rendered, but the timeout timer is only
      // scheduled once React hydrates. Next.js App Router mounts its route
      // announcer (a <next-route-announcer> element) from an effect in the
      // same commit, so waiting for it proves the timer exists before the
      // clock jumps past the 5-minute deadline.
      await page.waitForSelector('next-route-announcer', {
        state: 'attached',
      });
      // The fake clock keeps running after install(), so the timer was
      // scheduled at hydration time, not at `start`: pause relative to the
      // page's own now, read after the wait above.
      const hydratedAt = await page.evaluate(() => Date.now());
      await page.clock.pauseAt(hydratedAt + SURVEY_TIMEOUT_MS + 500);
      await expect(page.getByText('Still there?')).toBeVisible();
      await captureScreen(page, theme, 'timeout-card');
    });
  });
}
