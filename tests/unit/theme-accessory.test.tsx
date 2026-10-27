import { render } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

/**
 * A sentinel Whobit accessory with a position per pose: Whobit must draw the
 * active theme's accessory over each pose at that pose's position. The
 * matching default-value test (no accessory at all) lives in
 * tests/unit/theme-images.test.tsx.
 */
const sentinels = vi.hoisted(() => ({
  accessory: {
    svg: '/images/test-whobit-accessory.svg',
    positions: {
      'right-wing-up': { top: '-10px', left: '30px', width: '160px' },
      'arms-up': { top: '-4px', left: '40px', width: '150px' },
      'arms-down': { top: '-6px', left: '35px', width: '155px' },
    },
  },
}));

vi.mock('@/themes', async () => {
  const actual = await vi.importActual<typeof import('@/themes')>('@/themes');
  return {
    ...actual,
    activeWhobitAccessory: () => sentinels.accessory,
  };
});

import MaintenancePage from '@/app/maintenance/page';
import Whobit from '@/components/Whobit';

type WhobitPose = keyof typeof sentinels.accessory.positions;

function accessoryImage(container: HTMLElement) {
  return container.querySelector<HTMLImageElement>(
    `img[src="${sentinels.accessory.svg}"]`
  );
}

test('the accessory renders over each pose at that pose’s position', () => {
  const { container, rerender } = render(
    <Whobit variant="right-wing-up">Hello</Whobit>
  );

  const expectPose = (pose: WhobitPose) => {
    const image = accessoryImage(container);
    expect(image).not.toBeNull();
    expect(image).toHaveStyle({
      position: 'absolute',
      ...sentinels.accessory.positions[pose],
    });
  };

  expectPose('right-wing-up');
  rerender(<Whobit variant="arms-up">Hello</Whobit>);
  expectPose('arms-up');
  rerender(<Whobit variant="arms-down">Hello</Whobit>);
  expectPose('arms-down');
});

test('Whobit wears no accessory where the page turns it off', () => {
  const { container } = render(
    <Whobit variant="arms-down" accessory={false}>
      Hello
    </Whobit>
  );

  expect(accessoryImage(container)).toBeNull();
  // Whobit itself still renders.
  expect(container.querySelector('img[alt="Whobit"]')).not.toBeNull();
});

test('Maintenance never shows the Whobit accessory', () => {
  const { container } = render(<MaintenancePage />);

  expect(accessoryImage(container)).toBeNull();
  // Whobit itself still renders on Maintenance.
  expect(container.querySelector('img[alt="Whobit"]')).not.toBeNull();
});
