'use client';

import { Bats, Ghost, Moon, Pumpkin, Spider, Web, spiderLeft } from './ambient';
import { MonsterSkel } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the ssm1 Scene's Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the spider keeps its
 *  board's own gap from its right edge) and pose (the board leans its
 *  pumpkin out from under it), and the page's own emoji circle (the board
 *  floats its ghost beside it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const circleAnchor = () =>
  document.querySelector('[data-decoration-anchor="ssm1-circle"]');

/**
 * The ssm1 Scene's Decorations (docs/design/halloween/SSM1.dc.html): the
 * stage's ambient set — web, moon, bats, the spider on its 120px thread and
 * the flickering pumpkin under Whobit's pose — plus the board's ghost by
 * the emoji circle and the skeleton sliding in from the stage's left edge.
 * The board draws the emoji circle over the moon and the bats, so both are
 * cut around the circle the page itself draws (agent decision A8). While
 * the page shows its send-error image instead of the circle, the ghost and
 * the cuts are omitted — as on the board's error variant, which draws no
 * circle and no ghost — and never the rest of the set.
 */
export default function Ssm1Decorations() {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const circle = useElementBox(circleAnchor);
  if (!stage || !bubble || !pose) {
    return null;
  }
  // The emoji circle's own disc: the page draws circle.png contained in its
  // 560px box, so the image's own circle (57px inside the 550px image)
  // scales to ~58px inside the box, as the CHSH3 results circle's does —
  // or none, while the page shows its send-error image instead.
  const disc = circle
    ? {
        cx: circle.left + circle.width / 2,
        cy: circle.top + circle.height / 2,
        r: (circle.width - 2 * 58) / 2,
      }
    : undefined;
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} circleOccluder={disc} />
      <Bats stage={stage} circleOccluder={disc} />
      <Spider
        left={spiderLeft(stage, bubble, 0.44)}
        top={stage.top}
        threadHeight={120}
        bobDuration="3.4s"
      />
      <MonsterSkel stage={stage} />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      {circle && (
        <Ghost
          left={circle.left + 540}
          top={circle.top + 8}
          width={84}
          height={100}
        />
      )}
    </>
  );
}
