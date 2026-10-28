import { ROTATOR_THETA, SSM_EMOJI } from './backend';
import {
  captureScreen,
  expect,
  expectArrowRotation,
  test,
  themeUrl,
} from './harness';
import { THEMES } from './themes';

const QUESTION_COUNT = 5;

for (const theme of THEMES) {
  test.describe(`theme: ${theme.name}`, () => {
    test('Secret Message, choose an emoji', async ({ page }) => {
      await page.goto(themeUrl(theme, '/ssm/page1'));
      await expect(
        page.getByText('Choose a message to send to your friend!')
      ).toBeVisible();
      await captureScreen(page, theme, 'ssm1');
    });

    test('Secret Message, asking your friend', async ({ page }) => {
      // The request to the other computer is still on its way.
      await page.route('**/coordination/collect_follower', () => {});
      await page.goto(themeUrl(theme, '/ssm/page2'));
      await expect(page.getByText('Asking your friend to join.')).toBeVisible();
      await expect(page.getByText('Waiting for response...')).toBeVisible();
      await captureScreen(page, theme, 'ssm2-asking');
    });

    test('Secret Message, waiting for the response', async ({ page }) => {
      // The other computer has been asked and has not answered yet.
      await page.goto(themeUrl(theme, '/ssm/page2'));
      await expect(page.getByText('Asking your friend to join.')).toBeVisible();
      await expect(page.getByText('Waiting for response...')).toBeVisible();
      await captureScreen(page, theme, 'ssm2-waiting');
    });

    test('Secret Message, declined', async ({ page }) => {
      await page.route('**/coordination/collect_follower', (route) =>
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ accepted: false }),
        })
      );
      await page.goto(themeUrl(theme, '/ssm/page2'));
      await expect(
        page.getByText('Other computer has said no to playing the game')
      ).toBeVisible();
      await captureScreen(page, theme, 'ssm2-declined');
    });

    test('Secret Message, answer questions', async ({ page }) => {
      await page.goto(themeUrl(theme, '/ssm/page3?role=leader'));
      await expect(page.getByText('Question 1 of 5')).toBeVisible();
      await expect(
        page.getByText('The smallest quantity of light is a photon.')
      ).toBeVisible();
      // Unlike CHSH2's RotatorCircle, this page does not double the theta.
      await expectArrowRotation(page, ROTATOR_THETA);
      await captureScreen(page, theme, 'ssm3');
    });

    test('Measuring popup, Secret Message', async ({ page }) => {
      // Hold the submission open so the popup stays up for the screenshot.
      let respond!: () => void;
      const response = new Promise<void>((resolve) => (respond = resolve));
      await page.route('**/qkd/submit_selection_and_start*', async (route) => {
        await response;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            n_matching_bits: QUESTION_COUNT,
            n_total_bits: QUESTION_COUNT,
            emoji: SSM_EMOJI,
            role: 'leader',
          }),
        });
      });

      await page.goto(themeUrl(theme, '/ssm/page3?role=leader'));
      const submit = page.getByRole('button', { name: 'Submit' });
      for (let question = 1; question <= QUESTION_COUNT; question++) {
        await expect(
          page.getByText(`Question ${question} of ${QUESTION_COUNT}`)
        ).toBeVisible();
        await submit.click();
      }
      await expect(
        page.getByText('Your secret message is being encoded and transmitted')
      ).toBeVisible();
      await captureScreen(page, theme, 'measuring-ssm');
      respond();
    });

    test('Secret Message, perfect match', async ({ page }) => {
      await page.goto(
        themeUrl(
          theme,
          `/ssm/page4?success=true&n_matching_bits=5&n_total_bits=5&emoji=${encodeURIComponent(SSM_EMOJI)}&role=leader`
        )
      );
      await expect(page.getByText('Woo!! Hoo!!')).toBeVisible();
      await expect(
        page.getByText('You and your friend are in perfect sync!')
      ).toBeVisible();
      await expect(page.getByText('Matching bits: 5 / 5')).toBeVisible();
      await captureScreen(page, theme, 'ssm4-perfect');
    });

    test('Secret Message, partial match', async ({ page }) => {
      await page.goto(
        themeUrl(
          theme,
          `/ssm/page4?success=true&n_matching_bits=3&n_total_bits=5&emoji=${encodeURIComponent(SSM_EMOJI)}&role=leader`
        )
      );
      await expect(
        page.getByText(
          'You sent the message now. If it is too blurry you might need to agree on more questions.'
        )
      ).toBeVisible();
      await expect(page.getByText('Matching bits: 3 / 5')).toBeVisible();
      await captureScreen(page, theme, 'ssm4-partial');
    });

    test('Secret Message, error', async ({ page }) => {
      await page.goto(themeUrl(theme, '/ssm/page4?success=false'));
      await expect(
        page.getByText('There was an error, we will work on this.')
      ).toBeVisible();
      await captureScreen(page, theme, 'ssm4-error');
    });
  });
}
