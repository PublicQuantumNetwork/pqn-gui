'use client';

import type { CSSProperties } from 'react';
import './Burst.css';

/** One item of the burst: where it starts, how far it flies, when it leaves. */
interface BurstItem {
  left: number;
  top: number;
  x: number;
  y: number;
  delay: string;
  bat: boolean;
}

/**
 * The burst of the CHSH3 board (docs/design/halloween/CHSH3.dc.html): three
 * origins with eight items each, bats and pumpkins alternating, ported as the
 * board computes them.
 */
const origins = [
  { x: 520, y: 110, d: 0 },
  { x: 440, y: 440, d: 0.8 },
  { x: 150, y: 300, d: 1.6 },
];

const burst: BurstItem[] = origins.flatMap((origin) =>
  Array.from({ length: 8 }, (_, k) => {
    const angle = ((k * 45 + 20) * Math.PI) / 180;
    const radius = 90 + (k % 3) * 25;
    return {
      left: origin.x,
      top: origin.y,
      x: Math.round(Math.cos(angle) * radius),
      y: Math.round(Math.sin(angle) * radius),
      delay: (origin.d + (k % 3) * 0.08).toFixed(2) + 's',
      bat: k % 2 === 0,
    };
  })
);

/** The board's bat, ported as it is. */
function Bat() {
  return (
    <svg
      width="40"
      height="16"
      viewBox="0 -2 46 20"
      style={{ display: 'block' }}
    >
      <path
        fill="#000000"
        d="M0 10 Q6 0 14 7 Q17 1 20 4 L22 -2 L25 4 Q28 1 31 7 Q39 0 46 10 Q38 9 35 16 Q31 12 27 16 Q23 11 19 16 Q15 12 11 16 Q8 9 0 10 Z"
      />
    </svg>
  );
}

/** The board's pumpkin, ported as it is (pumpkins are always #ff5f05). */
function Pumpkin() {
  return (
    <svg
      width="34"
      height="30"
      viewBox="0 0 120 104"
      style={{ display: 'block' }}
    >
      <path
        d="M54 26 Q52 10 62 2 Q69 1 70 6 Q62 11 65 27 Z"
        fill="#006230"
        stroke="#000000"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <ellipse
        cx="38"
        cy="62"
        rx="32"
        ry="36"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="7"
      />
      <ellipse
        cx="82"
        cy="62"
        rx="32"
        ry="36"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="7"
      />
      <ellipse
        cx="60"
        cy="62"
        rx="20"
        ry="38"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="7"
      />
      <g fill="#fcb316" stroke="#000000" strokeWidth="5" strokeLinejoin="round">
        <path d="M34 56 L52 56 L43 40 Z" />
        <path d="M68 56 L86 56 L77 40 Z" />
        <path d="M36 72 Q60 94 84 72 Q60 80 36 72 Z" />
      </g>
    </svg>
  );
}

/**
 * The Halloween Celebration (decision 14): the bat-and-pumpkin burst of the
 * CHSH3 board, shown when a Game succeeds.
 */
export default function Burst() {
  return (
    <div className="halloween-burst" aria-hidden="true">
      {burst.map((item, index) => (
        <div
          key={index}
          className="halloween-burst-item"
          style={
            {
              left: `${item.left}px`,
              top: `${item.top}px`,
              animationDelay: item.delay,
              '--x': `${item.x}px`,
              '--y': `${item.y}px`,
            } as CSSProperties
          }
        >
          {item.bat ? <Bat /> : <Pumpkin />}
        </div>
      ))}
    </div>
  );
}
