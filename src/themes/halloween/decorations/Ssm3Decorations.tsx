'use client';

import { Pumpkin, Spider, Web } from './ambient';
import { MonsterTentacle } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the ssm3 Scene's Decorations are placed against: the stage and
 *  Whobit's pose (the board leans its pumpkin out from under it). The board
 *  carries no moon, no bats and no speech bubble piece: its spider hangs from
 *  the stage's top left of the bubble, where no clamp is needed. */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');

/**
 * The ssm3 Scene's Decorations (the SSM3 design board): the
 * board's own ambient set — the web, the spider on its 230px thread — plus
 * the flickering pumpkin under Whobit's pose and the tentacle monster
 * rising from the stage's bottom right. The board's broom is the wheel's
 * own pointer, which the page draws, so it is not a
 * Decoration.
 */
export default function Ssm3Decorations() {
  const stage = useElementBox(stageAnchor);
  const pose = useElementBox(poseAnchor);
  if (!stage || !pose) {
    return null;
  }
  return (
    <>
      <Web stage={stage} />
      <Spider
        left={stage.left + stage.width * 0.03}
        top={stage.top}
        threadHeight={230}
        bobDuration="3.6s"
      />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      <MonsterTentacle stage={stage} />
    </>
  );
}
