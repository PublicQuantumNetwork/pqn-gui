import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';
import { Dialog } from '@mui/material';
import { readFileSync } from 'node:fs';

/**
 * The Halloween Decorations of groups 2.2-2.3 through the real registry and
 * resolvers: with NEXT_PUBLIC_SEASONAL_THEME=halloween the home, qf1, qf2,
 * measuring and CHSH Scenes render the Decorations of their boards
 * (docs/design/halloween/Main, QF1, QF2, Measuring, CHSH1, CHSH2 and the
 * CHSH3 boards), and only those Scenes. Every piece is placed against the
 * page element its board ties it to, as the page lays that element out
 * (agent decision A8), so the tests hand each anchor a box (probed from the
 * real pages at the boards' 1440x980) and follow the pieces as the anchors
 * move. The env var is set in vi.hoisted so it is in place before the pages
 * are imported.
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
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/',
  useSearchParams: () => searchParams.current,
}));

// Home renders the attract loop; disabled, it opens no display-command
// stream (and no EventSource exists under jsdom).
process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS = '0';

// The Measuring popup reads its progress from the SSE stream, so the mock
// hands it a fixed message per test.
const sse = vi.hoisted(() => ({
  message: null as null | { event: string; current: number; total: number },
}));

// The CHSH3 page picks its Scene from its search params, so the mock hands
// them per test.
const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const searchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

import Home from '@/app/page';
import RootLayout from '@/app/layout';
import QF1 from '@/app/qf/page1/page';
import QF2 from '@/app/qf/page2/page';
import CHSH1 from '@/app/chsh/page1/page';
import CHSH2 from '@/app/chsh/page2/page';
import CHSH3 from '@/app/chsh/page3/page';
import ModalBox from '@/components/ModalBox';
import SSMModalBox from '@/components/SSMModalBox';
import {
  Pumpkin,
  ballCircle,
  type BallCircle,
} from '@/themes/halloween/decorations/ambient';
import { MonsterRise } from '@/themes/halloween/decorations/monsters';
import { type ElementBox } from '@/themes/halloween/decorations/useElementBox';
import { activeImages, knownThemes } from '@/themes';

afterAll(() => {
  delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

/** A plain box, as an element lays it out. */
interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const box = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
});

function rectOf(box: Box): DOMRect {
  return {
    x: box.left,
    y: box.top,
    ...box,
    right: box.left + box.width,
    bottom: box.top + box.height,
    toJSON: () => ({}),
  } as DOMRect;
}

/** The anchors' boxes on the real pages at the boards' 1440x980 (probed):
 *  the stage (the layout's 60vh content box), the Home game buttons and
 *  Whobit's pose, the QF1 bubble and ball, and the Measuring popup's dialog,
 *  bar and title. */
const STAGE = box(0, 167, 1440, 588);
const HOME = {
  chsh: box(794, 199, 502, 115),
  qf: box(794, 334, 502, 115),
  ssm: box(794, 509, 502, 115),
  pose: box(144, 459, 288, 358),
};
const QF = {
  bubble: box(144, 245, 500, 250),
  ball: box(794, 239, 560, 560),
  pose: box(144, 505, 288, 358),
};
const MEASURING = {
  dialog: box(270, 190, 900, 600),
  progressbar: box(320, 291, 800, 4),
  'measuring-title': box(320, 240, 800, 35),
};
/** The CHSH pages' anchors at the boards' 1440x980 (probed): Whobit's bubble
 *  and pose, CHSH1's Next button, CHSH2's wheel and CHSH3's results circle.
 *  The GUI lays the bubble and the pose right of the boards' stage, and the
 *  results circle hangs below the content box's bottom edge. */
const CHSH = {
  chsh1: {
    bubble: box(144, 199, 500, 250),
    pose: box(144, 459, 288, 358),
    next: box(1342, 601, 154, 96),
  },
  chsh2: {
    bubble: box(144, 205, 500, 250),
    pose: box(144, 465, 288, 358),
    wheel: box(756, 199, 560, 560),
    wheelD: box(1202.2, 281, 26, 60),
  },
  chsh3: {
    bubble: box(144, 199, 500, 250),
    pose: box(144, 459, 288, 358),
    circle: box(774, 199, 560, 560),
  },
};

/** The anchors' boxes for the current render, keyed by data attribute (or,
 *  for the Measuring popup, by role); each box stands in for layout. */
const anchors: { current: Record<string, Box> } = { current: {} };

/**
 * A stub ResizeObserver: records every instance and everything each instance
 * observes, so a test can fire the callbacks by hand — the trigger the real
 * browser fires when an element re-lays out (the Measuring popup growing as
 * its QR image loads), which jsdom has none of — and prove what was watched.
 */
class ResizeObserverStub {
  static instances: ResizeObserverStub[] = [];
  callback: ResizeObserverCallback;
  observed: Element[] = [];
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    ResizeObserverStub.instances.push(this);
  }
  observe(element: Element) {
    this.observed.push(element);
  }
  unobserve(element: Element) {
    this.observed = this.observed.filter((observed) => observed !== element);
  }
  disconnect() {
    this.observed = [];
  }
}

beforeAll(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const name = this.getAttribute('data-decoration-anchor');
      if (name && name in anchors.current) {
        return rectOf(anchors.current[name]);
      }
      const role = this.getAttribute('role');
      if (role && role in anchors.current) {
        return rectOf(anchors.current[role]);
      }
      return rectOf(box(0, 0, 0, 0));
    }
  );
});

function setAnchors(next: Record<string, Box>) {
  anchors.current = next;
}

/**
 * The ball's mist is drawn whole, with no box cut out of it: the page's own
 * text on the ball (QF1's counter, QF2's fortune) sits above the Decorations
 * layer instead, so the mist passes behind it as on the boards. Returns the
 * mist's svg.
 */
function expectWholeMist(container: HTMLElement): Element {
  const mistSvg = container.querySelector('.halloween-mist')!.closest('svg')!;
  expect(mistSvg.querySelector('path[clip-rule="evenodd"]')).toBeNull();
  return mistSvg;
}

/** The page's own text sits above the Decorations layer (its zIndex 999). */
function expectAboveDecorations(element: Element) {
  expect(Number(getComputedStyle(element).zIndex)).toBeGreaterThan(999);
}

/**
 * Renders a page with its stage anchor: the layout, which carries that
 * anchor (the content box), is not part of these tests, so the anchor
 * element stands in for it and the patched rects give it its box.
 */
function renderPage(node: React.ReactElement) {
  return render(
    <>
      <div data-decoration-anchor="stage" />
      {node}
    </>
  );
}

/** The stage-relative left of a piece the board places at `right` of the
 *  stage, as the Scenes compute it. */
function stageLeft(stage: ElementBox, right: number): number {
  return stage.right - stage.width * right - 0;
}

/** The box of the GUI's own ball (the QF pages' circle.png drawing). */
function ballOf(ball: Box): BallCircle {
  return ballCircle(rectOf(ball));
}

