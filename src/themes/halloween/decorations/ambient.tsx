'use client';

import { useId, type CSSProperties } from 'react';
import type { ElementBox } from './useElementBox';
import './decorations.css';

/**
 * The ambient pieces every Halloween board is dressed with, each ported once
 * from its board so every Scene composes the pieces its own board has. Every
 * piece is placed against the element its board ties it to, as the page lays
 * that element out (the boxes a Scene measures for them), inside the
 * Decorations layer — fixed over the page, aria-hidden, no pointer events.
 */

/**
 * The clip-path that cuts the occluders' boxes out of a piece's box: where
 * the page's own content occludes a piece on its board (the game buttons
 * over the moon and the bats), the same boxes are cut out of it here, so the piece never covers
 * that content's text. A round occluder (a circle the page
 * itself draws, `CircleOccluder`) is cut as the circle it is. The clip's
 * outer edge is generous: it only bounds the piece's own art, which its
 * animations move (the bats drift, the peeking monster drops out of sight).
 */
function clipPathValue(
  box: { left: number; top: number; width: number; height: number },
  occluders: ElementBox[],
  circles: CircleOccluder[] = []
): string {
  const holes = occluders
    .map((occluder) => {
      const x = occluder.left - box.left;
      const y = occluder.top - box.top;
      return ` M${x} ${y} H${x + occluder.width} V${y + occluder.height} H${x} Z`;
    })
    .join('');
  const roundHoles = circles
    .map((circle) => {
      const cx = circle.cx - box.left;
      const cy = circle.cy - box.top;
      return ` M${cx - circle.r} ${cy} a${circle.r} ${circle.r} 0 1 0 ${circle.r * 2} 0 a${circle.r} ${circle.r} 0 1 0 ${-circle.r * 2} 0 Z`;
    })
    .join('');
  return `path(evenodd, "M-100 -100 H${box.width + 100} V${box.height + 100} H-100 Z${holes}${roundHoles}")`;
}

/** A round occluder: a circle the page itself draws (circle.png's disc —
 *  the CHSH2 wheel, the CHSH3 results circle). A piece the board draws
 *  behind that circle is cut around it here, as the rectangular occluders
 *  are. */
export interface CircleOccluder {
  cx: number;
  cy: number;
  r: number;
}

/**
 * The wrapper a piece paints in: placed at its box, and where the page's own
 * content occludes the piece on its board, that content's boxes (and the
 * circles it draws) are cut out of it (see `clipPathValue`).
 */
export function pieceStyle(
  box: { left: number; top: number; width: number; height: number },
  occluders?: ElementBox[],
  circles?: CircleOccluder[]
): CSSProperties {
  const style: CSSProperties = {
    position: 'absolute',
    left: `${box.left}px`,
    top: `${box.top}px`,
    width: `${box.width}px`,
    height: `${box.height}px`,
  };
  if ((occluders && occluders.length > 0) || (circles && circles.length > 0)) {
    style.clipPath = clipPathValue(box, occluders ?? [], circles ?? []);
  }
  return style;
}

/** The corner web (Main board and every board): 200x200, hanging from the
 *  stage's top-left corner. Every board places it the same way. */
export function Web({ stage }: { stage: ElementBox }) {
  return (
    <div
      style={pieceStyle({
        left: stage.left,
        top: stage.top,
        width: 200,
        height: 200,
      })}
    >
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        style={{ display: 'block' }}
      >
        <g fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="round">
          <path d="M0 0 L200 0 M0 0 L188 68 M0 0 L141 141 M0 0 L68 188 M0 0 L0 200" />
          <path d="M60 0 Q52 9 56 21 Q44 28 42 42 Q28 44 21 56 Q9 52 0 60" />
          <path d="M110 0 Q96 17 103 38 Q82 52 78 78 Q52 82 38 103 Q17 96 0 110" />
          <path d="M160 0 Q140 25 150 55 Q120 76 113 113 Q76 120 55 150 Q25 140 0 160" />
        </g>
      </svg>
    </div>
  );
}

