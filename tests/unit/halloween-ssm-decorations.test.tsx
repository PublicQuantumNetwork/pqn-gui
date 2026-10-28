import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { afterAll, beforeAll, expect, test, vi } from 'vitest';

/**
 * The Halloween Decorations of group 2.4 through the real registry and
 * resolvers: with NEXT_PUBLIC_SEASONAL_THEME=halloween the SSM Scenes render
 * the Decorations of their boards (docs/design/halloween/SSM1, the SSM2
 * boards, SSM3 and SSM4 with its perfect-match sparks), and only those. Every
 * piece is placed against the page element its board ties it to, as the page
 * lays that element out (agent decision A8), so the tests hand each anchor a
 * box (probed from the real pages at the boards' 1440x980) and follow the
 * pieces as the anchors move. The env var is set in vi.hoisted so it is in
 * place before the pages are imported.
 */
vi.hoisted(() => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'halloween';
});

vi.mock('@/calls', async () => (await import('./backend-mocks')).callsMock());
vi.mock('@/hooks/useSSE', async () =>
  (await import('./backend-mocks')).useSSEMock()
);
vi.mock('@/hooks/WebSocketHook', async () =>
  (await import('./backend-mocks')).useWebSocketMock()
);
vi.mock('next/navigation', () => ({
  useRouter: () => router,
  usePathname: () => '/',
  useSearchParams: () => searchParams.current,
}));

import * as calls from '@/calls';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
import SSM1 from '@/app/ssm/page1/page';
import SSM2 from '@/app/ssm/page2/page';
import SSM3 from '@/app/ssm/page3/page';
import SSM4 from '@/app/ssm/page4/page';

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const searchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

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
  right: number;
  bottom: number;
}

const box = (left: number, top: number, width: number, height: number) => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
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
 *  the stage (the layout's 60vh content box), Whobit's speech bubble and
 *  pose, the SSM1 emoji circle, the SSM2 waiting status (the spinner while
 *  the friend decides, the declined face once they said no) and the SSM4
 *  results circle. The GUI lays the bubble right of the boards' stage. */
const STAGE = box(0, 167, 1440, 588);
const SSM = {
  bubble: box(144, 199, 500, 250),
  pose: box(144, 459, 288, 358),
  circle: box(794, 199, 560, 560),
  status: box(1005, 443, 80, 80),
  declinedStatus: box(970, 403, 150, 240),
};

/** The anchors' boxes for the current render, keyed by data attribute; each
 *  box stands in for layout. */
const anchors: { current: Record<string, Box> } = { current: {} };

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  );
  // The real emoji picker watches its category list with an
  // IntersectionObserver, which jsdom has none of.
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function (this: HTMLElement) {
      const name = this.getAttribute('data-decoration-anchor');
      if (name && name in anchors.current) {
        return rectOf(anchors.current[name]);
      }
      return rectOf(box(0, 0, 0, 0));
    }
  );
});

/**
 * A stub IntersectionObserver: records every instance and everything each
 * instance observes, so a test can fire the callbacks by hand with the
 * entries the real browser fires as the picker's categories come into
 * view — jsdom has no layout, so they never fire on their own and the
 * picker's emoji never render without them.
 */
class IntersectionObserverStub {
  static instances: IntersectionObserverStub[] = [];
  callback: IntersectionObserverCallback;
  observed: Element[] = [];
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    IntersectionObserverStub.instances.push(this);
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
  takeRecords() {
    return [];
  }
}

/** Fires the real emoji picker's IntersectionObservers, so its categories
 *  become visible and their emoji render. */
async function revealPickerEmojis() {
  await act(async () => {
    for (const observer of IntersectionObserverStub.instances) {
      observer.callback(
        observer.observed.map((target) => ({
          target,
          isIntersecting: true,
          intersectionRatio: 1,
        })),
        observer as unknown as IntersectionObserver
      );
    }
  });
}