test('Halloween decorates the home, qf, measuring, CHSH and SSM Scenes, and only those', () => {
  const decorated = [
    'home',
    'qf1',
    'qf2',
    'measuring',
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
  ] as const;
  const theme = knownThemes.halloween;
  for (const scene of decorated) {
    expect(
      theme.decorations?.[scene],
      `${scene} has Decorations`
    ).toBeDefined();
  }
});

test('Home renders the Main board’s ambient set and both its monsters', () => {
  setAnchors({
    stage: STAGE,
    'home-button-chsh': HOME.chsh,
    'home-button-qf': HOME.qf,
    'home-button-ssm': HOME.ssm,
    'whobit-pose': HOME.pose,
  });
  const { container } = renderPage(<Home />);

  // The stage-anchored pieces, at the board's own stage placements.
  const stage = rectOf(STAGE) as unknown as ElementBox;
  const web = container.querySelector('svg[viewBox="0 0 200 200"]')!;
  expect(web.parentElement).toHaveStyle({ left: '0px', top: '167px' });

  // The ghost-and-pumpkin row under the game buttons, right-aligned with
  // them, the pumpkin 16px right of the ghost with their bottoms level 8px
  // under the last button.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost).not.toBeNull();
  expect(ghost.style.left).toBe(`${HOME.chsh.left + HOME.chsh.width - 200}px`);
  expect(ghost.style.top).toBe(`${HOME.ssm.top + HOME.ssm.height + 8}px`);
  const small = container.querySelector('svg[viewBox="0 0 120 104"]');
  expect(small).not.toBeNull();
  expect(small!.style.left).toBe(`${HOME.chsh.left + HOME.chsh.width - 84}px`);
  expect(parseFloat(small!.style.top)).toBe(
    HOME.ssm.top + HOME.ssm.height + 8 + 120 - 73
  );
  // Main's board lights the small pumpkin's face steady, so it never
  // flickers here (CHSH3's board flickers its own).
  expect(small!.querySelector('.halloween-flicker')).toBeNull();

  // The pumpkin under Whobit's pose, at the board's own place beside the
  // pose box — its board spot sits below the stage's bottom edge (where the
  // pose's feet are already cut off), so it is clamped to rest its base on
  // that edge, beside the visible owl, next to the small pumpkin.
  const pumpkins = container.querySelectorAll('svg[viewBox="0 0 120 104"]');
  expect(pumpkins).toHaveLength(2);
  expect(pumpkins[0].style.left).toBe(
    `${HOME.chsh.left + HOME.chsh.width - 84}px`
  );
  const posePumpkin = pumpkins[1].parentElement as HTMLElement;
  expect(posePumpkin.style.left).toBe(`${HOME.pose.left + 258}px`);
  expect(posePumpkin.style.top).toBe(
    `${Math.min(HOME.pose.top + 340, STAGE.top + STAGE.height - 104)}px`
  );
  expect(parseFloat(posePumpkin.style.top) + 104).toBeLessThanOrEqual(
    STAGE.top + STAGE.height
  );

  // The popping monster rises from the stage's own bottom edge.
  const pop = container.querySelector<HTMLElement>('.halloween-monster-pop')!;
  expect(pop.parentElement).toHaveStyle({
    left: `${stage.left + stage.width / 2 - 56}px`,
    top: `${stage.bottom - 124}px`,
    overflow: 'hidden',
  });

  // Main's spider hangs from the stage's top, on a 150px thread, bobbing
  // Main's own 3.2s.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(spider.style.left).toBe(`${stageLeft(stage, 0.03) - 40}px`);
  expect(spider.style.top).toBe('167px');
  expect(spider.firstElementChild).toHaveStyle({ height: '150px' });
  expect(spider).toHaveStyle({ animationDuration: '3.2s' });

  // No other Scene's monster leaks onto the page.
  expect(container.querySelector('.halloween-monster-rise')).toBeNull();
  expect(container.querySelector('.halloween-monster-slide')).toBeNull();
});

test('the moon, the bats and the peek monster are cut to shape around the game buttons', () => {
  setAnchors({
    stage: STAGE,
    'home-button-chsh': HOME.chsh,
    'home-button-qf': HOME.qf,
    'home-button-ssm': HOME.ssm,
    'whobit-pose': HOME.pose,
  });
  const { container } = renderPage(<Home />);
  const stage = rectOf(STAGE) as unknown as ElementBox;

  // On the board these pieces sit behind the game buttons; the buttons'
  // boxes are cut out of them here, so they never cover a button's label
  // (decision 10).
  const expectClipped = (wrapper: HTMLElement, left: number, top: number) => {
    const clip = wrapper.style.clipPath;
    expect(clip).toMatch(/^path\(evenodd,/);
    for (const button of [HOME.chsh, HOME.qf, HOME.ssm]) {
      const x = button.left - left;
      const y = button.top - top;
      expect(clip).toContain(
        ` M${x} ${y} H${x + button.width} V${y + button.height} H${x} Z`
      );
    }
  };
  const moonLeft = stage.right - stage.width * 0.07 - 160;
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  expect(moon).toHaveStyle({ left: `${moonLeft}px`, top: '195px' });
  expectClipped(moon, moonLeft, STAGE.top + 28);

  const batsLeft = stage.right - stage.width * 0.07 - 120 - 220;
  const bats = container.querySelector('.halloween-bats')!
    .parentElement as HTMLElement;
  expect(bats).toHaveStyle({ left: `${batsLeft}px`, top: '207px' });
  expectClipped(bats, batsLeft, STAGE.top + 40);

  const peekLeft = stage.right - stage.width * 0.07 - 42 - 76;
  const peek = container.querySelector('.halloween-monster-peek')!
    .parentElement as HTMLElement;
  expect(peek).toHaveStyle({ left: `${peekLeft}px`, top: '171px' });
  expectClipped(peek, peekLeft, STAGE.top + 4);

  // The web needs no such shaping: no control sits under it.
  const web = container.querySelector('svg[viewBox="0 0 200 200"]')!
    .parentElement as HTMLElement;
  expect(web.style.clipPath).toBe('');
});

test('the moon covers the peeking monster at rest, as on the board', () => {
  setAnchors({
    stage: STAGE,
    'home-button-chsh': HOME.chsh,
    'home-button-qf': HOME.qf,
    'home-button-ssm': HOME.ssm,
    'whobit-pose': HOME.pose,
  });
  const { container } = renderPage(<Home />);

  // The board draws .monster-peek before the moon, so the moon hides it at
  // rest; the peeking monster is painted first here too.
  const peek = container.querySelector('.halloween-monster-peek')!;
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!;
  expect(
    peek.compareDocumentPosition(moon) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();
});

test('the Home pieces follow the game buttons when the buttons move', () => {
  setAnchors({
    stage: STAGE,
    'home-button-chsh': HOME.chsh,
    'home-button-qf': HOME.qf,
    'home-button-ssm': HOME.ssm,
    'whobit-pose': HOME.pose,
  });
  const { container } = renderPage(<Home />);

  // The buttons column moves down 40px (the page relays itself out); the
  // ghost's row follows it, and the moon's clip follows the buttons.
  const moved = { ...HOME, ssm: box(794, 549, 502, 115) };
  setAnchors({
    stage: STAGE,
    'home-button-chsh': HOME.chsh,
    'home-button-qf': HOME.qf,
    'home-button-ssm': moved.ssm,
    'whobit-pose': HOME.pose,
  });
  fireEvent(window, new Event('resize'));

  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.top).toBe(`${moved.ssm.top + moved.ssm.height + 8}px`);
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  const x = moved.ssm.left - parseFloat(moon.style.left);
  expect(moon.style.clipPath).toContain(
    ` M${x} ${moved.ssm.top - 195} H${x + moved.ssm.width}`
  );
});

test('QF1 renders the QF1 board’s spider, ball pieces and rising monster', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': QF.bubble,
    'qf-ball': QF.ball,
  });
  const { container } = renderPage(<QF1 />);

  // QF1's spider hangs just right of the speech bubble, at the board's own
  // ~26px from its right edge, on a 96px thread, bobbing 3.6s.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(spider.style.left).toBe(`${QF.bubble.left + QF.bubble.width + 26}px`);
  expect(spider.style.top).toBe('167px');
  expect(spider.firstElementChild).toHaveStyle({ height: '96px' });
  expect(spider).toHaveStyle({ animationDuration: '3.6s' });

  // The board's mist and twinkles over the page's own ball: the mist swirl
  // is clipped to the ball, and the twinkles sparkle on it.
  const mist = container.querySelector<HTMLElement>('.halloween-mist')!;
  expect(mist).not.toBeNull();
  expect(mist.getAttribute('clip-path')).toMatch(/^url\(#halloween-ball-/);
  const twinkles = container.querySelectorAll(
    '.halloween-twinkle, .halloween-twinkle-late'
  );
  expect(twinkles).toHaveLength(3);
  expect(container.querySelector('.halloween-glow-pulse')).toBeNull();

  // The counter is drawn over the ball's mist on the board: the mist stays
  // whole and the counter sits above the Decorations layer.
  expectWholeMist(container);
  expectAboveDecorations(container.querySelector('h1 strong')!.closest('h1')!);

  // The QF1 board carries no ghost.
  expect(container.querySelector('.halloween-ghost')).toBeNull();
});

