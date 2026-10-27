// Renders every board in canvas.json, plus the Measuring popup's
// "Secret message" variant, to runtime/renders/<board>.png at the board's size.
// Usage: npm run design:render

import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { startServer } from './serve-design.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, 'runtime', 'renders');
const PORT = 4321;
// Let entrance animations (monsters popping up, the hat settling) play out.
const SETTLE_MS = 3000;

const canvas = JSON.parse(await readFile(join(here, 'canvas.json'), 'utf8'));
const boards = canvas.order.map((file) => ({ file, ...canvas.boards[file] }));
const measuring = boards.find((b) => b.file === 'Measuring.dc.html');
boards.push({ ...measuring, file: 'Measuring-secret.dc.html' });

await mkdir(out, { recursive: true });
const server = await startServer(PORT);
const browser = await chromium.launch();
let failed = false;
try {
  for (const b of boards) {
    const page = await browser.newPage({ viewport: { width: b.w, height: b.h } });
    const problems = [];
    page.on('pageerror', (e) => problems.push(`page error: ${e.message}`));
    page.on('requestfailed', (r) => problems.push(`failed: ${r.url()}`));
    // Everything must come from the local server.
    await page.route(/^(?!http:\/\/127\.0\.0\.1:)/, (route) => {
      problems.push(`blocked external request: ${route.request().url()}`);
      return route.abort();
    });
    await page.goto(`http://127.0.0.1:${PORT}/${b.file}`, {
      waitUntil: 'networkidle',
    });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(SETTLE_MS);
    const text = await page.evaluate(() => document.body.innerText);
    if (text.includes('{{')) problems.push('unrendered {{…}} template text');
    const name = b.file.replace(/\.dc\.html$/, '');
    await page.screenshot({ path: join(out, `${name}.png`), fullPage: true });
    console.log(`${problems.length ? 'WARN' : 'ok  '} ${name}.png`);
    for (const p of problems) console.log(`     ${p}`);
    failed ||= problems.length > 0;
    await page.close();
  }
} finally {
  await browser.close();
  server.close();
}
console.log(`Renders in ${out}`);
if (failed) process.exitCode = 1;
