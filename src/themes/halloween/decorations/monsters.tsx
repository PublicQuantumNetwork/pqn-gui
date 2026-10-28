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

/** The mummy leaning out from the stage's right edge (CHSH1.dc.html):
 *  124x140 at the board's own place (right 0, 230px down), leaning in and
 *  reaching with its arm. At rest it leans fully outside the stage, where
 *  the content box's own edge hides it, as on the board. */
export function MonsterLean({ stage }: { stage: ElementBox }) {
  return (
    <div
      aria-hidden="true"
      style={pieceStyle({
        left: stage.right - 124,
        top: stage.top + 230,
        width: 124,
        height: 140,
      })}
    >
      <div
        className="halloween-monster-lean"
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width="124"
          height="140"
          viewBox="0 0 124 140"
          overflow="visible"
          style={{ display: 'block' }}
        >
          <path
            d="M36 140 L36 54 Q36 16 78 16 Q120 16 120 54 L120 140 Z"
            fill="#fff4dd"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <g
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <path d="M42 34 Q80 24 118 38" />
            <path d="M37 70 Q78 62 120 74" />
            <path d="M37 92 Q78 84 120 96" />
            <path d="M37 114 Q78 106 120 118" />
            <path d="M37 132 Q78 126 120 136" />
          </g>
          <path
            d="M38 40 Q78 32 119 46 L120 62 Q78 50 37 58 Z"
            fill="#424242"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle
            cx="60"
            cy="52"
            r="10"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle
            cx="90"
            cy="51"
            r="7"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="56" cy="53" r="4" fill="#000000" />
          <circle cx="87" cy="52" r="3" fill="#000000" />
          <path
            d="M58 82 Q64 78 70 82 Q76 86 82 82"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M120 76 Q132 86 124 100"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <g className="halloween-monster-reach">
            <path
              d="M42 96 L6 88 Q0 94 6 102 L42 108 Z"
              fill="#fff4dd"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M30 94 L26 106 M18 91 L14 104"
              fill="none"
              stroke="#000000"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M6 88 Q-4 86 -2 92 M6 102 Q-4 104 -2 98"
              fill="none"
              stroke="#000000"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

/** The blob oozing out of the witch's brew pot (CHSH2.dc.html): the board's
 *  own 150x190 stand — the pot with its brewing bubbles at the bottom, the
 *  monster rising out of it through a window whose bottom edge sits 66px
 *  above — placed on the stage's bottom edge, 250px left of its centre.
 *  The Scene passes the stand's own left edge (clamped past the pose
 *  pumpkin beside it, whose clamped spot the GUI lays right of the board's)
 *  and the stage's bottom edge (agent decision A8). At rest the monster
 *  sits fully below the window's bottom edge, hidden inside the pot, as on
 *  the board. */
export function MonsterOoze({
  left,
  bottom,
}: {
  left: number;
  bottom: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${bottom - 190}px`,
        width: '150px',
        height: '190px',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '15px',
          top: '0px',
          width: '120px',
          height: '124px',
          overflow: 'hidden',
        }}
      >
        <div
          className="halloween-monster-ooze"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '120px',
            height: '124px',
          }}
        >
          <svg
            width="120"
            height="124"
            viewBox="0 0 120 124"
            style={{ display: 'block' }}
          >
            <path
              d="M48 34 Q44 20 38 8 M72 34 Q76 20 82 8"
              fill="none"
              stroke="#000000"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M14 124 Q8 70 28 54 Q34 30 60 30 Q86 30 92 54 Q112 70 106 124 Z"
              fill="#eaffbb"
              stroke="#000000"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M22 90 Q20 100 24 104 Q28 100 26 90 M96 84 Q94 96 98 100 Q102 96 100 84"
              fill="#eaffbb"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <circle cx="40" cy="98" r="6" fill="#338659" />
            <circle cx="84" cy="108" r="8" fill="#338659" />
            <circle cx="78" cy="70" r="4" fill="#338659" />
            <g className="halloween-ooze-eye">
              <circle
                cx="38"
                cy="8"
                r="9"
                fill="#ffffff"
                stroke="#000000"
                strokeWidth="2.5"
              />
              <circle
                cx="82"
                cy="8"
                r="9"
                fill="#ffffff"
                stroke="#000000"
                strokeWidth="2.5"
              />
              <circle cx="40" cy="10" r="4" fill="#000000" />
              <circle cx="80" cy="10" r="4" fill="#000000" />
            </g>
            <path
              d="M44 62 Q60 82 76 62 Z"
              fill="#000000"
              stroke="#000000"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <ellipse cx="60" cy="72" rx="6" ry="3.5" fill="#f48fb1" />
            <path d="M50 64 L55 64 L52.5 70 Z" fill="#ffffff" />
          </svg>
        </div>
      </div>
      <svg
        width="150"
        height="110"
        viewBox="0 0 150 110"
        aria-hidden="true"
        style={{ position: 'absolute', left: 0, bottom: 0, display: 'block' }}
      >
        <circle
          className="halloween-brew"
          cx="54"
          cy="36"
          r="5"
          fill="#eaffbb"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <circle
          className="halloween-brew-late"
          cx="100"
          cy="34"
          r="4"
          fill="#eaffbb"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <path
          d="M30 106 L24 96 M120 106 L126 96"
          fill="none"
          stroke="#000000"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M14 46 Q6 98 75 100 Q144 98 136 46 Z"
          fill="#13294b"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M28 64 Q34 84 52 90"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <ellipse
          cx="75"
          cy="44"
          rx="66"
          ry="12"
          fill="#0d1b33"
          stroke="#000000"
          strokeWidth="3"
        />
        <path
          d="M18 44 Q75 54 132 44 Q75 36 18 44 Z"
          fill="#eaffbb"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M24 48 Q22 58 27 60 Q30 56 30 48 M120 48 Q118 60 124 62 Q127 56 126 48"
          fill="#eaffbb"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** The vampire rising from the stage's bottom edge (CHSH3.dc.html):
 *  124x150 at the board's own place (right 28px, bottom 0), waving its arm.
 *  At rest it sits fully below the stage's bottom edge: a window with its
 *  bottom edge there hides it, as the board's own stage edge does (the
 *  Decorations layer is not the stage's child, so nothing else would clip
 *  it). */
export function MonsterVamp({ stage }: { stage: ElementBox }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${stage.right - 28 - 124}px`,
        top: `${stage.bottom - 150}px`,
        width: '124px',
        height: '150px',
        overflow: 'hidden',
      }}
    >
      <div
        className="halloween-monster-vamp"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '124px',
          height: '150px',
        }}
      >
        <svg
          width="124"
          height="150"
          viewBox="0 0 124 150"
          overflow="visible"
          style={{ display: 'block' }}
        >
          <path
            d="M10 150 L20 100 Q62 82 104 100 L114 150 Z"
            fill="#9c9a9d"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M46 94 L62 118 L78 94 Q62 88 46 94 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M30 112 L32 150 M94 112 L92 150"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <g className="halloween-vamp-arm">
            <path
              d="M100 108 Q116 94 118 70"
              fill="none"
              stroke="#000000"
              strokeWidth="13"
              strokeLinecap="round"
            />
            <path
              d="M100 108 Q116 94 118 70"
              fill="none"
              stroke="#9c9a9d"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <rect
              x="114"
              y="46"
              width="7"
              height="16"
              rx="2"
              fill="#ffffff"
              stroke="#000000"
              strokeWidth="1.5"
              transform="rotate(18 117 54)"
            />
            <circle
              cx="118"
              cy="64"
              r="8"
              fill="#f5ddff"
              stroke="#000000"
              strokeWidth="2.5"
            />
          </g>
          <path
            d="M40 22 L42 6 L52 18 Z M84 22 L82 6 L72 18 Z"
            fill="#fcb316"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <g fill="#ffffff" stroke="#000000" strokeWidth="2.5">
            <circle cx="26" cy="58" r="13" />
            <circle cx="28" cy="38" r="14" />
            <circle cx="42" cy="24" r="14" />
            <circle cx="62" cy="20" r="14" />
            <circle cx="82" cy="24" r="14" />
            <circle cx="96" cy="38" r="14" />
            <circle cx="98" cy="58" r="13" />
          </g>
          <path
            d="M14 40 L4 34 M16 62 L4 66 M108 40 L120 34 M108 62 L120 66 M50 8 L46 0 M74 8 L78 0"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <ellipse
            cx="62"
            cy="62"
            rx="30"
            ry="32"
            fill="#f5ddff"
            stroke="#000000"
            strokeWidth="3"
          />
          <path
            d="M38 46 Q46 38 56 46 M68 46 Q78 38 86 46"
            fill="none"
            stroke="#000000"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M38 46 Q46 38 56 46 M68 46 Q78 38 86 46"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle
            cx="48"
            cy="58"
            r="8"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle
            cx="76"
            cy="58"
            r="8"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="50" cy="59" r="3.5" fill="#000000" />
          <circle cx="78" cy="59" r="3.5" fill="#000000" />
          <ellipse
            cx="38"
            cy="72"
            rx="5"
            ry="3"
            fill="rgba(240,128,170,0.55)"
          />
          <ellipse
            cx="86"
            cy="72"
            rx="5"
            ry="3"
            fill="rgba(240,128,170,0.55)"
          />
          <path
            d="M40 78 Q50 70 62 75 Q74 70 84 78 Q76 86 62 81 Q48 86 40 78 Z"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M54 88 Q62 94 70 88"
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

