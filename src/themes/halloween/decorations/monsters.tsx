import { STAGE_TOP } from './ambient';
import './decorations.css';

/**
 * The monsters of the Halloween boards (the plan's Scenes table), each ported
 * once from its board: each Scene composes its own monster, placed as its
 * board places it. The stage-anchored monsters carry their boards' own
 * placements; the content-anchored ones take the position the Scene measured
 * for them on the page.
 */

/**
 * The peeking monster (Main.dc.html): 76x80 at the stage's top right, popping
 * in over the edge. The board's own placement.
 */
export function MonsterPeek() {
  return (
    <div
      className="halloween-monster-peek"
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 'calc(7% + 42px)',
        top: `calc(${STAGE_TOP} + 4px)`,
        width: '76px',
        height: '80px',
      }}
    >
      <svg width="76" height="80" viewBox="0 0 76 80">
        <path
          d="M22 14 Q16 2 10 4 M54 14 Q60 2 66 4"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle
          cx="10"
          cy="4"
          r="4"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2"
        />
        <circle
          cx="66"
          cy="4"
          r="4"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2"
        />
        <path
          d="M6 80 L6 40 Q6 12 38 12 Q70 12 70 40 L70 80 Z"
          fill="#f5ddff"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle
          cx="26"
          cy="36"
          r="9"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle
          cx="50"
          cy="36"
          r="9"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle cx="28" cy="38" r="4" fill="#000000" />
        <circle cx="52" cy="38" r="4" fill="#000000" />
        <path
          d="M30 54 Q38 60 46 54"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/**
 * The popping monster (Main.dc.html): 112x124 at the bottom centre, popping
 * up from below the stage. The board's own placement.
 */
export function MonsterPop() {
  return (
    <div
      className="halloween-monster-pop"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 'calc(50% - 56px)',
        bottom: 0,
        width: '112px',
        height: '124px',
      }}
    >
      <svg width="112" height="124" viewBox="0 0 112 124">
        <path
          d="M30 26 Q20 6 30 0 Q34 12 42 20 Z M82 26 Q92 6 82 0 Q78 12 70 20 Z"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 124 L10 56 Q10 16 56 16 Q102 16 102 56 L102 124 Z"
          fill="#338659"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M34 18 L38 10 L44 17 L50 8 L56 16 L62 8 L68 17 L74 10 L78 18"
          fill="#338659"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="96" r="6" fill="#006230" />
        <circle cx="88" cy="104" r="8" fill="#006230" />
        <circle cx="84" cy="80" r="4" fill="#006230" />
        <circle
          cx="56"
          cy="54"
          r="20"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
        />
        <circle cx="59" cy="57" r="9" fill="#000000" />
        <circle cx="62" cy="53" r="3" fill="#ffffff" />
        <path
          d="M36 38 Q56 28 76 38"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M32 86 Q56 106 80 86 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M40 89 L46 89 L43 96 Z M66 89 L72 89 L69 96 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

interface MonsterRiseProps {
  left: number;
  top: number;
}

/**
 * The rising monster (QF1.dc.html): 96x110, rising from behind the crystal
 * ball. The board anchors it to the ball, so the Scene passes the ball's own
 * place on the page.
 */
export function MonsterRise({ left, top }: MonsterRiseProps) {
  return (
    <div
      className="halloween-monster-rise"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '96px',
        height: '110px',
      }}
    >
      <svg width="96" height="110" viewBox="0 0 96 110">
        <path
          d="M16 28 L8 4 L28 18 Z M80 28 L88 4 L68 18 Z"
          fill="#13294b"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M6 110 L6 48 Q6 14 48 14 Q90 14 90 48 L90 110 Z"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cx="22" cy="72" r="5" fill="#c88f11" />
        <circle cx="74" cy="86" r="7" fill="#c88f11" />
        <circle
          cx="26"
          cy="38"
          r="9"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle
          cx="48"
          cy="30"
          r="10"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle
          cx="70"
          cy="38"
          r="9"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle cx="28" cy="40" r="4" fill="#000000" />
        <circle cx="50" cy="32" r="4.5" fill="#000000" />
        <circle cx="72" cy="40" r="4" fill="#000000" />
        <path
          d="M34 60 Q48 70 62 60"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M40 64 L44 64 L42 70 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * The sliding monster (QF2.dc.html): 124x140, sliding in from the right at
 * the bottom of the stage, waving. The board's own placement.
 */
