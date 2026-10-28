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

import Page from '@/app/chsh/page1/page';

test('renders the first page of Verify Quantum Link', () => {
  render(<Page />);
  // "Entangled photons" is a link inside the sentence, so match the paragraph.
  expect(
    screen.getByText(
      (_, element) =>
        element?.tagName === 'P' &&
        element.textContent?.normalize('NFKC') ===
          'Entangled photons are flying through the library.'
    )
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      'We are going to check that they are entangled using a Bell Test.'
    )
  ).toBeInTheDocument();
  // The button is rendered as a link (component="a" href="#").
  expect(screen.getByRole('link', { name: 'Next' })).toBeInTheDocument();
});
