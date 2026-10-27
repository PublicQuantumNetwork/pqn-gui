# Plan: Interactive map, rebuilt in MUI

> **This is the living tracker for this project.** Every working session reads it first and updates it before finishing:
>
> 1. Tick the checkboxes in [Phases](#phases) as tasks are completed.
> 2. Add a row to the [Work log](#work-log) (newest first): date, who, what was done, and anything that went wrong or was decided.
> 3. If a decision changes, update [Design decisions](#design-decisions) and log the change. Don't silently rewrite history.
>
> Related: [`CONTEXT.md`](../../CONTEXT.md) (glossary)

## Status

| Phase | State | Who |
| --- | --- | --- |
| 0. Commit, clean up, decide | Done (2026-10-27) | Marcos with one Claude session |
| 1. Design inputs | Done (2026-10-27) | Claude (single session) |
| 2. Static map in MUI | Done (2026-10-27) | Claude (single session) |
| 3. Step modal | Done (2026-10-27) | Claude (single session) |
| 4. Animations | Done (2026-10-27) | Claude (single session) |
| 5. Carry-over behaviour and cleanup | Done (2026-10-27) | Claude (single session) |
| 6. Verify and open the PR | Verified; push and PR waiting on Marcos | Claude (single session) |
| 7. Review, merge, deploy | Not started | Marcos, by hand |

Everything happens in the main checkout, `/Users/marcosf2/Documents/github/PQN/pqn-gui`, on branch `adding_map` (based on `master` at `ae7aed9`), and ships as **one PR** to `master` on `origin` (`PublicQuantumNetwork/frontend`). Branch state at the start of Phase 1: `c0d528a` (first map), `18bab9a` (photon pair animation), `80fbdc4` (docs).

## Summary

The `/map` page ("How the experiment works") explains the PQN experiment on one 1920×1080 screen: Building 1 (Loomis Lab, the lab side) and Building 2 (Urbana Free Library, where the visitor stands), the equipment in each, the optical fiber and digital relay between them, and a numbered step for each part. Tapping a step opens a modal that explains it.

Today `/map` is a 5-step React page styled with a CSS module, the only page in the app not on MUI. It is built from an older design. Three sources are merged into one MUI page:

- **Figma**, file `wc36ZFIpEHpOgoCRS852BS` ("PQN Interactive Map"): map frame **`195:892`** (layout, positions, fiber and relay shapes, images) and the six modal frames on the "Prototype – [Most Recent]" page.
- **The HTML prototype**, `~/Downloads/pqn-interactive-map.html` (outside the repo, 1.6 MB with base64 images): the 6-step text, the modal behaviour, and the small animations. Everything this plan needs from it is copied into [Step content](#step-content) and [Animation specs](#animation-specs), so the file is not needed to do the work.
- **The current React page** (`src/app/map/page.tsx` at `18bab9a`): the photon pair animation, the turning waveplate dials, the Alice/Bob question bubbles, the missed-tap hint, and `PageTimeout`.

## Open questions

None.

## Design decisions

| # | Decision | Why | Rejected alternatives |
| --- | --- | --- | --- |
| 1 | Marcos is the only author of every commit and PR. No `Co-Authored-By` trailers, "Generated with" footers, or any line crediting Claude or another AI, in commit messages, PR bodies or committed files | Marcos's standing rule | — |
| 2 | Phase 0 commits: the photon animation (`18bab9a`) and the docs (`80fbdc4`: `CONTEXT.md`, `docs/adr/`, `docs/plans/attract-loop.md`) as two commits. Not committed: `next-env.d.ts` (a dev-build artifact) | Separate concerns; `next-env.d.ts` changes with whichever `BUILD_DIR` ran last | One commit; committing `next-env.d.ts` |
| 3 | GitNexus is no longer used: removed `AGENTS.md`, `.gitnexus/`, `.claude/skills/gitnexus-*` and the GitNexus block in the (gitignored) `CLAUDE.md`. The stale `ANALYTICS-PLAN.md` was deleted; the real one lives in the orca worktree `Adding-google-analytics` | Marcos's call | Keeping the boilerplate |
| 4 | Plans live in `docs/plans/`, linked from a **Plans** section at the end of `CONTEXT.md` | One place to find them; the glossary stays a glossary | Pasting plans into `CONTEXT.md` |
| 5 | The page is **rewritten in MUI** (`Box`/`Stack` with `sx`, `Dialog`, theme colours and keyframes via `@emotion`/`sx`), matching the other 13 pages. `src/app/map/map.module.css` is deleted. No bare HTML, no `dangerouslySetInnerHTML` | Marcos: "we don't need bare html"; one styling system across the app | Keeping the CSS module; embedding the HTML prototype |
| 6 | Layout target is **Figma frame `195:892`** (labels above icons; fiber stops at each waveplate card's edges with the waveplate in the gap; fiber enters the detector from the left and from below). Not `78:2295`, the frame first linked | Newer revision; the photon crosses a clear gap straight through the waveplate, which shows the collapse | `78:2295` (fiber arcs over the waveplate) |
| 7 | **6 steps**, as in Figma and the HTML: 1 Source, 2 Optical Fiber, 3 Interaction Points, 4 Digital Relay System, 5 Half-waveplate and Polarizer (badge at both waveplates, A and B), 6 Detection System. Text from the HTML ([Step content](#step-content)) | Figma and the HTML agree; the relay deserves its own step | Keeping 5 steps |
| 8 | One 1920×1080 **stage scaled to fit** the area under `HeaderBar`, as the current page does (`ResizeObserver`, `transform: scale`). No pan mode for narrow screens | Nodes are fixed 16:9 kiosks; positions come straight from Figma | Responsive reflow; the HTML's pan-below-760px mode |
| 9 | The app's own **`HeaderBar`** (PQN logo, QR code, "How the experiment works" heading on `/map`) and the app **background** (`/images/GUI-background.png`) stay. Figma's logo, title block and light-blue page fill are not built | Consistent with every other page; `HeaderBar` already shows the map heading | Figma's header and background |
| 10 | **Modal** follows the Figma prototype frames (sidebar "How it works" with the 6 steps, gradient top bar, kicker, title, photo, optional caption, bold lead, body, Previous/Next footer, "Return to Beginning" on step 6, close button) as an MUI `Dialog`. Keys: `1`–`6` open a step, `←`/`→` move, `Esc` closes. No `#step-N` deep links | Figma has the design; the HTML has the behaviour; nobody types URLs on a kiosk | The current modal; deep links |
| 11 | Step 4's modal image is the Figma placeholder: a blue-to-orange gradient captioned "Placeholder graphic — final artwork pending" | No photo exists yet, in Figma or the HTML | Leaving the image slot empty |
| 12 | The **photon pair animation replaces the glowing yellow fiber dots** of the HTML. It is kept as built (superposition cross in flight, collapse to a shared axis at the waveplate, dials turning in step) and **re-traced** along frame B's fibers so each photon passes straight through its waveplate. The waveplate icon stays today's inline SVG (it is Figma's `Group 10`, 26×58) | Two moving things on one fiber would muddy which one is "the photon" | Keeping the HTML's dots; both |
| 13 | From the HTML, also: **glowing step numbers** (ping ring + navy hover/focus), **marching dashes on the digital relay lines**, **breathing source orbs**, **bobbing Alice and Bob**, **modal fade + pop**. All motion stops under `prefers-reduced-motion: reduce` | Marcos asked for the line and number animations plus the small extras | Static map |
| 14 | Kept from the current page: the Alice/Bob question bubbles (SSM questions; since 2026-10-27 shown only when Alice or Bob is tapped, see Work log), the missed-tap "Tap a highlighted element to learn more" hint, `PageTimeout` | Already working and liked | Dropping them |
| 15 | Images come from Figma via `get_design_context` downloads into `public/images/interactive-map/`, reusing a file already there when it is the same image. No base64 | Real files are cacheable and reviewable | Extracting the HTML's base64 |
| 16 | Verification is by **screenshots in a real browser** at 1920×1080: the map, each of the 6 modals, and the photons at fixed moments (SMIL `pauseAnimations()` + `setCurrentTime()`), compared by eye with the Figma screenshots. Plus `npm run lint`, `npm run format:check` (app files) and `npm run build`. No test framework is added | The repo has no test tooling; this is one visual page; the Playwright-from-npx-cache harness already worked for the analytics and photon work | Adding Vitest/Playwright to the repo for this PR |
| 17 | "Deploy" for the agent means **opening the PR**. Marcos reviews, merges and updates the nodes (`ssh`, `git pull`, reboot) | Rebooting a node takes an exhibit offline; timing is Marcos's | Agent merges or updates nodes |
| 18 | **One agent**: a single Claude session does Phases 1–6 in order, no orchestrator, no reviewer agents | Marcos's call; the page is one file plus assets | The multi-agent workflow of the seasonal-themes plan |

## Step content

Text for the modal, from the HTML prototype. `kicker` is the small caps line above the title.

| # | Sidebar label | Kicker | Image | Lead (bold) | Body |
| --- | --- | --- | --- | --- | --- |
| 1 | Entangled Photon-Pair Source | On the lab side | `step-1-source.png` | A pair of photons is born. All it took was a laser and some glass. | A laser goes through a polarizer and enters the source, where photon pairs are created in an entangled state of \|HH⟩+\|VV⟩. |
| 2 | Optical Fiber | In and between both buildings | `step-2-optical-fiber.png` | The pair is separated at birth and sent to different destinations. | A dichroic mirror splits the pairs, and each photon goes through optical fiber to its destination. |
| 3 | Interaction Points | At the library | `step-3-interaction-points.png` | The photons' fates are in your hands! | At your location there is accessible equipment that remotely controls what the photons will experience next. |
| 4 | Digital Relay System | In and between both buildings | Gradient placeholder; caption "Placeholder graphic — final artwork pending" | Your choices are relayed to the equipment. | Turning the wheel and pressing the button sends your chosen angle over the network to motors on the half-waveplates at both buildings, rotating them to match your selection. |
| 5 | Half-waveplate and Polarizer | At each building | `step-4-waveplate-polarizer.png`; caption "Stand-in photo of the half-waveplate rotation mount — final photography pending" | When the photons arrive, they are prepared by an outside power (you!) to answer a yes/no question. | Each photon goes through a user-controlled half-waveplate which prepares the photons to be offered a polarization state using the polarizers. |
| 6 | Detection System | On the lab side | `step-5-detection-system.png` | Their choices made, the pair of photons are seen for what they are. | They enter very sensitive light detectors and their time of arrival is recorded. Because they were born at the same time, their arrival times are coincident. |

The existing image files keep their names (`step-4-…` is step 5's photo, `step-5-…` is step 6's); renaming them is optional. Keep the current `imagePosition` values. If a Figma modal frame's text differs from this table, Figma wins and the difference is logged.

## Figma reference

File `wc36ZFIpEHpOgoCRS852BS`. Load the `figma-design-to-code` guidance (MCP resource `skill://figma/figma-design-to-code/SKILL.md`) before calling `get_design_context`.

| What | Node | Notes |
| --- | --- | --- |
| Map (target) | `195:892` | 1920×1080. Ignore `PQN Logo` and `Frame 1` (title) per decision 9 |
| Building 1 row | `195:893` | Loomis card `195:897`, content `195:914` |
| Building 2 row | `195:962` | Library card `195:966`, content `195:983` |
| Optical fiber shapes | `195:923` (A2), `195:947` (Group 4), `195:928` (Vector 4), `205:707` (Vector 6), `195:1036` (B2), `195:1047` (B1) | The photon paths are traced from these |
| Relay paths | `195:1032` (Path B), `195:1035` (Path A) | Dashed; get the marching animation |
| Alice, Bob | `195:1054`, `195:1053` | |
| Modal, step 1–6 | `78:2079`, `78:2084`, `78:2094`, `172:602`, `78:2099`, `78:2089` | "Modal With Sidebar" inside each, 1180×758 |

## Animation specs

From the HTML prototype; port them as `@keyframes` in `sx`/`keyframes` from `@emotion/react`.

| Effect | Spec |
| --- | --- |
| Step number glow | Ring `inset: -6px`, `2px solid rgba(31,122,224,.55)`, `ping 2.6s ease-out infinite`: 0% `scale(.82)` opacity 0 → 18% opacity .75 → 70% `scale(1.5)` opacity 0. Stagger delays 0s / .9s / 1.7s across badges |
| Step number hover/focus | Background and border navy `#13294B`, text white, `scale(1.1)`, `.16s ease`; focus ring `0 0 0 3px #fff, 0 0 0 6px #1F7AE0` |
| Relay lines | `stroke #9AAAB8`, width 1.8, round caps, `stroke-dasharray: 1.5 7`; `dash 3.4s linear infinite` to `stroke-dashoffset: -85` |
| Source orbs | `breathe 3.2s ease-in-out infinite`: `scale(.94)` opacity .88 ↔ `scale(1.04)` opacity 1; second orb delayed .5s |
| Alice / Bob | Alice `4.4s`: `translateY(0) rotate(-3deg)` ↔ `translateY(-7px) rotate(3deg)`. Bob `5.1s`: `translateY(-5px) rotate(4deg)` ↔ `translateY(2px) rotate(-4deg)`. Both `ease-in-out infinite` |
| Modal | Backdrop fade `.22s ease`; card pop `.24s cubic-bezier(.2,.8,.3,1)` from `translateY(14px) scale(.985)` opacity 0 |
| Reduced motion | `@media (prefers-reduced-motion: reduce)`: no CSS animations or transitions; SMIL photons paused (call `pauseAnimations()` on the photon `<svg>`) |
| Photon pair | As at `18bab9a`: 6 s per trip, outcomes 0°, 90°, 45°, 135°, fade in at 3.5 %, fade out at 94 %, collapse window ±2 % around the fraction of the path where the photon crosses its waveplate (recompute `*_COLLAPSE_AT` for the new paths) |

## Phases

Each phase ends with a commit (decision 1: Marcos as sole author, no AI lines) and a Work log row. `next-env.d.ts` and `tsconfig.json` are never committed if a build rewrites them; restore them with `git checkout`.

### Phase 0: Commit, clean up, decide (done)

- [x] Commit the photon pair animation (`18bab9a`) and the docs (`80fbdc4`) on `adding_map`, without AI attribution
- [x] Remove GitNexus boilerplate and the stale `ANALYTICS-PLAN.md`; move the attract-loop plan to `docs/plans/` and fix its links
- [x] Connect Figma; compare Figma, the HTML and the current page; record decisions 1–18
- [x] Write this plan

### Phase 1: Design inputs

- [x] `create_session` on the Figma file, then `get_design_context` on `195:892` (and on its child frames in one parallel batch if the response is sparse) and on each modal frame's "Modal With Sidebar"
- [x] Download every asset the responses list into `public/images/interactive-map/`. Reuse an existing file when it is the same image (compare dimensions, then by eye); no temporary Figma URLs left in code
- [x] Save the Figma screenshots of `195:892` and the six modals to the session scratchpad as the visual targets for Phase 6
- [x] Write down, as constants for Phase 2, every position and size in the 1920×1080 stage, and the fiber and relay path data (`d` strings in stage coordinates)

### Phase 2: Static map in MUI

- [x] Step data module: the 6 steps of [Step content](#step-content) as typed data (`StepNumber = 1 | … | 6`)
- [x] Stage: 1920×1080 `Box`, scaled to fit under `HeaderBar` (port `fitStage` and the `MAP_CONTENT_TOP` offset), page background as today
- [x] Building rows: "Building 1" / "Building 2 (You are here!)" tags, location cards (photo, logo badge, pin icon, name, address, accent strip in Illini orange / navy), white content panels, "Interaction Points" and "Network Closet" subpanels
- [x] Equipment cards as `ButtonBase` hotspots: Source (two orbs), Waveplate A, Detection System (radar), Public Station A and B (gear), Waveplate B, each with A/B receiver chip; Digital Relay pill (A | Digital Relay System | B); "Optical Fiber" pill
- [x] Step badges 1–6 at Figma's positions (5 at both waveplates); each opens its step
- [x] Fiber (yellow core over dark edge) and relay lines (dashed) in one SVG layer behind the cards, from Figma's paths; the direction arrows from the design
- [x] Alice and Bob beside the stations
- [x] Screenshot at 1920×1080 against the Figma target; fix layout differences before moving on

### Phase 3: Step modal

- [x] MUI `Dialog` per the Figma modal frames: sidebar list with the active step highlighted, gradient top bar, close button, kicker, title, image (or gradient placeholder for step 4), caption, lead, body, footer with Previous Step / Next Step ("Return to Beginning" on step 6, wraps to step 1), Previous disabled on step 1
- [x] Keys: `1`–`6` open that step (whether or not the modal is open), `←`/`→` move while open, `Esc` closes; focus returns to the hotspot that opened it
- [x] Opening a step clears the missed-tap hint and the Alice/Bob bubbles (as today)
- [x] Screenshot all six modals against the Figma frames

### Phase 4: Animations

- [x] Re-trace `LAB_PHOTON_PATH` and `LIBRARY_PHOTON_PATH` along frame B's fibers (Source → Waveplate A → Detection; Source → down through the loop → Waveplate B → up to Detection), passing straight through each waveplate; recompute `LAB_COLLAPSE_AT` / `LIBRARY_COLLAPSE_AT` as the fraction of path length at the waveplate (measure with `getTotalLength()` / `getPointAtLength()` in the browser)
- [x] Waveplate icons with the turning dial at both waveplates, in step with the photons
- [x] Step number glow and hover/focus ([Animation specs](#animation-specs))
- [x] Marching dashes on the relay lines
- [x] Breathing orbs; bobbing Alice and Bob; modal fade and pop
- [x] Reduced motion: every CSS animation and transition off, photons paused at a readable frame
- [x] Screenshots of the photons at fixed times (e.g. mid-flight, at collapse, after collapse) with `pauseAnimations()` + `setCurrentTime()`

### Phase 5: Carry-over behaviour and cleanup

- [x] Alice/Bob question bubbles, positioned for frame B's Alice and Bob (tap-only since Marcos's feedback)
- [x] Missed-tap hint: a tap that hits no control shows "Tap a highlighted element to learn more" and highlights every hotspot for 2.6 s
- [x] `PageTimeout` as today
- [x] Delete `src/app/map/map.module.css` and any image in `public/images/interactive-map/` that nothing references any more (check with `grep -r` across `src/` first)
- [x] `CONTEXT.md`: run Prettier on it (it fails `format:check` today) or add `CONTEXT.md` and `docs/` to `.prettierignore`, whichever keeps the tables readable
- [x] Local `CLAUDE.md` (gitignored): note that `/map` is MUI with a scaled 1920×1080 stage

### Phase 6: Verify and open the PR

- [x] `npm run lint`, `npm run format:check`, `npm run build` all pass
- [x] Browser check at 1920×1080 with mocked backend (see the analytics browser harness note: Playwright from the npx cache, isolated `BUILD_DIR` and port, `127.0.0.1:8000` mocked): map, six modals, photons at fixed times, reduced motion, keys `1`–`6`/arrows/Esc, missed-tap hint, Header map button from `/` reaches `/map`
- [x] Compare each screenshot with its Figma target; fix in-scope differences; list any intended difference in the PR
- [ ] Push `adding_map` and open the PR to `master` with `gh pr create`: summary, the decisions table in short, screenshots, what Marcos should check. No AI attribution (decision 1)
- [ ] Tick Phase 6, log it, tell Marcos the PR link

### Phase 7: Review, merge, deploy (by hand)

- [ ] **Manual:** Marcos reviews the PR and the screenshots
- [ ] **Manual:** merge to `master`
- [ ] **Manual:** on each node, `ssh`, `git pull`, reboot; open `/map` and tap through all six steps

## Workflow

One Claude session does Phases 1–6 in order (decision 18). No orchestrator, no reviewer agents.

- **Read this plan first**, then the current `src/app/map/page.tsx` and `HeaderBar.tsx`.
- **Surgical and minimal.** Reuse the current page's logic (stage fitting, photon timing, waveplate SVG, fuzzy conversation, hint) rather than rewriting it; only the styling layer and layout change wholesale.
- **Decide, don't wait.** When this plan doesn't answer a question, pick the option closest to the decisions above, write it into the Work log, and carry on. Stop and ask Marcos only for something that changes a decision here or needs something outside the repo.
- **Commit at the end of each phase**, Marcos as sole author (decision 1). Never commit `next-env.d.ts`.
- **Agents never merge or touch the nodes** (decision 17).

## Out of scope and deferred

- Final artwork for step 4 and final photography for step 5 (placeholders stay, decisions 11 and the step 5 caption).
- `#step-N` deep links and the narrow-screen pan mode (decisions 8, 10).
- Adding a test framework to the repo (decision 16).
- The pre-existing kiosk focus + Enter double-activation bug; not touched here.

## Risks

- **Photon paths don't line up with the new fibers.** Mitigation: trace from Figma's path data, not by eye; measure collapse points with `getPointAtLength()`; screenshot at fixed times.
- **Figma's absolute positions fight MUI layout.** Mitigation: the stage is fixed 1920×1080, so absolute positions inside it are fine (decision 8); MUI is for styling and components, not reflow.
- **The design's light-blue fill was part of the contrast.** The app background replaces it (decision 9); check card and label contrast in the screenshots.
- **Builds rewrite `next-env.d.ts` / `tsconfig.json`.** Mitigation: restore them before each commit.

## Work log

Newest first. One row per session or meaningful event.

| Date | Who | What happened |
| --- | --- | --- |
| 2026-10-27 | Claude | **Marcos's feedback.** (1) The library photon took the loop in the wrong order (up the left side first, then a reversal at the crossing), so it turned sharply instead of going round. Re-ordered to match the fiber: through the crossing, up the right side, over the top, down the left side, out through the crossing. `LIBRARY_COLLAPSE_AT` re-measured: 0.6122. Frames at 1.65–2.25 s confirm it follows the loop. (2) **Decision 14 changed:** Alice and Bob no longer speak on a timer. Tapping one makes that fuzzy ask the other an SSM question, and the other replies; a new tap starts a new exchange, and opening a step ends it. They are buttons but not hotspots, so a tap on them never sets off the missed-tap hint, and the hint never outlines them. Verified in Chrome: no bubble before a tap, the right speaker on each tap, a missed tap shows the hint with no outline on them, opening a step clears the bubble; keys still pass. |
| 2026-10-27 | Claude | **Phases 2–5, Phase 6 checks.** `/map` rewritten in MUI as `page.tsx` (stage, buildings, hotspots, lines, Alice/Bob, bubbles, hint, keys), `StepDialog.tsx` (Figma modal), `photons.tsx` (photon pair + waveplate SMIL, ported unchanged apart from paths) and `steps.ts`; `map.module.css` deleted. Each building's panel is absolutely placed at Figma's coordinates and its equipment uses Figma's panel-local positions; the measured waveplate centres, (1167, 353) and (1380, 805), match the computed ones. Photon paths re-traced along the fiber centrelines (lab from the right orb, library from the left orb); `getTotalLength()` gives `LAB_COLLAPSE_AT` 0.5116 and `LIBRARY_COLLAPSE_AT` 0.6115, and screenshots at fixed times show each photon collapsing on its waveplate. Keys verified in Chrome: `1`–`6`, `←`/`→` (→ on step 6 wraps to 1, ← on step 1 does nothing), `Esc`, sidebar, footer, close; focus returns to the hotspot that opened the dialog. Reduced motion: all SMIL timelines paused at 4.8 s (both photons collapsed), zero CSS animations. `npm run lint` clean, `npm run build` passes, `format:check` passes for every tracked app file (still fails on the pre-existing `status-bridge/server.mjs`). **Decided:** the dialog renders inside the scaled stage (`container`), as the old one did, so it scales with the map; its backdrop overshoots the stage so the letterbox bands are dimmed too. **Decided:** the old focus-ring colour (`#ff5f05`) stays inside the dialog; hotspots use the HTML's blue ring. **Decided:** `CONTEXT.md` is formatted with Prettier (only `*em*` → `_em_`); `docs/` goes in `.prettierignore` because Prettier pads every plan table row to the widest cell; `.next-*` replaces `.next-a`/`.next-b` there so test build dirs don't fail `format:check`. **Kept, differs from Figma:** step 5's photo crop stays `center 65%` as this plan says (Figma crops nearer 78%). Inter and PP Museum are not loaded anywhere in the app, so text renders in the fallback fonts, as on the old page and in `HeaderBar`. **Not checked:** the Header map button from `/`; with the `{}` API mock the home page drops into maintenance mode, which hides that button. `HeaderBar` is untouched on this branch. |
| 2026-10-27 | Claude | **Phase 1.** `get_design_context` on `195:892` (high-fidelity, no child calls needed) and on all six modals. Modal text matches [Step content](#step-content) exactly. Every photo and logo Figma returned is byte-identical to a file already in `public/images/interactive-map/`, so those are reused. New files: `alice.png`, `bob.png` (Figma's PNG characters), `source-orb.png`, `detection-system.svg`, `fiber-arrow.svg`, `optical-fiber-a-detector.svg` (Vector 4), `optical-fiber-b-detector.svg` (Vector 6), `fiber-crossing-1/2.svg` (the over/under ticks on B1's loop), `radio.svg`, `radio-receiver.svg`. Overwritten with frame B versions: `optical-fiber-a1/a2/b1/b2.svg`, `device-line.svg`, `relay-line.svg`. Figma screenshots (map + six modals, 1920×1080) saved to the session scratchpad. Stage geometry: Building 1/2 content panels start at (602, 183) and (602, 633) (card 394 wide + 2 px border; tag 27 + gap 16 above each station). **Decided:** Figma exports the relay lines as pre-cut dash outlines, which can't march, so their centrelines were rebuilt from the dash centres (filtered, chained nearest-neighbour, Catmull-Rom) into `RELAY_PATH_A`/`B`. **Decided:** the fiber/relay SVG layer sits *above* the cards, not behind as Phase 2 says: in Figma the fibers are drawn over the card edges, and the fiber has to be visible inside the waveplate cards for the photon to cross the waveplate. |
| 2026-10-27 | Marcos with Claude | Grilling session. Committed the photon pair animation (`18bab9a`) and docs (`80fbdc4`), first with a `Co-Authored-By` trailer, then rewritten without it (not yet pushed). Removed GitNexus boilerplate and the stale `ANALYTICS-PLAN.md`; moved the attract-loop plan to `docs/plans/`. Connected Figma; found two `Map` frames and picked `195:892`; found the six modal frames. Decisions 1–18. Wrote this plan. |
