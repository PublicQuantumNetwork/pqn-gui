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

import Page from '@/app/ssm/page1/page';

test('renders the first page of Share a Secret Message', () => {
  render(<Page />);
  expect(
    screen.getByText('Choose a message to send to your friend!', {
      exact: false,
    })
  ).toBeInTheDocument();
  expect(screen.getByText('Tap')).toBeInTheDocument();
  // The button is rendered as a link (component="a" href="#").
  expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
});
