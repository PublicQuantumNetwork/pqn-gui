import { expect, test } from 'vitest';

import defaultPalette from '@/theme';
import { KNOWN_THEME_NAMES } from '@/themes/names.mjs';
import {
  activeImages,
  activeMuiTheme,
  getActiveTheme,
  knownThemes,
} from '@/themes';

test('the registry holds exactly the known Seasonal Theme names', () => {
  expect(Object.keys(knownThemes)).toEqual([...KNOWN_THEME_NAMES]);
});

test('an unset NEXT_PUBLIC_SEASONAL_THEME is the Default Theme', () => {
  expect(getActiveTheme(undefined)).toBe(knownThemes.default);
});

test('a known name gives that theme', () => {
  expect(getActiveTheme('default')).toBe(knownThemes.default);

  const registry = {
    default: {},
    'test-theme': { images: { background: '/images/test-background.png' } },
  };
  expect(getActiveTheme('test-theme', registry)).toBe(registry['test-theme']);
});

test('getActiveTheme() with no argument reads NEXT_PUBLIC_SEASONAL_THEME', () => {
  const saved = process.env.NEXT_PUBLIC_SEASONAL_THEME;
  try {
    // Unset is the Default Theme.
    delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
    expect(getActiveTheme()).toBe(knownThemes.default);

    // A known name gives that theme.
    process.env.NEXT_PUBLIC_SEASONAL_THEME = 'default';
    expect(getActiveTheme()).toBe(knownThemes.default);

    // The env var really is what is read: an unknown name is an error.
    process.env.NEXT_PUBLIC_SEASONAL_THEME = 'nosuchtheme';
    expect(() => getActiveTheme()).toThrow(/nosuchtheme[\s\S]*\bdefault\b/);
  } finally {
    if (saved === undefined) {
      delete process.env.NEXT_PUBLIC_SEASONAL_THEME;
    } else {
      process.env.NEXT_PUBLIC_SEASONAL_THEME = saved;
    }
  }
});

test('an unknown name is an error naming the bad value and the known ones', () => {
  expect(() => getActiveTheme('nosuchtheme')).toThrow(
    /nosuchtheme[\s\S]*\bdefault\b/
  );
});

test('the Default Theme leaves the Default Palette untouched', () => {
  expect(activeMuiTheme(getActiveTheme(undefined))).toBe(defaultPalette);
});

test('a theme setting one Palette colour keeps every other Default value', () => {
  const merged = activeMuiTheme({ palette: { primary: { main: '#8A2BE2' } } });

  expect(merged.palette.primary.main).toBe('#8A2BE2');
  // Every other value keeps the Default Theme's.
  expect(merged.palette.primary.light).toBe(
    defaultPalette.palette.primary.light
  );
  expect(merged.palette.primary.dark).toBe(defaultPalette.palette.primary.dark);
  expect(merged.palette.primary.contrastText).toBe(
    defaultPalette.palette.primary.contrastText
  );
  expect(merged.palette.secondary).toEqual(defaultPalette.palette.secondary);
  expect(merged.palette.text).toEqual(defaultPalette.palette.text);
  expect(merged.typography).toEqual(defaultPalette.typography);
  expect(merged.components).toEqual(defaultPalette.components);
});

test('the Default Theme renders today’s image files', () => {
  expect(activeImages(getActiveTheme(undefined))).toEqual({
    background: '/images/GUI-background.png',
    'whobit-right-wing-up': '/images/whobit-right-wing-up.svg',
    'whobit-arms-up': '/images/whobit-arms-up.svg',
    'whobit-arms-down': '/images/whobit-arms-down.svg',
    'measuring-illustration': '/images/gif_pqn.gif',
  });
});

test('a theme setting one image keeps every other Default image', () => {
  const images = activeImages({
    images: { 'measuring-illustration': '/images/cauldron.svg' },
  });

  expect(images['measuring-illustration']).toBe('/images/cauldron.svg');
  expect(images.background).toBe('/images/GUI-background.png');
  expect(images['whobit-right-wing-up']).toBe(
    '/images/whobit-right-wing-up.svg'
  );
  expect(images['whobit-arms-up']).toBe('/images/whobit-arms-up.svg');
  expect(images['whobit-arms-down']).toBe('/images/whobit-arms-down.svg');
});
