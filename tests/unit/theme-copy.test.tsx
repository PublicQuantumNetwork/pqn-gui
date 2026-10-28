import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

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
    // The QF2 and CHSH3 pages read their result from the search params.
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
import { activeFlavourCopy, activeFortune, getActiveTheme } from '@/themes';

test('the Default Theme renders today’s Flavour copy on Home', () => {
  render(<Home />);

  expect(screen.getByText('Hi, Quantum Adventurer!')).toBeInTheDocument();
  expect(screen.getByText("I'm Whobit.")).toBeInTheDocument();
  expect(screen.getByText('What would you like to do?')).toBeInTheDocument();
});

test('the Default Theme renders no QF1 lead-in before the instruction', () => {
  render(<QF1 />);

  const instruction = screen.getByText(
    'Press the red button seven times to generate your fortune.'
  );
  // The speech bubble holds the instruction and nothing else: no empty
  // lead-in element either.
  expect(instruction.parentElement?.children).toHaveLength(1);
});

test('the Default Theme renders today’s fortune and no QF2 lead-in', () => {
  searchParams.current = new URLSearchParams('value=3&fail=false');
  render(<QF2 />);

  expect(screen.getByText('Your fortune is...')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Entangled particles are everywhere, so are we ever really alone?'
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText('Your fortune is...').parentElement?.children
  ).toHaveLength(1);
});

test('the Default Theme renders no CHSH3 line under an entangled result', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  render(<CHSH3 />);

  // The results circle holds today’s two texts and nothing else: no empty
  // line element either.
  const circle = screen.getByText(
    /show the photons are entangled/
  ).parentElement;
  expect(circle?.children).toHaveLength(2);
});

test('the Default Theme’s Flavour copy slots are today’s text', () => {
  const copy = activeFlavourCopy(getActiveTheme(undefined));

  expect(copy['home-greeting-first-line']).toBe('Hi, Quantum Adventurer!');
  expect(copy['home-greeting-last-line']).toBe('What would you like to do?');
  // Today there is no QF1 or QF2 lead-in and no CHSH3 line at all.
  expect(copy['qf1-lead-in']).toBeUndefined();
  expect(copy['qf2-lead-in']).toBeUndefined();
  expect(copy['chsh3-entangled-line']).toBeUndefined();
});

test('a theme overriding fortune 2 changes only fortune 2', () => {
  const theme = { flavourCopy: { fortunes: { 2: 'SENTINEL fortune two' } } };

  expect(activeFortune(2, theme)).toBe('SENTINEL fortune two');
  expect(activeFortune(1, theme)).toBe(
    'Is everything random? Or is it just a matter of your quantum interpretation?'
  );
  expect(activeFortune(3, theme)).toBe(
    'Entangled particles are everywhere, so are we ever really alone?'
  );
});

test('a theme setting one Flavour copy slot keeps every other Default text', () => {
  const copy = activeFlavourCopy({
    flavourCopy: { 'home-greeting-first-line': 'SENTINEL greeting' },
  });

  expect(copy['home-greeting-first-line']).toBe('SENTINEL greeting');
  expect(copy['home-greeting-last-line']).toBe('What would you like to do?');
  expect(copy['qf1-lead-in']).toBeUndefined();
  expect(copy['qf2-lead-in']).toBeUndefined();
  expect(copy['chsh3-entangled-line']).toBeUndefined();
});
