import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('@/hooks/useSSE', async () =>
  (await import('./backend-mocks')).useSSEMock()
);

import ModalBox from '@/components/ModalBox';
import SSMModalBox from '@/components/SSMModalBox';
import Whobit from '@/components/Whobit';

test('Whobit reads each pose image from the Images slots', () => {
  const { rerender } = render(<Whobit variant="right-wing-up">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    '/images/whobit-right-wing-up.svg'
  );
  rerender(<Whobit variant="arms-up">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    '/images/whobit-arms-up.svg'
  );
  rerender(<Whobit variant="arms-down">Hello</Whobit>);
  expect(screen.getByRole('img', { name: 'Whobit' })).toHaveAttribute(
    'src',
    '/images/whobit-arms-down.svg'
  );
});

test('the Default Theme gives Whobit no accessory', () => {
  const { container } = render(<Whobit variant="arms-down">Hello</Whobit>);

  // Only the pose image renders: no accessory element at all.
  expect(container.querySelectorAll('img')).toHaveLength(1);
});

test('the Measuring popup reads its illustration from the Images slots', () => {
  render(<ModalBox />);
  expect(
    screen.getByRole('img', { name: 'Your photons in action!' })
  ).toHaveAttribute('src', '/images/gif_pqn.gif');
});

test('the SSM Measuring popup reads its illustration from the Images slots', () => {
  render(<SSMModalBox />);
  expect(
    screen.getByRole('img', { name: 'Your photons in action!' })
  ).toHaveAttribute('src', '/images/gif_pqn.gif');
});