/** The moon (Main board and every board): 160x160, at the stage's top
 *  right (right 7%, 28px down). Every board places it the same way. Where
 *  the board draws a circle of its own over the moon (the CHSH2 wheel, the
 *  CHSH3 results circle), that circle is cut out of it here. */
export function Moon({
  stage,
  occluders,
  circleOccluder,
}: {
  stage: ElementBox;
  occluders?: ElementBox[];
  circleOccluder?: CircleOccluder;
}) {
  const left = stage.right - stage.width * 0.07 - 160;
  return (
    <div
      style={pieceStyle(
        { left, top: stage.top + 28, width: 160, height: 160 },
        occluders,
        circleOccluder ? [circleOccluder] : undefined
      )}
    >
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        style={{ display: 'block' }}
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
    </div>
  );
}

/** The bats (Main board and every board): drifting at the stage's top
 *  right (right 7% plus 120px, 40px down). Every board places them the same
 *  way. Where the board draws a circle of its own over the bats (the CHSH3
 *  results circle), that circle is cut out of them here. */
export function Bats({
  stage,
  occluders,
  circleOccluder,
}: {
  stage: ElementBox;
  occluders?: ElementBox[];
  circleOccluder?: CircleOccluder;
}) {
  const left = stage.right - stage.width * 0.07 - 120 - 220;
  return (
    <div
      style={pieceStyle(
        { left, top: stage.top + 40, width: 220, height: 110 },
        occluders,
        circleOccluder ? [circleOccluder] : undefined
      )}
    >
      <svg
        className="halloween-bats"
        width="220"
        height="110"
        viewBox="0 0 220 110"
        style={{ display: 'block' }}
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
    </div>
  );
}

/** The spider (Main board, QF1 board), hanging from the top of the
 *  stage on its thread, bobbing. Each board places it and times it its own
 *  way: the Scene passes where the board hangs it. Where the board draws it
 *  behind page content (the SSM2 board hangs it behind the speech bubble's
 *  right edge), that content's boxes are cut out of it here, so it shows
 *  only where the board shows it. */
