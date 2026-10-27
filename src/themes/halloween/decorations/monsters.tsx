import { pieceStyle, type BallCircle } from './ambient';
import type { ElementBox } from './useElementBox';
import './decorations.css';

/**
 * The monsters of the Halloween boards (the plan's Scenes table), each ported
 * once from its board: each Scene composes its own monster, placed against
 * the element its board ties it to, as the page lays that element out (agent
 * decision A8).
 */

/** The peeking monster (Main.dc.html): 76x80 at the stage's top right (right
 *  7% plus 42px, 4px down), popping in over the edge. Rendered before the
 *  moon, which covers it at rest as on the board; `occluders` (the game
 *  buttons) are cut out of it, as the buttons cover it there on the board. */
export function MonsterPeek({
  stage,
  occluders,
}: {
  stage: ElementBox;
  occluders?: ElementBox[];
}) {
  const left = stage.right - stage.width * 0.07 - 42 - 76;
  return (
    <div
      aria-hidden="true"
      style={pieceStyle(
        { left, top: stage.top + 4, width: 76, height: 80 },
        occluders
      )}
    >
      <div
        className="halloween-monster-peek"
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width="76"
          height="80"
          viewBox="0 0 76 80"
          style={{ display: 'block' }}
        >
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
    </div>
  );
}

/** The popping monster (Main.dc.html): 112x124 at the bottom centre of the
 *  stage, popping up from below its bottom edge. The window's bottom edge is
 *  the stage's own bottom, so at rest the monster is hidden below it, as on
 *  the board. */
export function MonsterPop({ stage }: { stage: ElementBox }) {
  const left = stage.left + stage.width / 2 - 56;
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${stage.bottom - 124}px`,
        width: '112px',
        height: '124px',
        overflow: 'hidden',
      }}
    >
      <div
        className="halloween-monster-pop"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '112px',
          height: '124px',
        }}
      >
        <svg
          width="112"
          height="124"
          viewBox="0 0 112 124"
          style={{ display: 'block' }}
        >
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
    </div>
  );
}

/** The rising monster (QF1.dc.html): 96x110 behind the page's own ball,
 *  rising above the ball's top edge. On the board the ball itself hides the
 *  monster at rest and everything below its edge; here a window with its
 *  bottom edge at the ball's top edge (at the monster's x, the circle's
 *  highest point) does the same, so only what rises above the ball shows —
 *  the horns' 48px at full rise, nothing at rest or under reduced motion. */
export function MonsterRise({ ball }: { ball: BallCircle }) {
  const circleTop = ball.cy - ball.r;
  // The board's monster rests 26px below its ball's top edge and rises 74px
  // (wigling ±5°), so the window reaches 80px above the resting top.
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${ball.cx - 48}px`,
        top: `${circleTop - 54}px`,
        width: '96px',
        height: '54px',
        overflow: 'hidden',
      }}
    >
      <div
        className="halloween-monster-rise"
        style={{
          position: 'absolute',
          left: 0,
          top: '80px',
          width: '96px',
          height: '110px',
        }}
      >
        <svg
          width="96"
          height="110"
          viewBox="0 0 96 110"
          style={{ display: 'block' }}
        >
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
    </div>
  );
}

/** The sliding monster (QF2.dc.html): 124x140, sliding in from the right at
 *  the bottom of the stage (20px up), waving. */
export function MonsterSlide({ stage }: { stage: ElementBox }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${stage.right - 124}px`,
        top: `${stage.bottom - 20 - 140}px`,
        width: '124px',
        height: '140px',
      }}
    >
      <div
        className="halloween-monster-slide"
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width="124"
          height="140"
          viewBox="0 0 124 140"
          overflow="visible"
          style={{ display: 'block' }}
        >
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
    </div>
  );
}

/** The peeking monster of the Measuring popup (Measuring.dc.html): 96x80 in
 *  a 96x70 window with its bottom on the popup's top edge, 72px in from the
 *  right, so it pops up over the edge. The Scene passes the popup's own
 *  top-right corner, measured where the popup renders. */
export function Peeker({ left, top }: { left: number; top: number }) {
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
        <svg
          width="96"
          height="80"
          viewBox="0 0 96 80"
          style={{ display: 'block' }}
        >
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

/** The bat riding the Measuring popup's progress bar (Measuring.dc.html):
 *  flapping at the fill's leading edge, its left edge tracking the real
 *  progress along the real bar (agent decision A7: the bar keeps MUI's
 *  shape; the bat rides it as it is). The board hangs its bat 30px above a
 *  bar 44px under the title; the GUI's bar sits 16px under the title, so the
 *  bat hangs from the title's own bottom edge down onto the bar, never
 *  covering the title (Fixed copy) nor the "% complete" line below the bar. */
export function BarBat({
  bar,
  headingBottom,
  progress,
}: {
  bar: ElementBox;
  headingBottom: number;
  /** The real progress, 0-100 (agent decision A7). */
  progress: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${bar.left}px`,
        top: `${bar.top}px`,
        width: `${bar.width}px`,
        height: `${bar.height}px`,
      }}
    >
      <div
        className="halloween-bar-rider"
        style={{
          position: 'absolute',
          top: `${headingBottom - bar.top}px`,
          left: `${progress}%`,
          transform: 'translateX(-50%)',
          width: '48px',
          height: '26px',
        }}
      >
        <svg
          width="48"
          height="26"
          viewBox="0 0 48 26"
          style={{ display: 'block' }}
        >
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
