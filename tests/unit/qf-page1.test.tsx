import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';

vi.mock('@/calls', async () => (await import('./backend-mocks')).callsMock());
vi.mock('@/hooks/useSSE', async () =>
  (await import('./backend-mocks')).useSSEMock()
);
vi.mock('@/hooks/WebSocketHook', async () =>
  (await import('./backend-mocks')).useWebSocketMock()
);
vi.mock('next/navigation', async () =>
  (await import('./backend-mocks')).navigationMock()
);

import Page from '@/app/qf/page1/page';

test('renders the first page of Quantum Fortune', () => {
  render(<Page />);
  expect(
    screen.getByText(
      'Press the red button seven times to generate your fortune.'
    )
  ).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
});