export function Spider({
  left,
  top,
  threadHeight,
  bobDuration,
  occluders,
}: {
  left: number;
  top: number;
  /** How far down the stage the spider hangs on its thread. */
  threadHeight: number;
  /** The board's own bobbing duration (Main's 3.2s, QF1's 3.6s). */
  bobDuration: string;
  occluders?: ElementBox[];
}) {
  return (
    <div
      className="halloween-spider"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        animationDuration: bobDuration,
        ...(occluders && occluders.length > 0
          ? {
              clipPath: clipPathValue(
                { left, top, width: 40, height: threadHeight + 34 },
                occluders
              ),
            }
          : {}),
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

/** The SSM boards' spider's left: each board hangs it
 *  at a share of the stage beside the speech bubble (whose right edge the
 *  boards lay at 564px of their 1440px stage; the GUI lays it ~80px right
 *  of that), so it keeps the board's own gap from the bubble's right edge,
 *  clamped past it where the GUI's bubble crosses the board's spot (as the
 *  CHSH boards' pieces keep their gaps). `at` is the board's share (SSM1's
 *  0.44, SSM2's 0.38-0.47, SSM4's 0.40; SSM3's 0.03 hangs it left of the
 *  bubble, where no clamp is needed). */
export function spiderLeft(
  stage: ElementBox,
  bubble: ElementBox,
  at: number
): number {
  const spot = stage.left + stage.width * at;
  return Math.max(spot, bubble.right + spot - 564);
}

/** The ghost's mouth, each board its own: Main's and QF2's open mouth, and
 *  the CHSH boards' smile (CHSH1 board, CHSH3-error board), little o
 *  (CHSH2 board), grin (CHSH3 board) and frown (CHSH3-weak board),
 *  each ported as its board draws it. */
export type GhostMouth = 'open' | 'smile' | 'o' | 'grin' | 'frown';

function ghostMouth(mouth: GhostMouth) {
  switch (mouth) {
    case 'smile':
      return (
        <path
          d="M44 64 Q52 72 60 64"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case 'o':
      return <ellipse cx="52" cy="66" rx="5" ry="6" fill="#000000" />;
    case 'grin':
      return (
        <path
          d="M42 62 Q52 74 62 62 Z"
          fill="#000000"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      );
    case 'frown':
      return (
        <path
          d="M46 66 Q52 62 58 66"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
      );
    case 'open':
    default:
      return (
        <>
          <ellipse cx="52" cy="64" rx="6" ry="8" fill="#000000" />
          <ellipse cx="52" cy="68" rx="3.5" ry="3" fill="#f48fb1" />
        </>
      );
  }
}

/** The ghost (every board), floating. The boards draw it the same but for
 *  the mouth, so each board's Scene wears its own mouth (see `GhostMouth`)
 *  at its own size and place; this is Main's drawing otherwise. */
export function Ghost({
  left,
  top,
  width,
  height,
  mouth = 'open',
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  mouth?: GhostMouth;
}) {
  return (
    <svg
      className="halloween-ghost"
      width={width}
      height={height}
      viewBox="0 0 100 120"
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
      {ghostMouth(mouth)}
    </svg>
  );
}

/** The sad ghost (SSM2-declined board): the ghost drawn with its arms
 *  drooping at its sides, its brows down and its mouth a frown, floating
 *  the board's own slower 4.4s bob. The Scene passes its place in the
 *  board's communication box; ported as the board draws it. */
export function GhostSad({
  left,
  top,
  width,
  height,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    <svg
      className="halloween-ghost"
      width={width}
      height={height}
      viewBox="0 0 100 120"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        animationDuration: '4.4s',
      }}
    >
      <path
        d="M20 64 Q8 72 10 84 Q18 82 22 74"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M84 64 Q96 72 94 84 Q86 82 82 74"
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
      <path
        d="M32 38 L46 42 M72 38 L58 42"
        fill="none"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <ellipse cx="40" cy="50" rx="5" ry="6" fill="#000000" />
      <ellipse cx="64" cy="50" rx="5" ry="6" fill="#000000" />
      <path
        d="M44 70 Q52 62 60 70"
        fill="none"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** The happy ghost (SSM4 board): the ghost drawn cheering, its arms up
 *  and its eyes closed happy, its mouth an open grin. The Scene passes its
 *  place by the results circle; ported as the board draws it. */
export function GhostHappy({
  left,
  top,
  width,
  height,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
}) {
  return (
    <svg
      className="halloween-ghost"
      width={width}
      height={height}
      viewBox="0 0 100 120"
      style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
    >
      <path
        d="M20 54 Q6 40 8 26 Q16 30 22 42"
        fill="#ffffff"
        stroke="#000000"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M84 54 Q98 40 96 26 Q88 30 82 42"
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
      <path
        d="M34 48 Q40 40 46 48 M58 48 Q64 40 70 48"
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <ellipse cx="31" cy="58" rx="6" ry="3.5" fill="rgba(240,128,170,0.55)" />
      <ellipse cx="73" cy="58" rx="6" ry="3.5" fill="rgba(240,128,170,0.55)" />
      <path
        d="M42 62 Q52 76 62 62 Z"
        fill="#000000"
        stroke="#000000"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** The pumpkin leaning out from under Whobit's pose (Main board,
 *  QF2 board), 120x104, at the board's own place beside the pose box
 *  (258px from its left, 340px down); QF2's face flickers. Pumpkins are
 *  always #ff5f05. `clipBottom` is the stage's bottom edge: the
 *  board's stage ends at the content box's bottom, below which the pose's
 *  feet are already cut off, so when the board's spot
 *  falls below that edge the pumpkin is clamped to rest its base on the
 *  edge, beside the visible owl, and never shows below it. */
export function Pumpkin({
  left,
  top,
  flicker,
  clipBottom,
}: {
  left: number;
  top: number;
  flicker?: boolean;
  clipBottom?: number;
}) {
  const height = 104;
  const placedTop =
    clipBottom === undefined ? top : Math.min(top, clipBottom - height);
  const windowHeight =
    clipBottom === undefined
      ? undefined
      : Math.max(height, clipBottom - placedTop);
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${placedTop}px`,
        width: '120px',
        ...(windowHeight !== undefined ? { height: `${windowHeight}px` } : {}),
        overflow: 'hidden',
      }}
    >
      <svg
        width="120"
        height="104"
        viewBox="0 0 120 104"
        style={{ display: 'block' }}
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
        <path
          d="M41 52 L47 52 L44 46 Z M73 52 L79 52 L76 46 Z"
          fill="#fdca5c"
        />
      </svg>
    </div>
  );
}

/** The small pumpkin beside the ghost under the game buttons
 *  (Main board), the board's own smaller drawing with its smooth face,
 *  at the place the Scene measures for the ghost's row. CHSH3 board (and
 *  its weak and error boards) wears the same drawing beside the results
 *  circle at its own bigger size, its face flickering as that board draws
 *  it (Main's is lit steady). */
export function PumpkinSmall({
  left,
  top,
  width = 84,
  height = 73,
  flicker = false,
}: {
  left: number;
  top: number;
  width?: number;
  height?: number;
  flicker?: boolean;
}) {
  return (
    <svg
      width={width}
      height={height}
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
        className={flicker ? 'halloween-flicker' : undefined}
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

/** The pumpkin pair under the buttons column (CHSH1 board): a 132x114
 *  pumpkin with droopy eyes and a jagged grin and, 12px right of it with
 *  their bottoms level, an 84x73 round-eyed one, both faces flickering.
 *  The board floats the pair at the bottom of the Next button's column,
 *  180px left of its right edge and 32px above the button, so the Scene
 *  passes that spot as the GUI lays the button out. */
export function PumpkinPair({
  right,
  bottom,
}: {
  /** The pair row's right edge (the button's right, 180px left). */
  right: number;
  /** The pair row's bottom edge (32px above the button's top). */
  bottom: number;
}) {
  return (
    <>
      <svg
        width="132"
        height="114"
        viewBox="0 0 120 104"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${right - 84 - 12 - 132}px`,
          top: `${bottom - 114}px`,
        }}
      >
        <ellipse cx="60" cy="100" rx="46" ry="4" fill="rgba(0,0,0,0.15)" />
        <path
          d="M54 26 Q52 10 62 2 Q69 1 70 6 Q62 11 65 27 Z"
          fill="#006230"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M66 20 Q78 14 90 24 Q78 32 66 20 Z"
          fill="#338659"
          stroke="#000000"
          strokeWidth="2"
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
          d="M16 48 Q12 60 16 76"
          fill="none"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g
          className="halloween-flicker"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2"
          strokeLinejoin="round"
        >
          <path d="M34 50 Q44 36 54 50 Q44 46 34 50 Z" />
          <path d="M66 50 Q76 36 86 50 Q76 46 66 50 Z" />
          <path d="M36 70 Q60 92 84 70 L78 72 L74 64 L68 74 L60 66 L52 74 L46 64 L42 72 Z" />
        </g>
        <path d="M40 48 Q44 42 48 48 Z M72 48 Q76 42 80 48 Z" fill="#fdca5c" />
      </svg>
      <svg
        width="84"
        height="73"
        viewBox="0 0 120 104"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: `${right - 84}px`,
          top: `${bottom - 73}px`,
        }}
      >
        <ellipse cx="60" cy="100" rx="46" ry="4" fill="rgba(0,0,0,0.15)" />
        <path
          d="M54 26 Q52 10 62 2 Q69 1 70 6 Q62 11 65 27 Z"
          fill="#006230"
          stroke="#000000"
          strokeWidth="3"
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
        <g
          className="halloween-flicker"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
        >
          <circle cx="44" cy="50" r="7" />
          <circle cx="76" cy="50" r="7" />
          <path d="M46 72 Q60 84 74 72 Q60 76 46 72 Z" />
        </g>
      </svg>
    </>
  );
}

