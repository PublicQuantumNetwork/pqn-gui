// Public status page for PQN game availability.
//
// Why this exists: the Nodes sit behind the ZeroTier VPN and nothing is reachable
// from the open internet. This is the one process that straddles both sides — it
// runs on a VM that is a ZeroTier member *and* publicly reachable, so a visitor's
// browser never touches the VPN. It serves a single page, meant to be embedded in
// an <iframe> on the public PQN website.
//
// Deliberately minimal, and deliberately frozen:
//
//   - Zero dependencies. Node 18+ has `fetch` and `http` built in, so there is no
//     package.json and nothing to keep current on a public-facing box.
//   - Exactly one outbound call, to a hardcoded path. No part of a visitor's
//     request — path, query, header, body — reaches that URL, so there is nothing
//     to inject and SSRF is impossible by construction. Keep NODE_PATH a literal.
//   - Read-only. GET /games/availability mutates nothing on the Node, so even a
//     fully compromised bridge can only ever read three booleans.
//   - Binds loopback only. Caddy terminates TLS and is the sole public listener.
//
// Known and accepted: /games/availability is a pure read of the Node's config
// gated by its *last* health probe, and this does not trigger a fresh one. A Node
// whose process is up but whose router or timetagger has since died will still
// report its games as available. Unreachable Node → everything unavailable.

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8080;
const HOST = '127.0.0.1';

// Hardcoded on purpose — see the SSRF note above.
const NODE_PATH = '/games/availability';
const NODE_TIMEOUT_MS = 3000;

// The Node's ZeroTier address stays out of this (public) repo. Fail loudly rather
// than defaulting to localhost: a silent default reports "no games" forever, and
// that is a miserable thing to debug.
const NODE_ADDRESS = process.env.PQN_NODE_ADDRESS;
if (!NODE_ADDRESS) {
  console.error(
    'PQN_NODE_ADDRESS is not set. Expected the designated Node as host:port, e.g. PQN_NODE_ADDRESS=10.147.17.42:8000'
  );
  process.exit(1);
}

// The kiosk's own art, read from the repo rather than duplicated here — the VM runs
// this from a full clone of pqn-gui. These are the only files outside this directory
// that the bridge ever touches, and each is read once, at startup.
//
// A closed map, not a directory lookup: the served paths are fixed at startup and a
// visitor's request is only ever compared against these keys, never used to build a
// path. There is no traversal to defend against because there is no path arithmetic.
const IMAGES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'images');
const ASSETS = new Map([
  ['/bg.png', { type: 'image/png', body: readFileSync(join(IMAGES_DIR, 'GUI-background.png')) }],
  ...['arms-up', 'right-wing-up', 'arms-down'].map((variant) => [
    `/whobit-${variant}.svg`,
    { type: 'image/svg+xml', body: readFileSync(join(IMAGES_DIR, `whobit-${variant}.svg`)) },
  ]),
]);

/** Whobit's posture reports the count at a glance: cheering, waving, or arms down. */
function whobitVariant(availableCount) {
  if (availableCount === GAMES.length) return 'arms-up';
  if (availableCount === 0) return 'arms-down';
  return 'right-wing-up';
}

// Labels are the kiosk's own, verbatim (pqn-gui/src/app/page.tsx). A visitor who
// reads "Quantum Fortune" here sees the same words on the button at the machine.
const GAMES = [
  ['chsh', 'Verify Quantum Link (single player)'],
  ['qf', 'Quantum Fortune (single player)'],
  ['ssm', 'Share a secret message (Two players)'],
];

// Illinois brand palette, matching pqn-gui/src/theme.ts.
const BLUE = '#13294B'; // Illini Blue
const PRAIRIE = '#006230'; // Prairie green — available
const STORM = '#707372'; // Storm Gray — unavailable

