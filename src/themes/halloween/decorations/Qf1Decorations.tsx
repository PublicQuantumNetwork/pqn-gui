'use client';

import { Bats, BallMist, Moon, Spider, Web, ballCircle } from './ambient';
import { MonsterRise } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the qf1 Scene's Decorations are placed against (agent
 *  decision A8): the stage, Whobit's speech bubble (the board hangs its
 *  spider just right of it), the page's own ball and its counter (drawn
 *  over the ball's mist on the board, so cut out of it here). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const ballAnchor = () =>
  document.querySelector('[data-decoration-anchor="qf-ball"]');
const counterAnchor = () =>
  document.querySelector('[data-decoration-anchor="qf-counter"]');

/**
 * The qf1 Scene's Decorations (docs/design/halloween/QF1.dc.html): the
 * stage's ambient set — web, moon, bats, the spider by the speech bubble and
 * the mist with the twinkles over the ball — plus the rising monster behind
 * the ball. The stage-anchored pieces keep the board's stage placements; the
 * board hangs its spider ~26px right of the bubble's right edge, and its
 * ball pieces (mist, twinkles, monster) are placed against the GUI's own
 * ball as the board places them against its.
 */
export default function Qf1Decorations() {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const ballBox = useElementBox(ballAnchor);
  const counter = useElementBox(counterAnchor);
  if (!stage || !bubble || !ballBox) {
    return null;
  }
  const ball = ballCircle(ballBox);
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Bats stage={stage} />
      <Spider
        left={bubble.right + 26}
        top={stage.top}
        threadHeight={96}
        bobDuration="3.6s"
      />
      <BallMist ball={ball} board="qf1" occluders={counter ? [counter] : []} />
      <MonsterRise ball={ball} />
    </>
  );
}
