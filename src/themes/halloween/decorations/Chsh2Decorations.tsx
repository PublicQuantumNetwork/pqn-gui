'use client';

import { Ghost, Moon, Pumpkin, Spider, Web } from './ambient';
import { MonsterOoze } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the chsh2 Scene's Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the ghost floats in the
 *  gap between the bubble and the wheel, clamped to the bubble's right edge,
 *  which the GUI lays right of the board's stage), Whobit's pose (the board
 *  leans its pumpkin out from under it, and the brew pot is clamped past
 *  that pumpkin's clamped spot) and the page's own wheel (the board hangs
 *  its ghost beside it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const wheelAnchor = () =>
  document.querySelector('[data-decoration-anchor="chsh2-wheel"]');

/**
 * The chsh2 Scene's Decorations (docs/design/halloween/CHSH2.dc.html): the
 * stage's ambient set — web, moon, the spider on the stage's right, the
 * ghost beside the wheel and the flickering pumpkin under Whobit's pose —
 * plus the blob oozing out of the witch's brew pot on the stage's bottom
 * edge. The board carries no bats here. The ghost keeps the board's offsets
 * from the wheel (128px left of it, 8px down); the pot keeps the board's
 * stage placement, clamped past the pose pumpkin beside it; the pumpkin
 * keeps its place beside the pose box, clamped to rest its base on the
 * stage's bottom edge.
 */
export default function Chsh2Decorations() {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const wheel = useElementBox(wheelAnchor);
  if (!stage || !bubble || !pose || !wheel) {
    return null;
  }
  // The pose pumpkin's clamped spot (beside the pose box, its base on the
  // stage's bottom edge); the pot rests on the same edge and is clamped
  // past the pumpkin, as the board lays them side by side.
  const pumpkinRight = pose.left + 258 + 120;
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Spider
        left={stage.right - stage.width * 0.03 - 40}
        top={stage.top}
        threadHeight={210}
        bobDuration="3.2s"
      />
      <Ghost
        left={Math.max(wheel.left - 128, bubble.right)}
        top={wheel.top + 8}
        width={84}
        height={100}
        mouth="o"
      />
      <MonsterOoze
        left={Math.max(stage.left + stage.width / 2 - 250, pumpkinRight)}
        bottom={stage.bottom}
      />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
    </>
  );
}
