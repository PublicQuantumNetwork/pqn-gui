/**
 * The names of the known Seasonal Themes: the keys of the theme registry
 * (src/themes/index.ts).
 *
 * A plain .mjs module because `next.config.mjs` imports it to check
 * `NEXT_PUBLIC_SEASONAL_THEME` at build time: the config is
 * loaded as native ESM, so it cannot import TypeScript, and the registry
 * (whose entries carry React components) must stay out
 * of the config bundle.
 */
export const KNOWN_THEME_NAMES = ['default', 'halloween'];

/** Whether `name` is a known Seasonal Theme name (exact, case-sensitive). */
export function isKnownThemeName(name) {
  return KNOWN_THEME_NAMES.includes(name);
}
