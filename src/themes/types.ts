import type { CSSProperties } from 'react';
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
 * Whobit's three poses (decision 8): the Images slots' `whobit-…` keys
 * without the prefix.
 */
export type WhobitPose = 'right-wing-up' | 'arms-up' | 'arms-down';

/**
 * The Whobit accessory part of a Seasonal Theme (decision 8): an SVG drawn
 * over each of Whobit's three poses by `Whobit.tsx`, wherever Whobit appears.
 * Decision 9: Maintenance and Survey never show it.
 */
export interface WhobitAccessory {
  /** The accessory's SVG file. */
  svg: string;
  /** How the accessory sits over the pose: CSS over the 288×288 pose image. */
  positions: Record<WhobitPose, CSSProperties>;
}

/**
 * The Flavour copy part of a Seasonal Theme (decision 13): the named slots of
 * the plan's "User-facing text" table. Each slot defaults to today's text;
 * the lead-ins and the CHSH3 line have no text today, so a theme that leaves
 * them unset renders nothing there. Quantum Fortune's fortunes are
 * overridden by number.
 */
export interface FlavourCopy {
  /** Home greeting, first line. */
  'home-greeting-first-line'?: string;
  /** Home greeting, last line. */
  'home-greeting-last-line'?: string;
  /** QF1 lead-in, before the instruction. */
  'qf1-lead-in'?: string;
  /** QF2 lead-in, before "Your fortune is...". */
  'qf2-lead-in'?: string;
  /** Quantum Fortune's fortunes, overridden by number (decision 13). */
  fortunes?: Record<number, string>;
  /** CHSH3 line under an entangled result. */
  'chsh3-entangled-line'?: string;
}

/**
 * A Seasonal Theme: any of its six parts, each optional; anything it does
 * not set falls back to the Default Theme.
 */
export interface SeasonalTheme {
  palette?: SeasonalPalette;
  images?: SeasonalImages;
  /** The Whobit accessory, worn over each pose (decision 8). */
  whobitAccessory?: WhobitAccessory;
  /** Decorations per Scene (group 1.4 types it). */
  decorations?: unknown;
  /** The effect when a Game succeeds (group 1.4 types it). */
  celebration?: unknown;
  /** Flavour copy slots, each defaulting to today's text (decision 13). */
  flavourCopy?: FlavourCopy;
}
