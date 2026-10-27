import { render, screen } from '@testing-library/react';
import { afterAll, expect, test, vi } from 'vitest';

/**
 * The Halloween Seasonal Theme through the real registry and resolvers: with
 * NEXT_PUBLIC_SEASONAL_THEME=halloween every page renders its Flavour copy,
 * Whobit wears the witch hat, the Celebration is the bat-and-pumpkin burst
 * and the Measuring popup's track is the palette's cream. The env var is set
 * in vi.hoisted so it is in place before the pages are imported: CHSH3 and
 * SSM4 read their Celebration once, at module level.
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
vi.mock('next/navigation', async () => {
  const navigation = (await import('./backend-mocks')).navigationMock();
  return {
    ...navigation,
    // The QF2, CHSH3 and SSM4 pages read their result from the search params.
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
import CHSH1 from '@/app/chsh/page1/page';
import CHSH2 from '@/app/chsh/page2/page';
import CHSH3 from '@/app/chsh/page3/page';
import QF1 from '@/app/qf/page1/page';
import QF2 from '@/app/qf/page2/page';
import SSM1 from '@/app/ssm/page1/page';
import SSM2 from '@/app/ssm/page2/page';
import SSM3 from '@/app/ssm/page3/page';
import SSM4 from '@/app/ssm/page4/page';
import MaintenancePage from '@/app/maintenance/page';
import SurveyPage from '@/app/survey/page';
import Whobit from '@/components/Whobit';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
import Fireworks from '@/components/Fireworks';
import {
  activeCelebration,
  activeFortune,
  activeMuiTheme,
  getActiveTheme,
  knownThemes,
} from '@/themes';
import { KNOWN_THEME_NAMES } from '@/themes/names.mjs';

afterAll(() => {
  delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
});

/** The witch hat Whobit wears, as Whobit.tsx draws it. */
function hatImage(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>(
    'img[src="/images/whobit-witch-hat.svg"]'
  );
}

/** The bat-and-pumpkin burst layer. */
function burst(container: HTMLElement) {
  return container.querySelector('.halloween-burst');
}

test('halloween is a known Seasonal Theme, and the active one', () => {
  expect(KNOWN_THEME_NAMES).toEqual(['default', 'halloween']);
  expect(Object.keys(knownThemes)).toEqual(['default', 'halloween']);
  expect(getActiveTheme()).toBe(knownThemes.halloween);
  expect(getActiveTheme('halloween')).toBe(knownThemes.halloween);
});

test('Home renders the Halloween greeting around the fixed Whobit line', () => {
  const { container } = render(<Home />);

  expect(
    screen.getByText('Happy Halloween, Quantum Adventurer!')
  ).toBeInTheDocument();
  expect(screen.getByText("I'm Whobit.")).toBeInTheDocument();
  expect(screen.getByText('Pick a game… if you dare!')).toBeInTheDocument();
  expect(screen.queryByText('Hi, Quantum Adventurer!')).not.toBeInTheDocument();
  // Whobit wears the hat on Home.
  expect(hatImage(container)).not.toBeNull();
});

test('QF1 renders the lead-in before the fixed instruction, in the hat', () => {
  const { container } = render(<QF1 />);

  expect(screen.getByText('Gaze into my crystal ball…')).toBeInTheDocument();
  const instruction = screen.getByText(
    'Press the red button seven times to generate your fortune.'
  );
  expect(instruction.parentElement?.children).toHaveLength(2);
  expect(hatImage(container)).not.toBeNull();
});

test('QF2 renders the lead-in and the Halloween fortune for a number', () => {
  // Fortune #3 (the mocked /rng/fortune returns [2] and the GUI adds 1).
  searchParams.current = new URLSearchParams('value=3&fail=false');
  const { container } = render(<QF2 />);

  expect(screen.getByText('The spirits have spoken…')).toBeInTheDocument();
  expect(
    screen.getByText(
      'Entangled particles are everywhere, so are we ever really alone? Maybe check behind you.'
    )
  ).toBeInTheDocument();
  expect(hatImage(container)).not.toBeNull();
});

