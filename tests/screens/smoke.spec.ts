import { expect, test } from '@playwright/test';

test('launches Chromium at the board size', async ({ page }) => {
  await page.setContent('<p>Hi, Quantum Adventurer!</p>');
  expect(page.viewportSize()).toEqual({ width: 1440, height: 980 });
  await expect(page.getByText('Hi, Quantum Adventurer!')).toBeVisible();
});
