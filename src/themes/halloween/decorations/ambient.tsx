import type { CSSProperties } from 'react';
import './decorations.css';

/**
 * The ambient pieces every Halloween board is dressed with (the plan's Scenes
 * table), each ported once from its board so every Scene composes the pieces
 * its own board has (groups 2.2-2.4). Each piece is an absolutely placed
 * ornament inside the Decorations layer (group 1.4), which is fixed over the
 * page and takes no pointer events.
 */

/**
 * Where the boards' stage begins: under the header, which on every page is
 * the logo's own 135px over its 32px margin, as in the boards' own header.
 * The stage-anchored pieces sit at the boards' own offsets below it.
 */
export const STAGE_TOP = '167px';

/** The stage's top-left corner offset a stage-anchored piece sits at. */
function stageTop(offset: number | string): string {
  return `calc(${STAGE_TOP} + ${offset}px)`;
}

/**
 * The corner web (Main.dc.html and every board): 200x200, hanging from the
 * stage's top-left corner. Every board places it the same way.
 */
export function Web() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      aria-hidden="true"
      style={{ position: 'absolute', left: 0, top: STAGE_TOP }}
    >
      <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round">
        <path d="M0 0 L200 0 M0 0 L188 68 M0 0 L141 141 M0 0 L68 188 M0 0 L0 200" />
        <path d="M60 0 Q52 9 56 21 Q44 28 42 42 Q28 44 21 56 Q9 52 0 60" />
        <path d="M110 0 Q96 17 103 38 Q82 52 78 78 Q52 82 38 103 Q17 96 0 110" />
        <path d="M160 0 Q140 25 150 55 Q120 76 113 113 Q76 120 55 150 Q25 140 0 160" />
      </g>
    </svg>
  );
}

/**
 * The moon (Main.dc.html and every board): 160x160, at the stage's top right.
 * Every board places it the same way.
 */
export function Moon() {
  return (
    <svg
      width="160"
      height="160"
      viewBox="0 0 160 160"
      aria-hidden="true"
      style={{ position: 'absolute', right: '7%', top: stageTop(28) }}
    >
      <circle
        cx="80"
        cy="80"
        r="70"
        fill="#fff4dd"
        stroke="#000000"
        strokeWidth="2"
      />
      <circle
        cx="56"
        cy="62"
        r="12"
        fill="none"
        stroke="#000000"
        strokeWidth="1.5"
      />
      <circle
        cx="98"
        cy="96"
        r="8"
        fill="none"
        stroke="#000000"
        strokeWidth="1.5"
      />
      <circle
        cx="70"
        cy="112"
        r="5"
        fill="none"
        stroke="#000000"
        strokeWidth="1.5"
      />
    </svg>
  );
}

/**
 * The bats (Main.dc.html and every board): drifting at the stage's top right.
 * Every board places them the same way.
 */
export function Bats() {
  return (
    <svg
      className="halloween-bats"
      width="220"
      height="110"
      viewBox="0 0 220 110"
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 'calc(7% + 120px)',
        top: stageTop(40),
      }}
    >
      <path
        fill="#000000"
        d="M10 40 Q16 30 24 37 Q27 31 30 34 L32 28 L35 34 Q38 31 41 37 Q49 30 56 40 Q48 39 45 46 Q41 42 37 46 Q33 41 29 46 Q25 42 21 46 Q18 39 10 40 Z"
      />
      <path
        fill="#000000"
        d="M110 12 Q118 0 128 9 Q131 2 135 6 L137 0 L140 6 Q144 2 147 9 Q157 0 166 12 Q156 11 152 19 Q147 14 142 19 Q138 13 133 19 Q128 14 124 19 Q120 11 110 12 Z"
      />
      <path
        fill="#000000"
        d="M150 78 Q155 71 161 76 Q163 72 165 74 L167 70 L169 74 Q171 72 173 76 Q179 71 184 78 Q178 77 176 82 Q173 79 170 82 Q167 78 164 82 Q161 79 158 82 Q156 77 150 78 Z"
      />
    </svg>
  );
}

interface SpiderProps {
  /** The horizontal placement, one of the board's own `left`/`right` values. */
  offset: Pick<CSSProperties, 'left' | 'right'>;
  /** How far down the stage the spider hangs on its thread. */
  threadHeight: number;
  /** The board's own bobbing duration (Main's 3.2s, QF1's 3.6s). */
  bobDuration: string;
}

/**
 * The spider (Main.dc.html, QF1.dc.html), hanging from the top of the stage
 * on its thread, bobbing. Each board places it and times it its own way.
 */
export function Spider({ offset, threadHeight, bobDuration }: SpiderProps) {
  return (
    <div
      className="halloween-spider"
      aria-hidden="true"
      style={{
        position: 'absolute',
        ...offset,
        top: STAGE_TOP,
        width: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animationDuration: bobDuration,
      }}
    >
      <div
        style={{
          width: '2px',
          height: `${threadHeight}px`,
          background: '#000000',
        }}
      />
      <svg width="40" height="34" viewBox="0 0 40 34">
        <g fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round">
          <path d="M14 14 Q6 8 2 12 M14 18 Q5 16 1 22 M15 21 Q8 26 6 32 M26 14 Q34 8 38 12 M26 18 Q35 16 39 22 M25 21 Q32 26 34 32" />
        </g>
        <ellipse cx="20" cy="18" rx="8" ry="9" fill="#000000" />
        <circle cx="17" cy="16" r="2" fill="#ffffff" />
        <circle cx="23" cy="16" r="2" fill="#ffffff" />
      </svg>
    </div>
  );
}

interface GhostProps {
  left: number;
  top: number;
  width: number;
  height: number;
}