test('the rising monster peeks only above the ball’s top edge', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': QF.bubble,
    'qf-ball': QF.ball,
  });
  const { container } = renderPage(<QF1 />);
  const ball = ballOf(QF.ball);
  const circleTop = ball.cy - ball.r;

  // On the board the ball itself hides the monster; here a window with its
  // bottom edge at the ball's top edge does, so nothing shows at rest (or
  // under reduced motion) and the risen horns peek above the edge.
  const riseWindow = container.querySelector<HTMLElement>(
    '.halloween-monster-rise'
  )!.parentElement!;
  expect(riseWindow).toHaveStyle({ overflow: 'hidden' });
  expect(riseWindow.style.left).toBe(`${ball.cx - 48}px`);
  expect(
    parseFloat(riseWindow.style.top) + parseFloat(riseWindow.style.height)
  ).toBe(circleTop);
  const monster = riseWindow.firstElementChild as HTMLElement;
  // At rest the monster sits 26px below the ball's top edge: fully below the
  // window's bottom edge, hidden.
  expect(monster.style.top).toBe('80px');
  expect(
    parseFloat(riseWindow.style.top) + parseFloat(monster.style.top)
  ).toBeGreaterThanOrEqual(
    parseFloat(riseWindow.style.top) + parseFloat(riseWindow.style.height)
  );
  // The window reaches high enough for the full 74px rise above the rest.
  expect(parseFloat(riseWindow.style.height)).toBe(54);
});

test('the QF1 ball pieces follow the ball when the ball moves', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': QF.bubble,
    'qf-ball': QF.ball,
  });
  const { container } = renderPage(<QF1 />);

  const moved = box(700, 250, 560, 560);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': QF.bubble,
    'qf-ball': moved,
  });
  fireEvent(window, new Event('resize'));

  const ball = ballOf(moved);
  const riseWindow = container.querySelector<HTMLElement>(
    '.halloween-monster-rise'
  )!.parentElement!;
  expect(riseWindow.style.left).toBe(`${ball.cx - 48}px`);
  expect(
    parseFloat(riseWindow.style.top) + parseFloat(riseWindow.style.height)
  ).toBe(ball.cy - ball.r);
  const mist = container.querySelector<HTMLElement>('.halloween-mist')!;
  const mistSvg = mist.closest('svg')!;
  const scale = ball.r / 190;
  expect(mistSvg.style.left).toBe(`${ball.cx - 280 * scale}px`);
  expect(mistSvg.style.top).toBe(`${ball.cy - 230 * scale}px`);
});