async function fetchAvailability() {
  const response = await fetch(`http://${NODE_ADDRESS}${NODE_PATH}`, {
    signal: AbortSignal.timeout(NODE_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const body = await response.json();
  return Object.fromEntries(GAMES.map(([key]) => [key, body[key] === true]));
}

function renderPage(availability) {
  const availableCount = GAMES.filter(([key]) => availability[key]).length;
  const variant = whobitVariant(availableCount);
  const rows = GAMES.map(([key, label]) => {
    const on = availability[key];
    return `<li>
        <span class="dot" style="background:${on ? PRAIRIE : STORM}"></span>
        <span class="label">${label}</span>
        <span class="state" style="color:${on ? PRAIRIE : STORM}">${on ? 'Available now' : 'Unavailable'}</span>
      </li>`;
  }).join('\n      ');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>PQN — what's playable right now</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      min-height: 100%;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background: url(/bg.png) center / cover no-repeat ${BLUE};
      padding: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, .35);
      padding: 20px 24px;
      width: 100%;
      max-width: 620px;
      color: ${BLUE};
      display: flex;
      align-items: center;
      gap: 18px;
    }
    .whobit { width: 96px; flex: 0 0 auto; }
    .whobit img { width: 100%; height: auto; display: block; }
    .content { flex: 1 1 auto; min-width: 0; }
    /* Narrow frames: Whobit costs more than it gives, so drop it rather than
       squeeze the labels into two lines each. */
    @media (max-width: 460px) {
      .whobit { display: none; }
    }
    h1 { font-size: 1.05rem; margin: 0 0 14px; letter-spacing: .01em; text-align: center; }
    ul { list-style: none; margin: 0; padding: 0; }
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      border-top: 1px solid #C8C6C7;
      font-size: .92rem;
    }
    li:first-child { border-top: 0; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex: 0 0 auto; }
    .label { flex: 1 1 auto; }
    .state { font-weight: 600; font-size: .82rem; white-space: nowrap; }
    .note { margin: 14px 0 0; font-size: .82rem; color: ${STORM}; line-height: 1.45; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="whobit"><img src="/whobit-${variant}.svg" alt="Whobit, the PQN mascot"></div>
    <div class="content">
      <h1>PQN — what's playable right now</h1>
      <ul>
        ${rows}
      </ul>
      ${
        availableCount > 0
          ? '<p class="note">Come visit us and play.</p>'
          : '<p class="note">No games are currently on right now &mdash; sorry! Things go offline for maintenance and come back on their own. Please check again later.</p>'
      }
    </div>
  </div>
</body>
</html>
`;
}

const server = createServer(async (request, response) => {
  const path = (request.url ?? '/').split('?')[0];

  if (request.method !== 'GET') {
    response.writeHead(405, { 'Content-Type': 'text/plain' });
    response.end('Method Not Allowed');
    return;
  }

  const asset = ASSETS.get(path);
  if (asset) {
    response.writeHead(200, {
      'Content-Type': asset.type,
      'Content-Length': asset.body.length,
      'Cache-Control': 'public, max-age=86400',
    });
    response.end(asset.body);
    return;
  }

  if (path !== '/') {
    response.writeHead(404, { 'Content-Type': 'text/plain' });
    response.end('Not Found');
    return;
  }

  // An unreachable Node is not an error to report to a visitor — it is the page's
  // "nothing is on" state. Nothing about the failure is echoed into the response.
  let availability = Object.fromEntries(GAMES.map(([key]) => [key, false]));
  try {
    availability = await fetchAvailability();
  } catch (error) {
    console.error(`[${new Date().toISOString()}] node unreachable: ${error}`);
  }

  // no-store: never let a browser or proxy pin an answer that changes on its own.
  response.writeHead(200, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  response.end(renderPage(availability));
});

server.listen(PORT, HOST, () => {
  console.log(`pqn status bridge on http://${HOST}:${PORT} -> http://${NODE_ADDRESS}${NODE_PATH}`);
});
