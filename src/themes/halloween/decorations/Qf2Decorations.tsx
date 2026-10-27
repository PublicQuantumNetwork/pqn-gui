import { Bats, Ghost, Moon, Pumpkin, Web } from './ambient';
import { MonsterSlide } from './monsters';

/**
 * The qf2 Scene's Decorations (docs/design/halloween/QF2.dc.html): the
 * stage's ambient set — web, moon, bats, the ghost by the crystal ball and
 * the flickering pumpkin under Whobit's pose — plus the sliding monster. The
 * board anchors the ghost to the crystal ball (112px left of it, 24px down)
 * and the pumpkin to the pose box; both sit at those places relative to the
 * page's own layout. The board has no spider on this page.
 */
export default function Qf2Decorations() {
  return (
    <>
      <Web />
      <Moon />
      <Bats />
      <Ghost left={682} top={263} width={84} height={100} />
      <Pumpkin left={402} top={845} flicker />
      <MonsterSlide />
    </>
  );
}
