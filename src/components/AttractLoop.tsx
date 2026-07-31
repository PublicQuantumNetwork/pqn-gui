'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useDisplayEvents } from '@/hooks/useDisplayEvents';
import { attractIdleMs, subscribeToAttractRequests } from '@/attractLoop';

// Path is relative to /public. The file is not in git — see
// docs/adr/0001-large-media-outside-git.md.
const VIDEO_SRC = '/video/pqn-intro.mp4';

// How long the overlay takes to fade in or out. The node's screenshot endpoint
// waits out this fade before capturing, so keep the two in step.
const FADE_MS = 300;

// After an operator peek there is nobody standing at the node, so the attract
// loop comes back quickly rather than waiting out the full idle delay.
const PEEK_GRACE_MS = 10_000;

/** Events that mean a visitor is present. Deliberately excludes `mousemove`:
 *  a jittery mouse or a cursor left over the display would keep a node awake
 *  forever. */
const PRESENCE_EVENTS = [
  'pointerdown',
  'touchstart',
  'keydown',
  'wheel',
] as const;

interface AttractLoopProps {
  /** Holds the overlay hidden while true — used so an incoming follow request
   *  is never buried behind a video. */
  suppressed: boolean;
  /** Called when the overlay is dismissed, for whatever reason. */
  onDismiss: () => void;
}

/**
 * The attract loop: a fullscreen video that plays when no visitor is present,
 * inviting a passerby to engage. See CONTEXT.md for the domain terms.
 *
 * Cycles in perpetuity while unattended — idle delay, one full pass of the
 * video, idle delay, one pass — rather than looping the video continuously.
 *
 * Renders nothing at all when the idle delay is configured to 0, or once the
 * video has failed to load — a node with no video file simply never shows one.
 */
export default function AttractLoop({
  suppressed,
  onDismiss,
}: AttractLoopProps) {
  const [visible, setVisible] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleMs = attractIdleMs();
  const disabled = idleMs <= 0 || unavailable;

  const arm = useCallback(
    (delayMs: number) => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (disabled) return;
      idleTimer.current = setTimeout(() => setVisible(true), delayMs);
    },
    [disabled]
  );

  /** Hide the overlay, rewind, and re-arm. Every route back to the home page
   *  goes through here, which is what makes "the home page is visible" and
   *  "game availability was just re-checked" the same event. */
  const hideAndRearm = useCallback(
    (rearmMs: number) => {
      setVisible(false);
      // Next pass starts from the beginning — a new passerby should see the
      // video from the top, not from wherever the last one left it.
      if (videoRef.current) videoRef.current.currentTime = 0;
      arm(rearmMs);
      onDismiss();
    },
    [arm, onDismiss]
  );

  // Mirrors `visible` for the window listener below, which must not re-subscribe
  // every time the overlay shows or hides.
  const visibleRef = useRef(false);
  useEffect(() => {
    visibleRef.current = visible;
  }, [visible]);

  // A visitor being present resets the timer. A touch on the overlay is handled
  // by its own swallowing handler below, so this sees pointer events only once
  // the overlay is already gone — but keyboard and wheel events reach here even
  // while it is showing, and must dismiss it the same way a touch would.
  useEffect(() => {
    if (disabled) return;

    const onPresence = () => {
      if (visibleRef.current) hideAndRearm(idleMs);
      else arm(idleMs);
    };

    PRESENCE_EVENTS.forEach((name) =>
      window.addEventListener(name, onPresence, { passive: true })
    );
    arm(idleMs);

    return () => {
      PRESENCE_EVENTS.forEach((name) =>
        window.removeEventListener(name, onPresence)
      );
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [arm, disabled, hideAndRearm, idleMs]);

  // An operator peek: dismiss so the screenshot shows the home page, then come
  // back sooner than a visitor dismissal would allow. Only subscribed while the
  // attract loop is live, since there is nothing to dismiss otherwise.
  const onDisplayCommand = useCallback(
    (command: string) => {
      if (command === 'dismiss_attract') hideAndRearm(PEEK_GRACE_MS);
    },
    [hideAndRearm]
  );
  useDisplayEvents(!disabled, onDisplayCommand);

  // A visitor asking to see the video from the header. Skips the idle delay,
  // and cancels any pending arm so the two cannot fight over the overlay.
  useEffect(() => {
    if (disabled) return;
    return subscribeToAttractRequests(() => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      setVisible(true);
    });
  }, [disabled]);

  // Don't decode video into a hidden element on an idle node.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!visible || suppressed) {
      video.pause();
      return;
    }

    // The element's `error` event routinely fires before React has attached its
    // handler, and media error events are never replayed — so the element is
    // inspected directly rather than trusted to report in. Without this, a node
    // whose video file is missing shows a fullscreen black overlay instead of
    // no attract loop at all.
    if (video.error) {
      // Legitimate: reacting to the state of an external platform API.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnavailable(true);
      return;
    }

    void video.play().catch(() => {
      /* Autoplay refused. The overlay is dismissible either way. */
    });
  }, [visible, suppressed]);

  if (disabled) return null;

  const shown = visible && !suppressed;

  return (
    <Box
      aria-hidden={!shown}
      // Right-click is how a desktop browser offers Picture-in-Picture even
      // with controls hidden, so the menu never opens on a kiosk.
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={(event) => {
        // Swallow the dismissing touch: a visitor should never be dropped into
        // an experiment they did not choose.
        event.preventDefault();
        event.stopPropagation();
        hideAndRearm(idleMs);
      }}
      sx={{
        position: 'fixed',
        inset: 0,
        // Below MUI's modal layer (1300) so a dialog is never masked.
        zIndex: 1200,
        backgroundColor: '#000',
        opacity: shown ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-in-out`,
        pointerEvents: shown ? 'auto' : 'none',
        cursor: 'pointer',
        touchAction: 'none',
      }}
    >
      <Box
        component="video"
        ref={videoRef}
        src={VIDEO_SRC}
        onError={() => setUnavailable(true)}
        // One pass per cycle, not a continuous loop: the video plays through
        // once, the home page shows for the idle delay, then it plays again.
        // Hence no `loop` attribute — `ended` is what drives the cycle.
        onEnded={() => hideAndRearm(idleMs)}
        muted
        playsInline
        preload="auto"
        // Kiosk hygiene: no controls, no Picture-in-Picture toggle, and no
        // context menu offering either. Standard attribute — Chrome, Edge and
        // Safari honour it fully, Firefox 116+ partially.
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Plain black text, no backing. The video is near-white for all but its
          final ~2s, which are pure black — the prompt is effectively invisible
          for that fraction of each loop. Accepted deliberately; trimming the
          black tail from the video would remove it entirely. */}
      <Typography
        sx={{
          position: 'absolute',
          right: '2.5vw',
          bottom: '3vh',
          color: '#000000',
          fontSize: 'clamp(0.9rem, 1.4vw, 1.4rem)',
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          userSelect: 'none',
          animation: 'attractPromptBreathe 4s ease-in-out infinite',
          '@keyframes attractPromptBreathe': {
            '0%, 100%': { opacity: 0.3 },
            '50%': { opacity: 1 },
          },
        }}
      >
        Please touch the screen to begin
      </Typography>
    </Box>
  );
}
