import { captureScreen, expect, test, themeUrl } from './harness';
import { THEMES } from './themes';

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test('Quantum Fortune, first page', async ({ page }) => {
      await page.goto(themeUrl(theme, '/qf/page1'));
      await expect(
        page.getByText(
          'Press the red button seven times to generate your fortune.'
        )
      ).toBeVisible();
      await captureScreen(page, theme, 'qf1');
    });

    test('Quantum Fortune, a fortune', async ({ page }) => {
      // Fortune #3 (the mocked /rng/fortune returns [2] and the GUI adds 1).
      await page.goto(themeUrl(theme, '/qf/page2?fail=false&value=3'));
      await expect(page.getByText('Your fortune is...')).toBeVisible();
      await expect(page.getByText('#3')).toBeVisible();
      await captureScreen(page, theme, 'qf2-fortune');
    });

    test('Quantum Fortune, error', async ({ page }) => {
      await page.goto(themeUrl(theme, '/qf/page2?fail=true'));
      await expect(
        page.getByText('There was an error, we will work on this.')
      ).toBeVisible();
      await captureScreen(page, theme, 'qf2-error');
    });

    test('Measuring popup, Quantum Fortune', async ({ page }) => {
      // Hold the fortune response open so the popup stays up for the screenshot.
      let respond!: () => void;
      const response = new Promise<void>((resolve) => (respond = resolve));
      await page.route('**/rng/fortune*', async (route) => {
        await response;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: '[2]',
        });
      });

      await page.goto(themeUrl(theme, '/qf/page1'));
      const submit = page.getByRole('button', { name: 'Submit' });
      for (let press = 1; press <= 7; press++) {
        await submit.click();
        // The counter shows which press the page has registered so far.
        if (press < 7)
          await expect(page.locator('h1')).toHaveText(String(press + 1));
      }
      await expect(
        page.getByText('Photons are being measured back at the lab')
      ).toBeVisible();
      await expect(page.getByText('50% complete')).toBeVisible();
      await captureScreen(page, theme, 'measuring-qf');
      respond();
    });
  });
}
