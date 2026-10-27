import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { PaletteOptions } from '@mui/material/styles';

/**
 * The Palette part of a Seasonal Theme: overrides merged over the Default
 * Palette (src/theme.ts). Anything the theme leaves out keeps the Default
 * Theme's value.
 */
export type SeasonalPalette = PaletteOptions & {
  /**
   * The Measuring popup's progress track (decision 11, agent decision A5),
   * under MUI's own name for it: MUI's css-variables mode reads the track
   * from `palette.LinearProgress.primaryBg`, and `activeMuiTheme` maps this
   * value to a MuiLinearProgress track override, because the track MUI
   * derives from `primary.main` must not change (it is also the fill).
   */
  LinearProgress?: {
    primaryBg?: string;
  };
};

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
  /** How the accessory sits over the pose: CSS over the pose Box, which
   * grows the boards' 70px gap above the 288×288 pose while Whobit wears
   * an accessory, so the positions are the boards' own. */
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
  /** CHSH3 line under an entangled result. A theme may give a ReactNode so
   * the line can animate letter by letter (agent decision A4); a plain
   * string renders as it is. */
  'chsh3-entangled-line'?: string | ReactNode;
}

/**
 * The Scenes a page can be in (decision 10): the one fixed list every
 * Seasonal Theme shares, each Scene named after the design board it comes
 * from. A page picks the Scene from its own state; a theme maps any Scenes
 * it wants to Decorations.
 */
export type Scene =
  | 'home'
  | 'qf1'
  | 'qf2'
  | 'chsh1'
  | 'chsh2'
  | 'chsh3-entangled'
  | 'chsh3-weak'
  | 'chsh3-error'
  | 'ssm1'
  | 'ssm2-asking'
  | 'ssm2-waiting'
  | 'ssm2-declined'
  | 'ssm3'
  | 'ssm4'
  | 'ssm4-perfect'
  | 'measuring';

/**
 * The Decorations of one Scene (decision 10): the component a theme maps the
 * Scene to. The `measuring` Scene's component receives the Measuring popup's
 * read-only progress (decision 11).
 */
export type SceneDecorations = ComponentType<{
  /** The Measuring popup's read-only progress, 0–100 (decision 11). */
  progress?: number;
}>;

/**
 * The Celebration of a Seasonal Theme (decision 14): the effect when a Game
 * succeeds, rendered by CHSH3 (entangled) and SSM4 (perfect match). The
 * Default Theme's is today's Fireworks.
 */
export type Celebration = ComponentType;

/**
 * A Seasonal Theme: any of its six parts, each optional; anything it does
 * not set falls back to the Default Theme.
 */
export interface SeasonalTheme {
  palette?: SeasonalPalette;
  images?: SeasonalImages;
  /** The Whobit accessory, worn over each pose (decision 8). */
  whobitAccessory?: WhobitAccessory;
  /** Decorations per Scene (decision 10): a theme maps any Scenes it wants
   * to components; the Default Theme maps none. */
  decorations?: Partial<Record<Scene, SceneDecorations>>;
  /** The effect when a Game succeeds (decision 14). */
  celebration?: Celebration;
  /** Flavour copy slots, each defaulting to today's text (decision 13). */
  flavourCopy?: FlavourCopy;
}
