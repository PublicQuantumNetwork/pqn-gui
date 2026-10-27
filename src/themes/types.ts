import type { PaletteOptions } from '@mui/material/styles';

/**
 * The Palette part of a Seasonal Theme: overrides merged over the Default
 * Palette (src/theme.ts). Anything the theme leaves out keeps the Default
 * Theme's value.
 */
export type SeasonalPalette = PaletteOptions;

/**
 * The Images part of a Seasonal Theme: the slots a theme may replace with
 * its own files. Unset slots keep the Default Theme's files.
 */
export interface SeasonalImages {
  /** The page background (layout.tsx). */
  background?: string;
  /** Whobit's three poses (Whobit.tsx). */
  'whobit-right-wing-up'?: string;
  'whobit-arms-up'?: string;
  'whobit-arms-down'?: string;
  /** The Measuring popup's illustration (ModalBox, SSMModalBox). */
  'measuring-illustration'?: string;
}

/**
 * A Seasonal Theme: any of its six parts, each optional; anything it does
 * not set falls back to the Default Theme.
 */
export interface SeasonalTheme {
  palette?: SeasonalPalette;
  images?: SeasonalImages;
  /** Whobit accessory: an SVG worn over each pose (group 1.3 types it). */
  whobitAccessory?: unknown;
  /** Decorations per Scene (group 1.4 types it). */
  decorations?: unknown;
  /** The effect when a Game succeeds (group 1.4 types it). */
  celebration?: unknown;
  /** Flavour copy slots (group 1.3 types it). */
  flavourCopy?: unknown;
}
