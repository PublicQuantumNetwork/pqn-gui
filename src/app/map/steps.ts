export const ASSET_ROOT = '/images/interactive-map';

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type StepDetail = {
  kicker: string;
  title: string;
  /** Omitted for steps whose artwork is still pending; a gradient stands in. */
  image?: string;
  imageAlt?: string;
  imagePosition?: string;
  caption?: string;
  summary: string;
  description: string;
};

export const stepNumbers: StepNumber[] = [1, 2, 3, 4, 5, 6];

export const stepDetails: Record<StepNumber, StepDetail> = {
  1: {
    kicker: 'On the lab side',
    title: 'Entangled Photon-Pair Source',
    image: `${ASSET_ROOT}/step-1-source.png`,
    imageAlt: 'Entangled photon-pair source optical equipment',
    summary:
      'A pair of photons is born. All it took was a laser and some glass.',
    description:
      'A laser goes through a polarizer and enters the source, where photon pairs are created in an entangled state of |HH⟩+|VV⟩.',
  },
  2: {
    kicker: 'In and between both buildings',
    title: 'Optical Fiber',
    image: `${ASSET_ROOT}/step-2-optical-fiber.png`,
    imageAlt: 'Yellow optical fiber connected to a fiber coupler mount',
    summary:
      'The pair is separated at birth and sent to different destinations.',
    description:
      'A dichroic mirror splits the pairs, and each photon goes through optical fiber to its destination.',
  },
  3: {
    kicker: 'At the library',
    title: 'Interaction Points',
    image: `${ASSET_ROOT}/step-3-interaction-points.png`,
    imageAlt: 'A visitor turning the interaction point rotator',
    summary: "The photons' fates are in your hands!",
    description:
      'At your location there is accessible equipment that remotely controls what the photons will experience next.',
  },
  4: {
    kicker: 'In and between both buildings',
    title: 'Digital Relay System',
    image: `${ASSET_ROOT}/step-4-digital-relay.jpg`,
    imageAlt: 'Close-up of a computer circuit board',
    summary: 'Your choices are relayed to the equipment.',
    description:
      'Turning the wheel and pressing the button sends your chosen angle over the network to motors on the half-waveplates at both buildings, rotating them to match your selection.',
  },
  5: {
    kicker: 'At each building',
    title: 'Half-waveplate and Polarizer',
    image: `${ASSET_ROOT}/step-5-waveplate-polarizer.jpg`,
    imageAlt: 'Half-waveplate in a rotation mount next to a polarizing cube',
    summary:
      'When the photons arrive, they are prepared by an outside power (you!) to answer a yes/no question.',
    description:
      'Each photon goes through a user-controlled half-waveplate which prepares the photons to be offered a polarization state using the polarizers.',
  },
  6: {
    kicker: 'On the lab side',
    title: 'Detection System',
    image: `${ASSET_ROOT}/step-6-detection-system.png`,
    imageAlt: 'Photon detection system equipment',
    imagePosition: 'center 31%',
    summary:
      'Their choices made, the pair of photons are seen for what they are.',
    description:
      'They enter very sensitive light detectors and their time of arrival is recorded. Because they were born at the same time, their arrival times are coincident.',
  },
};
