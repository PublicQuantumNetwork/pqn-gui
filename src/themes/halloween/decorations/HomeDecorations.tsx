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

/**
 * The home Scene's Decorations (docs/design/halloween/Main.dc.html): the
 * stage's ambient set — web, moon, bats, spider, the ghost with its small
 * pumpkin under the game buttons and the pumpkin under Whobit's pose — plus
 * the peeking and the popping monster. The stage-anchored pieces carry the
 * board's own placements; the content-anchored ones sit where the board puts
 * them relative to the page's own layout at the boards' 1440x980.
 */
export default function HomeDecorations() {
  return (
    <>
      <Web />
      <Moon />
      <Bats />
      <Spider offset={{ right: '3%' }} threadHeight={150} bobDuration="3.2s" />
      {/* The board's ghost-and-pumpkin row at the bottom of the buttons
          column, right-aligned with it (the ghost 16px left of the pumpkin,
          their bottoms level 8px under the last button). */}
      <Ghost left={1096} top={633} width={100} height={120} />
      <PumpkinSmall left={1212} top={680} />
      {/* The pumpkin leaning out from under Whobit's pose, at the board's own
          place beside the pose box. */}
      <Pumpkin left={402} top={799} />
      <MonsterPeek />
      <MonsterPop />
    </>
  );
}