/**
 * The GUI's own ball (the Quantum Fortune pages' circle.png box): the image
 * is 550px, centred in the 560px box, and draws its circle 57px inside
 * itself, so the ball the boards' ball pieces dress is the box's centred
 * circle, 62px in (measured from the drawing).
 */
export interface BallCircle {
  /** The visible ball circle's centre and radius. */
  cx: number;
  cy: number;
  r: number;
  /** The visible ball circle's top-left corner. */
  left: number;
  top: number;
}

export function ballCircle(box: ElementBox): BallCircle {
  const inset = 62;
  return {
    cx: box.left + box.width / 2,
    cy: box.top + box.height / 2,
    r: (box.width - 2 * inset) / 2,
    left: box.left + inset,
    top: box.top + inset,
  };
}

/** The mist strokes of the QF1 and QF2 boards' ball, ported as they are. */
const mistStrokes = [
  {
    d: 'M100 300 Q170 250 250 290 Q330 330 410 280 Q450 255 480 270',
    stroke: '#ffffff',
    width: 16,
  },
  {
    d: 'M100 196 Q170 156 232 188 Q292 220 360 176 Q400 152 440 170',
    stroke: '#d0f9ff',
    width: 14,
  },
  {
    d: 'M170 372 Q240 340 310 372 Q380 402 450 360',
    stroke: '#ffffff',
    width: 12,
  },
  { d: 'M290 110 Q340 88 396 120', stroke: '#d0f9ff', width: 10 },
  { d: 'M130 250 Q160 236 190 248', stroke: '#ffffff', width: 8 },
];

