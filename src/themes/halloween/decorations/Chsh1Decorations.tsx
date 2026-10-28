'use client';

import {
  Bats,
  Ghost,
  Moon,
  Pumpkin,
  PumpkinPair,
  Spider,
  Web,
} from './ambient';
import { MonsterLean } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the chsh1 Scene's Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the board floats its
 *  spider and its ghost beside the bubble, 32px and 8px right of its right
 *  edge, which the GUI lays right of the board's stage, so both are clamped
 *  to keep their board gap from it), Whobit's pose (the board leans its
 *  pumpkin out from under it) and the Next button (the board floats its
 *  pumpkin pair above it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const nextAnchor = () =>
  document.querySelector('[data-decoration-anchor="chsh1-next"]');

/**
 * The chsh1 Scene's Decorations (docs/design/halloween/CHSH1.dc.html): the
 * stage's ambient set — web, moon, bats, the spider and the ghost beside the
 * speech bubble, the flickering pumpkin under Whobit's pose and the pumpkin
 * pair above the Next button — plus the mummy leaning in from the right. The
 * stage-anchored pieces keep the board's stage placements; the spider and
 * the ghost hang where the board hangs them, keeping the board's own gaps
 * from the bubble's right edge; the pumpkin pair keeps the board's offsets
 * from the button (180px left of its right edge, 32px above its top).
 */
export default function Chsh1Decorations() {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const next = useElementBox(nextAnchor);
  if (!stage || !bubble || !pose || !next) {
    return null;
  }
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Bats stage={stage} />
      <Spider
        left={Math.max(stage.left + stage.width / 2 - 100, bubble.right + 32)}
        top={stage.top}
        threadHeight={70}
        bobDuration="3.4s"
      />
      <Ghost
        left={Math.max(stage.left + stage.width / 2 - 124, bubble.right + 8)}
        top={stage.top + 250}
        width={84}
        height={100}
        mouth="smile"
      />
      <MonsterLean stage={stage} />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      <PumpkinPair right={next.right - 180} bottom={next.top - 32} />
    </>
  );
}
