import { FOLLOW_REQUEST_MESSAGE } from './backend';
import { captureScreen, expect, test, themeUrl } from './harness';
import { THEMES, type ThemeServer } from './themes';

/** The Home greeting's first line is Flavour copy (decision 13): each theme
 * waits for its own line before the screenshot is captured. */
const homeGreeting: Record<ThemeServer['name'], string> = {
  default: 'Hi, Quantum Adventurer!',
  halloween: 'Happy Halloween, Quantum Adventurer!',
};

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test('Home', async ({ page }) => {
      await page.goto(themeUrl(theme, '/'));
      await expect(page.getByText(homeGreeting[theme.name])).toBeVisible();
      // The game buttons are rendered as links (component="a").
      await expect(
        page.getByRole('link', {
          name: 'Verify Quantum Link (single player)',
        })
      ).toBeEnabled();
      await captureScreen(page, theme, 'home');
    });

    test('Home, friend-invite popup', async ({ page, backend }) => {
      await page.goto(themeUrl(theme, '/'));
      await expect(page.getByText(homeGreeting[theme.name])).toBeVisible();
      await backend.emitFollowRequest(FOLLOW_REQUEST_MESSAGE);
      await expect(page.getByText(FOLLOW_REQUEST_MESSAGE)).toBeVisible();
      await expect(page.getByRole('button', { name: 'Accept' })).toBeVisible();
      await captureScreen(page, theme, 'home-friend-invite');
    });
  });
}