/** The sock monster dangling from the stage's top edge (CHSH3-weak.dc.html):
 *  90x156, 82px left of the board's stage centre (the Scene clamps it past
 *  the speech bubble's right edge, which the GUI lays right of the board's
 *  stage), scratching itself. At rest it hangs fully above its window's top
 *  edge, which sits on the stage's own top edge and hides it, as the board's
 *  stage edge does (the Decorations layer is not the stage's child, so
 *  nothing else would clip it). */
export function MonsterDangle({ left, top }: { left: number; top: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '90px',
        height: '156px',
        overflow: 'hidden',
      }}
    >
      <div
        className="halloween-monster-dangle"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '90px',
          height: '156px',
        }}
      >
        <svg
          width="90"
          height="156"
          viewBox="0 0 90 156"
          overflow="visible"
          style={{ display: 'block' }}
        >
          <path
            d="M45 0 Q45 30 36 46 Q28 60 42 64 Q54 66 48 80"
            fill="none"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M45 0 Q45 30 36 46 Q28 60 42 64 Q54 66 48 80"
            fill="none"
            stroke="#1d58a7"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M22 132 Q14 142 18 148 M68 132 Q76 142 72 148"
            fill="none"
            stroke="#000000"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18 116 Q6 124 12 136"
            fill="none"
            stroke="#000000"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M18 116 Q6 124 12 136"
            fill="none"
            stroke="#1d58a7"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M45 76 Q30 76 22 86 L14 82 L18 92 Q12 102 14 112 L6 114 L15 120 Q18 134 32 140 L32 148 L40 141 Q45 142 50 141 L58 148 L58 140 Q72 134 75 120 L84 114 L76 112 Q78 102 72 92 L76 82 L68 86 Q60 76 45 76 Z"
            fill="#1d58a7"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <ellipse
            cx="45"
            cy="124"
            rx="17"
            ry="12"
            fill="#d0f9ff"
            stroke="#000000"
            strokeWidth="2"
          />
          <circle
            cx="34"
            cy="100"
            r="9"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle
            cx="57"
            cy="100"
            r="9"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="36" cy="96" r="4" fill="#000000" />
          <circle cx="59" cy="96" r="4" fill="#000000" />
          <ellipse cx="46" cy="115" rx="3.5" ry="4" fill="#000000" />
          <g className="halloween-dangle-arm">
            <path
              d="M70 112 Q86 98 74 82"
              fill="none"
              stroke="#000000"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M70 112 Q86 98 74 82"
              fill="none"
              stroke="#1d58a7"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <circle
              cx="72"
              cy="80"
              r="5"
              fill="#1d58a7"
              stroke="#000000"
              strokeWidth="2"
            />
          </g>
        </svg>
      </div>
    </div>
  );
}

