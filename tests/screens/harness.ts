import { expect, test as base, type Page } from '@playwright/test';
import { installBackendMocks, type MockBackend } from './backend';
import { BASELINE_THEMES, type ThemeServer } from './themes';

/** URL of a path on the theme's own server (one web server per theme). */
export function themeUrl(theme: ThemeServer, path: string): string {
  return `http://127.0.0.1:${theme.port}${path}`;
}

/**
 * Capture one screen of one theme.
 *
 * The Default Theme is compared with the committed Default baselines
 * (decision 15): any difference fails. A theme without baselines is captured
 * without comparison into tests/screens/&lt;theme&gt;/ (gitignored) for the
 * design checker to review against the design boards.
 */
export async function captureScreen(
  page: Page,
  theme: ThemeServer,
  screen: string
): Promise<void> {
  // Stable wait: the self-hosted fonts must be in before pixels are compared.
  await page.evaluate(() => document.fonts.ready);
  if (BASELINE_THEMES.has(theme.name)) {
    await expect(page).toHaveScreenshot([theme.name, `${screen}.png`]);
  } else {
    // The same animation setting toHaveScreenshot compares with, so every
    // theme's capture freezes CSS animations the same way.
    await page.screenshot({
      path: `tests/screens/${theme.name}/${screen}.png`,
      animations: 'disabled',
    });
  }
}

/**
 * Stable wait for the rotator arrow: it follows the fixed theta the mocked
 * backend reports, polled every 100 ms, so wait for the computed rotation
 * rather than for time to pass.
 */
export async function expectArrowRotation(
  page: Page,
  degrees: number
): Promise<void> {
  await expect
    .poll(
      async () =>
        page.evaluate(() => {
          const arrow = document.querySelector<HTMLElement>(
            '[data-polarization-arrow]'
          );
          if (!arrow) return null;
          const transform = getComputedStyle(arrow).transform;
          const match = transform.match(/^matrix\(([-\d.e]+), ([-\d.e]+),/);
          if (!match) return transform === 'none' ? 0 : null;
          return Math.round(
            (Math.atan2(Number(match[2]), Number(match[1])) * 180) / Math.PI
          );
        }),
      { timeout: 10_000 }
    )
    .toBe(degrees);
}

/**
 * The screenshot-test fixture: every test gets a page whose backend is mocked
 * by route interception (HTTP, SSE and the WebSocket).
 */
export const test = base.extend<{ backend: MockBackend }>({
  backend: [
    async ({ page }, use) => {
      use(await installBackendMocks(page));
    },
    { auto: true },
  ],
});

export { expect };
