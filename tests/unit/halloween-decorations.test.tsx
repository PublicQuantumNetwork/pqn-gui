import { render, screen } from '@testing-library/react';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import { Dialog } from '@mui/material';
import { readFileSync } from 'node:fs';

/**
 * The Halloween Decorations of group 2.2 through the real registry and
 * resolvers: with NEXT_PUBLIC_SEASONAL_THEME=halloween the home, qf1, qf2 and
 * measuring Scenes render the Decorations of their boards
 * (docs/design/halloween/Main, QF1, QF2 and Measuring.dc.html), and only
 * those Scenes. The env var is set in vi.hoisted so it is in place before
 * the pages are imported.
 */
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'halloween';
});

vi.mock('@/calls', async () => (await import('./backend-mocks')).callsMock());
vi.mock('@/hooks/useSSE', () => ({
  useSSE: () => ({
    lastMessage: sse.message,
    isConnected: true,
    error: null,
  }),
}));
vi.mock('@/hooks/WebSocketHook', async () =>
  (await import('./backend-mocks')).useWebSocketMock()
);
vi.mock('next/navigation', async () =>
  (await import('./backend-mocks')).navigationMock()
);

// Home renders the attract loop; disabled, it opens no display-command
// stream (and no EventSource exists under jsdom).
process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS = '0';

// The Measuring popup reads its progress from the SSE stream, so the mock
// hands it a fixed message per test.
const sse = vi.hoisted(() => ({
  message: null as null | { event: string; current: number; total: number },
}));

import Home from '@/app/page';
import QF1 from '@/app/qf/page1/page';
import QF2 from '@/app/qf/page2/page';
import ModalBox from '@/components/ModalBox';
import SSMModalBox from '@/components/SSMModalBox';
import { activeImages, knownThemes, type Scene } from '@/themes';

afterAll(() => {
  delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  vi.restoreAllMocks();
});

/**
 * The Measuring popup's geometry under test: a dialog and its progress bar,
 * as the browser would lay them out. The Decorations measure the real popup
 * (the two variants are different shapes), so the rects stand in for layout.
 */
const PAPER = {
  left: 420,
  top: 186,
  width: 600,
  height: 607,
};
const BAR = { left: 470, top: 287, width: 500, height: 4 };

function rectOf(box: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return {
    x: box.left,
    y: box.top,
    ...box,
    right: box.left + box.width,
    bottom: box.top + box.height,
    toJSON: () => ({}),
  } as DOMRect;
}

beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      if (this.getAttribute('role') === 'dialog') {
        return rectOf(PAPER);
      }
      if (this.getAttribute('role') === 'progressbar') {
        return rectOf(BAR);
      }
      return rectOf({ left: 0, top: 0, width: 0, height: 0 });
    }
  );
});

test('Halloween decorates the home, qf1, qf2 and measuring Scenes, and only those', () => {
  const decorated = ['home', 'qf1', 'qf2', 'measuring'] as const;
  const theme = knownThemes.halloween;
  for (const scene of decorated) {
    expect(
      theme.decorations?.[scene],
      `${scene} has Decorations`
    ).toBeDefined();
  }
  // The CHSH and SSM Scenes' Decorations come with groups 2.3 and 2.4.
  const later: Scene[] = [
    'chsh1',
    'chsh2',
    'chsh3-entangled',
    'chsh3-weak',
    'chsh3-error',
    'ssm1',
    'ssm2-asking',
    'ssm2-waiting',
    'ssm2-declined',
    'ssm3',
    'ssm4',
    'ssm4-perfect',
  ];
  for (const scene of later) {
    expect(theme.decorations?.[scene]).toBeUndefined();
  }
});

test('Home renders the Main board’s ambient set and both its monsters', () => {
  const { container } = render(<Home />);

  // The stage-anchored pieces, at the board's own placements.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(spider).not.toBeNull();
  expect(spider.style.right).toBe('3%');
  expect(spider.style.top).toBe('167px');
  // Main's spider hangs on a 150px thread and bobs on Main's own 3.2s.
  expect(spider.firstElementChild).toHaveStyle({ height: '150px' });
  expect(spider).toHaveStyle({ animationDuration: '3.2s' });

  // The ghost-and-pumpkin row under the game buttons, right-aligned with
  // them, the pumpkin 16px right of the ghost with their bottoms level.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost).not.toBeNull();
  expect(ghost.style.left).toBe('1096px');
  expect(ghost.style.top).toBe('633px');
  const pumpkins = container.querySelectorAll('svg[viewBox="0 0 120 104"]');
  expect(pumpkins).toHaveLength(2);
  // The small one beside the ghost, rendered before the pose pumpkin.
  const small = pumpkins[0] as HTMLElement;
  expect(small.style.left).toBe('1212px');
  expect(parseFloat(small.style.top)).toBe(
    parseFloat(ghost.style.top) + 120 - 73
  );

  // The board's two monsters.
  const peek = container.querySelector<HTMLElement>('.halloween-monster-peek')!;
  expect(peek).not.toBeNull();
  expect(peek.style.right).toBe('calc(7% + 42px)');
  // jsdom folds the stage offset into the board's own 4px.
  expect(peek.style.top).toBe('calc(171px)');
  const pop = container.querySelector<HTMLElement>('.halloween-monster-pop')!;
  expect(pop).not.toBeNull();
  expect(pop.style.left).toBe('calc(50% - 56px)');
  expect(pop.style.bottom).toBe('0px');

  // No other Scene's monster leaks onto the page.
  expect(container.querySelector('.halloween-monster-rise')).toBeNull();
  expect(container.querySelector('.halloween-monster-slide')).toBeNull();
});