test('QF2 renders the QF2 board’s ghost, glow, flickering pumpkin and sliding monster', () => {
  setAnchors({
    stage: STAGE,
    'qf-ball': QF.ball,
    'whobit-pose': QF.pose,
  });
  const { container } = renderPage(<QF2 />);
  const ball = ballOf(QF.ball);

  // The ghost beside the page's own ball, at the board's smaller size and at
  // its place relative to the ball (202px left of its edge, 16px above its
  // top).
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost).not.toBeNull();
  expect(ghost.style.left).toBe(`${ball.left - 202}px`);
  expect(ghost.style.top).toBe(`${ball.top - 16}px`);
  expect(ghost.getAttribute('width')).toBe('84');

  // The board's mist, twinkles and pulsing glow halo over the ball, with the
  // board's white veil softening the mist over the ball's middle.
  const mist = container.querySelector<HTMLElement>('.halloween-mist')!;
  expect(mist).not.toBeNull();
  expect(
    container.querySelectorAll('.halloween-twinkle, .halloween-twinkle-late')
  ).toHaveLength(4);
  expect(container.querySelector('.halloween-glow-pulse')).not.toBeNull();
  const veil = mist.querySelector('circle[cx="280"]');
  expect(veil).not.toBeNull();
  expect(veil!.getAttribute('fill')).toBe('#ffffff');
  expect(veil!.getAttribute('opacity')).toBe('0.55');

  // The fortune's number and text are drawn over the ball's mist on the
  // board: the mist stays whole and both sit above the Decorations layer.
  expectWholeMist(container);
  const fortune = Array.from(container.querySelectorAll('h1')).filter((h1) =>
    h1.closest('[data-decoration-anchor="qf-ball"]')
  );
  expect(fortune).toHaveLength(2);
  fortune.forEach(expectAboveDecorations);

  // The pumpkin under the pose keeps its place beside the pose box, clamped
  // to rest its base on the stage's bottom edge (its board spot on this page
  // falls below it), and it is the board's flicker piece.
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin).not.toBeNull();
  expect(pumpkin.parentElement!.style.left).toBe(`${QF.pose.left + 258}px`);
  expect(pumpkin.parentElement!.style.top).toBe(
    `${Math.min(QF.pose.top + 340, STAGE.top + STAGE.height - 104)}px`
  );
  expect(pumpkin.querySelector('.halloween-flicker')).not.toBeNull();

  // The sliding monster slides in from the stage's own bottom right, 20px up.
  const slide = container.querySelector<HTMLElement>(
    '.halloween-monster-slide'
  )!.parentElement!;
  expect(slide).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 124}px`,
    top: `${STAGE.top + STAGE.height - 20 - 140}px`,
  });

  // The QF2 board carries no spider.
  expect(container.querySelector('.halloween-spider')).toBeNull();
});

test('the pumpkin rests its base on the stage bottom when its board spot falls below it', () => {
  // Directly, with the board spot below the edge (as on both QF pages): the
  // pumpkin is clamped up to rest on the edge, never showing below it.
  const below = render(<Pumpkin left={100} top={800} clipBottom={755} />);
  const wrapper = below.container.firstElementChild as HTMLElement;
  expect(wrapper.style.top).toBe('651px');
  expect(wrapper.style.height).toBe('104px');
  expect(wrapper.style.overflow).toBe('hidden');
  below.unmount();

  // With the board spot above the edge: the pumpkin keeps the board's place
  // and its base stays above the edge.
  const above = render(<Pumpkin left={100} top={600} clipBottom={755} />);
  const kept = above.container.firstElementChild as HTMLElement;
  expect(kept.style.top).toBe('600px');
  expect(parseFloat(kept.style.top) + 104).toBeLessThanOrEqual(755);
});

/** The ghost's mouth each CHSH board draws its own (the boards' own d). */
const ghostMouths = {
  smile: 'M44 64 Q52 72 60 64',
  grin: 'M42 62 Q52 74 62 62 Z',
  frown: 'M46 66 Q52 62 58 66',
} as const;

test('CHSH1 renders the CHSH1 board’s ambient set, its pumpkin pair and the mummy', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh1.bubble,
    'whobit-pose': CHSH.chsh1.pose,
    'chsh1-next': CHSH.chsh1.next,
  });
  const { container } = renderPage(<CHSH1 />);

  // The Next button carries the pair's anchor, as Home's buttons carry
  // theirs (agent decision A8).
  expect(screen.getByRole('link', { name: 'Next' })).toHaveAttribute(
    'data-decoration-anchor',
    'chsh1-next'
  );

  // The stage-anchored pieces at the board's own stage placements.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 160 160"]')).not.toBeNull();
  expect(container.querySelector('.halloween-bats')).not.toBeNull();

  // The spider 100px left of the stage's centre on the board's own 70px
  // thread, bobbing its own 3.4s. The board hangs it beside the bubble,
  // 56px right of its right edge, which the GUI lays right of the board's
  // stage, so it is clamped to keep that gap.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(spider.style.left).toBe('700px');
  expect(
    CHSH.chsh1.bubble.left + CHSH.chsh1.bubble.width,
    'the board’s spot crosses the bubble’s gap, so the clamp above can fail'
  ).toBeGreaterThan(STAGE.left + STAGE.width / 2 - 100);
  expect(spider.style.top).toBe(`${STAGE.top}px`);
  expect(spider.firstElementChild).toHaveStyle({ height: '70px' });
  expect(spider).toHaveStyle({ animationDuration: '3.4s' });

  // The ghost at the board's own place (124px left of the stage's centre,
  // 250px down) with the board's smile, keeping the board's own 32px gap
  // from the bubble's right edge.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe('676px');
  expect(CHSH.chsh1.bubble.left + CHSH.chsh1.bubble.width).toBeGreaterThan(
    STAGE.left + STAGE.width / 2 - 124
  );
  expect(ghost.style.top).toBe(`${STAGE.top + 250}px`);
  expect(ghost.querySelector(`path[d="${ghostMouths.smile}"]`)).not.toBeNull();

  // The mummy leaning in from the stage's right edge, 230px down.
  const lean = container.querySelector<HTMLElement>(
    '.halloween-monster-lean'
  )!.parentElement!;
  expect(lean).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 124}px`,
    top: `${STAGE.top + 230}px`,
  });

  // The flickering pumpkin under Whobit's pose, clamped to rest its base on
  // the stage's bottom edge.
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[width="120"][viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin.parentElement).toHaveStyle({
    left: `${CHSH.chsh1.pose.left + 258}px`,
    top: `${Math.min(CHSH.chsh1.pose.top + 340, STAGE.top + STAGE.height - 104)}px`,
  });
  expect(pumpkin.querySelector('.halloween-flicker')).not.toBeNull();

  // The pumpkin pair above the Next button: 180px left of its right edge,
  // 32px above its top, the small one 12px right of the big one with their
  // bottoms level, both faces flickering.
  const big = container.querySelector<HTMLElement>('svg[width="132"]')!;
  const small = Array.from(container.querySelectorAll('svg[width="84"]')).find(
    (svg) => !svg.classList.contains('halloween-ghost')
  ) as HTMLElement;
  const pairRight = CHSH.chsh1.next.left + CHSH.chsh1.next.width - 180;
  const pairBottom = CHSH.chsh1.next.top - 32;
  expect(big.style.left).toBe(`${pairRight - 84 - 12 - 132}px`);
  expect(big.style.top).toBe(`${pairBottom - 114}px`);
  expect(big.querySelector('.halloween-flicker')).not.toBeNull();
  expect(small.style.left).toBe(`${pairRight - 84}px`);
  expect(small.style.top).toBe(`${pairBottom - 73}px`);
  expect(small.querySelector('.halloween-flicker')).not.toBeNull();

  // No other Scene's monster leaks onto the page.
  for (const other of [
    '.halloween-monster-ooze',
    '.halloween-monster-vamp',
    '.halloween-monster-dangle',
    '.halloween-monster-tiptoe',
    '.halloween-monster-pop',
    '.halloween-monster-rise',
    '.halloween-monster-slide',
  ]) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('the CHSH1 pieces follow the Next button and clamp past the bubble', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh1.bubble,
    'whobit-pose': CHSH.chsh1.pose,
    'chsh1-next': CHSH.chsh1.next,
  });
  const { container } = renderPage(<CHSH1 />);

  // The button moves down 50px; the pair keeps its offsets from it.
  const moved = box(1342, 651, 154, 96);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh1.bubble,
    'whobit-pose': CHSH.chsh1.pose,
    'chsh1-next': moved,
  });
  fireEvent(window, new Event('resize'));
  const big = container.querySelector<HTMLElement>('svg[width="132"]')!;
  expect(big.style.top).toBe(`${moved.top - 32 - 114}px`);
  const small = Array.from(container.querySelectorAll('svg[width="84"]')).find(
    (svg) => !svg.classList.contains('halloween-ghost')
  ) as HTMLElement;
  expect(small.style.top).toBe(`${moved.top - 32 - 73}px`);

  // The bubble widens past the board's spots; the spider and the ghost
  // clamp to keep their board gaps from its right edge.
  const wide = box(144, 199, 600, 250);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': wide,
    'whobit-pose': CHSH.chsh1.pose,
    'chsh1-next': moved,
  });
  fireEvent(window, new Event('resize'));
  expect(
    container.querySelector<HTMLElement>('.halloween-spider')!.style.left
  ).toBe(`${wide.left + wide.width + 56}px`);
  expect(
    container.querySelector<HTMLElement>('.halloween-ghost')!.style.left
  ).toBe(`${wide.left + wide.width + 32}px`);
});

