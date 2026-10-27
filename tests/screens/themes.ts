/**
 * One entry per Seasonal Theme the screenshot harness builds and serves
 * (decision 15, agent decision A1). Adding a theme is one entry here; the
 * Playwright config starts one web server per entry and the specs run against
 * every entry.
 */
export interface ThemeServer {
  /** Theme name; also the folder its screenshots go to. */
  name: string;
  /** Port the theme's own `next start` server listens on. */
  port: number;
  /**
   * Own build directory, so a test build never shares `.next` with
   * `npm run build` (both are gitignored, like Next's other instance dirs).
   */
  buildDir: string;
  /** `NEXT_PUBLIC_SEASONAL_THEME` value; unset means the Default Theme. */
  seasonalTheme?: string;
}

/** The themes the harness serves. */
export const THEMES: ThemeServer[] = [
  { name: 'default', port: 3300, buildDir: '.next-a' },
  {
    name: 'halloween',
    port: 3301,
    buildDir: '.next-b',
    seasonalTheme: 'halloween',
  },
];

/**
 * Themes whose screenshots are compared with committed baselines. Every other
 * theme is captured without comparison into tests/screens/<name>/ (gitignored)
 * for the design checker to review against the design boards.
 */
export const BASELINE_THEMES: ReadonlySet<string> = new Set(['default']);

/**
 * The backend host baked into the test build. It does not resolve anywhere:
 * every HTTP, SSE and WebSocket call the GUI makes to it is answered by route
 * interception (tests/screens/backend.ts), never by the network.
 */
export const MOCK_API_ADDRESS = 'pqn-backend.test';