test('the Halloween fortunes override their numbers and only those', () => {
  const theme = knownThemes.halloween;

  expect(activeFortune(1, theme)).toBe(
    'Is that a ghost, or a particle in superposition? Nobody knows until somebody looks.'
  );
  expect(activeFortune(2, theme)).toBe(
    'Quantum means smallest quantity. Even the tiniest pumpkin can light up the whole night.'
  );
  expect(activeFortune(3, theme)).toBe(
    'Entangled particles are everywhere, so are we ever really alone? Maybe check behind you.'
  );
  // Every other number keeps today's fortune.
  expect(activeFortune(4, theme)).toBe(
    'My personal opinion is that the world is even weirder than what quantum physics tells us. - Anton Zeilinger'
  );
});

test('CHSH3 renders the spooky line under an entangled result, letter by letter', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  const { container } = render(<CHSH3 />);

  const letters = Array.from(container.querySelectorAll('.halloween-sp'));
  expect(letters.map((letter) => letter.textContent).join('')).toBe('spooky');
  // The letters bob one after the other, on the board's own delays.
  expect(letters[0]).toHaveStyle({ animationDelay: '0s' });
  expect(letters[1]).toHaveStyle({ animationDelay: '0.12s' });
  expect(letters[5]).toHaveStyle({ animationDelay: '0.6s' });
  expect(screen.getByText(/action at a distance/)).toBeInTheDocument();
  expect(screen.getByText('— Albert Einstein')).toBeInTheDocument();
  // Whobit wears the hat in the arms-up pose.
  expect(hatImage(container)).not.toBeNull();
});

test('the spooky line stays off a weak result and an error', () => {
  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const { unmount } = render(<CHSH3 />);
  expect(
    screen.getByText(/Some angles are better than others/)
  ).toBeInTheDocument();
  expect(screen.queryByText(/action at a distance/)).not.toBeInTheDocument();
  unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  render(<CHSH3 />);
  expect(
    screen.getByText(/There was an error, we will work on this/)
  ).toBeInTheDocument();
  expect(screen.queryByText(/action at a distance/)).not.toBeInTheDocument();
});

test('the hat sits over each pose at that pose’s position', () => {
  const { container, rerender } = render(
    <Whobit variant="right-wing-up">Hello</Whobit>
  );

  const expectHat = (style: Record<string, string>) => {
    const image = hatImage(container);
    expect(image).not.toBeNull();
    expect(image).toHaveStyle({ position: 'absolute', ...style });
  };

  // Every board draws the hat 160×110, rotated -8°; each pose's position
  // shifts by how far that pose's own aspect centres it in the pose box.
  expectHat({
    left: '36.5px',
    top: '-6px',
    width: '160px',
    height: '110px',
    transform: 'rotate(-8deg)',
  });
  rerender(<Whobit variant="arms-up">Hello</Whobit>);
  expectHat({
    left: '30px',
    top: '12.9px',
    width: '160px',
    height: '110px',
    transform: 'rotate(-8deg)',
  });
  rerender(<Whobit variant="arms-down">Hello</Whobit>);
  expectHat({
    left: '66.4px',
    top: '-6px',
    width: '160px',
    height: '110px',
    transform: 'rotate(-8deg)',
  });
});

test('the hat renders on every Whobit screen except Maintenance and Survey', () => {
  const screens = [
    ['CHSH1', () => render(<CHSH1 />)],
    ['CHSH2', () => render(<CHSH2 />)],
    [
      'CHSH3',
      () => {
        searchParams.current = new URLSearchParams(
          'value=2.62&error=0.05&fail=false'
        );
        return render(<CHSH3 />);
      },
    ],
    ['SSM1', () => render(<SSM1 />)],
    ['SSM2', () => render(<SSM2 />)],
    ['SSM3', () => render(<SSM3 />)],
    [
      'SSM4',
      () => {
        searchParams.current = new URLSearchParams(
          'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
        );
        return render(
          <PageRedirectProvider>
            <SSM4 />
          </PageRedirectProvider>
        );
      },
    ],
  ] as const;

  for (const [name, renderScreen] of screens) {
    const { container, unmount } = renderScreen();
    expect(hatImage(container), `${name} shows the hat`).not.toBeNull();
    unmount();
  }

  // Home, QF1 and QF2 are covered by their own tests above.
  const maintenance = render(<MaintenancePage />);
  expect(
    hatImage(maintenance.container),
    'Maintenance shows no hat'
  ).toBeNull();
  expect(
    maintenance.container.querySelector('img[alt="Whobit"]')
  ).not.toBeNull();
  maintenance.unmount();

  const survey = render(
    <PageRedirectProvider>
      <SurveyPage />
    </PageRedirectProvider>
  );
  expect(
    screen.getByText('Please take a moment to fill out this short survey.')
  ).toBeInTheDocument();
  expect(hatImage(survey.container), 'Survey shows no hat').toBeNull();
});