test('CHSH2 renders the CHSH2 board’s ambient set and the ooze in its brew pot', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh2.bubble,
    'whobit-pose': CHSH.chsh2.pose,
    'chsh2-wheel': CHSH.chsh2.wheel,
    'chsh2-wheel-d': CHSH.chsh2.wheelD,
  });
  const { container } = renderPage(<CHSH2 />);

  // The wheel anchor sits on the page's own wheel: the wheel's own labels
  // render inside it.
  const wheel = container.querySelector(
    '[data-decoration-anchor="chsh2-wheel"]'
  )!;
  expect(wheel.textContent).toContain('V');

  // The D label carries its own anchor, and the board draws the D over the
  // moon, so the moon is cut around the label and around the wheel's own
  // circle, which the board draws over it too: neither covers the label nor
  // the wheel's edge (agent decision A8).
  expect(screen.getByText('D')).toHaveAttribute(
    'data-decoration-anchor',
    'chsh2-wheel-d'
  );
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  expect(moon.style.clipPath).toMatch(/^path\(evenodd,/);
  const moonLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 160;
  const moonTop = STAGE.top + 28;
  const d = CHSH.chsh2.wheelD;
  const dx = d.left - moonLeft;
  const dy = d.top - moonTop;
  expect(moon.style.clipPath).toContain(
    ` M${dx} ${dy} H${dx + d.width} V${dy + d.height} H${dx} Z`
  );
  const wheelCircleX = CHSH.chsh2.wheel.left + 275 - moonLeft;
  const wheelCircleY = CHSH.chsh2.wheel.top + 275 - moonTop;
  expect(moon.style.clipPath).toContain(
    ` M${wheelCircleX - 218} ${wheelCircleY} a218 218 0 1 0 436 0 a218 218 0 1 0 -436 0 Z`
  );
  // The D label really does sit inside the moon's box and over its drawn
  // circle, so the holes above can fail.
  expect(d.left).toBeGreaterThanOrEqual(moonLeft);
  expect(d.left + d.width).toBeLessThanOrEqual(moonLeft + 160);

  // The stage-anchored pieces at the board's own stage placements — and the
  // board carries no bats here.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 160 160"]')).not.toBeNull();
  expect(container.querySelector('.halloween-bats')).toBeNull();

  // The spider 3% in from the stage's right, on the board's 210px thread.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(
    STAGE.left + STAGE.width - STAGE.width * 0.03 - 40
  );
  expect(spider.firstElementChild).toHaveStyle({ height: '210px' });
  expect(spider).toHaveStyle({ animationDuration: '3.2s' });

  // The ghost beside the wheel at the board's own offsets from it (128px
  // left, 8px down), keeping the board's own 22px gap from the bubble's
  // right edge, with the board's own little o mouth.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe('666px');
  expect(CHSH.chsh2.bubble.left + CHSH.chsh2.bubble.width).toBeGreaterThan(
    CHSH.chsh2.wheel.left - 128
  );
  expect(ghost.style.top).toBe(`${CHSH.chsh2.wheel.top + 8}px`);
  expect(ghost.querySelector('ellipse[cx="52"][cy="66"]')).not.toBeNull();

  // The blob oozing out of the brew pot on the stage's bottom edge, 250px
  // left of its centre, clamped past the pose pumpkin beside it (whose
  // clamped spot the GUI lays right of the board's). The monster rises
  // through a window that hides it inside the pot at rest.
  const ooze = container.querySelector<HTMLElement>('.halloween-monster-ooze')!;
  const oozeWindow = ooze.parentElement!;
  const stand = oozeWindow.parentElement!;
  expect(stand.style.left).toBe('522px');
  expect(
    CHSH.chsh2.pose.left + 258 + 120,
    'the pumpkin’s clamped spot crosses the pot’s board spot, so the clamp above can fail'
  ).toBeGreaterThan(STAGE.left + STAGE.width / 2 - 250);
  expect(stand.style.top).toBe(`${STAGE.top + STAGE.height - 190}px`);
  expect(oozeWindow).toHaveStyle({
    left: '15px',
    top: '0px',
    width: '120px',
    height: '124px',
    overflow: 'hidden',
  });
  expect(ooze.style.bottom).toBe('0px');
  const pot = stand.querySelector('svg[width="150"]');
  expect(pot).not.toBeNull();
  expect(pot!.querySelector('.halloween-brew')).not.toBeNull();
  expect(pot!.querySelector('.halloween-brew-late')).not.toBeNull();

  // The flickering pumpkin under Whobit's pose, clamped to the stage's
  // bottom edge.
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[width="120"][viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin.parentElement).toHaveStyle({
    left: `${CHSH.chsh2.pose.left + 258}px`,
    top: `${Math.min(CHSH.chsh2.pose.top + 340, STAGE.top + STAGE.height - 104)}px`,
  });

  // No other Scene's monster leaks onto the page.
  for (const other of [
    '.halloween-monster-lean',
    '.halloween-monster-vamp',
    '.halloween-monster-dangle',
    '.halloween-monster-tiptoe',
    '.halloween-monster-pop',
    '.halloween-monster-rise',
    '.halloween-monster-slide',
  ]) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('the CHSH2 pieces follow the wheel and the pose when they move', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh2.bubble,
    'whobit-pose': CHSH.chsh2.pose,
    'chsh2-wheel': CHSH.chsh2.wheel,
    'chsh2-wheel-d': CHSH.chsh2.wheelD,
  });
  const { container } = renderPage(<CHSH2 />);

  // The wheel moves right and the pose column with it; the ghost keeps its
  // offsets from the wheel and the pot stays clamped past the pumpkin.
  const movedWheel = box(856, 199, 560, 560);
  const movedPose = box(244, 465, 288, 358);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh2.bubble,
    'whobit-pose': movedPose,
    'chsh2-wheel': movedWheel,
    'chsh2-wheel-d': CHSH.chsh2.wheelD,
  });
  fireEvent(window, new Event('resize'));

  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${movedWheel.left - 128}px`);
  const ooze = container.querySelector<HTMLElement>('.halloween-monster-ooze')!;
  expect(ooze.parentElement!.parentElement!.style.left).toBe(
    `${movedPose.left + 258 + 120}px`
  );
});

test('CHSH3 shows the vampire, and only that monster, under an entangled result', () => {
  searchParams.current = new URLSearchParams(
    'value=2.42&error=0.05&fail=false'
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': CHSH.chsh3.circle,
  });
  const { container } = renderPage(<CHSH3 />);

  // The circle anchor sits on the page's own results circle: the value
  // heading renders inside it.
  const circle = container.querySelector(
    '[data-decoration-anchor="chsh3-circle"]'
  )!;
  expect(circle.querySelector('h1')?.textContent).toContain('Your value was');

  // The stage-anchored pieces at the board's own stage placements. The
  // boards draw the results circle over the moon and the bats, so both are
  // cut around the circle the page itself draws (circle.png contained in
  // the circle's box), never covering its edge (agent decision A8).
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('.halloween-bats')).not.toBeNull();
  const disc = {
    cx: CHSH.chsh3.circle.left + CHSH.chsh3.circle.width / 2,
    cy: CHSH.chsh3.circle.top + CHSH.chsh3.circle.height / 2,
    r: (CHSH.chsh3.circle.width - 2 * 58) / 2,
  };
  // The disc reaches into both pieces' boxes, so the cuts below can fail.
  const moonLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 160;
  expect(disc.cx + disc.r).toBeGreaterThan(moonLeft);
  const batsLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 120 - 220;
  expect(disc.cx + disc.r).toBeGreaterThan(batsLeft);
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  expect(moon.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(moon.style.clipPath).toContain(
    ` M${disc.cx - disc.r - moonLeft} ${disc.cy - (STAGE.top + 28)} a${disc.r} ${disc.r} 0 1 0 ${disc.r * 2} 0 a${disc.r} ${disc.r} 0 1 0 ${-disc.r * 2} 0 Z`
  );
  const bats = container.querySelector('.halloween-bats')!
    .parentElement as HTMLElement;
  expect(bats.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(bats.style.clipPath).toContain(
    ` M${disc.cx - disc.r - batsLeft} ${disc.cy - (STAGE.top + 40)} a${disc.r} ${disc.r} 0 1 0 ${disc.r * 2} 0 a${disc.r} ${disc.r} 0 1 0 ${-disc.r * 2} 0 Z`
  );

  // The spider 3% in from the stage's right, on the board's 210px thread.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(
    STAGE.left + STAGE.width - STAGE.width * 0.03 - 40
  );
  expect(spider.firstElementChild).toHaveStyle({ height: '210px' });

  // The vampire rising from the stage's bottom right (28px in), through a
  // window whose bottom edge is the stage's own bottom edge, which hides it
  // at rest.
  const vamp = container.querySelector<HTMLElement>('.halloween-monster-vamp')!;
  expect(vamp.parentElement).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 28 - 124}px`,
    top: `${STAGE.top + STAGE.height - 150}px`,
    overflow: 'hidden',
  });

  // The ghost on the circle's bottom-left (124px left of it, 470px down)
  // with the board's grin, its base clamped onto the stage's bottom edge
  // where the circle hangs below it, never crossing the bubble's edge.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe('650px');
  expect(ghost.style.top).toBe('655px');
  expect(
    CHSH.chsh3.circle.top + 470,
    'the circle hangs below the stage’s bottom edge, so the clamp above can fail'
  ).toBeGreaterThan(STAGE.top + STAGE.height - 100);
  expect(ghost.querySelector(`path[d="${ghostMouths.grin}"]`)).not.toBeNull();

  // The small pumpkin on the circle's bottom-right (52px in, 30px up), at
  // the board's own bigger size, its face flickering as the board draws it.
  const small = container.querySelector<HTMLElement>('svg[width="96"]')!;
  expect(small.style.left).toBe(
    `${CHSH.chsh3.circle.left + CHSH.chsh3.circle.width - 52 - 96}px`
  );
  expect(small.style.top).toBe(
    `${CHSH.chsh3.circle.top + CHSH.chsh3.circle.height - 30 - 83}px`
  );
  expect(small.querySelector('.halloween-flicker')).not.toBeNull();

  // The flickering pumpkin under Whobit's pose, clamped to the stage's
  // bottom edge.
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[width="120"][viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin.parentElement).toHaveStyle({
    left: `${CHSH.chsh3.pose.left + 258}px`,
    top: `${Math.min(CHSH.chsh3.pose.top + 340, STAGE.top + STAGE.height - 104)}px`,
  });

  // Only this Scene's monster: neither of the other CHSH3 boards' monsters,
  // nor any other Scene's.
  for (const other of [
    '.halloween-monster-dangle',
    '.halloween-monster-tiptoe',
    '.halloween-monster-lean',
    '.halloween-monster-ooze',
    '.halloween-monster-pop',
    '.halloween-monster-rise',
    '.halloween-monster-slide',
  ]) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('CHSH3 shows the sock monster, and only that monster, under a weak result', () => {
  searchParams.current = new URLSearchParams(
    'value=1.42&error=0.07&fail=false'
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': CHSH.chsh3.circle,
  });
  const { container } = renderPage(<CHSH3 />);

  // The sock monster dangling over the stage's top edge (82px left of its
  // centre), through a window whose top edge is the stage's own, which
  // hides it at rest; its board spot crosses the bubble, so it is clamped
  // to keep the board's own 74px gap from the bubble's right edge.
  const dangle = container.querySelector<HTMLElement>(
    '.halloween-monster-dangle'
  )!;
  expect(dangle.parentElement).toHaveStyle({
    left: '718px',
    top: `${STAGE.top}px`,
    overflow: 'hidden',
  });
  expect(CHSH.chsh3.bubble.left + CHSH.chsh3.bubble.width).toBeGreaterThan(
    STAGE.left + STAGE.width / 2 - 82
  );

  // The ghost wears this board's frown; the spider and the small pumpkin
  // sit as on the entangled board.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.querySelector(`path[d="${ghostMouths.frown}"]`)).not.toBeNull();
  expect(
    container.querySelector<HTMLElement>('svg[width="96"]')!.style.left
  ).toBe(`${CHSH.chsh3.circle.left + CHSH.chsh3.circle.width - 52 - 96}px`);

  // Only this Scene's monster.
  for (const other of [
    '.halloween-monster-vamp',
    '.halloween-monster-tiptoe',
    '.halloween-monster-lean',
    '.halloween-monster-ooze',
  ]) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('CHSH3 shows the tiptoeing monster, and only that monster, on an error', () => {
  searchParams.current = new URLSearchParams('value=0&error=0&fail=true');
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': CHSH.chsh3.circle,
  });
  const { container } = renderPage(<CHSH3 />);

  // The monster tiptoeing in from the stage's right edge, 12px above its
  // bottom.
  const tiptoe = container.querySelector<HTMLElement>(
    '.halloween-monster-tiptoe'
  )!;
  expect(tiptoe.parentElement).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 140}px`,
    top: `${STAGE.top + STAGE.height - 12 - 120}px`,
  });

  // This board's own spider: 60px left of the stage's centre on a 120px
  // thread.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(STAGE.left + STAGE.width / 2 - 60);
  expect(spider.firstElementChild).toHaveStyle({ height: '120px' });

  // The ghost wears this board's smile.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.querySelector(`path[d="${ghostMouths.smile}"]`)).not.toBeNull();

  // Only this Scene's monster.
  for (const other of [
    '.halloween-monster-vamp',
    '.halloween-monster-dangle',
    '.halloween-monster-lean',
    '.halloween-monster-ooze',
  ]) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('the CHSH3 pieces follow the results circle when it moves', () => {
  searchParams.current = new URLSearchParams(
    'value=2.42&error=0.05&fail=false'
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': CHSH.chsh3.circle,
  });
  const { container } = renderPage(<CHSH3 />);

  // The circle moves right and up; the ghost and the small pumpkin keep
  // their offsets from it (the ghost's base now rests clear of the stage's
  // bottom edge, so no clamp moves it).
  const moved = box(874, 150, 560, 560);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': moved,
  });
  fireEvent(window, new Event('resize'));

  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${moved.left - 124}px`);
  expect(ghost.style.top).toBe(
    `${Math.min(moved.top + 470, STAGE.top + STAGE.height - 100)}px`
  );
  expect(
    container.querySelector<HTMLElement>('svg[width="96"]')!.style.left
  ).toBe(`${moved.left + moved.width - 52 - 96}px`);

  // Back to the params the other tests render with.
  searchParams.current = new URLSearchParams();
});

