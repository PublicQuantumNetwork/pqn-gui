import { createTheme, type Theme } from '@mui/material/styles';
import defaultPalette from '@/theme';
import defaultFortunes from '@/app/qf/page2/fortunes';
import Fireworks from '@/components/Fireworks';
import halloween from './halloween';
import { KNOWN_THEME_NAMES, type SeasonalThemeName } from './names.mjs';
import type {
  Celebration,
  FlavourCopy,
  Scene,
  SceneDecorations,
  SeasonalImages,
  SeasonalTheme,
  WhobitAccessory,
} from './types';

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
 * rely on.
 */
export const knownThemes: Record<string, SeasonalTheme> = {
  default: defaultTheme,
  halloween,
} satisfies Record<SeasonalThemeName, SeasonalTheme>;

/**
 * The active Seasonal Theme: `NEXT_PUBLIC_SEASONAL_THEME`
 * names it, read at build time; unset means the Default Theme. An unknown
 * name cannot survive the build (next.config.mjs), so it is an
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
  'polarization-wheel': '/images/circle.png',
  'polarization-arrow': '/images/arrow.png',
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
  // The Measuring popup's progress track:
  // the palette's LinearProgress.primaryBg becomes a MuiLinearProgress
  // override on the primary-colour track, which MUI would otherwise derive
  // from primary.main — the bar's fill, which keeps the Default Theme's
  // colour. A theme that sets no track gets no override at all.
  const track = theme.palette.LinearProgress?.primaryBg;
  // createTheme deep-merges its extra arguments into the theme it builds,
  // so the theme's Palette lands over the Default Palette and every value
  // it leaves out keeps the Default Theme's.
  return createTheme(
    base,
    { palette: theme.palette },
    ...(track
      ? [
          {
            components: {
              MuiLinearProgress: {
                variants: [
                  {
                    props: { color: 'primary' },
                    style: { backgroundColor: track },
                  },
                ],
              },
            },
          },
        ]
      : [])
  );
}

/**
 * The Default Theme's Flavour copy: today's text, the fallback
 * for every slot a Seasonal Theme leaves unset. The lead-ins and the CHSH3
 * line have no text today, so their Default value is nothing at all.
 */
export const DEFAULT_FLAVOUR_COPY = {
  'home-greeting-first-line': 'Hi, Quantum Adventurer!',
  'home-greeting-last-line': 'What would you like to do?',
} satisfies Partial<FlavourCopy>;

/**
 * The Default Theme's Quantum Fortune fortunes by number:
 * today's list, the value a Seasonal Theme's override for a number falls
 * back to.
 */
const DEFAULT_FORTUNES: Record<number, string> = Object.fromEntries(
  defaultFortunes.map(({ number, description }) => [number, description])
);

/**
 * The active theme's Flavour copy: its slots over the Default Theme's text,
 * so a theme that sets one slot keeps every other Default text. Fortunes are
 * resolved by number through `activeFortune`, not read off this object.
 */
export function activeFlavourCopy(
  theme: SeasonalTheme = getActiveTheme()
): FlavourCopy {
  return { ...DEFAULT_FLAVOUR_COPY, ...theme.flavourCopy };
}

/**
 * The active theme's fortune for a number: the theme's override if it has
 * one, today's fortune otherwise, so a theme overriding one number changes
 * only that number.
 */
export function activeFortune(
  fortuneNumber: number,
  theme: SeasonalTheme = getActiveTheme()
): string | undefined {
  return (
    theme.flavourCopy?.fortunes?.[fortuneNumber] ??
    DEFAULT_FORTUNES[fortuneNumber]
  );
}

/**
 * The active theme's Whobit accessory, or nothing when the theme sets none.
 */
export function activeWhobitAccessory(
  theme: SeasonalTheme = getActiveTheme()
): WhobitAccessory | undefined {
  return theme.whobitAccessory;
}

/**
 * The active theme's Decorations for a Scene: the component
 * the theme maps the Scene to, or nothing when it maps none — the Default
 * Theme maps no Scene, so it renders no Decorations at all.
 */
export function activeDecorations(
  scene: Scene,
  theme: SeasonalTheme = getActiveTheme()
): SceneDecorations | undefined {
  return theme.decorations?.[scene];
}

/**
 * The active theme's Celebration: the effect when a Game
 * succeeds. The Default Theme sets none, so it keeps today's Fireworks.
 */
export function activeCelebration(
  theme: SeasonalTheme = getActiveTheme()
): Celebration {
  return theme.celebration ?? Fireworks;
}
