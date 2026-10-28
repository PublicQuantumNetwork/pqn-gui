# Attract loop — implementation plan

Adds a looping promotional video to the home page of each node, shown when no
visitor is present, with a "please touch the screen to begin" prompt. Also lets a
node operator dismiss it remotely so Whobot's screenshot shows the home page
rather than a video frame.

Domain terms used here — **node**, **visitor**, **node operator**, **attract
loop**, **idle delay**, **touch prompt**, **operator peek** — are defined in
[CONTEXT.md](../../CONTEXT.md). Two decisions have their own records:

- [ADR 0001](../adr/0001-large-media-outside-git.md) — why the video is not
  in git
- [ADR 0002](../adr/0002-display-commands-over-sse.md) — why the dismiss
  command uses SSE rather than the existing WebSocket

---

## 1. Decisions

| Aspect          | Decision                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| Trigger         | Idle on `/` only. Fullscreen overlay covering `HeaderBar` too.                                                        |
| Timing knobs    | One: the idle delay. It gates both the wait before a pass and the wait between passes.                                |
| Config          | `NEXT_PUBLIC_ATTRACT_IDLE_SECONDS`, default `60`, `0` disables.                                                       |
| Asset delivery  | GitHub Release asset, fetched by a `prestart` script into gitignored `public/video/`.                                 |
| Encoding        | Audio stripped, H.264 CRF 23, `+faststart`. 74 MB → **5.6 MB** actual.                                                |
| Presence events | `pointerdown`, `touchstart`, `keydown`, `wheel`. Not `mousemove`.                                                     |
| Dismissal       | First event is swallowed — a visitor never lands in an experiment they did not choose.                                |
| Side effects    | Re-fetch game availability. Nothing else; `resetBackendState()` is deliberately not called.                           |
| Follow request  | An incoming request dismisses the loop so the modal is never hidden behind video.                                     |
| Display fit     | `object-fit: cover` on black. Displays are 16:9, matching the source.                                                 |
| Touch prompt    | Bottom-right, plain black text, ~4 s opacity breathe.                                                                 |
| Operator peek   | `GET /system/screenshot?dismiss_attract=true` → SSE `dismiss_attract` → 1200 ms settle → `maim`. Re-arms after ~10 s. |
| Missing video   | Attract loop stays dormant. It is an enhancement, not a dependency.                                                   |
| On demand       | An "Intro Video" button in the header replays it immediately. Home page only.                                         |

### Deliberately rejected

- **Idle timer app-wide.** Would need layout-level state and would interact with
  in-flight experiment and coordination state. The loop arms on the home page
  only.
- **Continuous looping of the video.** Superseded during implementation: the
  attract loop plays one full pass, shows the home page for another idle delay,
  then plays again, in perpetuity. An unattended node alternates rather than
  showing unbroken video.
- **Passing the dismissing touch through.** A stray tap on "Share a secret
  message" would commit a lone visitor to a two-player experiment.
- **Extending the coordination WebSocket.** See ADR 0002.
- **`resetBackendState()` on dismissal.** Whether stale coordination state hurts
  the next visitor is genuinely unknown; guessing risks clobbering a partner
  node mid-handshake. Revisit if stale-state bugs show up at the exhibit.

---

## 2. Prepare the video

Strip audio (browsers block unmuted autoplay, and an exhibit floor is noisy),
re-encode, and move the MP4 index to the front so playback starts before the
file finishes loading:

```bash
ffmpeg -i ~/Downloads/PQN-Intro-V2.mp4 -an \
  -c:v libx264 -crf 23 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  public/video/pqn-intro.mp4
```

Source is 1920×1080, H.264 + AAC 317 kbps, 3:00, 74 MB at ~3.3 Mbps.

**Actual result: 5.6 MB at 245 kb/s**, full 1080p, audio gone, text still crisp.
An order of magnitude below the 25–35 MB estimate, because the video is mostly
static text over a near-white background rather than dense motion. See §7 — at
that size the premise of ADR 0001 no longer holds and committing the file
directly becomes viable.