export function MonsterSlide() {
  return (
    <div
      className="halloween-monster-slide"
      aria-hidden="true"
      style={{
        position: 'absolute',
        right: 0,
        bottom: '20px',
        width: '124px',
        height: '140px',
      }}
    >
      <svg width="124" height="140" viewBox="0 0 124 140" overflow="visible">
        <g className="halloween-monster-arm">
          <path
            d="M34 74 Q12 62 12 36"
            fill="none"
            stroke="#000000"
            strokeWidth="13"
            strokeLinecap="round"
          />
          <path
            d="M34 74 Q12 62 12 36"
            fill="none"
            stroke="#d0f9ff"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M4 34 L6 22 L12 30 L16 20 L20 32"
            fill="#d0f9ff"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M62 22 Q64 2 78 2 Q68 10 72 24 Z"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M28 140 L28 62 Q28 22 70 22 Q112 22 112 62 L112 140 Z"
          fill="#d0f9ff"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M44 30 L48 22 L52 30 M84 28 L90 20 L94 30"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="46" cy="110" r="7" fill="#33b3dd" />
        <circle cx="96" cy="120" r="9" fill="#33b3dd" />
        <circle cx="92" cy="96" r="4" fill="#33b3dd" />
        <circle
          cx="56"
          cy="58"
          r="11"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle
          cx="86"
          cy="58"
          r="11"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <circle cx="51" cy="60" r="4.5" fill="#000000" />
        <circle cx="81" cy="60" r="4.5" fill="#000000" />
        <path
          d="M54 82 Q70 102 86 82 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <ellipse cx="70" cy="92" rx="7" ry="4" fill="#f48fb1" />
        <path
          d="M60 84 L65 84 L62.5 90 Z M75 84 L80 84 L77.5 90 Z"
          fill="#ffffff"
        />
      </svg>
    </div>
  );
}

interface PeekerProps {
  left: number;
  top: number;
}

/**
 * The peeking monster of the Measuring popup (Measuring.dc.html): 96x80 in a
 * 96x70 window with its bottom on the popup's top edge, so it pops up over
 * the edge. The Scene passes the popup's own top-right corner.
 */
export function Peeker({ left, top }: PeekerProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '96px',
        height: '70px',
        overflow: 'hidden',
      }}
    >
      <div
        className="halloween-peeker"
        style={{ width: '96px', height: '70px' }}
      >
        <svg width="96" height="80" viewBox="0 0 96 80">
          <path
            d="M26 20 L20 2 L36 14 Z M70 20 L76 2 L60 14 Z"
            fill="#fcb316"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M8 80 L8 44 Q8 12 48 12 Q88 12 88 44 L88 80 Z"
            fill="#f5ddff"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <circle
            cx="34"
            cy="40"
            r="10"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle
            cx="62"
            cy="40"
            r="10"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="36" cy="44" r="4.5" fill="#000000" />
          <circle cx="64" cy="44" r="4.5" fill="#000000" />
          <path
            d="M40 60 Q48 66 56 60"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

interface BarBatProps {
  /** The progress bar's own box on the page, which the bat rides. */
  left: number;
  top: number;
  width: number;
  /** The real progress, 0-100 (agent decision A7). */
  progress: number;
}

/**
 * The bat riding the Measuring popup's progress bar (Measuring.dc.html):
 * flapping at the fill's leading edge, 30px above the bar, its left edge
 * tracking the real progress along the real bar (agent decision A7: the bar
 * keeps MUI's shape; the bat rides it as it is).
 */
export function BarBat({ left, top, width, progress }: BarBatProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
      }}
    >
      <div
        className="halloween-bar-rider"
        style={{
          position: 'absolute',
          top: '-30px',
          left: `${progress}%`,
          transform: 'translateX(-50%)',
          width: '48px',
          height: '26px',
        }}
      >
        <svg width="48" height="26" viewBox="0 0 48 26">
          <g className="halloween-wing">
            <path
              fill="#000000"
              d="M2 12 Q8 2 16 9 Q18 4 21 7 L23 1 L25 7 Q28 4 30 9 Q38 2 46 12 Q38 11 34 18 Q30 14 26 18 Q24 13 22 18 Q18 14 14 18 Q10 11 2 12 Z"
            />
          </g>
          <circle cx="21" cy="10" r="1.3" fill="#ffffff" />
          <circle cx="26" cy="10" r="1.3" fill="#ffffff" />
        </svg>
      </div>
    </div>
  );
}
