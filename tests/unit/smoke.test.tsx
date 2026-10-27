import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('renders React into jsdom', () => {
  render(<p>Hi, Quantum Adventurer!</p>);
  expect(screen.getByText('Hi, Quantum Adventurer!')).toBeInTheDocument();
});