test('the CHSH3 Scene boundary is a value of 2: entangled at it, weak below', () => {
  // A value of exactly 2 is an entangled result (value >= 2): the vampire,
  // and only the vampire.
  searchParams.current = new URLSearchParams('value=2&error=0.05&fail=false');
  setAnchors({
    stage: STAGE,
    'whobit-bubble': CHSH.chsh3.bubble,
    'whobit-pose': CHSH.chsh3.pose,
    'chsh3-circle': CHSH.chsh3.circle,
  });
  const entangled = renderPage(<CHSH3 />);
  expect(
    entangled.container.querySelector('.halloween-monster-vamp')
  ).not.toBeNull();
  expect(
    entangled.container.querySelector('.halloween-monster-dangle')
  ).toBeNull();
  expect(
    entangled.container.querySelector('.halloween-monster-tiptoe')
  ).toBeNull();
  entangled.unmount();

  // Just below it is a weak result: the sock monster, and only it.
  searchParams.current = new URLSearchParams(
    'value=1.99&error=0.05&fail=false'
  );
  const weak = renderPage(<CHSH3 />);
  expect(
    weak.container.querySelector('.halloween-monster-dangle')
  ).not.toBeNull();
  expect(weak.container.querySelector('.halloween-monster-vamp')).toBeNull();
  expect(weak.container.querySelector('.halloween-monster-tiptoe')).toBeNull();
  weak.unmount();

  searchParams.current = new URLSearchParams();
});