Two properties of the content that the implementation depends on: backgrounds are
near-white for almost the whole run, and the final ~2.2 s are pure black. Black
prompt text therefore reads for ~99% of the loop and vanishes for the tail; see
§3.1.

Three minutes is long for an attract loop. Worth considering a shorter cut later,
but not a blocker.

---

## 3. Frontend changes (`pqn-gui`)

All of this ships independently of the node work in §4. Until
`/system/display_events` exists, `useDisplayEvents` retries quietly in the
background and logs nothing — the attract loop is unaffected.

### 3.1 `src/components/AttractLoop.tsx` (new)

Owns the idle timer and the overlay.

```tsx
'use client';
// props: { suppressed: boolean; onDismiss: () => void }
```

Behaviour:

- Reads the idle delay once:
  `(Number(process.env.NEXT_PUBLIC_ATTRACT_IDLE_SECONDS) ?? 60)`. Falls back to
  `60` on `NaN`. `0` means the component renders nothing at all.
- Idle timer lives in a ref, reset by the presence events above, registered on
  `window` with `{ capture: true, passive: true }`.
- Overlay is `position: fixed; inset: 0; z-index: 1200`. Fixed positioning is how
  it escapes the `60vh` content box in `src/app/layout.tsx`; `1200` is
  deliberately below MUI's `1300` modal layer so it can never mask a dialog.
- `<video autoPlay loop muted playsInline preload="auto">` with
  `object-fit: cover` on a black background. Paused and `currentTime = 0` when
  hidden, so an idle node is not decoding video into an invisible element.
- Fade in and out via `opacity` with a 300 ms transition, plus
  `pointer-events: none` when hidden.
- Dismissal handler calls `event.stopPropagation()` and `preventDefault()` — the
  swallowed first touch — then `onDismiss()`.
- `suppressed` forces the overlay hidden and holds it hidden while true.
- Video `onError` sets a flag that disables the loop permanently for that page
  load. Covers the missing-file case without a broken player ever appearing.
- No `loop` attribute. `onEnded` ends the pass, which hides the overlay, rewinds
  to `currentTime = 0`, and re-arms for another idle delay — so a new passerby
  always sees the video from the top.
- Every route back to the home page — visitor touch, keyboard or wheel event,
  operator peek, or the pass simply ending — goes through one `hideAndRearm`
  function. That is what makes "the home page became visible" and "game
  availability was just re-checked" the same event.
- Subscribes via `useDisplayEvents` (see 3.4) and dismisses on the
  `dismiss_attract` command, then re-arms with a ~10 s grace timer instead of
  the full idle delay.
- Kiosk hygiene on the video element: `disablePictureInPicture`, a
  `controlsList` of `nodownload nofullscreen noremoteplayback`, and
  `onContextMenu` prevented — right-click is how a desktop browser offers
  Picture-in-Picture even when controls are hidden. The attribute is standard
  (Chrome 69+, Edge 79+, Safari 13.1+ full; Firefox 116+ partial). For a
  guaranteed kill on a Firefox kiosk, also set
  `media.videocontrols.picture-in-picture.enabled=false` in the profile.

The touch prompt is a child element, bottom-right, `position: absolute`, plain
black text with no backing, and a CSS `@keyframes` opacity breathe (`0.3 → 1 →
0.3` over 4 s, infinite).

The video is near-white for all but its final ~2.2 s, which are pure black, so
the prompt is effectively invisible for roughly 1% of each loop. Accepted
deliberately in preference to a background. Trimming the black tail from the
video removes the problem outright and would also stop the loop boundary
flashing black — worth doing on the next cut.

> Discoverability trade-off, recorded on purpose: bottom-right is maximally out
> of the way but easier for a passerby to miss than bottom-centre. If visitors
> at the exhibit do not realise the screen is interactive, move it to
> bottom-centre — that is a one-line change.

