# 2. Node-to-display commands travel over SSE, not the coordination WebSocket

Date: 2026-07-30

## Status

Accepted

## Context

Whobot's screenshot Action captures a node's real X display via `maim`
(`pqn-node/src/pqn_node/api/routes/system.py`). The frontend is not in that path
at all. To photograph the home page rather than a video, something has to tell
the browser to dismiss the attract loop first — which means the node needs a way
to push a command to the display.

Two existing channels between node and GUI, and they are not equivalent:

- **One WebSocket**, `/coordination/follow_requested_alerts`. The GUI treats
  _every_ message on it as a follow request: `src/app/page.tsx` drops
  `lastMessage.data` straight into `FollowRequestEventModal` as body text,
  without parsing. Carrying a second kind of message would require introducing a
  message envelope on both sides — a breaking change across two repos, where
  mismatched versions fail silently. The hook also does not reconnect: on close
  it sets its desired state to disconnected and gives up
  (`src/hooks/WebSocketHook.tsx`). On a kiosk that runs for weeks, a dropped
  socket stays dropped.
- **Three SSE endpoints**: `/chsh/progress`, `/rng/progress`, and
  `/coordination/state_events`. Every payload already carries a typed `event`
  field, and consumers already switch on it (`src/components/ModalBox.tsx`).
  `src/hooks/useSSE.tsx` exists and takes an `enabled` flag, so a stream can be
  scoped to a single page.

  One caveat, found during implementation: `useSSE` calls `eventSource.close()`
  in its `onerror`, which suppresses `EventSource`'s own auto-reconnect, and it
  reports failures via `console.error`. Both are right for a progress dialog
  that lives for one experiment and wrong for a background channel on a kiosk
  that runs for weeks. The attract loop therefore uses its own
  `src/hooks/useDisplayEvents.tsx`, which retries every 5s and stays silent —
  rather than changing `useSSE` under its two existing consumers.

A third option was to add no channel at all and have the GUI notice a
`dismiss_attract_until` flag on its next availability poll.

## Decision

Operator-initiated display commands travel over a new SSE endpoint,
`/system/display_events`, following the shape of `/coordination/state_events`:
an `asyncio.Event` the screenshot handler sets, a 1 s `wait_for` loop, heartbeat
comments between events. Its first message type is `dismiss_attract`.

The coordination WebSocket is not extended. Treat it as legacy and
coordination-only.

Because `EventSource` is one-way, the browser cannot acknowledge that it has
repainted. The screenshot handler therefore sets the event, waits a configurable
settle delay (default 1200 ms), and then captures. That default covers the
overlay's 300 ms fade plus the availability re-fetch the dismissal triggers —
without the re-fetch completing first, the screenshot would show stale
availability buttons and defeat the point of the peek.

## Consequences

Good:

- Additive on both sides. Nothing about follow requests changes, so the
  two-player experiment path is untouched and versions need not move in lockstep.
- The typed-`event` convention already in use gives dispatch for free; no new
  envelope to design.
- Reconnection is cheap to get right on this transport — redialling an
  `EventSource` is a `setTimeout`, where the WebSocket hook would need its
  give-up-on-close behaviour unpicked.
- The channel generalises. Future operator nudges (return to home page, reload
  the GUI) are new `event` values, not new transports.

Bad:

- A second persistent connection from the home page. Immaterial against the
  browser's per-origin limit at current usage, but it is one more thing that can
  be open.
- The settle delay is a guess, not a handshake. Too short and the capture races
  the fade or the re-fetch; too long and every peek is slower. It is configurable
  precisely because the right value is empirical.
- A browser not listening — mid-experiment, or with the stream closed — makes
  the dismissal a silent no-op. Correct behaviour here, but it means "I asked for
  a dismissal" and "the display dismissed" are not the same thing, and nothing
  reports the difference.
- Two channels now exist with overlapping capability. Anyone adding a push
  message has to know the rule: SSE unless it is coordination.
