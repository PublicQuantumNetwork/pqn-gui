import type { ReactNode } from 'react';
import './Chsh3Line.css';

/**
 * "spooky", one letter per span so each bobs on its own delay, exactly the
 * delays of the CHSH3 design board.
 */
const spooky = [
  { letter: 's', delay: '0s' },
  { letter: 'p', delay: '0.12s' },
  { letter: 'o', delay: '0.24s' },
  { letter: 'o', delay: '0.36s' },
  { letter: 'k', delay: '0.48s' },
  { letter: 'y', delay: '0.6s' },
];

/**
 * The CHSH3 Flavour-copy line under an entangled result:
 * "spooky action at a distance — Albert Einstein", the "spooky" letters
 * bobbing one after the other, ported from the CHSH3 board. The page's
 * Typography carries the board's placement and size; this node carries the
 * letters and the attribution.
 */
export const chsh3EntangledLine: ReactNode = (
  <>
    {spooky.map(({ letter, delay }) => (
      <span
        key={delay}
        className="halloween-sp"
        style={{ animationDelay: delay }}
      >
        {letter}
      </span>
    ))}{' '}
    action at a distance
    <br />
    <span
      style={{
        fontSize: '14px',
        lineHeight: '20px',
        letterSpacing: '0.17px',
      }}
    >
      — Albert Einstein
    </span>
  </>
);
