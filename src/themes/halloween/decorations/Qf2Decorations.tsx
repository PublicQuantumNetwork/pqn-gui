'use client';

import {
  Bats,
  BallMist,
  Ghost,
  Moon,
  Pumpkin,
  Web,
  ballCircle,
} from './ambient';
import { MonsterSlide } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the qf2 Scene's Decorations are placed against: the stage, the
 *  page's own ball (the board's ghost floats beside it, its mist, twinkles and
 *  glow dress it) and Whobit's pose. */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const ballAnchor = () =>
  document.querySelector('[data-decoration-anchor="qf-ball"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');

/**
 * The qf2 Scene's Decorations (the QF2 design board): the
 * stage's ambient set — web, moon, bats, the ghost by the ball with its mist,
 * twinkles and pulsing glow, and the flickering pumpkin under Whobit's pose —
 * plus the sliding monster. The stage-anchored pieces keep the board's stage
 * placements; the ghost and the ball pieces are placed against the GUI's own
 * ball as the board places them against its (the ghost 202px left of the
 * ball's edge and 16px above its top), and the board has no spider here.
 */
export default function Qf2Decorations() {
  const stage = useElementBox(stageAnchor);
  const ballBox = useElementBox(ballAnchor);
  const pose = useElementBox(poseAnchor);
  if (!stage || !ballBox || !pose) {
    return null;
  }
  const ball = ballCircle(ballBox);
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} />
      <Bats stage={stage} />
      <BallMist ball={ball} board="qf2" />
      <Ghost
        left={ball.left - 202}
        top={ball.top - 16}
        width={84}
        height={100}
      />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        flicker
        clipBottom={stage.bottom}
      />
      <MonsterSlide stage={stage} />
    </>
  );
}
