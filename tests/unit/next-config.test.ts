import { expect, test, vi } from 'vitest';

/**
 * The build check of decision 6: `next.config.mjs` fails the build when
 * NEXT_PUBLIC_SEASONAL_THEME is not a known Seasonal Theme, naming the bad
 * value and the known ones. The config is imported fresh (with the env var
 * under test set) so its module-level check runs.
 */
async function importNextConfig() {
  vi.resetModules();
  return import('../../next.config.mjs');
}

test('an unknown NEXT_PUBLIC_SEASONAL_THEME fails the build check, naming the bad value and the known ones', async () => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'nosuchtheme';
  try {
    await expect(importNextConfig()).rejects.toThrow(
      /nosuchtheme[\s\S]*\bdefault, halloween\b/
    );
  } finally {
    delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  }
});

test('an unset NEXT_PUBLIC_SEASONAL_THEME passes the build check', async () => {
  delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  const config = await importNextConfig();
  expect(config.default).toEqual({ distDir: '.next' });
});

test('a known name passes the build check', async () => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'default';
  try {
    const config = await importNextConfig();
    expect(config.default).toEqual({ distDir: '.next' });
  } finally {
    delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  }
});

test('halloween passes the build check', async () => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'halloween';
  try {
    const config = await importNextConfig();
    expect(config.default).toEqual({ distDir: '.next' });
  } finally {
    delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  }
});

test('a known name in another case fails the build check (the match is case-sensitive)', async () => {
  process.env.NEXT_PUBLIC_SEASONAL_THEME = 'Default';
  try {
    await expect(importNextConfig()).rejects.toThrow(
      /Default[\s\S]*\bdefault\b/
    );
  } finally {
    delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
  }
});