test('the Measuring popup renders the peeker over its top edge and the bat riding its bar', () => {
  setAnchors(MEASURING);
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
  const dialog = MEASURING.dialog;
  expect(peeker.style.left).toBe(`${dialog.left + dialog.width - 72 - 96}px`);
  expect(peeker.style.top).toBe(`${dialog.top - 70}px`);

  // The bat rides the real bar: its layer sits exactly on the bar, and the
  // bat itself is at the fill's leading edge (agent decision A7), hanging
  // from the title's own bottom edge so it never covers the title nor the
  // "% complete" line below the bar.
  const rider = document.querySelector<HTMLElement>('.halloween-bar-rider')!;
  expect(rider).not.toBeNull();
  const bar = MEASURING.progressbar;
  const title = MEASURING['measuring-title'];
  expect(rider.parentElement).toHaveStyle({
    left: `${bar.left}px`,
    top: `${bar.top}px`,
    width: `${bar.width}px`,
  });
  expect(rider.style.left).toBe('50%');
  expect(rider.style.top).toBe(`${title.top + title.height - bar.top}px`);
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

test('the Measuring popup’s Decorations follow the popup when it grows', () => {
  setAnchors(MEASURING);
  sse.message = { event: 'rng_progress', current: 8, total: 16 };
  render(
    <Dialog open>
      <ModalBox variant="rng" />
    </Dialog>
  );

  // The popup grows (its QR image loads), so it stands taller and everything
  // in it moves; the Decorations are measured again and follow (A8).
  const grown = {
    dialog: box(270, 112, 900, 755),
    progressbar: box(320, 213, 800, 4),
    'measuring-title': box(320, 162, 800, 35),
  };
  setAnchors(grown);
  fireEvent(window, new Event('resize'));

  const peeker =
    document.querySelector<HTMLElement>('.halloween-peeker')!.parentElement!;
  expect(peeker.style.top).toBe(`${grown.dialog.top - 70}px`);
  const rider = document.querySelector<HTMLElement>('.halloween-bar-rider')!;
  expect(rider.parentElement).toHaveStyle({
    left: `${grown.progressbar.left}px`,
    top: `${grown.progressbar.top}px`,
  });
  expect(rider.style.top).toBe(
    `${
      grown['measuring-title'].top +
      grown['measuring-title'].height -
      grown.progressbar.top
    }px`
  );
});

test('the SSM Measuring popup renders the peeker and no bat, there being no bar', () => {
  setAnchors({ dialog: box(420, 222, 600, 535) });
  sse.message = null;
  render(
    <Dialog open maxWidth="md">
      <SSMModalBox />
    </Dialog>
  );

  expect(document.querySelector('.halloween-peeker')).not.toBeNull();
  expect(document.querySelector('.halloween-bar-rider')).toBeNull();
});

test('the web, the moon and the bats render on Home, QF1 and QF2', () => {
  const screens = [
    ['Home', <Home key="home" />, HOME],
    ['QF1', <QF1 key="qf1" />, null],
    ['QF2', <QF2 key="qf2" />, null],
  ] as const;
  for (const [name, node] of screens) {
    setAnchors({
      stage: STAGE,
      'home-button-chsh': HOME.chsh,
      'home-button-qf': HOME.qf,
      'home-button-ssm': HOME.ssm,
      'whobit-pose': name === 'Home' ? HOME.pose : QF.pose,
      ...(name === 'QF1' ? { 'whobit-bubble': QF.bubble } : {}),
      ...(name !== 'Home' ? { 'qf-ball': QF.ball } : {}),
    });
    const { container, unmount } = renderPage(node);
    expect(
      container.querySelector('svg[viewBox="0 0 200 200"]'),
      `${name} shows the web`
    ).not.toBeNull();
    expect(
      container.querySelector('svg[viewBox="0 0 160 160"]'),
      `${name} shows the moon`
    ).not.toBeNull();
    expect(
      container.querySelector('.halloween-bats'),
      `${name} shows the bats`
    ).not.toBeNull();
    unmount();
  }
});

test('the Measuring popup keeps its text and swaps in the cauldron illustration', () => {
  setAnchors(MEASURING);
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

  // The Images slot carries the cauldron (decision 8: the background and the
  // Whobit poses stay today's).
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

test('CHSH2’s wheel wears the board’s cream face and broom needle', () => {
  setAnchors({ stage: STAGE });
  const { container } = renderPage(<CHSH2 />);
  const wheel = container.querySelector(
    '[data-decoration-anchor="chsh2-wheel"]'
  )!;
  expect(getComputedStyle(wheel).backgroundImage).toContain(
    '/images/polarization-wheel-halloween.svg'
  );
  // The needle is the wheel's only child box carrying a background image.
  const needle = Array.from(wheel.children).find((child) =>
    getComputedStyle(child).backgroundImage.includes('url(')
  )!;
  expect(getComputedStyle(needle).backgroundImage).toContain(
    '/images/polarization-broom-halloween.svg'
  );

  // Both files are the board's art: the cream face and the broom, its tip in
  // the pumpkin colour (decision 7).
  const face = readFileSync(
    'public/images/polarization-wheel-halloween.svg',
    'utf8'
  );
  expect(face).toContain('fill="#fff4dd"');
  const broom = readFileSync(
    'public/images/polarization-broom-halloween.svg',
    'utf8'
  );
  expect(broom).toContain('fill="#ff5f05"');
  expect(broom).toContain('fill="#fcb316"');
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

test('every class the Decorations animate stops under prefers-reduced-motion', () => {
  // Decision 12: every animation stops under reduced motion, so the media
  // query's selector list must name every class the file animates or
  // transitions — a newly animated class left out fails here.
  const css = readFileSync(
    'src/themes/halloween/decorations/decorations.css',
    'utf8'
  );
  const mediaIndex = css.indexOf('@media (prefers-reduced-motion: reduce)');
  expect(mediaIndex).toBeGreaterThanOrEqual(0);
  const animated = new Set<string>();
  for (const match of css
    .slice(0, mediaIndex)
    .matchAll(/\.([a-z0-9-]+)\s*\{([^}]*)\}/g)) {
    if (/(^|\s)(animation|transition):/.test(match[2])) {
      animated.add(match[1]);
    }
  }
  expect(animated.size).toBeGreaterThan(0);
  const reduced = css.slice(mediaIndex);
  for (const className of animated) {
    expect(reduced, `.${className} stops under reduced motion`).toContain(
      `.${className}`
    );
  }
  expect(reduced).toContain('animation: none');
  expect(reduced).toContain('transition: none');
});

test('the rising monster’s window is the ball’s own geometry, directly', () => {
  const ball = ballOf(QF.ball);
  const { container } = render(<MonsterRise ball={ball} />);
  const riseWindow = container.firstElementChild as HTMLElement;
  expect(riseWindow.style.overflow).toBe('hidden');
  // The window's bottom edge is the ball's top edge, and the monster rests
  // 26px below it, hidden, rising 74px above its rest.
  expect(
    parseFloat(riseWindow.style.top) + parseFloat(riseWindow.style.height)
  ).toBe(ball.cy - ball.r);
  expect(riseWindow.firstElementChild!.style.top).toBe('80px');
});

test('the Measuring Decorations follow the popup when only the ResizeObserver fires', () => {
  const beforeRender = ResizeObserverStub.instances.length;
  setAnchors(MEASURING);
  sse.message = { event: 'rng_progress', current: 8, total: 16 };
  render(
    <Dialog open>
      <ModalBox variant="rng" />
    </Dialog>
  );

  // The popup grows (its QR image loads): the real browser fires the
  // observers, and nothing else — no window resize is dispatched here — so
  // the observer path alone must carry the Decorations along.
  const grown = {
    dialog: box(270, 112, 900, 755),
    progressbar: box(320, 213, 800, 4),
    'measuring-title': box(320, 162, 800, 35),
  };
  setAnchors(grown);
  const observers = ResizeObserverStub.instances.slice(beforeRender);
  expect(observers.length).toBeGreaterThan(0);

  // The observers watch the popup's own elements and the containers around
  // them: the dialog itself, an ancestor of the bar and the title — the half
  // of the watching that carries the bar along when the popup grows around
  // it — and the bar and title themselves.
  const observed = observers.flatMap((observer) => observer.observed);
  const dialogElement = observed.find(
    (element) => element.getAttribute('role') === 'dialog'
  );
  const barElement = observed.find(
    (element) => element.getAttribute('role') === 'progressbar'
  );
  const titleElement = observed.find(
    (element) =>
      element.getAttribute('data-decoration-anchor') === 'measuring-title'
  );
  expect(dialogElement).toBeDefined();
  expect(barElement).toBeDefined();
  expect(titleElement).toBeDefined();
  expect(dialogElement!.contains(barElement!)).toBe(true);
  expect(dialogElement!.contains(titleElement!)).toBe(true);

  // Per observer, not just across them all: the hook watches an element and
  // every container around it with one and the same observer, so the
  // observer that watches the bar (the title) must itself watch the dialog
  // too — otherwise the ancestor loop could be deleted and the bar would
  // never follow the popup when it moves inside it without resizing.
  expect(
    observers.some((observer) => observer.observed.includes(barElement!))
  ).toBe(true);
  expect(
    observers.some((observer) => observer.observed.includes(titleElement!))
  ).toBe(true);
  for (const observer of observers) {
    const watched = observer.observed;
    if (watched.includes(barElement!) || watched.includes(titleElement!)) {
      expect(watched.includes(dialogElement!)).toBe(true);
    }
  }

  // The real browser fires the observers, and nothing else — no window
  // resize is dispatched here — so the observer path alone must carry the
  // Decorations along.
  act(() => {
    for (const observer of observers) {
      observer.callback([], observer as unknown as ResizeObserver);
    }
  });

  const peeker =
    document.querySelector<HTMLElement>('.halloween-peeker')!.parentElement!;
  expect(peeker.style.top).toBe(`${grown.dialog.top - 70}px`);
  const rider = document.querySelector<HTMLElement>('.halloween-bar-rider')!;
  expect(rider.parentElement).toHaveStyle({
    left: `${grown.progressbar.left}px`,
    top: `${grown.progressbar.top}px`,
  });
  expect(rider.style.top).toBe(
    `${
      grown['measuring-title'].top +
      grown['measuring-title'].height -
      grown.progressbar.top
    }px`
  );
});

test('the real layout carries the stage anchor on the content box', () => {
  const { unmount } = render(
    <RootLayout>
      <p>page</p>
    </RootLayout>
  );

  // The page tests stub the anchor with a plain div, so this proves the
  // layout itself carries it — on the content box the boards' stage stands
  // for: the box right under the header that carries the page and is painted
  // with the theme's background image. (The emotion @layer rules do not
  // reach jsdom's computed styles, so the background is checked in the
  // injected styles' own text.)
  const stage = document.querySelector('[data-decoration-anchor="stage"]');
  expect(stage).not.toBeNull();
  expect(stage!.querySelector('p')?.textContent).toBe('page');
  expect(stage!.previousElementSibling?.textContent).toContain('Start Over');
  const styles = Array.from(document.querySelectorAll('style'))
    .map((style) => style.textContent)
    .join('');
  expect(styles).toContain('GUI-background');
  unmount();
});

test('the ball’s visible circle is the ball box’s centred circle, 62px in', () => {
  // Literal expectations, not ballCircle's own arithmetic: circle.png is
  // 550px, centred in the 560px ball box, and draws its circle 57px inside
  // itself, so the visible ball is the box inset 62px on every side.
  expect(ballCircle(rectOf(box(794, 239, 560, 560)))).toEqual({
    cx: 1074,
    cy: 519,
    r: 218,
    left: 856,
    top: 301,
  });
});