/** The twinkles on the QF1 and QF2 boards' ball, ported as they are: each
 *  board's own stars, at its own places. */
const twinkles = {
  qf1: [
    {
      d: 'M0 -12 L3.5 -3.5 L12 0 L3.5 3.5 L0 12 L-3.5 3.5 L-12 0 L-3.5 -3.5 Z',
      x: 404,
      y: 136,
      late: false,
    },
    {
      d: 'M0 -8 L2.5 -2.5 L8 0 L2.5 2.5 L0 8 L-2.5 2.5 L-8 0 L-2.5 -2.5 Z',
      x: 170,
      y: 320,
      late: true,
    },
    {
      d: 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z',
      x: 392,
      y: 340,
      late: false,
    },
  ],
  qf2: [
    {
      d: 'M0 -12 L3.5 -3.5 L12 0 L3.5 3.5 L0 12 L-3.5 3.5 L-12 0 L-3.5 -3.5 Z',
      x: 420,
      y: 120,
      late: false,
    },
    {
      d: 'M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5 Z',
      x: 132,
      y: 316,
      late: true,
    },
    {
      d: 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z',
      x: 468,
      y: 300,
      late: true,
    },
    {
      d: 'M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z',
      x: 110,
      y: 150,
      late: false,
    },
  ],
} as const;

/**
 * The mist, the twinkles and QF2's glow halo over the GUI's own ball
 * (QF1 board, QF2 board), ported in the boards' own ball coordinates
 * (their 560x500 ball svg) and scaled so the boards' ball circle lands on
 * the GUI's: the mist swirls clipped inside the ball as on the boards, the
 * twinkles sparkle on it, and QF2's gold halo pulses around it (the ring the
 * boards show, the ball itself covering the disc's middle) and its white
 * veil softens the mist over the ball's middle. The ball, the counter and
 * the fortune text stay the page's own content, drawn above the Decorations
 * layer, so the mist passes behind them as on the boards.
 */
