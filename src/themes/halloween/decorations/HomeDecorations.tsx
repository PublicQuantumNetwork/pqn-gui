'use client';

import {
  Bats,
  Ghost,
  Moon,
  Pumpkin,
  PumpkinSmall,
  Spider,
  Web,
} from './ambient';
import { MonsterPeek, MonsterPop } from './monsters';
import { useElementBox } from './useElementBox';

/**
 * The anchors the home Scene's Decorations are placed against: the stage (the
 * layout's content box), the three game buttons and Whobit's pose, each marked
 * on the page with a data attribute.
 */
const stageAnchor = () =>
  document.querySelector<HTMLElement>('[data-decoration-anchor="stage"]');
const buttonAnchor = (game: string) => () =>
  document.querySelector(`[data-decoration-anchor="home-button-${game}"]`);
const chshButton = buttonAnchor('chsh');
const qfButton = buttonAnchor('qf');
const ssmButton = buttonAnchor('ssm');
const poseAnchor = () =>
  document.querySelector('[data-decoration-anchor="whobit-pose"]');

/**
 * The home Scene's Decorations (the Main design board): the
 * stage's ambient set — web, moon, bats, spider, the ghost with its small
 * pumpkin under the game buttons and the pumpkin under Whobit's pose — plus
 * the peeking and the popping monster. The stage-anchored pieces keep the
 * board's stage placements; the moon, the bats and the peeking monster are
 * cut to shape around the game buttons, which cover them on the board; the
 * peeking monster is painted before the moon, which hides it at rest, as on
 * the board.
 */
export default function HomeDecorations() {
  const stage = useElementBox(stageAnchor);
  const chsh = useElementBox(chshButton);
  const qf = useElementBox(qfButton);
  const ssm = useElementBox(ssmButton);
  const pose = useElementBox(poseAnchor);
  if (!stage || !chsh || !qf || !ssm || !pose) {
    return null;
  }
  const buttons = [chsh, qf, ssm];
  // The board's ghost-and-pumpkin row at the bottom of the buttons column,
  // right-aligned with it (the ghost 16px left of the pumpkin, their bottoms
  // level 8px under the last button).
  const ghostTop = ssm.bottom + 8;
  return (
    <>
      <Web stage={stage} />
      <MonsterPeek stage={stage} occluders={buttons} />
      <Moon stage={stage} occluders={buttons} />
      <Bats stage={stage} occluders={buttons} />
      <Spider
        left={stage.right - stage.width * 0.03 - 40}
        top={stage.top}
        threadHeight={150}
        bobDuration="3.2s"
      />
      <Ghost left={chsh.right - 200} top={ghostTop} width={100} height={120} />
      <PumpkinSmall left={chsh.right - 84} top={ghostTop + 120 - 73} />
      <Pumpkin
        left={pose.left + 258}
        top={pose.top + 340}
        clipBottom={stage.bottom}
      />
      <MonsterPop stage={stage} />
    </>
  );
}
