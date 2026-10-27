import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Page components read the active Seasonal Theme, whose Default Palette
// (src/theme.ts) loads its font through next/font; that only works inside
// a Next build, so stub the font for every test file.
vi.mock('next/font/google', () => ({
  Roboto: () => ({ style: { fontFamily: 'Roboto' } }),
}));

afterEach(() => cleanup());
