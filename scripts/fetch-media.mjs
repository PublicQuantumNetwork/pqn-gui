#!/usr/bin/env node
/**
 * Fetch large media that is deliberately not stored in git.
 *
 * See docs/adr/0001-large-media-outside-git.md. Runs from the `prestart` npm
 * hook, so it is part of the boot sequence a node already goes through rather
 * than a step an operator has to remember.
 *
 * Two properties matter more than anything else here:
 *
 *  - It is idempotent. An asset already present at the expected size is left
 *    alone and the network is never touched, so it costs nothing on every
 *    subsequent boot.
 *  - It never blocks the server from starting. Any failure warns and exits 0.
 *    A node with no video simply shows no attract loop, which the frontend
 *    handles; a node that will not boot because a download failed is far worse.
 */

import { createWriteStream } from 'node:fs';
import { mkdir, rename, stat, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { fileURLToPath } from 'node:url';

const REPO = 'PublicQuantumNetwork/pqn-gui';
const PROJECT_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Each asset pins the release tag it came from. Bumping `tag` here is what
 * tells a node a new cut exists — uploading a new release asset alone is not
 * enough, and forgetting this line means nodes keep the old file with no error.
 *
 * `bytes` is the size check. Set it to the exact size of the uploaded file, or
 * to null to accept any existing file and only download when it is missing.
 */
const ASSETS = [
  {
    tag: 'media-v2',
    name: 'pqn-intro.mp4',
    path: 'public/video/pqn-intro.mp4',
    bytes: null,
  },
];

const TIMEOUT_MS = 120_000;

function warn(message) {
  process.stderr.write(`fetch-media: ${message}\n`);
}

/** Resolve to the asset's size on disk, or null if it isn't a readable file. */
async function sizeOnDisk(absolutePath) {
  try {
    const stats = await stat(absolutePath);
    return stats.isFile() ? stats.size : null;
  } catch {
    return null;
  }
}

async function download(url, absolutePath) {
  // Write to a temp file and rename into place, so an interrupted download
  // never leaves a truncated file that satisfies the size check next boot.
  const temporaryPath = `${absolutePath}.partial`;
  const response = await fetch(url, {
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok || !response.body) {
    throw new Error(`${response.status} ${response.statusText} for ${url}`);
  }

  await mkdir(dirname(absolutePath), { recursive: true });
  try {
    await pipeline(
      Readable.fromWeb(response.body),
      createWriteStream(temporaryPath)
    );
    await rename(temporaryPath, absolutePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => {});
    throw error;
  }
}

for (const asset of ASSETS) {
  const absolutePath = join(PROJECT_ROOT, asset.path);
  const existing = await sizeOnDisk(absolutePath);

  if (existing !== null && (asset.bytes === null || existing === asset.bytes)) {
    continue;
  }

  if (existing !== null) {
    warn(
      `${asset.path} is ${existing} bytes, expected ${asset.bytes} — re-downloading`
    );
  }

  const url = `https://github.com/${REPO}/releases/download/${asset.tag}/${asset.name}`;
  try {
    await download(url, absolutePath);
    warn(`fetched ${asset.path} from ${asset.tag}`);
  } catch (error) {
    // Deliberately not fatal. See the note at the top of this file.
    warn(`could not fetch ${asset.path}: ${error.message}`);
    warn('continuing without it');
  }
}
