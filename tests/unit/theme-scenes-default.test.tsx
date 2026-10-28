import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

/**
 * The Default Theme's Scenes and Celebration: it maps no Scene, so the
 * Decorations slot renders nothing at all, and its Celebration is today's
 * Fireworks, exactly where it renders today. Fireworks is mocked with a
 * sentinel so the tests can see where it lands;
 * tests/unit/theme-scenes.test.tsx holds the matching test-theme tests.
 */
vi.mock('@/components/Fireworks', async () => {
  const { createElement } = await import('react');
  return {
    default: () => createElement('div', null, 'fireworks-sentinel'),
  };
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

// Home renders the attract loop; disabled, it opens no display-command
// stream (and no EventSource exists under jsdom).
process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS = '0';

const router = vi.hoisted(() => ({ push: vi.fn(), replace: vi.fn() }));
const searchParams = vi.hoisted(() => ({
  current: new URLSearchParams(),
}));

import Fireworks from '@/components/Fireworks';
import Decorations from '@/components/Decorations';
import CHSH3 from '@/app/chsh/page3/page';
import SSM4 from '@/app/ssm/page4/page';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
import { activeCelebration, type Scene } from '@/themes';

test('the Default Theme’s Celebration is today’s Fireworks', () => {
  expect(activeCelebration()).toBe(Fireworks);
});

test('the Default Theme renders no Decorations for any Scene', () => {
  const scenes: Scene[] = [
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
  ];

  for (const scene of scenes) {
    const { container, unmount } = render(<Decorations scene={scene} />);
    // Nothing at all: no element that could shift a Default screen's layout.
    expect(container.firstChild).toBeNull();
    unmount();
  }
});

test('CHSH3 renders Fireworks only for an entangled result, as today', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  const { unmount } = render(<CHSH3 />);
  expect(screen.getByText('fireworks-sentinel')).toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const weak = render(<CHSH3 />);
  expect(screen.queryByText('fireworks-sentinel')).not.toBeInTheDocument();
  weak.unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  render(<CHSH3 />);
  expect(screen.queryByText('fireworks-sentinel')).not.toBeInTheDocument();
});

test('SSM4 renders Fireworks only for a perfect match, as today', () => {
  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const { unmount } = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.getByText('fireworks-sentinel')).toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=3&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const partial = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.queryByText('fireworks-sentinel')).not.toBeInTheDocument();
  partial.unmount();

  searchParams.current = new URLSearchParams('success=false');
  render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(screen.queryByText('fireworks-sentinel')).not.toBeInTheDocument();
});