function setAnchors(next: Record<string, Box>) {
  anchors.current = next;
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

/** The SSM boards' speech-bubble edge: the boards lay the bubble's right
 *  edge at 564px of their 1440px stage; the spider keeps its board's own
 *  gap from it (see spiderLeft). */
const BOARD_BUBBLE_RIGHT = 564;

function spiderLeftAt(at: number): number {
  const spot = STAGE.left + STAGE.width * at;
  return Math.max(
    spot,
    SSM.bubble.left + SSM.bubble.width + spot - BOARD_BUBBLE_RIGHT
  );
}

/** An occluder's hole in a piece's clip-path, as `pieceStyle` writes it. */
function occluderHole(occluder: Box, piece: Box): string {
  const x = occluder.left - piece.left;
  const y = occluder.top - piece.top;
  return ` M${x} ${y} H${x + occluder.width} V${y + occluder.height} H${x} Z`;
}

/** Whether two boxes overlap (edges only touching do not). */
function intersects(a: Box, b: Box): boolean {
  return (
    a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom
  );
}

/** The other Scenes' monsters, none of which may leak onto an SSM page. */
const otherMonsters = [
  '.halloween-monster-lean',
  '.halloween-monster-ooze',
  '.halloween-monster-vamp',
  '.halloween-monster-dangle',
  '.halloween-monster-tiptoe',
  '.halloween-monster-pop',
  '.halloween-monster-rise',
  '.halloween-monster-slide',
  '.halloween-monster-skel',
  '.halloween-monster-fuzz',
  '.halloween-monster-cat',
  '.halloween-monster-frank',
  '.halloween-monster-tentacle',
  '.halloween-monster-wolf',
];

/** The flickering pumpkin under Whobit's pose, clamped to rest its base on
 *  the stage's bottom edge, as every SSM board draws it. */
const POSE_PUMPKIN_TOP = Math.min(
  SSM.pose.top + 340,
  STAGE.top + STAGE.height - 104
);

function expectPosePumpkin(container: HTMLElement) {
  const pumpkin = container.querySelector<HTMLElement>(
    'svg[width="120"][viewBox="0 0 120 104"]'
  )!;
  expect(pumpkin).not.toBeNull();
  expect(pumpkin.parentElement).toHaveStyle({
    left: `${SSM.pose.left + 258}px`,
    top: `${POSE_PUMPKIN_TOP}px`,
  });
  expect(pumpkin.querySelector('.halloween-flicker')).not.toBeNull();
}

test('SSM1 renders the board’s ambient set, its ghost by the emoji circle and the skeleton', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm1-circle': SSM.circle,
  });
  const { container } = renderPage(<SSM1 />);

  // The emoji-circle anchor sits on the page's own emoji circle.
  const circle = container.querySelector(
    '[data-decoration-anchor="ssm1-circle"]'
  )!;
  expect(circle).not.toBeNull();

  // The stage-anchored pieces: web, moon and bats.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  const bats = container.querySelector('.halloween-bats')!
    .parentElement as HTMLElement;
  expect(moon).not.toBeNull();
  expect(bats).not.toBeNull();

  // The boards draw the emoji circle over the moon and the bats, so both
  // are cut around the circle's own disc, which the page draws contained in
  // its 560px box (~58px inside it), never covering its edge (A8).
  const disc = {
    cx: SSM.circle.left + SSM.circle.width / 2,
    cy: SSM.circle.top + SSM.circle.height / 2,
    r: (SSM.circle.width - 2 * 58) / 2,
  };
  const moonLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 160;
  const batsLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 120 - 220;
  // The disc reaches into both pieces' boxes, so the cuts below can fail.
  expect(disc.cx - disc.r).toBeLessThan(moonLeft + 160);
  expect(disc.cx - disc.r).toBeLessThan(batsLeft + 220);
  const discHole = (pieceLeft: number, pieceTop: number) =>
    ` M${disc.cx - disc.r - pieceLeft} ${disc.cy - pieceTop} a${disc.r} ${disc.r} 0 1 0 ${disc.r * 2} 0 a${disc.r} ${disc.r} 0 1 0 ${-disc.r * 2} 0 Z`;
  expect(moon.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(moon.style.clipPath).toContain(discHole(moonLeft, STAGE.top + 28));
  expect(bats.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(bats.style.clipPath).toContain(discHole(batsLeft, STAGE.top + 40));

  // The spider at the board's 44%, keeping its board's own gap from the
  // bubble's right edge, which the GUI lays right of the board's stage.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(
    SSM.bubble.left + SSM.bubble.width,
    'the GUI’s bubble crosses the board’s spot, so the clamp above can fail'
  ).toBeGreaterThan(STAGE.left + STAGE.width * 0.44);
  expect(parseFloat(spider.style.left)).toBe(spiderLeftAt(0.44));
  expect(spider.firstElementChild).toHaveStyle({ height: '120px' });
  expect(spider).toHaveStyle({ animationDuration: '3.4s' });

  // The skeleton sliding in from the stage's left edge, 40px above its
  // bottom, its arm waving.
  const skel = container.querySelector<HTMLElement>(
    '.halloween-monster-skel'
  )!.parentElement!;
  expect(skel).toHaveStyle({
    left: `${STAGE.left}px`,
    top: `${STAGE.bottom - 40 - 132}px`,
  });
  expect(skel.querySelector('.halloween-skel-wave')).not.toBeNull();

  // The flickering pumpkin under the pose, clamped to the stage's bottom.
  expectPosePumpkin(container);

  // The board's ghost beside the emoji circle: 64px past its right edge
  // (84px wide), 8px down, drawn after the moon it flies over, as on the
  // board.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${SSM.circle.left + 540}px`);
  expect(ghost.style.top).toBe(`${SSM.circle.top + 8}px`);
  expect(ghost.getAttribute('width')).toBe('84');
  expect(
    moon.compareDocumentPosition(ghost) & Node.DOCUMENT_POSITION_FOLLOWING
  ).toBeTruthy();

  // No other Scene's monster leaks onto the page.
  for (const other of otherMonsters.filter(
    (monster) => monster !== '.halloween-monster-skel'
  )) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('the SSM1 ghost follows the emoji circle when the circle moves', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm1-circle': SSM.circle,
  });
  const { container } = renderPage(<SSM1 />);

  // The circle moves down the page; the ghost keeps its board offsets from
  // it.
  const moved = box(700, 250, 560, 560);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm1-circle': moved,
  });
  fireEvent(window, new Event('resize'));
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${moved.left + 540}px`);
  expect(ghost.style.top).toBe(`${moved.top + 8}px`);
});

test('SSM2 asking renders the flight path, the bat courier and the fuzz ball', () => {
  vi.mocked(calls.requestFollower).mockReturnValueOnce(new Promise(() => {}));
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': SSM.status,
  });
  const { container } = renderPage(<SSM2 />);

  // The waiting-status anchor sits on the page's own spinner.
  const status = container.querySelector(
    '[data-decoration-anchor="ssm2-status"]'
  )!;
  expect(status).not.toBeNull();

  // The stage-anchored pieces: web, moon and bats (no circle to cut around
  // on this page).
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 160 160"]')).not.toBeNull();
  expect(container.querySelector('.halloween-bats')).not.toBeNull();

  // The board's 560px communication box, derived from the status (the
  // board sits it 280px down the box's middle), clamped to the stage's top
  // edge: the dashed flight path with its stars fills it, and the waiting
  // status the page draws is cut out of its lower corner (A8).
  const commBox = {
    left: SSM.status.left + SSM.status.width / 2 - 280,
    top: Math.max(SSM.status.top - 280, STAGE.top),
  };
  const path = container.querySelector<HTMLElement>(
    'svg[viewBox="0 0 560 300"]'
  )!.parentElement as HTMLElement;
  expect(path).not.toBeNull();
  expect(path).toHaveStyle({
    left: `${commBox.left}px`,
    top: `${commBox.top}px`,
  });
  expect(path.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(path.style.clipPath).toContain(
    occluderHole(SSM.status, {
      left: commBox.left,
      top: commBox.top,
      width: 560,
      height: 300,
    })
  );

  // The bat courier 150px in and 40px down the box, its wings flapping.
  const courier = container.querySelector<HTMLElement>(
    '.halloween-courier-fly'
  )!;
  expect(courier).toHaveStyle({
    left: `${commBox.left + 150}px`,
    top: `${commBox.top + 40}px`,
  });
  expect(container.querySelectorAll('.halloween-courier-wing')).toHaveLength(2);

  // The fuzz ball popping up from the stage's bottom at the board's 33%,
  // clamped past the pose pumpkin beside it (whose clamped spot the GUI
  // lays right of the board's), hidden below the stage's edge at rest.
  const fuzz = container.querySelector<HTMLElement>(
    '.halloween-monster-fuzz'
  )!.parentElement!;
  expect(
    SSM.pose.left + 258 + 120,
    'the pumpkin’s clamped spot crosses the fuzz ball’s board spot, so the clamp above can fail'
  ).toBeGreaterThan(STAGE.left + STAGE.width * 0.33);
  expect(fuzz).toHaveStyle({
    left: `${SSM.pose.left + 258 + 120}px`,
    top: `${STAGE.bottom - 112}px`,
    overflow: 'hidden',
  });
  expect(container.querySelectorAll('.halloween-lid')).toHaveLength(2);

  // The spider at the board's 38%, on its 84px thread: its board spot hangs
  // behind the bubble's right edge, so it keeps that overlap here with the
  // bubble cut out of it, showing only where the board shows it (A8).
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(spiderLeftAt(0.38));
  expect(spider.firstElementChild).toHaveStyle({ height: '84px' });
  expect(spider).toHaveStyle({ animationDuration: '3.8s' });
  expect(spider.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(spider.style.clipPath).toContain(
    occluderHole(SSM.bubble, {
      left: spiderLeftAt(0.38),
      top: STAGE.top,
      width: 40,
      height: 84 + 34,
    })
  );

  // The flickering pumpkin under the pose, and no other Scene's pieces: no
  // cat, no leaning monster, no sparks.
  expectPosePumpkin(container);
  expect(container.querySelector('.halloween-monster-cat')).toBeNull();
  expect(container.querySelector('.halloween-monster-frank')).toBeNull();
  expect(container.querySelector('.halloween-spark')).toBeNull();
  expect(container.querySelector('.halloween-courier-deliver')).toBeNull();
});

test('SSM2 waiting renders the cat, the friend’s computer and the ghost courier', async () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': SSM.status,
  });
  const { container } = renderPage(<SSM2 />);

  // The request has answered without an answer, so the waiting board's
  // pieces arrive with the ssm2-waiting Scene.
  const cat = await waitFor(() => {
    const found = container.querySelector<HTMLElement>(
      '.halloween-monster-cat'
    );
    expect(found).not.toBeNull();
    return found;
  });

  // The board's communication box, derived from the status (the board sits
  // it 330px down the box's middle), clamped to the stage's top edge: the
  // cat 404px in and 30px down it, its tail swishing.
  const commBox = {
    left: SSM.status.left + SSM.status.width / 2 - 280,
    top: Math.max(SSM.status.top - 330, STAGE.top),
  };
  expect(cat.parentElement).toHaveStyle({
    left: `${commBox.left + 404}px`,
    top: `${commBox.top + 30}px`,
  });
  expect(cat.querySelector('.halloween-cat-tail')).not.toBeNull();

  // The friend's computer filling the box, its popup light blinking, with
  // the waiting status cut out of it where the box reaches over it (A8).
  const computer = container.querySelector<HTMLElement>(
    'svg[viewBox="0 0 560 330"]'
  )!.parentElement as HTMLElement;
  expect(computer).toHaveStyle({
    left: `${commBox.left}px`,
    top: `${commBox.top}px`,
  });
  expect(computer.querySelector('.halloween-popup-dot')).not.toBeNull();
  expect(computer.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(computer.style.clipPath).toContain(
    occluderHole(SSM.status, {
      left: commBox.left,
      top: commBox.top,
      width: 560,
      height: 330,
    })
  );

  // The ghost courier 120px in and 70px down the box.
  const courier = container.querySelector<HTMLElement>(
    '.halloween-courier-deliver'
  )!;
  expect(courier).toHaveStyle({
    left: `${commBox.left + 120}px`,
    top: `${commBox.top + 70}px`,
  });

  // The spider at the board's 47%, on its 104px thread, bobbing 3.2s, with
  // nothing cut out of it (its spot clears the bubble).
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(spiderLeftAt(0.47));
  expect(spider.firstElementChild).toHaveStyle({ height: '104px' });
  expect(spider.style.clipPath).toBe('');

  // The flickering pumpkin, and only the waiting board's pieces.
  expectPosePumpkin(container);
  expect(container.querySelector('.halloween-monster-fuzz')).toBeNull();
  expect(container.querySelector('.halloween-monster-frank')).toBeNull();
  expect(container.querySelector('.halloween-courier-fly')).toBeNull();
});

test('SSM2 declined renders the sad pumpkin whole beside the declined face, the envelope, the sad ghost and the monster', async () => {
  vi.mocked(calls.requestFollower).mockReturnValueOnce(
    Promise.resolve({ success: true, data: { accepted: false } })
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': SSM.declinedStatus,
  });
  const { container } = renderPage(<SSM2 />);

  // The friend said no, so the declined board's pieces arrive with the
  // ssm2-declined Scene.
  const pumpkin = await waitFor(() => {
    const found = container.querySelector<HTMLElement>(
      '.halloween-sad-pumpkin'
    );
    expect(found).not.toBeNull();
    return found;
  });
  const pumpkinBox = pumpkin.closest('div') as HTMLElement;

  // The board's communication box, centred on the declined face the GUI
  // lays in the status's spot (the board carries no status of its own).
  const commBox = {
    left: SSM.declinedStatus.left + SSM.declinedStatus.width / 2 - 280,
    top: SSM.declinedStatus.top + SSM.declinedStatus.height / 2 - 280,
  };
  // The sad pumpkin stands whole, as on the board: no occluder hole slices
  // through its face...
  expect(pumpkinBox.style.clipPath).toBe('');
  // ...and where its board spot crosses the declined face (the page's own
  // content, which no piece may cover), it stands beside the face instead,
  // flush at the face's left edge and never further left than 24px clear
  // of the speech bubble.
  const boardSpot = {
    left: commBox.left + 140,
    top: commBox.top + 40,
    right: commBox.left + 140 + 280,
    bottom: commBox.top + 40 + 270,
  };
  expect(
    intersects(boardSpot, SSM.declinedStatus),
    'the pumpkin’s board spot crosses the declined face, so the move below can fail'
  ).toBe(true);
  const pumpkinLeft = Math.max(
    Math.min(boardSpot.left, SSM.declinedStatus.left - 280),
    SSM.bubble.left + SSM.bubble.width + 24
  );
  expect(pumpkinBox).toHaveStyle({
    left: `${pumpkinLeft}px`,
    top: `${boardSpot.top}px`,
  });
  const pumpkinPlaced = {
    left: pumpkinLeft,
    top: boardSpot.top,
    right: pumpkinLeft + 280,
    bottom: boardSpot.top + 270,
  };
  expect(intersects(pumpkinPlaced, SSM.declinedStatus)).toBe(false);

  // The crossed-out envelope 404px in and 252px down the box.
  const envelope = container.querySelector<HTMLElement>(
    'svg[width="120"][viewBox="0 0 120 84"]'
  )!;
  expect(envelope).not.toBeNull();
  expect(envelope.style.left).toBe(`${commBox.left + 404}px`);
  expect(envelope.style.top).toBe(`${commBox.top + 252}px`);

  // The sad ghost keeps its board spot, or drops below the pumpkin where
  // the pumpkin's clamped spot crosses it (its board spot crosses the
  // pumpkin here): never over the pumpkin, never over the declined face,
  // floating the board's own slower 4.4s.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${commBox.left + 20}px`);
  expect(
    commBox.left + 20 + 84 > pumpkinLeft &&
      commBox.left + 20 < pumpkinLeft + 280 &&
      commBox.top + 120 + 100 > boardSpot.top &&
      commBox.top + 120 < boardSpot.top + 270,
    'the ghost’s board spot crosses the pumpkin, so the move below can fail'
  ).toBe(true);
  expect(ghost.style.top).toBe(`${boardSpot.top + 270 + 20}px`);
  const ghostPlaced = {
    left: commBox.left + 20,
    top: boardSpot.top + 270 + 20,
    right: commBox.left + 20 + 84,
    bottom: boardSpot.top + 270 + 20 + 100,
  };
  expect(intersects(ghostPlaced, pumpkinPlaced)).toBe(false);
  expect(intersects(ghostPlaced, SSM.declinedStatus)).toBe(false);
  expect(ghost).toHaveStyle({ animationDuration: '4.4s' });
  // The sad ghost's own drooping arms, brows and frown.
  expect(
    ghost.querySelector('path[d="M32 38 L46 42 M72 38 L58 42"]')
  ).not.toBeNull();
  expect(ghost.querySelector('path[d="M44 70 Q52 62 60 70"]')).not.toBeNull();

  // The monster leaning in from the stage's right edge, 300px down, its
  // tear rolling.
  const frank = container.querySelector<HTMLElement>(
    '.halloween-monster-frank'
  )!.parentElement!;
  expect(frank).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 130}px`,
    top: `${STAGE.top + 300}px`,
  });
  expect(frank.querySelector('.halloween-tear')).not.toBeNull();

  // The spider at the board's 41%, on its 140px thread, bobbing 4.2s.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(spiderLeftAt(0.41));
  expect(spider.firstElementChild).toHaveStyle({ height: '140px' });
  expect(spider).toHaveStyle({ animationDuration: '4.2s' });

  // The flickering pumpkin, and only the declined board's pieces.
  expectPosePumpkin(container);
  expect(container.querySelector('.halloween-monster-fuzz')).toBeNull();
  expect(container.querySelector('.halloween-monster-cat')).toBeNull();
  expect(container.querySelector('.halloween-spark')).toBeNull();
});

test('the SSM2 waiting pieces follow the status when the status moves', async () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': SSM.status,
  });
  const { container } = renderPage(<SSM2 />);
  await waitFor(() => {
    expect(container.querySelector('.halloween-monster-cat')).not.toBeNull();
  });

  // The status moves down the page (the page relays itself out); the
  // communication box follows it, and the computer's status hole with it.
  const moved = box(940, 550, 80, 80);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': moved,
  });
  fireEvent(window, new Event('resize'));

  const commBox = {
    left: moved.left + moved.width / 2 - 280,
    top: Math.max(moved.top - 330, STAGE.top),
  };
  const cat = container.querySelector<HTMLElement>(
    '.halloween-monster-cat'
  )!.parentElement!;
  expect(cat).toHaveStyle({
    left: `${commBox.left + 404}px`,
    top: `${commBox.top + 30}px`,
  });
  const computer = container.querySelector<HTMLElement>(
    'svg[viewBox="0 0 560 330"]'
  )!.parentElement as HTMLElement;
  expect(computer).toHaveStyle({
    left: `${commBox.left}px`,
    top: `${commBox.top}px`,
  });
  expect(computer.style.clipPath).toContain(
    occluderHole(moved, {
      left: commBox.left,
      top: commBox.top,
      width: 560,
      height: 330,
    })
  );
});

test('SSM3 renders the board’s own web and spider, and the tentacle monster — no moon, no bats', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
  });
  const { container } = renderPage(<SSM3 />);

  // The board's own ambient set: the web and the spider, 3% in from the
  // stage's left on its 230px thread. The board carries no moon and no
  // bats, so neither renders.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 160 160"]')).toBeNull();
  expect(container.querySelector('.halloween-bats')).toBeNull();
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(STAGE.left + STAGE.width * 0.03);
  expect(spider.firstElementChild).toHaveStyle({ height: '230px' });
  expect(spider).toHaveStyle({ animationDuration: '3.6s' });

  // The flickering pumpkin under the pose, clamped to the stage's bottom.
  expectPosePumpkin(container);

  // The tentacle monster rising from the stage's bottom right (24px in),
  // its arm swaying, hidden below the stage's edge at rest.
  const tentacle = container.querySelector<HTMLElement>(
    '.halloween-monster-tentacle'
  )!.parentElement!;
  expect(tentacle).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 24 - 110}px`,
    top: `${STAGE.bottom - 170}px`,
    overflow: 'hidden',
  });
  expect(tentacle.querySelector('.halloween-tentacle-sway')).not.toBeNull();

  // No other Scene's monster leaks onto the page.
  for (const other of otherMonsters.filter(
    (monster) => monster !== '.halloween-monster-tentacle'
  )) {
    expect(container.querySelector(other)).toBeNull();
  }
});

