'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { BarBat, Peeker } from './monsters';

/**
 * The Measuring popup's geometry its Decorations anchor to (decision 11):
 * the popup itself — the peeking monster hangs over its top-right corner, 72px
 * in from the right edge, as on the board — and its progress bar, which the
 * bat rides at the real progress (agent decision A7). Measured where the
 * popup renders, because the two popup variants are different shapes: the
 * bar-less one stands taller, and each dialog is as wide as its page makes
 * it, so no single placement fits them all.
 */
interface PopupGeometry {
  /** The popup's top-right corner, in viewport coordinates. */
  popupRight: number;
  popupTop: number;
  /** The progress bar's box, in viewport coordinates; absent when the popup
   * shows no bar (the SSM variant). */
  bar: { left: number; top: number; width: number } | null;
}

/**
 * The measuring Scene's Decorations (docs/design/halloween/Measuring.dc.html):
 * the peeking monster and, when the popup shows its progress bar, the bat
 * riding the bar's fill.
 */
export default function MeasuringDecorations({
  progress,
}: {
  /** The popup's read-only progress, 0-100 (decision 11). */
  progress?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [geometry, setGeometry] = useState<PopupGeometry | null>(null);

  // The popup is fully laid out when this mounts, and nothing in it moves
  // afterwards (the bar's fill grows inside the same box), so measuring once
  // on mount is enough.
  useLayoutEffect(() => {
    // The Decorations render inside the popup (group 1.4), so the popup is
    // this node's own dialog.
    const popup = root.current?.closest<HTMLElement>('[role="dialog"]');
    if (!popup) {
      return;
    }
    const popupBox = popup.getBoundingClientRect();
    const bar = popup.querySelector<HTMLElement>('[role="progressbar"]');
    const barBox = bar?.getBoundingClientRect();
    // Legitimate: the popup's layout is an external system this component
    // reads once on mount; the geometry cannot be derived from props or
    // state, and it never changes after the popup is laid out.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setGeometry({
      popupRight: popupBox.left + popupBox.width,
      popupTop: popupBox.top,
      bar: bar
        ? { left: barBox!.left, top: barBox!.top, width: barBox!.width }
        : null,
    });
  }, []);

  if (!geometry) {
    return <div ref={root} />;
  }
  return (
    <div ref={root}>
      {/* The board's peeker: 96px wide with its right edge 72px in from the
          popup's right, its bottom on the popup's top. */}
      <Peeker
        left={geometry.popupRight - 72 - 96}
        top={geometry.popupTop - 70}
      />
      {geometry.bar && progress !== undefined && (
        <BarBat
          left={geometry.bar.left}
          top={geometry.bar.top}
          width={geometry.bar.width}
          progress={progress}
        />
      )}
    </div>
  );
}
