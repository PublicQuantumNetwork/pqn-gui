# 1. Large media lives outside git, fetched from GitHub Releases

Date: 2026-07-30

## Status

Accepted

## Context

The attract loop needs a promotional video on every node. The source cut is
1920×1080 H.264, 3 minutes, 74 MB — and it will be re-cut repeatedly as the
exhibit's messaging evolves.

Deployment is `ssh` into each node, `git pull master`, reboot. There are 2 nodes
today and 5 planned. There is no S3 bucket, no campus file share, and no NAS —
everything the project depends on has to live on GitHub. Nodes are maintained
one at a time over SSH, so any step that is _not_ part of `git pull` + reboot is
a step that will eventually be forgotten on one node.

Three ways to get a 74 MB file onto five machines:

- **Commit it to git.** Free at `git pull`, no tooling. But the blob is
  permanent in history for every clone forever, GitHub warns above 50 MB and
  hard-blocks above 100 MB, and every re-cut adds another permanent copy.
- **Git LFS.** Also arrives with `git pull`. Costs a one-time `git lfs install`
  per node, and the org's free tier is 1 GB storage plus 1 GB/month bandwidth
  shared across everything. Each re-cut consumes another 74 MB of that
  permanently. Two failure modes are nasty: exceeding quota makes pulls fail at
  the venue, and a node without LFS installed silently checks out a pointer text
  file, so the video 404s with no obvious cause.
- **GitHub Release asset plus a fetch script.** The repo is public, so release
  assets download with no authentication.

## Decision

Video files are attached to GitHub Releases, not stored in git. `public/video/`
is gitignored. A small `scripts/fetch-media.mjs` pins the release tag and
downloads into `public/video/` only when the file is missing or the wrong size;
it runs from a `prestart` npm hook, so it is part of the existing boot sequence
rather than a step an operator has to remember.

The script is deliberately forgiving: if the file is already present it exits
without touching the network, and if the download fails it warns and exits zero
rather than blocking the server from starting.

## Consequences

Good:

- Nothing large ever enters git history; clones stay small permanently.
- The pinned tag lives in the repo, so `git pull` + reboot is what tells a node
  a new cut exists. Deployment stays exactly as it is today.
- Re-running is free — the size check makes it a no-op on an up-to-date node.
- A node offline at boot still starts and serves the app; it just has no attract
  loop until it can fetch.
- Works for the pre-release period: dropping a file into `public/video/` by hand
  satisfies the size check, so the feature can be developed and demoed before
  any video is published.

Bad:

- Swapping in a new cut is a two-part action: upload the release asset, then bump
  the pinned tag in the script and merge. Forgetting the second half means nodes
  keep the old video with no error.
- First boot on a fresh node needs internet, which the venue may not reliably
  provide. Mitigated by the graceful degradation above and by being able to copy
  the file in manually.
- A `prestart` hook makes `npm start` do slightly more than its name suggests.
  Anyone bypassing it (running `next start` directly) skips the fetch.

This pattern generalises: any future asset too large to commit — additional
videos, high-resolution imagery — should use the same channel rather than
inventing a second one.

## Postscript — the premise weakened

Encoding the first video produced **5.6 MB, not the 25–35 MB expected** (the
content is mostly static text on a near-white background, so it compresses to
245 kb/s). At that size the "74 MB cannot go in git" argument above does not
apply: 5.6 MB is well under GitHub's 50 MB warning, and committing it would
delete the fetch script, the `prestart` hook, the release-upload step and the
bump-the-pinned-tag trap in one go.

What still argues for keeping this mechanism is accumulation — every re-cut adds
another permanent copy to history — and the fact that it is already built and
tested. What argues against it is that all of its machinery exists to solve a
problem this particular video does not have.

This decision is therefore **provisional**. Revisit it before the first re-cut,
and if the video stays this small, prefer committing it and deleting the
machinery. A future asset that really is tens of megabytes would justify
reinstating this exactly as written.