/**
 * The ghost (Main.dc.html, QF2.dc.html), floating. The two boards draw it the
 * same but for a couple of pixels in the mouth; this is Main's drawing, worn
 * at each board's own size and place.
 */
export function Ghost({ left, top, width, height }: GhostProps) {
  return (
    <svg
      className="halloween-ghost"
      width={width}
      height={height}
      viewBox="0 0 100 120"
      aria-hidden="true"
      style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
    >
      <path
        d="M20 60 Q4 60 4 72 Q12 74 20 70"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M82 56 Q96 46 94 32 Q86 36 82 46"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M18 104 L18 50 Q18 8 52 8 Q86 8 86 50 L86 104 Q79 116 72 104 Q65 92 58 104 Q52 116 45 104 Q38 92 31 104 Q24 116 18 104 Z"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M28 30 Q34 18 46 16"
        fill="none"
        stroke="#e0e0e0"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="46" rx="6" ry="8" fill="#000000" />
      <ellipse cx="64" cy="46" rx="6" ry="8" fill="#000000" />
      <circle cx="42" cy="43" r="2.2" fill="#ffffff" />
      <circle cx="66" cy="43" r="2.2" fill="#ffffff" />
      <ellipse cx="31" cy="58" rx="6" ry="3.5" fill="rgba(240,128,170,0.55)" />
      <ellipse cx="73" cy="58" rx="6" ry="3.5" fill="rgba(240,128,170,0.55)" />
      <ellipse cx="52" cy="64" rx="6" ry="8" fill="#000000" />
      <ellipse cx="52" cy="68" rx="3.5" ry="3" fill="#f48fb1" />
    </svg>
  );
}

interface PumpkinProps {
  left: number;
  top: number;
  /** Whether the face flickers, as QF2.dc.html lights it. */
  flicker?: boolean;
}

/**
 * The pumpkin leaning out from under Whobit's pose (Main.dc.html, QF2.dc.html),
 * 120x104, at the board's own place beside the pose; QF2's face flickers.
 * Pumpkins are always #ff5f05 (decision 7).
 */
export function Pumpkin({ left, top, flicker }: PumpkinProps) {
  return (
    <svg
      width="120"
      height="104"
      viewBox="0 0 120 104"
      aria-hidden="true"
      style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
    >
      <ellipse cx="60" cy="100" rx="46" ry="4" fill="rgba(0,0,0,0.15)" />
      <path
        d="M64 14 Q78 2 86 12 Q90 22 80 22 Q74 21 77 16"
        fill="none"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M66 20 Q78 14 90 24 Q78 32 66 20 Z"
        fill="#338659"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M72 21 Q80 22 86 24"
        fill="none"
        stroke="#000000"
        strokeWidth="1.2"
      />
      <path
        d="M54 26 Q52 10 62 2 Q69 1 70 6 Q62 11 65 27 Z"
        fill="#006230"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="32"
        cy="62"
        rx="28"
        ry="34"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3"
      />
      <ellipse
        cx="88"
        cy="62"
        rx="28"
        ry="34"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3"
      />
      <ellipse
        cx="46"
        cy="62"
        rx="22"
        ry="37"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3"
      />
      <ellipse
        cx="74"
        cy="62"
        rx="22"
        ry="37"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3"
      />
      <ellipse
        cx="60"
        cy="62"
        rx="16"
        ry="38"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3"
      />
      <path
        d="M16 48 Q12 60 16 76 M30 36 Q26 50 28 60"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g
        className={flicker ? 'halloween-flicker' : undefined}
        fill="#fcb316"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      >
        <path d="M36 54 L52 54 L44 40 Z" />
        <path d="M68 54 L84 54 L76 40 Z" />
        <path d="M56 66 L64 66 L60 59 Z" />
        <path d="M34 74 Q60 98 86 74 L80 76 L76 83 L69 77 L60 86 L51 77 L44 83 L40 76 Z" />
      </g>
      <path d="M41 52 L47 52 L44 46 Z M73 52 L79 52 L76 46 Z" fill="#fdca5c" />
    </svg>
  );
}

interface PumpkinSmallProps {
  left: number;
  top: number;
}

/**
 * The small pumpkin beside the ghost under the game buttons (Main.dc.html),
 * 84x73, the board's own smaller drawing with its smooth face.
 */
export function PumpkinSmall({ left, top }: PumpkinSmallProps) {
  return (
    <svg
      width="84"
      height="73"
      viewBox="0 0 120 104"
      aria-hidden="true"
      style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
    >
      <ellipse cx="60" cy="100" rx="46" ry="4" fill="rgba(0,0,0,0.15)" />
      <path
        d="M54 26 Q52 10 62 2 Q69 1 70 6 Q62 11 65 27 Z"
        fill="#006230"
        stroke="#000000"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M66 20 Q78 14 90 24 Q78 32 66 20 Z"
        fill="#338659"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="32"
        cy="62"
        rx="28"
        ry="34"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <ellipse
        cx="88"
        cy="62"
        rx="28"
        ry="34"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <ellipse
        cx="46"
        cy="62"
        rx="22"
        ry="37"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <ellipse
        cx="74"
        cy="62"
        rx="22"
        ry="37"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <ellipse
        cx="60"
        cy="62"
        rx="16"
        ry="38"
        fill="#ff5f05"
        stroke="#000000"
        strokeWidth="3.5"
      />
      <path
        d="M16 48 Q12 60 16 76"
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <g
        fill="#fcb316"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
      >
        <path d="M36 56 Q44 40 52 56 Z" />
        <path d="M68 56 Q76 40 84 56 Z" />
        <path d="M38 72 Q60 94 82 72 Q60 80 38 72 Z" />
      </g>
    </svg>
  );
}
