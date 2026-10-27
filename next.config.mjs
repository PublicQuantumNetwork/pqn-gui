import { isKnownThemeName, KNOWN_THEME_NAMES } from './src/themes/names.mjs';

// Decision 6: a NEXT_PUBLIC_SEASONAL_THEME that is not a known Seasonal
// Theme fails the build, naming the bad value and the known ones.
const seasonalTheme = process.env.NEXT_PUBLIC_SEASONAL_THEME;
if (seasonalTheme && !isKnownThemeName(seasonalTheme)) {
  throw new Error(
    `Unknown NEXT_PUBLIC_SEASONAL_THEME "${seasonalTheme}". Known Seasonal Themes: ${KNOWN_THEME_NAMES.join(', ')}.`
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.BUILD_DIR || '.next',
};

export default nextConfig;