const SSM4_PARAMS =
  'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader';

function renderSsm4(params: string) {
  searchParams.current = new URLSearchParams(params);
  return renderPage(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
}

test('SSM4 renders the werewolf and the cheering ghost on a partial match, and no sparks', () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm4-circle': SSM.circle,
  });
  const { container } = renderSsm4(
    'success=true&n_matching_bits=3&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );

  // The stage-anchored pieces: web, moon and bats, cut around the results
  // circle the page draws (as on SSM1).
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  const disc = {
    cx: SSM.circle.left + SSM.circle.width / 2,
    cy: SSM.circle.top + SSM.circle.height / 2,
    r: (SSM.circle.width - 2 * 58) / 2,
  };
  const moonLeft = STAGE.left + STAGE.width - STAGE.width * 0.07 - 160;
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  expect(disc.cx - disc.r).toBeLessThan(moonLeft + 160);
  expect(moon.style.clipPath).toMatch(/^path\(evenodd,/);
  expect(moon.style.clipPath).toContain(
    ` M${disc.cx - disc.r - moonLeft} ${disc.cy - (STAGE.top + 28)} a${disc.r} ${disc.r} 0 1 0 ${disc.r * 2} 0 a${disc.r} ${disc.r} 0 1 0 ${-disc.r * 2} 0 Z`
  );

  // The spider at the board's 40%, on its 70px thread.
  const spider = container.querySelector<HTMLElement>('.halloween-spider')!;
  expect(parseFloat(spider.style.left)).toBe(spiderLeftAt(0.4));
  expect(spider.firstElementChild).toHaveStyle({ height: '70px' });

  // The werewolf rising from the stage's bottom right (64px in), its arms
  // cheering, hidden below the stage's edge at rest.
  const wolf = container.querySelector<HTMLElement>(
    '.halloween-monster-wolf'
  )!.parentElement!;
  expect(wolf).toHaveStyle({
    left: `${STAGE.left + STAGE.width - 64 - 140}px`,
    top: `${STAGE.bottom - 150}px`,
    overflow: 'hidden',
  });
  expect(wolf.querySelector('.halloween-wolf-arm-l')).not.toBeNull();
  expect(wolf.querySelector('.halloween-wolf-arm-r')).not.toBeNull();

  // The flickering pumpkin under the pose, clamped to the stage's bottom.
  expectPosePumpkin(container);

  // The cheering ghost 96px left of the results circle and 300px down it.
  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${SSM.circle.left - 96}px`);
  expect(ghost.style.top).toBe(`${SSM.circle.top + 300}px`);
  // The cheering ghost's own raised arms, happy eyes and grin.
  expect(
    ghost.querySelector('path[d="M20 54 Q6 40 8 26 Q16 30 22 42"]')
  ).not.toBeNull();
  expect(
    ghost.querySelector('path[d="M34 48 Q40 40 46 48 M58 48 Q64 40 70 48"]')
  ).not.toBeNull();
  expect(ghost.querySelector('path[d="M42 62 Q52 76 62 62 Z"]')).not.toBeNull();

  // Not a perfect match: no sparks anywhere (decision 14).
  expect(
    container.querySelectorAll('.halloween-spark, .halloween-spark-late')
  ).toHaveLength(0);

  // No other Scene's monster leaks onto the page.
  for (const other of otherMonsters.filter(
    (monster) => monster !== '.halloween-monster-wolf'
  )) {
    expect(container.querySelector(other)).toBeNull();
  }
});

test('SSM4 twinkles its gold sparks on the results circle only on a perfect match', async () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm4-circle': SSM.circle,
  });
  const { container } = renderSsm4(SSM4_PARAMS);
  expect(screen.getByText('Woo!! Hoo!!')).toBeInTheDocument();

  // The board's four sparks on the results circle, in its own circle
  // coordinates, two of them late — the ssm4-perfect Scene's Decorations
  // (decision 14), inside the aria-hidden Decorations layer.
  const sparks = container.querySelectorAll<HTMLElement>(
    '.halloween-spark, .halloween-spark-late'
  );
  expect(sparks).toHaveLength(4);
  expect(container.querySelectorAll('.halloween-spark-late')).toHaveLength(2);
  const sparkSvg = sparks[0].closest('svg') as HTMLElement;
  expect(sparkSvg.getAttribute('viewBox')).toBe('0 0 560 560');
  expect(sparkSvg.style.left).toBe(`${SSM.circle.left}px`);
  expect(sparkSvg.style.top).toBe(`${SSM.circle.top}px`);
  expect(sparkSvg.closest('[aria-hidden="true"]')).not.toBeNull();

  // EmojiConfetti stays exactly as today: the perfect match still bursts
  // the player's own emoji around the result, separate from the sparks
  // (decision 14) — every particle carries the player's emoji (😂, the one
  // the page's own params carry), and the particles are the page's own,
  // outside the Decorations layer.
  await waitFor(
    () => {
      expect(
        document.querySelectorAll('.emoji-confetti-particle').length
      ).toBeGreaterThan(0);
    },
    { timeout: 2000 }
  );
  const particles = document.querySelectorAll('.emoji-confetti-particle');
  expect(particles.length).toBeGreaterThan(0);
  for (const particle of particles) {
    expect(particle.textContent).toBe('😂');
  }
  expect(
    sparkSvg.contains(document.querySelector('.emoji-confetti-particle'))
  ).toBe(false);
});

test('the SSM4 ghost and sparks follow the results circle when it moves', async () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm4-circle': SSM.circle,
  });
  const { container } = renderSsm4(SSM4_PARAMS);

  const moved = box(874, 150, 560, 560);
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm4-circle': moved,
  });
  fireEvent(window, new Event('resize'));

  const ghost = container.querySelector<HTMLElement>('.halloween-ghost')!;
  expect(ghost.style.left).toBe(`${moved.left - 96}px`);
  expect(ghost.style.top).toBe(`${moved.top + 300}px`);
  const sparkSvg = container
    .querySelector<HTMLElement>('.halloween-spark')!
    .closest('svg') as HTMLElement;
  expect(sparkSvg.style.left).toBe(`${moved.left}px`);
  expect(sparkSvg.style.top).toBe(`${moved.top}px`);
});

test('SSM1 keeps its stage Decorations, and omits only its ghost, on a send error', async () => {
  vi.mocked(calls.submitQKDEmoji).mockReturnValueOnce(
    Promise.resolve({ success: false })
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm1-circle': SSM.circle,
  });
  const { container } = renderPage(<SSM1 />);

  // Choose an emoji and send it; the send fails, so the page swaps the
  // emoji circle for its broken-computer image and the circle's anchor
  // goes with it (the page relays itself out around it).
  fireEvent.click(screen.getByText('Tap'));
  const dialog = await screen.findByRole('dialog');
  // One of the real picker's own emoji buttons (they carry the emoji's
  // unified code, not its character, as text).
  await revealPickerEmojis();
  const emoji = await waitFor(() => {
    const found = dialog.querySelector<HTMLButtonElement>(
      'button[data-unified]'
    );
    expect(found).not.toBeNull();
    return found;
  });
  fireEvent.click(emoji);
  // The picker closes over MUI's exit transition, which keeps the page
  // aria-hidden behind the modal until it ends.
  const next = await screen.findByRole('link', { name: 'Next' });
  fireEvent.click(next);
  await screen.findByText(/There was an error sending your emoji/);
  fireEvent(window, new Event('resize'));

  // The stage-anchored pieces all stay: web, moon, bats, the spider, the
  // skeleton and the flickering pumpkin under Whobit's pose.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  const moon = container.querySelector('svg[viewBox="0 0 160 160"]')!
    .parentElement as HTMLElement;
  const bats = container.querySelector('.halloween-bats')!
    .parentElement as HTMLElement;
  expect(moon).not.toBeNull();
  expect(bats).not.toBeNull();
  expect(container.querySelector('.halloween-spider')).not.toBeNull();
  expect(container.querySelector('.halloween-monster-skel')).not.toBeNull();
  expectPosePumpkin(container);

  // The ghost is omitted — its anchor is gone, and the board's error
  // variant draws no ghost either — and with no circle drawn over them,
  // the moon and the bats are whole.
  expect(container.querySelector('.halloween-ghost')).toBeNull();
  expect(moon.style.clipPath).toBe('');
  expect(bats.style.clipPath).toBe('');
});

test('SSM2 keeps its stage Decorations, and omits its status-placed pieces, on a connection error', async () => {
  vi.mocked(calls.requestFollower).mockReturnValueOnce(
    Promise.resolve({ success: false })
  );
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm2-status': SSM.status,
  });
  const { container } = renderPage(<SSM2 />);

  // The request to the other computer fails, so the page shows its error
  // text and its broken-computer image instead of a status (agent decision
  // A2: still the ssm2-waiting Scene), and the status's anchor goes with
  // the spinner (the page relays itself out around it).
  await screen.findByText(
    /There was an error connecting to the other computer/
  );
  fireEvent(window, new Event('resize'));

  // The stage-anchored pieces all stay: web, moon, bats, the spider and
  // the flickering pumpkin under Whobit's pose.
  expect(container.querySelector('svg[viewBox="0 0 200 200"]')).not.toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 160 160"]')).not.toBeNull();
  expect(container.querySelector('.halloween-bats')).not.toBeNull();
  expect(container.querySelector('.halloween-spider')).not.toBeNull();
  expectPosePumpkin(container);

  // The status-placed pieces are omitted: no cat, no friend computer, no
  // ghost courier — and no fuzz ball, this being the waiting board.
  expect(container.querySelector('.halloween-monster-cat')).toBeNull();
  expect(container.querySelector('svg[viewBox="0 0 560 330"]')).toBeNull();
  expect(container.querySelector('.halloween-courier-deliver')).toBeNull();
  expect(container.querySelector('.halloween-monster-fuzz')).toBeNull();
});

test('SSM1 keeps the page’s own full emoji picker under Halloween', async () => {
  setAnchors({
    stage: STAGE,
    'whobit-bubble': SSM.bubble,
    'whobit-pose': SSM.pose,
    'ssm1-circle': SSM.circle,
  });
  const { container } = renderPage(<SSM1 />);

  // Decision 4: SSM keeps the full emoji picker in every Seasonal Theme —
  // the board's short Halloween emoji list is not built, and the
  // Decorations layer carries no picker of its own (only the board's
  // pieces, all inert).
  fireEvent.click(screen.getByText('Tap'));
  const dialog = await screen.findByRole('dialog');
  const picker = dialog.querySelector('.epr-body');
  expect(picker).not.toBeNull();
  // The real picker's own list runs far past the board's 24 Halloween
  // emoji (its first category alone holds more), so a themed short list
  // swapped in fails here.
  await revealPickerEmojis();
  await waitFor(() => {
    expect(
      dialog.querySelectorAll('button[data-unified]').length
    ).toBeGreaterThan(24);
  });
  // Nothing the Decorations layer draws is a control (decision 10).
  expect(
    container.querySelectorAll('[aria-hidden="true"] button')
  ).toHaveLength(0);
});