/** The monster tiptoeing in from the stage's right edge
 *  (CHSH3-error.dc.html): 140x120 at the board's own place (right 0, 12px
 *  above the bottom), its ears twitching. At rest it stands fully right of
 *  the stage's right edge, where the content box's own edge hides it, as on
 *  the board. */
export function MonsterTiptoe({ stage }: { stage: ElementBox }) {
  return (
    <div
      aria-hidden="true"
      style={pieceStyle({
        left: stage.right - 140,
        top: stage.bottom - 12 - 120,
        width: 140,
        height: 120,
      })}
    >
      <div
        className="halloween-monster-tiptoe"
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width="140"
          height="120"
          viewBox="0 0 140 120"
          overflow="visible"
          style={{ display: 'block' }}
        >
          <path
            d="M100 88 Q124 106 170 96"
            fill="none"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M100 88 Q124 106 170 96"
            fill="none"
            stroke="#424242"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <ellipse
            cx="52"
            cy="110"
            rx="10"
            ry="5"
            fill="#c88f11"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <ellipse
            cx="84"
            cy="110"
            rx="10"
            ry="5"
            fill="#c88f11"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <g className="halloween-tiptoe-ears">
            <path
              d="M40 50 L6 28 L36 64 Z M96 50 L130 28 L100 64 Z"
              fill="#c88f11"
              stroke="#000000"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path
              d="M34 52 L16 38 L32 60 Z M102 52 L120 38 L104 60 Z"
              fill="#fdca5c"
            />
          </g>
          <ellipse
            cx="68"
            cy="76"
            rx="36"
            ry="34"
            fill="#c88f11"
            stroke="#000000"
            strokeWidth="3"
          />
          <ellipse
            cx="68"
            cy="92"
            rx="20"
            ry="13"
            fill="#fdca5c"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <circle
            cx="56"
            cy="64"
            r="9"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle
            cx="80"
            cy="64"
            r="9"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <circle cx="59" cy="67" r="4" fill="#000000" />
          <circle cx="83" cy="67" r="4" fill="#000000" />
          <path
            d="M48 52 L62 50 M74 50 L88 52"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M58 80 Q62 77 66 80 Q70 83 74 80 Q78 77 80 80"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M108 42 Q113 51 108 56 Q103 51 108 42 Z"
            fill="#d0f9ff"
            stroke="#000000"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M84 94 L76 94 M84 100 L76 100"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <rect
            x="84"
            y="88"
            width="18"
            height="16"
            rx="3"
            fill="#13294b"
            stroke="#000000"
            strokeWidth="2"
          />
          <path
            d="M98 82 Q106 88 100 96"
            fill="none"
            stroke="#000000"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M98 82 Q106 88 100 96"
            fill="none"
            stroke="#c88f11"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