export function BallMist({
  ball,
  board,
}: {
  ball: BallCircle;
  board: keyof typeof twinkles;
}) {
  const clipId = `halloween-ball-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  // The boards' ball circle: centre (280, 230), radius 190, in a 560x500 svg.
  const scale = ball.r / 190;
  const box = {
    left: ball.cx - 280 * scale,
    top: ball.cy - 230 * scale,
    width: 560 * scale,
    height: 500 * scale,
  };
  return (
    <svg
      width={box.width}
      height={box.height}
      viewBox="0 0 560 500"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${box.left}px`,
        top: `${box.top}px`,
      }}
    >
      <defs>
        <clipPath id={`${clipId}-ball`}>
          <circle cx="280" cy="230" r="188" />
        </clipPath>
      </defs>
      {board === 'qf2' && (
        <path
          className="halloween-glow-pulse"
          fillRule="evenodd"
          d="M280 230 m-218 0 a218 218 0 1 0 436 0 a218 218 0 1 0 -436 0 M280 230 m-190 0 a190 190 0 1 0 380 0 a190 190 0 1 0 -380 0"
          fill="#fdca5c"
        />
      )}
      <g
        className="halloween-mist"
        fill="none"
        strokeLinecap="round"
        clipPath={`url(#${clipId}-ball)`}
      >
        {mistStrokes.map((stroke) => (
          <path
            key={stroke.d}
            d={stroke.d}
            stroke={stroke.stroke}
            strokeWidth={stroke.width}
          />
        ))}
        {board === 'qf2' && (
          <circle cx="280" cy="230" r="150" fill="#ffffff" opacity="0.55" />
        )}
      </g>
      {twinkles[board].map((twinkle) => (
        <path
          key={`${twinkle.x}-${twinkle.y}`}
          className={
            twinkle.late ? 'halloween-twinkle-late' : 'halloween-twinkle'
          }
          d={twinkle.d}
          transform={`translate(${twinkle.x} ${twinkle.y})`}
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

/** The SSM boards' 560px communication box: where each board draws its
 *  waiting content (the dashed flight path, the courier, the friend's
 *  computer) around the status. Each SSM2 Scene derives it from the status
 *  as its own board lays that out, keeping the board's own offsets. */
export interface CommunicationBox {
  left: number;
  top: number;
}

/** The dashed flight path with its two stars (SSM2 board), ported as the
 *  board draws it in its communication box. The asking board draws the
 *  waiting status over the path's lower corner, so the status's box is cut
 *  out of it here. */
export function MessagePath({
  box,
  occluders,
}: {
  box: CommunicationBox;
  occluders?: ElementBox[];
}) {
  return (
    <div
      aria-hidden="true"
      style={pieceStyle(
        { left: box.left, top: box.top, width: 560, height: 300 },
        occluders
      )}
    >
      <svg
        width="560"
        height="300"
        viewBox="0 0 560 300"
        style={{ display: 'block' }}
      >
        <path
          d="M-40 250 Q120 60 300 120 Q420 160 520 70"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
        <g
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <path
            d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3 Z"
            transform="translate(470 60)"
          />
          <path
            d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"
            transform="translate(526 112)"
          />
        </g>
      </svg>
    </div>
  );
}

/** The bat courier carrying the envelope (SSM2 board), flying the board's
 *  own course across the communication box, its wings flapping. */
export function CourierBat({ left, top }: { left: number; top: number }) {
  return (
    <div
      aria-hidden="true"
      className="halloween-courier-fly"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '180px',
        height: '150px',
      }}
    >
      <svg
        width="180"
        height="150"
        viewBox="0 0 180 150"
        style={{ display: 'block' }}
      >
        <g className="halloween-courier-wing">
          <path
            d="M84 46 Q60 6 18 18 Q30 26 26 38 Q38 34 44 44 Q54 38 60 50 Q70 44 84 52 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <g className="halloween-courier-wing">
          <path
            d="M96 46 Q120 6 162 18 Q150 26 154 38 Q142 34 136 44 Q126 38 120 50 Q110 44 96 52 Z"
            fill="#000000"
            stroke="#000000"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
        <path
          d="M78 34 L80 20 L88 30 Z M102 34 L100 20 L92 30 Z"
          fill="#000000"
        />
        <ellipse cx="90" cy="50" rx="16" ry="18" fill="#000000" />
        <circle cx="84" cy="46" r="4.5" fill="#ffffff" />
        <circle cx="96" cy="46" r="4.5" fill="#ffffff" />
        <circle cx="85" cy="47" r="2" fill="#000000" />
        <circle cx="97" cy="47" r="2" fill="#000000" />
        <path
          d="M86 58 L88 62 L90 58 L92 62 L94 58"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        <path
          d="M84 66 L80 82 M96 66 L100 82"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <g transform="rotate(-6 90 108)">
          <rect
            x="52"
            y="80"
            width="76"
            height="52"
            rx="4"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="3"
          />
          <path
            d="M52 82 L90 112 L128 82"
            fill="none"
            stroke="#000000"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M52 130 L80 106 M128 130 L100 106"
            fill="none"
            stroke="#000000"
            strokeWidth="1.5"
          />
          <circle
            cx="90"
            cy="112"
            r="8"
            fill="#ff5f05"
            stroke="#000000"
            strokeWidth="2.5"
          />
        </g>
      </svg>
    </div>
  );
}

/** The friend's computer with its invite popup (SSM2-waiting board),
 *  ported as the board draws it in its communication box, its popup light
 *  blinking. The waiting status is drawn below the computer on the board;
 *  where the GUI's box reaches over the status the page shows, the
 *  status's box is cut out of it. */
export function FriendComputer({
  box,
  occluders,
}: {
  box: CommunicationBox;
  occluders?: ElementBox[];
}) {
  return (
    <div
      aria-hidden="true"
      style={pieceStyle(
        { left: box.left, top: box.top, width: 560, height: 330 },
        occluders
      )}
    >
      <svg
        width="560"
        height="330"
        viewBox="0 0 560 330"
        style={{ display: 'block' }}
      >
        <path
          d="M-30 230 Q100 90 230 150 Q300 180 330 160"
          fill="none"
          stroke="#000000"
          strokeWidth="2"
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
        <rect
          x="336"
          y="96"
          width="200"
          height="140"
          rx="10"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="4"
        />
        <rect
          x="350"
          y="110"
          width="172"
          height="112"
          rx="4"
          fill="#13294b"
          stroke="#000000"
          strokeWidth="2"
        />
        <rect
          x="370"
          y="128"
          width="132"
          height="76"
          rx="6"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <path
          d="M384 146 L470 146 M384 160 L446 160"
          fill="none"
          stroke="#707372"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <rect
          x="384"
          y="176"
          width="44"
          height="18"
          rx="4"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2"
        />
        <rect
          x="440"
          y="176"
          width="48"
          height="18"
          rx="4"
          fill="#ff5f05"
          stroke="#000000"
          strokeWidth="2"
        />
        <circle
          className="halloween-popup-dot"
          cx="492"
          cy="134"
          r="5"
          fill="#fcb316"
          stroke="#000000"
          strokeWidth="1.5"
        />
        <path
          d="M418 236 L410 268 L462 268 L454 236 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect
          x="384"
          y="268"
          width="104"
          height="14"
          rx="4"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="4"
        />
      </svg>
    </div>
  );
}

/** The ghost courier delivering the envelope (SSM2-waiting board),
 *  flying the board's own course across the communication box. */
export function CourierGhost({ left, top }: { left: number; top: number }) {
  return (
    <div
      aria-hidden="true"
      className="halloween-courier-deliver"
      style={{
        position: 'absolute',
        left: `${left}px`,
        top: `${top}px`,
        width: '130px',
        height: '140px',
      }}
    >
      <svg
        width="130"
        height="140"
        viewBox="0 0 130 140"
        overflow="visible"
        style={{ display: 'block' }}
      >
        <path
          d="M18 112 L18 54 Q18 10 54 10 Q90 10 90 54 L90 112 Q83 124 76 112 Q69 100 62 112 Q55 124 48 112 Q41 100 34 112 Q27 124 18 112 Z"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path
          d="M28 34 Q34 20 46 18"
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <ellipse cx="44" cy="48" rx="6" ry="8" fill="#000000" />
        <ellipse cx="68" cy="48" rx="6" ry="8" fill="#000000" />
        <circle cx="46" cy="45" r="2.2" fill="#ffffff" />
        <circle cx="70" cy="45" r="2.2" fill="#ffffff" />
        <ellipse
          cx="35"
          cy="60"
          rx="6"
          ry="3.5"
          fill="rgba(240,128,170,0.55)"
        />
        <ellipse
          cx="77"
          cy="60"
          rx="6"
          ry="3.5"
          fill="rgba(240,128,170,0.55)"
        />
        <path
          d="M50 64 Q56 70 62 64"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g transform="rotate(8 104 74)">
          <rect
            x="78"
            y="56"
            width="52"
            height="36"
            rx="3"
            fill="#ffffff"
            stroke="#000000"
            strokeWidth="2.5"
          />
          <path
            d="M78 58 L104 78 L130 58"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle
            cx="104"
            cy="78"
            r="6"
            fill="#ff5f05"
            stroke="#000000"
            strokeWidth="2"
          />
        </g>
        <path
          d="M84 66 Q96 62 98 72 Q92 80 84 76"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** The declined envelope with its seal crossed out
 *  (SSM2-declined board), ported as the board draws it in its
 *  communication box. */
export function DeclinedEnvelope({ left, top }: { left: number; top: number }) {
  return (
    <svg
      width="120"
      height="84"
      viewBox="0 0 120 84"
      aria-hidden="true"
      style={{ position: 'absolute', left: `${left}px`, top: `${top}px` }}
    >
      <g transform="rotate(10 60 50)">
        <rect
          x="14"
          y="22"
          width="92"
          height="56"
          rx="4"
          fill="#ffffff"
          stroke="#000000"
          strokeWidth="3"
        />
        <path
          d="M14 24 L60 56 L106 24"
          fill="none"
          stroke="#000000"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle
          cx="60"
          cy="56"
          r="9"
          fill="#ff5f05"
          stroke="#000000"
          strokeWidth="2.5"
        />
        <path
          d="M55 51 L65 61 M65 51 L55 61"
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** The gold sparks of a perfect match (SSM4 board, its perfect-match
 *  variant): the board's four sparks on the results circle, twinkling —
 *  the ssm4-perfect Scene's own Decorations, separate from
 *  the Celebration and from EmojiConfetti. Placed on the page's own
 *  results circle, in the board's own circle coordinates. */
export function Sparks({ circle }: { circle: ElementBox }) {
  return (
    <svg
      width="560"
      height="560"
      viewBox="0 0 560 560"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: `${circle.left}px`,
        top: `${circle.top}px`,
      }}
    >
      <g
        fill="#fcb316"
        stroke="#000000"
        strokeWidth="1.5"
        strokeLinejoin="round"
      >
        <path
          className="halloween-spark"
          d="M70 70 L74 82 L86 86 L74 90 L70 102 L66 90 L54 86 L66 82 Z"
        />
        <path
          className="halloween-spark-late"
          d="M492 96 L495 105 L504 108 L495 111 L492 120 L489 111 L480 108 L489 105 Z"
        />
        <path
          className="halloween-spark"
          d="M510 470 L513 479 L522 482 L513 485 L510 494 L507 485 L498 482 L507 479 Z"
        />
        <path
          className="halloween-spark-late"
          d="M40 480 L44 492 L56 496 L44 500 L40 512 L36 500 L24 496 L36 492 Z"
        />
      </g>
    </svg>
  );
}