test('QF1 renders the QF1 board’s spider and the rising monster behind the circle', () => {
  const { container } = render(<QF1 />);

  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(spider).not.toBeNull();
  // QF1's spider hangs at 41% from the left, on a 96px thread, bobbing 3.6s.
  expect(spider.style.left).toBe('41%');
  expect(spider.firstElementChild).toHaveStyle({ height: '96px' });
  expect(spider).toHaveStyle({ animationDuration: '3.6s' });

  // The rising monster, at its place behind the page's own circle.
  const rise = container.querySelector<HTMLElement>('.halloween-monster-rise')!;
  expect(rise).not.toBeNull();
  expect(rise.style.left).toBe('1026px');
  expect(rise.style.top).toBe('305px');

  // The QF1 board carries no ghost.
  expect(container.querySelector('.halloween-ghost')).toBeNull();
});

test('QF2 renders the QF2 board’s ghost, flickering pumpkin and sliding monster', () => {
  const { container } = render(<QF2 />);

  // The ghost beside the page's own circle, at the board's smaller size.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost).not.toBeNull();
  expect(ghost.style.left).toBe('682px');
  expect(ghost.style.top).toBe('263px');
  expect(ghost.getAttribute('width')).toBe('84');

  // The pumpkin under the pose, its face flickering as the QF2 board lights it.
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin).not.toBeNull();
  expect(pumpkin.querySelector('.halloween-flicker')).not.toBeNull();

  // The sliding monster, in from the bottom-right corner.
  const slide = container.querySelector<HTMLElement>(
    '.halloween-monster-slide'
  )!;
  expect(slide).not.toBeNull();
  expect(slide.style.right).toBe('0px');
  expect(slide.style.bottom).toBe('20px');

  // The QF2 board carries no spider.
  expect(container.querySelector('.halloween-spider')).toBeNull();
});

test('the Measuring popup renders the peeker over its top edge and the bat riding its bar', () => {
  sse.message = { event: 'rng_progress', current: 8, total: 16 };
  const { rerender } = render(
    <Dialog open>
      <ModalBox variant="rng" />
    </Dialog>
  );

  // The peeking monster hangs over the popup's top-right corner, 72px in
  // from the right edge with its bottom on the popup's top, as on the board.
  const peeker =
    document.querySelector<HTMLElement>('.halloween-peeker')!.parentElement!;
  expect(peeker.style.left).toBe(`${PAPER.left + PAPER.width - 72 - 96}px`);
  expect(peeker.style.top).toBe(`${PAPER.top - 70}px`);

  // The bat rides the real bar: its layer sits exactly on the bar, and the
  // bat itself is at the fill's leading edge (agent decision A7).
  const rider = document.querySelector<HTMLElement>('.halloween-bar-rider')!;
  expect(rider).not.toBeNull();
  expect(rider.parentElement!.style.left).toBe(`${BAR.left}px`);
  expect(rider.parentElement!.style.top).toBe(`${BAR.top}px`);
  expect(rider.parentElement!.style.width).toBe(`${BAR.width}px`);
  expect(rider.style.left).toBe('50%');
  expect(rider.style.top).toBe('-30px');
  expect(rider.style.transform).toBe('translateX(-50%)');

  // The bat's position follows the progress: at four-fifths of the run it
  // rides four-fifths along the bar.
  sse.message = { event: 'rng_progress', current: 12.8, total: 16 };
  rerender(
    <Dialog open>
      <ModalBox variant="rng" />
    </Dialog>
  );
  expect(
    document.querySelector<HTMLElement>('.halloween-bar-rider')!.style.left
  ).toBe('80%');
});

test('the SSM Measuring popup renders the peeker and no bat, there being no bar', () => {
  sse.message = null;
  render(
    <Dialog open maxWidth="md">
      <SSMModalBox />
    </Dialog>
  );

  expect(document.querySelector('.halloween-peeker')).not.toBeNull();
  expect(document.querySelector('.halloween-bar-rider')).toBeNull();
});

test('the Measuring popup keeps its text and swaps in the cauldron illustration', () => {
  sse.message = null;
  render(
    <Dialog open>
      <ModalBox variant="rng" />
    </Dialog>
  );

  // Decision 11: the popup's text is Fixed copy, unchanged by the theme.
  expect(
    screen.getByText('Photons are being measured back at the lab')
  ).toBeInTheDocument();
  expect(
    screen.getByText('What is really happening here?')
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      /The entangled photons are being measured at the first angle you chose/
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Scan the code for a full explanation\./)
  ).toBeInTheDocument();
  expect(screen.getByText('0% complete')).toBeInTheDocument();

  // The Images slot carries the cauldron, and it is the only image Halloween
  // sets (decision 8: the background and the Whobit poses stay today's).
  const illustration = screen.getByAltText(
    'Your photons in action!'
  ) as HTMLImageElement;
  expect(illustration.getAttribute('src')).toBe(
    '/images/measuring-cauldron.svg'
  );
  const images = activeImages(knownThemes.halloween);
  expect(images['measuring-illustration']).toBe(
    '/images/measuring-cauldron.svg'
  );
});

test('the cauldron is an SVG carrying its own animations and reduced-motion rule', () => {
  // Decision 11: the Measuring popup's illustration is one .svg file under
  // public/images/ with its animations and reduced-motion rule inside.
  const cauldron = readFileSync('public/images/measuring-cauldron.svg', 'utf8');
  for (const animation of [
    'pqn-orbit',
    'pqn-bubble',
    'pqn-flicker',
    'pqn-steam',
  ]) {
    expect(cauldron).toContain(`@keyframes ${animation}`);
  }
  expect(cauldron).toContain('@media (prefers-reduced-motion: reduce)');
});
