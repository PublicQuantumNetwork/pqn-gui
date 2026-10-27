import { Bats, Moon, Spider, Web } from './ambient';
import { MonsterRise } from './monsters';

/**
 * The qf1 Scene's Decorations (docs/design/halloween/QF1.dc.html): the
 * stage's ambient set — web, moon, bats, spider — plus the rising monster.
 * The board anchors the monster to the crystal ball, which is the page's own
 * circle; it rises from behind the circle's top at the board's own place
 * relative to it (232px from its left, 66px down).
 */
export default function Qf1Decorations() {
  return (
    <>
      <Web />
      <Moon />
      <Bats />
      <Spider offset={{ left: '41%' }} threadHeight={96} bobDuration="3.6s" />
      <MonsterRise left={1026} top={305} />
    </>
  );
}
