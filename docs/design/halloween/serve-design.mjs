// Serves the Halloween design boards locally, with no network:
//   ./support.js        -> runtime/dc-runtime.js (its React CDN URLs point at runtime/vendor/)
//   /_blob/<id>         -> runtime/<id>.png
//   Google Fonts Roboto -> /_fonts/roboto.css, backed by @fontsource/roboto
//   /Measuring-secret.dc.html -> Measuring.dc.html with variant "Secret message"
// Usage: node docs/design/halloween/serve-design.mjs [port]   (default 4321)

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const runtime = join(here, 'runtime');
const require = createRequire(import.meta.url);
const fontFiles = join(
  dirname(require.resolve('@fontsource/roboto/package.json')),
  'files'
);

const GOOGLE_FONTS =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&amp;display=swap';
const CDN = 'https://cdn.jsdelivr.net/npm/';
const VENDOR = {
  'react@18.3.1/umd/react.production.min.js': 'react.production.min.js',
  'react-dom@18.3.1/umd/react-dom.production.min.js':
    'react-dom.production.min.js',
};
const MEASURING_DEFAULT = '"default":"Bell test / Quantum Fortune"';
const MEASURING_SECRET = '"default":"Secret message"';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
};

const robotoCss = [300, 400, 500, 700]
  .map(
    (w) =>
      `@font-face{font-family:'Roboto';font-style:normal;font-weight:${w};font-display:swap;` +
      `src:url(/_fonts/roboto-latin-${w}-normal.woff2) format('woff2')}`
  )
  .join('\n');

async function board(file) {
  const html = await readFile(join(here, file), 'utf8');
  return html.replaceAll(GOOGLE_FONTS, '/_fonts/roboto.css');
}

async function resolve(path) {
  if (path === '/') return [TYPES['.json'], await readFile(join(here, 'canvas.json'))];
  if (path === '/support.js') {
    let js = await readFile(join(runtime, 'dc-runtime.js'), 'utf8');
    for (const [from, to] of Object.entries(VENDOR)) {
      js = js.replaceAll(CDN + from, '/_vendor/' + to);
    }
    return [TYPES['.js'], js];
  }
  if (path === '/_fonts/roboto.css') return [TYPES['.css'], robotoCss];
  let m = path.match(/^\/_fonts\/(roboto-latin-\d+-normal\.woff2)$/);
  if (m) return [TYPES['.woff2'], await readFile(join(fontFiles, m[1]))];
  m = path.match(/^\/_vendor\/([\w.-]+\.js)$/);
  if (m) return [TYPES['.js'], await readFile(join(runtime, 'vendor', m[1]))];
  m = path.match(/^\/_blob\/([0-9a-f]{32})$/);
  if (m) return [TYPES['.png'], await readFile(join(runtime, `${m[1]}.png`))];
  if (path === '/Measuring-secret.dc.html') {
    const html = await board('Measuring.dc.html');
    if (!html.includes(MEASURING_DEFAULT)) {
      throw new Error('Measuring.dc.html: variant default not found');
    }
    return [TYPES['.html'], html.replace(MEASURING_DEFAULT, MEASURING_SECRET)];
  }
  const file = normalize(path).replace(/^\/+/, '');
  if (file.startsWith('..') || file.startsWith('runtime')) return null;
  if (file.endsWith('.dc.html')) return [TYPES['.html'], await board(file)];
  if (file.endsWith('.json')) return [TYPES['.json'], await readFile(join(here, file))];
  return null;
}

export function startServer(port = 4321) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    try {
      const found = await resolve(path);
      if (!found) {
        res.writeHead(404).end('not found');
        return;
      }
      res.writeHead(200, { 'content-type': found[0] }).end(found[1]);
    } catch (err) {
      if (err.code === 'ENOENT') res.writeHead(404).end('not found');
      else res.writeHead(500).end(String(err));
    }
  });
  return new Promise((ok) => server.listen(port, '127.0.0.1', () => ok(server)));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.argv[2] ?? 4321);
  await startServer(port);
  console.log(`Design boards at http://127.0.0.1:${port}/Main.dc.html`);
}
