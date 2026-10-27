'use client';
import { createElement } from 'react';
import { Box } from '@mui/material';
import { activeDecorations, type Scene } from '@/themes';

interface DecorationsProps {
  /** The Scene the page's state calls for (decision 10). */
  scene: Scene;
  /** The Measuring popup's read-only progress, for the `measuring` Scene
   * (decision 11). */
  progress?: number;
}

/**
 * The Decorations slot (decision 10): renders the active theme's Decorations
 * for a Scene above the page, aria-hidden and never taking pointer events,
 * so they cannot cover a control. The Default Theme maps no Scene, so the
 * slot renders nothing at all — nothing in the DOM that could shift layout.
 */
export default function Decorations({ scene, progress }: DecorationsProps) {
  const decorations = activeDecorations(scene);
  if (!decorations) {
    return null;
  }
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 999,
      }}
    >
      {createElement(decorations, { progress })}
    </Box>
  );
}
