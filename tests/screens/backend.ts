import { readFile } from 'node:fs/promises';
import type { Page, Route, WebSocketRoute } from '@playwright/test';

/** Fixed data the mocked backend answers with (fixed fortune number, fixed CHSH value, fixed emoji). */
export const FORTUNE_INDEX = 2; // /rng/fortune returns [2]; the GUI adds 1 → fortune #3
export const CHSH_VALUE = 2.62;
export const CHSH_ERROR = 0.05;
export const QUESTION_ORDER = [1, 2, 3, 4, 5];
export const SSM_EMOJI = '😂';
export const ROTATOR_THETA = 45; // CHSH2's wheel doubles it (90° arrow); SSM3 shows it as is

/** The follow-request alert the backend pushes over the WebSocket. */
export const FOLLOW_REQUEST_MESSAGE =
  'Your friend would like to play Share a Secret Message with you!';

export interface MockBackend {
  /** Push a follow-request alert to the page over the backend WebSocket. */
  emitFollowRequest(message: string): void;
}

function jsonResponse(route: Route, body: unknown): Promise<void> {
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Truncate an animated GIF to its first frame: everything up to the end of the
 * first frame's image data, closed with the trailer byte (0x3b). The Default
 * Theme's measuring illustration is an animated GIF, which no screenshot
 * setting can freeze (`animations: 'disabled'` covers CSS and Web Animations
 * only); the first frame is the one deterministic frame of today's image.
 */
function firstGifFrame(gif: Buffer): Buffer {
  let i = 13; // header (6 bytes) + logical screen descriptor (7 bytes)
  const screenPacked = gif[10];
  if (screenPacked & 0x80) {
    i += 3 * 2 ** ((screenPacked & 0x07) + 1); // global color table
  }
  while (i < gif.length) {
    const block = gif[i];
    if (block === 0x3b) break; // trailer before any frame
    if (block === 0x21) {
      // Extension: label, then sub-blocks ending in a 0x00 block.
      i += 2;
      while (gif[i] !== 0x00) i += 1 + gif[i];
      i += 1;
      continue;
    }
    if (block === 0x2c) {
      // Image descriptor: 10 bytes, optional local color table, then the LZW
      // minimum code size and image data sub-blocks ending in a 0x00 block.
      const imagePacked = gif[i + 9];
      i += 10;
      if (imagePacked & 0x80) {
        i += 3 * 2 ** ((imagePacked & 0x07) + 1); // local color table
      }
      i += 1; // LZW minimum code size
      while (gif[i] !== 0x00) i += 1 + gif[i];
      i += 1; // the first frame is complete
      return Buffer.concat([gif.subarray(0, i), Buffer.from([0x3b])]);
    }
    throw new Error(`Unexpected GIF block 0x${block.toString(16)}`);
  }
  throw new Error('No GIF frame found');
}

/**
 * Fulfil an SSE endpoint with fixed events. The stream ends after the body,
 * which the GUI's SSE hooks treat as a finished stream while keeping the last
 * message they received.
 */
function sseResponse(route: Route, events: unknown[]): Promise<void> {
  const body = events
    .map((event) => `data: ${JSON.stringify(event)}\n\n`)
    .join('');
  return route.fulfill({
    status: 200,
    contentType: 'text/event-stream',
    body,
  });
}

/**
 * Mock the whole backend (`NEXT_PUBLIC_API_ADDRESS`) by route interception:
 * HTTP calls, SSE progress and event streams, and the follow-request
 * WebSocket. No request ever leaves the browser. Tests that need a different
 * answer for one endpoint register their own route for it afterwards, which
 * takes precedence.
 */
export async function installBackendMocks(page: Page): Promise<MockBackend> {
  const sockets: WebSocketRoute[] = [];

  // The Measuring popup's illustration (public/images/gif_pqn.gif) is an
  // animated GIF: serve its first frame so the popup's pixels are stable.
  // Halloween's measuring illustration is an animated SVG from another URL,
  // which the screenshot settings themselves freeze.
  const measuringGif = firstGifFrame(
    await readFile('public/images/gif_pqn.gif')
  );
  await page.route('**/images/gif_pqn.gif', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'image/gif',
      body: measuringGif,
    })
  );

  // The mock is the WebSocket server; the page never reaches a real one.
  await page.routeWebSocket('**/coordination/follow_requested_alerts', (ws) => {
    sockets.push(ws);
  });

  // Home
  await page.route('**/games/availability', (route) =>
    jsonResponse(route, { chsh: true, qf: true, ssm: true })
  );
  await page.route('**/coordination/reset_coordination_state', (route) =>
    jsonResponse(route, {})
  );

  // Quantum Fortune
  await page.route('**/rng/fortune*', (route) =>
    jsonResponse(route, [FORTUNE_INDEX])
  );

  // Verify Quantum Link
  await page.route('**/chsh?*', (route) =>
    jsonResponse(route, { chsh_value: CHSH_VALUE, chsh_error: CHSH_ERROR })
  );

  // The rotator wheel (Verify Quantum Link and Secret Message)
  await page.route('**/serial/', (route) =>
    jsonResponse(route, { theta: ROTATOR_THETA })
  );

  // Secret Message
  await page.route('**/coordination/collect_follower', (route) =>
    jsonResponse(route, {})
  );
  await page.route('**/qkd/question_order', (route) =>
    jsonResponse(route, { question_order: QUESTION_ORDER })
  );
  await page.route('**/qkd/submit_selection_and_start*', (route) =>
    jsonResponse(route, {
      n_matching_bits: QUESTION_ORDER.length,
      n_total_bits: QUESTION_ORDER.length,
      emoji: SSM_EMOJI,
      role: 'leader',
    })
  );
  await page.route('**/qkd/set_emoji*', (route) => jsonResponse(route, {}));

  // Measuring-popup progress, halfway through: a determinate progress bar.
  await page.route('**/chsh/progress', (route) =>
    sseResponse(route, [{ event: 'chsh_progress', current: 8, total: 16 }])
  );
  await page.route('**/rng/progress', (route) =>
    sseResponse(route, [{ event: 'rng_progress', current: 8, total: 16 }])
  );
  await page.route('**/qkd/progress', (route) =>
    sseResponse(route, [{ event: 'qkd_progress', current: 8, total: 16 }])
  );

  // Event streams that carry nothing in these tests.
  await page.route('**/coordination/state_events', (route) =>
    sseResponse(route, [])
  );
  await page.route('**/system/display_events', (route) =>
    sseResponse(route, [])
  );

  // The survey page embeds the external survey form; serve fixed content so
  // the screenshot needs no network.
  await page.route('**surveys.illinois.edu/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: '<!doctype html><html><body style="font-family: sans-serif;"><h1>Survey form (mock)</h1><p>The survey form is mocked in tests.</p></body></html>',
    })
  );

  return {
    emitFollowRequest(message: string) {
      const socket = sockets[sockets.length - 1];
      if (!socket)
        throw new Error('No follow-request WebSocket has been opened yet');
      socket.send(message);
    },
  };
}
