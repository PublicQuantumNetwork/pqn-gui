import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import type { Celebration, Scene, SceneDecorations } from '@/themes';

/**
 * A sentinel test theme: it maps every Scene to Decorations that render the
 * Scene's name (and the progress the `measuring` Scene passes), and its
 * Celebration renders a sentinel of its own. Every page must render its
 * Scene's Decorations and no other Scene's, through the real resolvers.
 * tests/unit/theme-scenes-default.test.tsx holds the matching Default-value
 * tests.
 */
const sentinels = vi.hoisted(() => ({
  scenes: [
    'home',
    'qf1',
    'qf2',
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
    'measuring',
  ] as const,
}));

vi.mock('@/themes', async () => {
  const actual = await vi.importActual<typeof import('@/themes')>('@/themes');
  const { createElement } = await import('react');
  const decorations = Object.fromEntries(
    sentinels.scenes.map(
      (scene) =>
        [
          scene,
          (props: { progress?: number }) =>
            createElement(
              'div',
              null,
              `decorations-${scene}`,
              props.progress !== undefined
                ? createElement('span', null, `progress-${props.progress}`)
                : null
            ),
        ] as const
    )
  ) as Partial<Record<Scene, SceneDecorations>>;
  const celebration: Celebration = () =>
    createElement('div', null, 'celebration-sentinel');
  return {
    ...actual,
    // The pages read a test theme through the real resolvers, so these
    // tests exercise the same lookup the registry's themes get.
    activeDecorations: (scene: Scene) =>
      actual.activeDecorations(scene, { decorations }),
    activeCelebration: () => celebration,
  };
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

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const searchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));
// The Measuring popup reads its progress from the SSE stream, so the mock
// hands it a fixed message per test.
const sse = vi.hoisted(() => ({
  message: null as null | { event: string; current: number; total: number },
}));

import * as calls from '@/calls';
import Home from '@/app/page';
import QF1 from '@/app/qf/page1/page';
import QF2 from '@/app/qf/page2/page';
import CHSH1 from '@/app/chsh/page1/page';
import CHSH2 from '@/app/chsh/page2/page';
import CHSH3 from '@/app/chsh/page3/page';
import SSM1 from '@/app/ssm/page1/page';
import SSM2 from '@/app/ssm/page2/page';
import SSM3 from '@/app/ssm/page3/page';
import SSM4 from '@/app/ssm/page4/page';
import MaintenancePage from '@/app/maintenance/page';
import SurveyPage from '@/app/survey/page';
import ModalBox from '@/components/ModalBox';
import SSMModalBox from '@/components/SSMModalBox';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';

/** The page shows this Scene's Decorations and no other Scene's. */
function expectScene(scene: string) {
  expect(screen.getByText(`decorations-${scene}`)).toBeInTheDocument();
  expectNoOtherScene(scene);
}

/** No Scene's Decorations render anywhere on the page (but `scene`'s). */
function expectNoOtherScene(scene?: string) {
  for (const other of sentinels.scenes) {
    if (other !== scene) {
      expect(
        screen.queryByText(`decorations-${other}`)
      ).not.toBeInTheDocument();
    }
  }
}

test('Home renders the home Scene', () => {
  render(<Home />);
  expectScene('home');
});

test('QF1 renders the qf1 Scene', () => {
  render(<QF1 />);
  expectScene('qf1');
});

test('QF2 renders the qf2 Scene for a fortune and for an error', () => {
  searchParams.current = new URLSearchParams('value=3&fail=false');
  const { unmount } = render(<QF2 />);
  expectScene('qf2');
  unmount();

  searchParams.current = new URLSearchParams('fail=true');
  render(<QF2 />);
  expectScene('qf2');
});

test('CHSH1 renders the chsh1 Scene and its controls still work', () => {
  render(<CHSH1 />);
  expectScene('chsh1');

  // The Decorations sit above the page but take no pointer events, so the
  // Next control underneath still receives the click.
  fireEvent.click(screen.getByRole('link', { name: 'Next' }));
  expect(router.push).toHaveBeenCalledWith('/chsh/page2/');
});

test('CHSH2 renders the chsh2 Scene', () => {
  render(<CHSH2 />);
  expectScene('chsh2');
});

test('CHSH3 renders the Scene its result calls for', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  const { unmount } = render(<CHSH3 />);
  expectScene('chsh3-entangled');
  unmount();

  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const weak = render(<CHSH3 />);
  expectScene('chsh3-weak');
  weak.unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  render(<CHSH3 />);
  expectScene('chsh3-error');
});

