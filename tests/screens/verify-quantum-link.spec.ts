import { CHSH_ERROR, CHSH_VALUE } from './backend';
import {
  captureScreen,
  expect,
  expectArrowRotation,
  test,
  themeUrl,
} from './harness';
import { THEMES } from './themes';

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test('Verify Quantum Link, first page', async ({ page }) => {
      await page.goto(themeUrl(theme, '/chsh/page1'));
      await expect(
        page.getByText('Entangled photons are flying through the library.')
      ).toBeVisible();
      await captureScreen(page, theme, 'chsh1');
    });

    test('Verify Quantum Link, choose angles', async ({ page }) => {
      await page.goto(themeUrl(theme, '/chsh/page2'));
      await expect(
        page.getByText('Turn the wheel and press the button to choose')
      ).toBeVisible();
      await expectArrowRotation(page, 90);
      await captureScreen(page, theme, 'chsh2');
    });

    test('Verify Quantum Link, entangled photons', async ({ page }) => {
      await page.goto(
        themeUrl(
          theme,
          `/chsh/page3?fail=false&value=${CHSH_VALUE}&error=${CHSH_ERROR}`
        )
      );
      await expect(page.getByText('Woo!! Hoo!!')).toBeVisible();
      await expect(
        page.getByText(
          `Your value was ${CHSH_VALUE} with an error of ${CHSH_ERROR}`
        )
      ).toBeVisible();
      await captureScreen(page, theme, 'chsh3-entangled');
    });

    test('Verify Quantum Link, weak result', async ({ page }) => {
      await page.goto(
        themeUrl(theme, '/chsh/page3?fail=false&value=1.42&error=0.07')
      );
      await expect(
        page.getByText('Some angles are better than others for this test.')
      ).toBeVisible();
      await captureScreen(page, theme, 'chsh3-weak');
    });

    test('Verify Quantum Link, error', async ({ page }) => {
      await page.goto(themeUrl(theme, '/chsh/page3?fail=true'));
      await expect(
        page.getByText('There was an error, we will work on this.')
      ).toBeVisible();
      await captureScreen(page, theme, 'chsh3-error');
    });

    test('Measuring popup, Verify Quantum Link', async ({ page }) => {
      // Hold the measurement open so the popup stays up for the screenshot.
      let respond!: () => void;
      const response = new Promise<void>((resolve) => (respond = resolve));
      await page.route('**/chsh?*', async (route) => {
        await response;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            chsh_value: CHSH_VALUE,
            chsh_error: CHSH_ERROR,
          }),
        });
      });

      await page.goto(themeUrl(theme, '/chsh/page2'));
      const submit = page.getByRole('button', { name: 'Submit' });
      await submit.click();
      await expect(page.getByText('Great job!')).toBeVisible();
      await submit.click();
      await expect(
        page.getByText('Photons are being measured back at the lab')
      ).toBeVisible();
      await expect(page.getByText('50% complete')).toBeVisible();
      await captureScreen(page, theme, 'measuring-chsh');
      respond();
    });
  });
}
