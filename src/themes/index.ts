import { deepmerge } from '@mui/utils';
import type { Theme } from '@mui/material/styles';
import defaultPalette from '@/theme';
import { KNOWN_THEME_NAMES, type SeasonalThemeName } from './names.mjs';
import type { SeasonalImages, SeasonalTheme } from './types';

export * from './types';

/**
 * The Default Theme: sets no part, so every part falls back to today's
 * values — the Default Palette (src/theme.ts) and the default image files
 * below.
 */
const defaultTheme: SeasonalTheme = {};

/**
 * The registry of known Seasonal Themes, keyed by name; `satisfies` keeps
 * its keys exactly the known names, which `next.config.mjs` and the tests
 * rely on. Group 2.1 adds `halloween` here.
 */
export const knownThemes: Record<string, SeasonalTheme> = {
  default: defaultTheme,
} satisfies Record<SeasonalThemeName, SeasonalTheme>;

/**
 * The active Seasonal Theme (decision 5): `NEXT_PUBLIC_SEASONAL_THEME`
 * names it, read at build time; unset means the Default Theme. An unknown
 * name cannot survive the build (next.config.mjs, decision 6), so it is an
 * error here too. Tests pass a name and registry directly to try other
 * themes.
 */
export function getActiveTheme(
  seasonalTheme: string | undefined = process.env.NEXT_PUBLIC_SEASONAL_THEME,
  registry: Record<string, SeasonalTheme> = knownThemes
): SeasonalTheme {
  if (!seasonalTheme) {
    return registry.default;
  }
  const theme = registry[seasonalTheme];
  if (!theme) {
    throw new Error(
      `Unknown Seasonal Theme "${seasonalTheme}". Known Seasonal Themes: ${KNOWN_THEME_NAMES.join(', ')}.`
    );
  }
  return theme;
}

/**
 * The Default Theme's image files: today's images, the fallback for every
 * Images slot a Seasonal Theme leaves unset.
 */
export const DEFAULT_IMAGES: Required<SeasonalImages> = {
  background: '/images/GUI-background.png',
  'whobit-right-wing-up': '/images/whobit-right-wing-up.svg',
  'whobit-arms-up': '/images/whobit-arms-up.svg',
  'whobit-arms-down': '/images/whobit-arms-down.svg',
  'measuring-illustration': '/images/gif_pqn.gif',
};

/**
 * The active theme's Images: its slots over the Default Theme's files, so
 * a theme that sets one slot keeps every other Default image.
 */
export function activeImages(
  theme: SeasonalTheme = getActiveTheme()
): Required<SeasonalImages> {
  return { ...DEFAULT_IMAGES, ...theme.images };
}

/**
 * The MUI theme for the layout's ThemeProvider: the active theme's Palette
 * merged over the Default Palette, so a theme that sets one colour keeps
 * every other value of the Default Theme.
 */
export function activeMuiTheme(
  theme: SeasonalTheme = getActiveTheme(),
  base: Theme = defaultPalette
): Theme {
  if (!theme.palette) {
    return base;
  }
  return { ...base, palette: deepmerge(base.palette, theme.palette) };
}