test('the Halloween Celebration is the burst, not Fireworks', () => {
  expect(activeCelebration(knownThemes.halloween)).not.toBe(Fireworks);
});

test('CHSH3 renders the burst only for an entangled result', () => {
  searchParams.current = new URLSearchParams(
    'value=2.62&error=0.05&fail=false'
  );
  const { container, unmount } = render(<CHSH3 />);
  expect(burst(container)).not.toBeNull();

  // The CHSH3 board's burst: three origins of eight items each, bats and
  // pumpkins alternating.
  const items = Array.from(container.querySelectorAll('.halloween-burst-item'));
  expect(items).toHaveLength(24);
  expect(items[0]).toHaveStyle({
    left: '520px',
    top: '110px',
    animationDelay: '0.00s',
  });
  expect(items[0].style.getPropertyValue('--x')).toBe('85px');
  expect(items[0].style.getPropertyValue('--y')).toBe('31px');
  const bats = items.filter((item) =>
    item.querySelector('svg')?.getAttribute('viewBox')?.includes('46 20')
  );
  expect(bats).toHaveLength(12);
  unmount();

  searchParams.current = new URLSearchParams('value=1.5&error=0.05&fail=false');
  const weak = render(<CHSH3 />);
  expect(burst(weak.container)).toBeNull();
  weak.unmount();

  searchParams.current = new URLSearchParams('value=2.62&error=0.05&fail=true');
  const error = render(<CHSH3 />);
  expect(burst(error.container)).toBeNull();
});

test('SSM4 renders the burst only for a perfect match', () => {
  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=5&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const perfect = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(burst(perfect.container)).not.toBeNull();
  perfect.unmount();

  searchParams.current = new URLSearchParams(
    'success=true&n_matching_bits=3&n_total_bits=5&emoji=%F0%9F%98%82&role=leader'
  );
  const partial = render(
    <PageRedirectProvider>
      <SSM4 />
    </PageRedirectProvider>
  );
  expect(burst(partial.container)).toBeNull();
});

test('the Halloween palette gives the Measuring popup’s track the cream colour', () => {
  // The palette's cream becomes a MuiLinearProgress override on the
  // primary-colour track (agent decision A5), and everything else keeps the
  // Default Theme's values — including the bar's fill, primary.main.
  const merged = activeMuiTheme(knownThemes.halloween);

  expect(merged.components.MuiLinearProgress).toEqual({
    variants: [
      { props: { color: 'primary' }, style: { backgroundColor: '#fff4dd' } },
    ],
  });
  expect(merged.palette.primary.main).toBe('#FF5F05');
  expect(merged.components.MuiButton).toEqual(
    activeMuiTheme(knownThemes.default).components.MuiButton
  );
});

test('a theme setting only the track keeps every other Default Palette value', () => {
  const merged = activeMuiTheme({
    palette: { LinearProgress: { primaryBg: '#fff4dd' } },
  });

  expect(merged.components.MuiLinearProgress).toEqual({
    variants: [
      { props: { color: 'primary' }, style: { backgroundColor: '#fff4dd' } },
    ],
  });
  expect(merged.palette.primary).toEqual(
    activeMuiTheme(knownThemes.default).palette.primary
  );

  // The Default Theme sets no track, so the merged theme gets no override at
  // all: the Default Theme is the untouched base palette.
  expect(
    activeMuiTheme(knownThemes.default).components.MuiLinearProgress
  ).toBeUndefined();
});
