'use client';

import { useEffect, useRef } from 'react';

/** How long to wait before redialling a stream that dropped or was refused. */
const RETRY_MS = 5000;

/**
 * Subscribes to the node's display-command stream and invokes `onCommand` with
 * each command's `event` name. See docs/adr/0002-display-commands-over-sse.md.
 *
 * Deliberately not built on `useSSE`. That hook closes the stream on the first
 * error and surfaces the failure as UI state, which is right for a progress
 * dialog that lives for the length of one experiment. This is a background
 * channel on a kiosk that runs for weeks, so it needs the opposite: retry
 * quietly and indefinitely, and stay silent about an endpoint that may not
 * exist on this node yet.
 *
 * Commands arrive through a callback rather than as state, so the consumer
 * reacts in an event handler instead of an effect.
 */
export function useDisplayEvents(
  enabled: boolean,
  onCommand: (command: string) => void
) {
  // Held in a ref so a changing callback identity never resubscribes.
  const handler = useRef(onCommand);

  useEffect(() => {
    handler.current = onCommand;
  }, [onCommand]);

  useEffect(() => {
    if (!enabled) return;

    let source: EventSource | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    let unmounted = false;

    const connect = () => {
      source = new EventSource(
        `http://${process.env.NEXT_PUBLIC_API_ADDRESS}/system/display_events`
      );

      source.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (typeof data?.event === 'string') handler.current(data.event);
        } catch {
          /* A malformed frame is not worth acting on or complaining about. */
        }
      };

      source.onerror = () => {
        // Redial on our own schedule rather than leaving it to EventSource: a
        // node whose API is down or predates this endpoint would otherwise be
        // retried as fast as the browser likes.
        source?.close();
        source = null;
        if (unmounted) return;
        retry = setTimeout(connect, RETRY_MS);
      };
    };

    connect();

    return () => {
      unmounted = true;
      source?.close();
      if (retry) clearTimeout(retry);
    };
  }, [enabled]);
}