test('SSM1 renders the ssm1 Scene', () => {
  render(<SSM1 />);
  expectScene('ssm1');
});

test('SSM2 renders ssm2-asking while the request to the friend is in flight', () => {
  vi.mocked(calls.requestFollower).mockReturnValueOnce(new Promise(() => {}));
  render(<SSM2 />);

  expectScene('ssm2-asking');
  // Today's text stays: the two states differ only in Decorations.
  expect(screen.getByText('Waiting for response...')).toBeInTheDocument();
});

test('SSM2 renders ssm2-waiting once the request has answered without an answer', async () => {
  render(<SSM2 />);

  expect(
    await screen.findByText('decorations-ssm2-waiting')
  ).toBeInTheDocument();
  expect(screen.queryByText('decorations-ssm2-asking')).not.toBeInTheDocument();
});

test('SSM2 renders ssm2-declined when the friend declined', async () => {
  vi.mocked(calls.requestFollower).mockReturnValueOnce(
    Promise.resolve({ success: true, data: { accepted: false } })
  );
  render(<SSM2 />);

  expect(
    await screen.findByText('decorations-ssm2-declined')
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Other computer has said no to playing the game/)
  ).toBeInTheDocument();
});

test('SSM3 renders the ssm3 Scene', () => {
  render(<SSM3 />);
  expectScene('ssm3');
});

test('SSM4 renders the Scene its result calls for', () => {
  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const { unmount } = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expectScene('ssm4-perfect');
  unmount();

  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=3&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const partial = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expectScene('ssm4');
  partial.unmount();

  searchParams.current = new URLSearchParams('success=false');
  render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expectScene('ssm4');
});

test('Maintenance and Survey render no Decorations in any Seasonal Theme', () => {
  // The two pages stay exactly as today, so the Decorations
  // slot never renders on them, whatever the theme maps.
  const maintenance = render(<MaintenancePage />);
  expect(
    screen.getByText('All games are in maintenance mode')
  ).toBeInTheDocument();
  expectNoOtherScene();
  maintenance.unmount();

  render(
    <PageRedirectProvider>
      <SurveyPage />
    </PageRedirectProvider>
  );
  expect(
    screen.getByText('Please take a moment to fill out this short survey.')
  ).toBeInTheDocument();
  expectNoOtherScene();
});

test('the Measuring popup renders the measuring Scene with the read-only progress', () => {
  sse.message = { event: 'chsh_progress', current: 8, total: 16 };
  render(<ModalBox />);

  expectScene('measuring');
  expect(screen.getByText('progress-50')).toBeInTheDocument();
});

test('the SSM Measuring popup renders the measuring Scene, which shows no progress bar', () => {
  render(<SSMModalBox />);

  expectScene('measuring');
  expect(screen.queryByText(/^progress-/)).not.toBeInTheDocument();
});

test('Decorations sit above the page, hidden from assistive technology and unclickable', () => {
  render(<Home />);

  const wrapper = screen.getByText('decorations-home').parentElement;
  expect(wrapper).not.toBeNull();
  expect(wrapper).toHaveAttribute('aria-hidden', 'true');
  expect(wrapper).toHaveStyle({
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '999',
  });
});

test('CHSH3 and SSM4 render the theme’s Celebration on success', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  const { unmount } = render(<CHSH3 />);
  expect(screen.getByText('celebration-sentinel')).toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const weak = render(<CHSH3 />);
  expect(screen.queryByText('celebration-sentinel')).not.toBeInTheDocument();
  weak.unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  const error = render(<CHSH3 />);
  expect(screen.queryByText('celebration-sentinel')).not.toBeInTheDocument();
  error.unmount();

  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const perfect = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.getByText('celebration-sentinel')).toBeInTheDocument();
  perfect.unmount();

  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=3&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const partial = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.queryByText('celebration-sentinel')).not.toBeInTheDocument();
  partial.unmount();

  searchParams.current = new URLSearchParams('success=false');
  render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.queryByText('celebration-sentinel')).not.toBeInTheDocument();
});

test('the player’s own emoji still bursts on a perfect match, whatever the Celebration', () => {
  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );

  // EmojiConfetti is the same in every theme: the player's
  // emoji bursts alongside the theme's Celebration.
  const particles = document.querySelectorAll('.emoji-confetti-particle');
  expect(particles.length).toBeGreaterThan(0);
  expect(particles[0].textContent).toBe('😂');
});
