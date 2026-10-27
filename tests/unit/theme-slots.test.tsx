import { render, screen } from '@testing-library/react';
import { useTheme } from '@mui/material/styles';
import { expect, test, vi } from 'vitest';

/**
 * Sentinel theme parts: every reader must render what the active theme
 * provides, not today's Default values, so a reader that hardcodes a path
 * or a colour fails here. tests/unit/theme-images.test.tsx holds the
 * matching default-value tests.
 */
const sentinels = vi.hoisted(() => ({
  background: '/images/test-background.svg',
  'whobit-right-wing-up': '/images/test-whobit-right-wing-up.svg',
  'whobit-arms-up': '/images/test-whobit-arms-up.svg',
  'whobit-arms-down': '/images/test-whobit-arms-down.svg',
  'measuring-illustration': '/images/test-measuring-illustration.svg',
  primaryMain: '#102030',
}));

vi.mock('@/themes', async () => {
  const { createTheme } = await import('@mui/material/styles');
  return {
    activeImages: () => ({
      background: sentinels.background,
      'whobit-right-wing-up': sentinels['whobit-right-wing-up'],
      'whobit-arms-up': sentinels['whobit-arms-up'],
      'whobit-arms-down': sentinels['whobit-arms-down'],
      'measuring-illustration': sentinels['measuring-illustration'],
    }),
    activeMuiTheme: () =>
      createTheme({ palette: { primary: { main: sentinels.primaryMain } } }),
  };
});
vi.mock('@/hooks/useSSE', async () =>
  (await import('./backend-mocks')).useSSEMock()
);
vi.mock('next/navigation', async () =>
  (await import('./backend-mocks')).navigationMock()
);

import RootLayout from '@/app/layout';
import ModalBox from '@/components/ModalBox';
import SSMModalBox from '@/components/SSMModalBox';
import Whobit from '@/components/Whobit';

test('Whobit renders the active theme’s image for each pose', () => {
  const { rerender } = render(<Whobit variant="right-wing-up">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    sentinels['whobit-right-wing-up']
  );
  rerender(<Whobit variant="arms-up">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    sentinels['whobit-arms-up']
  );
  rerender(<Whobit variant="arms-down">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    sentinels['whobit-arms-down']
  );
});

test('the Measuring popup renders the active theme’s measuring illustration', () => {
  render(<ModalBox />);
  expect(
    screen.getByRole('img', { name: 'Your photons in action!' })
  ).toHaveAttribute('src', sentinels['measuring-illustration']);
});

test('the SSM Measuring popup renders the active theme’s measuring illustration', () => {
  render(<SSMModalBox />);
  expect(
    screen.getByRole('img', { name: 'Your photons in action!' })
  ).toHaveAttribute('src', sentinels['measuring-illustration']);
});

/** Reads the active theme off MUI's ThemeProvider context. */
function ThemeProbe() {
  const theme = useTheme();
  return (
    <div data-testid="theme-probe" data-primary={theme.palette.primary.main} />
  );
}

/** All CSS the document carries, whether Emotion writes tags or sheet rules. */
function documentCss(): string {
  const tags = Array.from(document.querySelectorAll('style'))
    .map((tag) => tag.textContent ?? '')
    .join('\n');
  const rules = Array.from(document.styleSheets)
    .flatMap((sheet) => {
      try {
        return Array.from(sheet.cssRules).map((rule) => rule.cssText);
      } catch {
        return [];
      }
    })
    .join('\n');
  return `${tags}\n${rules}`;
}

test('the layout uses the active theme’s background and Palette', () => {
  render(
    <RootLayout>
      <ThemeProbe />
    </RootLayout>
  );

  // The background Box renders the Images slot's background.
  expect(documentCss()).toContain(`url(${sentinels.background})`);

  // The ThemeProvider hands the active theme's Palette to the tree.
  expect(screen.getByTestId('theme-probe')).toHaveAttribute(
    'data-primary',
    sentinels.primaryMain
  );
});
