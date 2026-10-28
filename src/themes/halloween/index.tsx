import type { SeasonalTheme } from '../types';
import Burst from './Burst';
import { chsh3EntangledLine } from './Chsh3Line';
import HomeDecorations from './decorations/HomeDecorations';
import Qf1Decorations from './decorations/Qf1Decorations';
import Qf2Decorations from './decorations/Qf2Decorations';
import MeasuringDecorations from './decorations/MeasuringDecorations';
import Chsh1Decorations from './decorations/Chsh1Decorations';
import Chsh2Decorations from './decorations/Chsh2Decorations';
import {
  Chsh3EntangledDecorations,
  Chsh3WeakDecorations,
  Chsh3ErrorDecorations,
} from './decorations/Chsh3Decorations';
import Ssm1Decorations from './decorations/Ssm1Decorations';
import {
  Ssm2AskingDecorations,
  Ssm2WaitingDecorations,
  Ssm2DeclinedDecorations,
} from './decorations/Ssm2Decorations';
import Ssm3Decorations from './decorations/Ssm3Decorations';
import Ssm4Decorations, {
  Ssm4PerfectDecorations,
} from './decorations/Ssm4Decorations';

/**
 * The hat's size and tilt, the same on every board that shows Whobit: the
 * boards draw it 160×110, rotated -8°, 30px from the left and 6px above the
 * top of the pose container (which holds the pose 70px down).
 */
const hat = {
  width: '160px',
  height: '110px',
  transform: 'rotate(-8deg)',
} as const;

/**
 * The Halloween Seasonal Theme: the witch hat Whobit wears, the spooky
 * Flavour copy, the bat-and-pumpkin Celebration, the Measuring popup's cream
 * track and cauldron illustration, and the Decorations of every Game's
 * Scenes, ported from the Halloween design boards (pumpkins are always
 * #ff5f05). The background and Whobit poses stay the Default Theme's.
 */
const halloween: SeasonalTheme = {
  palette: {
    // The Measuring popup's cream progress track; primary.main stays the
    // Default Theme's pumpkin.
    LinearProgress: { primaryBg: '#fff4dd' },
  },
  images: {
    // The Measuring popup's cauldron illustration, an SVG
    // carrying its own animations and reduced-motion rule.
    'measuring-illustration': '/images/halloween/measuring-cauldron.svg',
    // The CHSH2 board's cream wheel face and broom needle.
    'polarization-wheel': '/images/halloween/polarization-wheel.svg',
    'polarization-arrow': '/images/halloween/polarization-broom.svg',
  },
  whobitAccessory: {
    svg: '/images/halloween/whobit-witch-hat.svg',
    positions: {
      // Every board places the hat the same way over the pose container:
      // left 30px, top -6px. Each pose's SVG is centred in the 288×288 pose
      // box while the boards anchor the pose top-left, so each pose's
      // position shifts by how far its own aspect moves the owl: the
      // right-wing-up pose is ~6.5px right, the arms-down pose ~36.4px
      // right, the arms-up pose ~18.9px down.
      'right-wing-up': { ...hat, left: '36.5px', top: '-6px' },
      'arms-down': { ...hat, left: '66.4px', top: '-6px' },
      'arms-up': { ...hat, left: '30px', top: '12.9px' },
    },
  },
  flavourCopy: {
    'home-greeting-first-line': 'Happy Halloween, Quantum Adventurer!',
    'home-greeting-last-line': 'Pick a game… if you dare!',
    'qf1-lead-in': 'Gaze into my crystal ball…',
    'qf2-lead-in': 'The spirits have spoken…',
    fortunes: {
      1: 'Is that a ghost, or a particle in superposition? Nobody knows until somebody looks.',
      2: 'Quantum means smallest quantity. Even the tiniest pumpkin can light up the whole night.',
      3: 'Entangled particles are everywhere, so are we ever really alone? Maybe check behind you.',
    },
    'chsh3-entangled-line': chsh3EntangledLine,
  },
  decorations: {
    home: HomeDecorations,
    qf1: Qf1Decorations,
    qf2: Qf2Decorations,
    measuring: MeasuringDecorations,
    chsh1: Chsh1Decorations,
    chsh2: Chsh2Decorations,
    'chsh3-entangled': Chsh3EntangledDecorations,
    'chsh3-weak': Chsh3WeakDecorations,
    'chsh3-error': Chsh3ErrorDecorations,
    ssm1: Ssm1Decorations,
    'ssm2-asking': Ssm2AskingDecorations,
    'ssm2-waiting': Ssm2WaitingDecorations,
    'ssm2-declined': Ssm2DeclinedDecorations,
    ssm3: Ssm3Decorations,
    ssm4: Ssm4Decorations,
    'ssm4-perfect': Ssm4PerfectDecorations,
  },
  celebration: Burst,
};

export default halloween;
