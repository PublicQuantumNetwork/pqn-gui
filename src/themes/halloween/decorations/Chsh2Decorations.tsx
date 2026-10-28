'use client';

import { Ghost, Moon, Pumpkin, Spider, Web } from './ambient';
import { MonsterOoze } from './monsters';
import { useElementBox } from './useElementBox';

/** The anchors the chsh2 Scene's Decorations are placed against: the stage,
 *  Whobit's speech bubble (the ghost floats 22px right of its right edge, in
 *  the gap between the bubble and the wheel, which the GUI lays narrower than
 *  the board's), Whobit's pose (the board leans its pumpkin out from under it,
 *  and the brew pot is clamped past that pumpkin's clamped spot), the page's
 *  own wheel (the board hangs its ghost beside it, and draws its circle over
 *  the moon) and the wheel's D label (the board draws the D over the moon too,
 *  so the moon is cut around it). */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const bubbleAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-bubble"]');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');
const wheelAnchor = () =>
  document.querySelector('[data-decoration-anchor="chsh2-wheel"]');
const wheelDAnchor = () =>
  document.querySelector('[data-decoration-anchor="chsh2-wheel-d"]');

/**
 * The chsh2 Scene's Decorations (the CHSH2 design board): the
 * stage's ambient set — web, moon, the spider on the stage's right, the
 * ghost beside the wheel and the flickering pumpkin under Whobit's pose —
 * plus the blob oozing out of the witch's brew pot on the stage's bottom
 * edge. The board carries no bats here. The ghost keeps the board's offsets
 * from the wheel (128px left of it, 8px down) and the board's own 22px gap
 * from the bubble's right edge; the moon is cut around the wheel's own
 * circle and its D label, which the board draws over it; the pot keeps the
 * board's stage placement, clamped past the pose pumpkin; the pumpkin keeps
 * its place beside the pose box, clamped to rest its base on the stage's
 * bottom edge.
 */
export default function Chsh2Decorations() {
  const stage = useElementBox(stageAnchor);
  const bubble = useElementBox(bubbleAnchor);
  const pose = useElementBox(poseAnchor);
  const wheel = useElementBox(wheelAnchor);
  const wheelD = useElementBox(wheelDAnchor);
  if (!stage || !bubble || !pose || !wheel || !wheelD) {
    return null;
  }
  // The wheel's own circle: circle.png at its natural 550px size in the
  // wheel's 560px box (RotatorCircle keeps the background's default top-left
  // position), drawing its circle 57px inside itself, as the ball's own
  // ballCircle box measures the same image.
  const wheelCircle = { cx: wheel.left + 275, cy: wheel.top + 275, r: 218 };
  // The pose pumpkin's clamped spot (beside the pose box, its base on the
  // stage's bottom edge); the pot rests on the same edge and is clamped
  // past the pumpkin, as the board lays them side by side.
  const pumpkinRight = pose.left + 258 + 120;
  return (
    <>
      <Web stage={stage} />
      <Moon stage={stage} occluders={[wheelD]} circleOccluder={wheelCircle} />
      <Spider
        left={stage.right - stage.width * 0.03 - 40}
        top={stage.top}
        threadHeight={210}
        bobDuration="3.2s"
      />
      <Ghost
        left={Math.max(wheel.left - 128, bubble.right + 22)}
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
