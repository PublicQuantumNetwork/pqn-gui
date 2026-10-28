'use client';

import { useCallback, useRef } from 'react';
import { BarBat, Peeker } from './monsters';
import { useElementBox } from './useElementBox';

/**
 * The measuring Scene's Decorations (the Measuring design board):
 * the peeking monster over the popup's top edge and, when the popup shows its
 * progress bar, the bat riding the bar's fill. Both are placed against the
 * popup's own geometry, measured where the popup renders and re-measured
 * whenever it moves or grows — the popup grows when its
 * QR image loads, and the two popup variants are different shapes: the
 * bar-less one stands taller, and each page's dialog is as wide as its page
 * makes it.
 */
export default function MeasuringDecorations({
  progress,
}: {
  /** The popup's read-only progress, 0-100. */
  progress?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  // The Decorations render inside the popup, so the popup is
  // this node's own dialog.
  const popup = useCallback(
    () => root.current?.closest<HTMLElement>('[role="dialog"]') ?? null,
    []
  );
  const bar = useCallback(
    () =>
      root.current
        ?.closest('[role="dialog"]')
        ?.querySelector('[role="progressbar"]') ?? null,
    []
  );
  const title = useCallback(
    () =>
      root.current
        ?.closest('[role="dialog"]')
        ?.querySelector('[data-decoration-anchor="measuring-title"]') ?? null,
    []
  );
  const popupBox = useElementBox(popup);
  const barBox = useElementBox(bar);
  const titleBox = useElementBox(title);
  return (
    <div ref={root}>
      {/* The board's peeker: 96px wide with its right edge 72px in from the
          popup's right, its bottom on the popup's top. */}
      {popupBox && (
        <Peeker left={popupBox.right - 72 - 96} top={popupBox.top - 70} />
      )}
      {barBox && titleBox && progress !== undefined && (
        <BarBat
          bar={barBox}
          headingBottom={titleBox.bottom}
          progress={progress}
        />
      )}
    </div>
  );
}
