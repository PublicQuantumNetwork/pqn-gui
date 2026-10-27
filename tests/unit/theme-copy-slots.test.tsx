import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

/**
 * Sentinel Flavour copy: every reader must render what the active theme
 * provides, not today's Default text, so a reader that hardcodes a string
 * fails here. tests/unit/theme-copy.test.tsx holds the matching
 * default-value tests.
 */
const sentinels = vi.hoisted(() => ({
  flavourCopy: {
    'home-greeting-first-line': 'Happy Sentinel, Quantum Adventurer!',
    'home-greeting-last-line': 'Pick a sentinel… if you dare!',
    'qf1-lead-in': 'Gaze into my sentinel ball…',
    'qf2-lead-in': 'The sentinels have spoken…',
    fortunes: { 2: 'Sentinel fortune two.' },
    'chsh3-entangled-line': 'sentinel action at a distance',
  },
}));

vi.mock('@/themes', async () => {
  const actual = await vi.importActual<typeof import('@/themes')>('@/themes');
  return {
    ...actual,
    // The pages read a test theme through the real resolvers, so these
    // tests exercise the same merge the registry's themes get.
    activeFlavourCopy: () =>
      actual.activeFlavourCopy({ flavourCopy: sentinels.flavourCopy }),
    activeFortune: (fortuneNumber: number) =>
      actual.activeFortune(fortuneNumber, {
        flavourCopy: sentinels.flavourCopy,
      }),
  };
});
vi.mock('@/calls', async () => (await import('./backend-mocks')).callsMock());
vi.mock('@/hooks/useSSE', async () =>
  (await import('./backend-mocks')).useSSEMock()
);
vi.mock('@/hooks/WebSocketHook', async () =>
  (await import('./backend-mocks')).useWebSocketMock()
);
vi.mock('next/navigation', async () => {
  const navigation = (await import('./backend-mocks')).navigationMock();
  return {
    ...navigation,
    useSearchParams: () => searchParams.current,
  };
});

// Home renders the attract loop; disabled, it opens no display-command
// stream (and no EventSource exists under jsdom).
process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS = '0';

const searchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

import Home from '@/app/page';
import CHSH3 from '@/app/chsh/page3/page';
import QF1 from '@/app/qf/page1/page';
import QF2 from '@/app/qf/page2/page';

test('Home renders the theme’s greeting lines around the fixed Whobit line', () => {
  render(<Home />);

  expect(
    screen.getByText(sentinels.flavourCopy['home-greeting-first-line'])
  ).toBeInTheDocument();
  expect(screen.getByText("I'm Whobit.")).toBeInTheDocument();
  expect(
    screen.getByText(sentinels.flavourCopy['home-greeting-last-line'])
  ).toBeInTheDocument();
  expect(screen.queryByText('Hi, Quantum Adventurer!')).not.toBeInTheDocument();
});

test('QF1 renders the theme’s lead-in before the fixed instruction', () => {
  render(<QF1 />);

  const leadIn = screen.getByText(sentinels.flavourCopy['qf1-lead-in']);
  const instruction = screen.getByText(
    'Press the red button seven times to generate your fortune.'
  );
  expect(
    leadIn.compareDocumentPosition(instruction) &
      Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(instruction.parentElement?.children).toHaveLength(2);
});

test('QF2 renders the theme’s lead-in before "Your fortune is..."', () => {
  searchParams.current = new URLSearchParams('value=2&fail=false');
  render(<QF2 />);

  const leadIn = screen.getByText(sentinels.flavourCopy['qf2-lead-in']);
  const fortuneIs = screen.getByText('Your fortune is...');
  expect(
    leadIn.compareDocumentPosition(fortuneIs) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
  expect(fortuneIs.parentElement?.children).toHaveLength(2);
});

test('QF2 renders the theme’s fortune for a number and today’s for the others', () => {
  searchParams.current = new URLSearchParams('value=2&fail=false');
  const { unmount } = render(<QF2 />);
  expect(
    screen.getByText(sentinels.flavourCopy.fortunes[2])
  ).toBeInTheDocument();
  expect(
    screen.queryByText(
      'Quantum means smallest quantity. You cannot be any less than what you are.'
    )
  ).not.toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams('value=3&fail=false');
  render(<QF2 />);
  expect(
    screen.getByText(
      'Entangled particles are everywhere, so are we ever really alone?'
    )
  ).toBeInTheDocument();
});

test('the theme’s QF2 lead-in stays off the error screen', () => {
  searchParams.current = new URLSearchParams('value=2&fail=true');
  render(<QF2 />);

  expect(
    screen.getByText(/There was an error, we will work on this/)
  ).toBeInTheDocument();
  expect(
    screen.queryByText(sentinels.flavourCopy['qf2-lead-in'])
  ).not.toBeInTheDocument();
  // The error screen shows no fortune text the lead-in could precede.
  expect(screen.queryByText('Your fortune is...')).not.toBeInTheDocument();
});

test('CHSH3 renders the theme’s line under an entangled result', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  render(<CHSH3 />);

  expect(
    screen.getByText(sentinels.flavourCopy['chsh3-entangled-line'])
  ).toBeInTheDocument();
  const circle = screen.getByText(
    /show the photons are entangled/
  ).parentElement;
  expect(circle?.children).toHaveLength(3);
});

test('the theme’s CHSH3 line stays off a weak result and an error', () => {
  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const { unmount } = render(<CHSH3 />);
  expect(
    screen.getByText(/Some angles are better than others/)
  ).toBeInTheDocument();
  expect(
    screen.queryByText(sentinels.flavourCopy['chsh3-entangled-line'])
  ).not.toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  render(<CHSH3 />);
  expect(
    screen.getByText(/There was an error, we will work on this/)
  ).toBeInTheDocument();
  expect(
    screen.queryByText(sentinels.flavourCopy['chsh3-entangled-line'])
  ).not.toBeInTheDocument();
});
