'use client';

import {
  Bats,
  Ghost,
  Moon,
  Pumpkin,
  PumpkinSmall,
  Spider,
  Web,
  type GhostMouth,
} from './ambient';
import { MonsterDangle, MonsterTiptoe, MonsterVamp } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the chsh3 Scenes' Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the ghost hangs on the
 *  results circle's bottom-left, clamped to the bubble's right edge, which
 *  the GUI lays right of the board's stage), Whobit's pose (the board leans
 *  its pumpkin out from under it) and the page's own results circle (the
 *  board hangs its ghost and its small pumpkin on it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const circleAnchor = () =>
  document.querySelector('[data-decoration-anchor="chsh3-circle"]');

/** What the three CHSH3 boards each draw their own: the monster, the spider
 *  and the ghost's mouth (CHSH3.dc.html, CHSH3-weak.dc.html and
 *  CHSH3-error.dc.html). */
type Chsh3Board = 'entangled' | 'weak' | 'error';

const boards: Record<
  Chsh3Board,
  { mouth: GhostMouth; spider: 'right' | 'centre' }
> = {
  entangled: { mouth: 'grin', spider: 'right' },
  weak: { mouth: 'frown', spider: 'right' },
  error: { mouth: 'smile', spider: 'centre' },
};

/**
 * The chsh3 Scenes' Decorations (docs/design/halloween/CHSH3.dc.html and its
 * weak and error boards): the stage's ambient set — web, moon, bats, the
 * spider, the ghost on the results circle's bottom-left, the flickering
 * pumpkin under Whobit's pose and the small pumpkin on the circle's
 * bottom-right — plus the board's own monster. Each state wears its own
 * monster, its own spider and its own ghost mouth; the ghost keeps the
 * board's offsets from the circle (124px left of it, 470px down), clamped
 * to rest its base on the stage's bottom edge where the circle hangs below
 * it, as the GUI lays the circle out.
 */
function Chsh3Decorations({ board }: { board: Chsh3Board }) {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const circle = useElementBox(circleAnchor);
  if (!stage || !bubble || !pose || !circle) {
    return null;
  }
  const { mouth, spider } = boards[board];
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Bats stage={stage} />
      {spider === 'right' ? (
        <Spider
          left={stage.right - stage.width * 0.03 - 40}
          top={stage.top}
          threadHeight={210}
          bobDuration="3.2s"
        />
      ) : (
        <Spider
          left={stage.left + stage.width / 2 - 60}
          top={stage.top}
          threadHeight={120}
          bobDuration="3.2s"
        />
      )}
      {board === 'entangled' && <MonsterVamp stage={stage} />}
      {board === 'weak' && (
        <MonsterDangle
          left={Math.max(stage.left + stage.width / 2 - 82, bubble.right)}
          top={stage.top}
        />
      )}
      {board === 'error' && <MonsterTiptoe stage={stage} />}
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      <Ghost
        left={Math.max(circle.left - 124, bubble.right)}
        top={Math.min(circle.top + 470, stage.bottom - 100)}
        width={84}
        height={100}
        mouth={mouth}
      />
      <PumpkinSmall
        width={96}
        height={83}
        left={circle.right - 52 - 96}
        top={circle.bottom - 30 - 83}
      />
    </>
  );
}

/** The chsh3-entangled Scene: the vampire rising from the stage's bottom
 *  right. */
export function Chsh3EntangledDecorations() {
  return <Chsh3Decorations board="entangled" />;
}

/** The chsh3-weak Scene: the sock monster dangling from the stage's top. */
export function Chsh3WeakDecorations() {
  return <Chsh3Decorations board="weak" />;
}

/** The chsh3-error Scene: the monster tiptoeing in from the stage's right. */
export function Chsh3ErrorDecorations() {
  return <Chsh3Decorations board="error" />;
}
