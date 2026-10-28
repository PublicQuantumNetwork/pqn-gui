'use client';

import {
  Bats,
  GhostHappy,
  Moon,
  Pumpkin,
  Spider,
  Sparks,
  Web,
  spiderLeft,
} from './ambient';
import { MonsterWolf } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the ssm4 Scenes' Decorations are placed against: the stage,
 *  Whobit's speech bubble (the spider keeps its board's own gap from its right
 *  edge) and pose (the board leans its pumpkin out from under it), and the
 *  page's own results circle (the board floats its cheering ghost beside it
 *  and, on a perfect match, twinkles its gold sparks on it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const circleAnchor = () =>
  document.querySelector('[data-decoration-anchor="ssm4-circle"]');

/**
 * The ssm4 Scenes' Decorations (the SSM4 design board): the
 * stage's ambient set — web, moon, bats, the spider on its 70px thread and
 * the flickering pumpkin under Whobit's pose — plus the werewolf rising
 * from the stage's bottom right and the cheering ghost by the results
 * circle. On a perfect match the board adds its gold sparks on the circle
 * — the ssm4-perfect Scene's own Decorations, separate from the
 * Celebration and from EmojiConfetti. The board draws the
 * results circle over the moon and the bats, so both are cut around the
 * circle the page itself draws.
 */
function Ssm4Board({ perfect }: { perfect: boolean }) {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const circle = useElementBox(circleAnchor);
  if (!stage || !bubble || !pose || !circle) {
    return null;
  }
  // The results circle's own disc, as the CHSH3 results circle's: the page
  // draws circle.png contained in its 560px box.
  const disc = {
    cx: circle.left + circle.width / 2,
    cy: circle.top + circle.height / 2,
    r: (circle.width - 2 * 58) / 2,
  };
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} circleOccluder={disc} />
      <Bats stage={stage} circleOccluder={disc} />
      <Spider
        left={spiderLeft(stage, bubble, 0.4)}
        top={stage.top}
        threadHeight={70}
        bobDuration="3.4s"
      />
      <MonsterWolf stage={stage} />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      {perfect && <Sparks circle={circle} />}
      <GhostHappy
        left={circle.left - 96}
        top={circle.top + 300}
        width={84}
        height={100}
      />
    </>
  );
}

/** The ssm4 Scene: the werewolf and the cheering ghost on a partial match
 *  or an error — no sparks. */
export default function Ssm4Decorations() {
  return <Ssm4Board perfect={false} />;
}

/** The ssm4-perfect Scene: the same board with the gold sparks twinkling
 *  on the results circle. */
export function Ssm4PerfectDecorations() {
  return <Ssm4Board perfect />;
}
