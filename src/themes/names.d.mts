/**
 * The types of the known Seasonal Theme names (names.mjs). The list itself
 * lives in the .mjs file so `next.config.mjs` can import it; keep the two
 * in sync (a Vitest test checks the registry against the runtime list).
 */
export declare const KNOWN_THEME_NAMES: readonly ['default'];

/** A name in the registry of known Seasonal Themes. */
export type SeasonalThemeName = (typeof KNOWN_THEME_NAMES)[number];

/** Whether `name` is a known Seasonal Theme name (exact, case-sensitive). */
export declare function isKnownThemeName(
  name: string
): name is SeasonalThemeName;