### 3.2 `src/app/page.tsx`

Mount the component and give it the two things it needs. `isFollowRequestModalOpen`
already exists, so the follow-request behaviour falls out of state that is
already there:

```tsx
<AttractLoop
  suppressed={isFollowRequestModalOpen}
  onDismiss={refetchAvailability}
/>
```

Extract the existing `fetchGamesAvailability().then(...)` body from the mount
effect into a `refetchAvailability` callback so both the mount and the dismissal
use one path. Keep the `router.replace('/maintenance')` behaviour inside it.

### 3.3 `src/attractLoop.ts` and the header button

`HeaderBar` renders inside the root layout while `AttractLoop` is mounted by the
home page, so they are in different React subtrees. Sharing state through a
common provider would mean lifting the page's follow-request and availability
state into the layout — much more disruption than the feature warrants, since the
only thing crossing the boundary is one fire-and-forget command.

`src/attractLoop.ts` holds that crossing: a window event with
`requestAttractLoop()` / `subscribeToAttractRequests()`, declared in one place so
both sides share a name and the contract is discoverable rather than an inline
string in two files. It also owns `attractIdleMs()` and `attractLoopEnabled()`,
so the component and the header read the idle delay through one implementation.

The button carries an `OndemandVideo` icon and an "Intro Video" label, matching
the contained style of its siblings, and sits immediately left of Start Over. It
renders only when `usePathname() === '/'` and the attract loop is enabled —
elsewhere it would be a control that does nothing. Showing on request cancels any
pending arm, so the button and the idle timer cannot fight over the overlay.

One accepted gap: the header cannot know whether the video file actually loaded,
since that is internal to `AttractLoop`. On a node whose video is missing the
button is present but inert. Only reachable by misconfiguration, and not worth
another cross-subtree channel to fix.

### 3.4 `src/hooks/useDisplayEvents.tsx` (new)

Subscribes to `/system/display_events` and invokes a callback per command.
Retries every 5 s, indefinitely and silently.

Not built on `useSSE`, which closes the stream on first error and reports via
`console.error` — correct for a progress dialog, wrong for a background channel
on a machine that runs for weeks against an endpoint that may not exist yet. See
ADR 0002. Commands arrive by callback rather than as state, so the consumer
reacts in a handler instead of an effect.

### 3.5 `scripts/fetch-media.mjs` (new)

Idempotent, forgiving, no dependencies beyond Node's built-ins.

- Pins the release tag and expected byte size at the top of the file.
- If `public/video/pqn-intro.mp4` exists and matches the expected size, exit `0`
  immediately without touching the network.
- Otherwise download from the release URL to a temp file, then rename into place
  — so an interrupted download never leaves a truncated file that passes the
  size check next time.
- On any failure: warn to stderr and **exit `0`**. Never block the server from
  starting. A node with no video serves the app fine.

Wired up as `"prestart": "node scripts/fetch-media.mjs"` in `package.json`, so it
runs as part of the existing boot sequence with no change to how nodes are
deployed.

### 3.6 Small files

- `.gitignore` — add `/public/video/`.
- `example.env.local`, `.env.locala`, `.env.localb` — document
  `NEXT_PUBLIC_ATTRACT_IDLE_SECONDS`.

---

## 4. Node changes (`pqn-node`) — dependency, not yet written

### 4.1 `/system/display_events`

New SSE endpoint in `src/pqn_node/api/routes/system.py`, modelled directly on
`/coordination/state_events` (`coordination.py:276-312`): a module-level
`asyncio.Event`, a `while True` loop doing
`asyncio.wait_for(event.wait(), timeout=1.0)`, yielding
`{"event": "dismiss_attract"}` when set and a `:\n` heartbeat otherwise.

`wait_for` wakes the moment the event is set, so latency is milliseconds — the
1 s timeout is only the heartbeat cadence.

