'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * An element's box in viewport coordinates: the box a Decoration is placed
 * against, as the page lays the element out.
 */
export interface ElementBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

function boxOf(element: Element): ElementBox {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    right: rect.right,
    bottom: rect.bottom,
    width: rect.width,
    height: rect.height,
  };
}

function sameBox(a: ElementBox, b: ElementBox): boolean {
  return (
    a.left === b.left &&
    a.top === b.top &&
    a.right === b.right &&
    a.bottom === b.bottom &&
    a.width === b.width &&
    a.height === b.height
  );
}

/**
 * An element's box, measured where the page lays the element out and
 * re-measured whenever it moves or resizes: a
 * ResizeObserver watches the element and every container around it — an
 * element can move without resizing, as the Measuring popup's bar does when
 * the popup grows around it — plus the window's resize event.
 *
 * `select` finds the element, so it can be one of the pages' own anchors
 * (a `data-decoration-anchor` attribute) or an element found from this
 * component's own place in the DOM. It must stay the same function across
 * renders (module-level, or `useCallback` with no deps), or the measurement
 * is torn down and set up again on every render. Until the element is laid
 * out, the box is null and a piece placed against it does not render; once
 * the element is gone, the box is null again and its pieces stop rendering.
 */
export function useElementBox(
  select: () => Element | null | undefined
): ElementBox | null {
  const [box, setBox] = useState<ElementBox | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const measure = () => {
      const element = select();
      if (!element) {
        // An element that is gone has no box: the pieces placed against it
        // stop rendering instead of floating on its last box (a page state
        // can swap its element away, as SSM1's send error swaps the emoji
        // circle for the broken computer), while the set's other pieces,
        // each placed against its own anchor, stay.
        setBox(null);
        return;
      }
      if (element !== elementRef.current) {
        elementRef.current = element;
        observerRef.current?.disconnect();
        if (typeof ResizeObserver !== 'undefined') {
          const observer = new ResizeObserver(measure);
          observer.observe(element);
          for (
            let container = element.parentElement;
            container;
            container = container.parentElement
          ) {
            observer.observe(container);
          }
          observerRef.current = observer;
        }
      }
      const next = boxOf(element);
      setBox((previous) =>
        previous && sameBox(previous, next) ? previous : next
      );
    };
    // The page's layout is an external system this measures, on mount and
    // then on every change; the box cannot be derived from props or state.
    measure();
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('resize', measure);
      observerRef.current?.disconnect();
      observerRef.current = null;
      elementRef.current = null;
    };
  }, [select]);

  return box;
}