### 4.2 Screenshot handler

Add `dismiss_attract: bool = False` and a configurable settle delay
(default 1200 ms) to the `screenshot` handler. When the flag is set: set the
event, `await asyncio.sleep(settle)`, then run `maim`.

1200 ms rather than something tighter because it has to cover the 300 ms fade
**plus** the `/games/availability` round trip the dismissal triggers. Capture too
early and the screenshot shows stale availability buttons, which defeats the
whole point of the peek.

### 4.3 Whobot

Expose the toggle on the Screenshot Action so an operator can choose per peek.
Default off, since a playing attract loop is itself the answer to "is anyone
here?".

---

## 5. Verification

Locally, with the file hand-placed in `public/video/`:

- Set `NEXT_PUBLIC_ATTRACT_IDLE_SECONDS=5` and confirm the overlay fades in,
  loops past the 3:00 mark, and fades out on a click.
- Confirm the dismissing click does **not** activate the button underneath it.
- Confirm `0` disables the feature entirely.
- Rename the video file and confirm the page works with no overlay and no broken
  player.
- Trigger a follow request from the partner node while the loop is playing and
  confirm the modal is fully visible.
- Toggle a game's availability on the backend and confirm the buttons update
  after a dismissal.

On a deployed node, once §4 exists:

- `curl -o /tmp/s.png 'http://<node>:9000/system/screenshot?dismiss_attract=true'`
  and confirm the PNG shows the home page with current availability, not a video
  frame.
- Same call with the flag off, and confirm it shows the video.
- Fire it while a visitor is mid-experiment and confirm nothing is interrupted.

---

## 6. Rollout

1. Merge the `pqn-gui` work. Nodes pick it up on the next `git pull` + reboot;
   with no video file present, nothing changes for visitors.
2. Once the video is final, `gh release create media-v1 pqn-intro.mp4`, bump the
   pinned tag in `scripts/fetch-media.mjs`, merge. Nodes fetch it on next boot.
3. Land the `pqn-node` half whenever convenient; the frontend already tolerates
   its absence.
4. Tune `NEXT_PUBLIC_ATTRACT_IDLE_SECONDS` per node by editing `.env.local` and
   restarting the tmux session.

**New cuts later** are two actions, and forgetting the second is the trap: upload
the release asset, _and_ bump the pinned tag. Without the bump, nodes keep the
old video and report no error.

---

## 7. Loose ends

- **The encoded video is 5.6 MB, which undercuts ADR 0001.** That ADR argues
  against putting the file in git on the strength of it being 74 MB. At 5.6 MB it
  is well under GitHub's 50 MB warning, and committing it would remove the fetch
  script, the `prestart` hook, the `.gitignore` entry, the release-upload step,
  and the "forgot to bump the pinned tag" trap — the video would genuinely arrive
  with `git pull`, which is what was wanted in the first place. The cost is that
  every re-cut adds another permanent ~5 MB to history, so ten cuts is ~50 MB of
  history for a repo that is otherwise small. The delivery mechanism as agreed is
  implemented and working; switching is a deletion, not a rewrite. **This is an
  open decision, not a closed one.**

- **`Containerfile` is dead.** It is untracked and copies `/app/.next/standalone`,
  which `next.config.mjs` never produces — `output: 'standalone'` is absent, so
  that build fails today. Deployment is a tmux-hosted `next start`. Recommend
  deleting it rather than leaving a booby trap for the next person.
- **Coordination state after idle.** Unresolved by choice; see the rejected list
  in §1. Watch for stale-state bugs at the exhibit.
- **Two push channels now exist** with overlapping capability. The rule for
  anyone adding one: SSE unless it is coordination. Recorded in ADR 0002.
- **A dismissal that lands nowhere is silent.** If no browser is listening, the
  command is a no-op and nothing distinguishes that from a successful dismissal
  in Whobot's output.
