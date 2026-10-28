import { Box } from '@mui/material';

export const DESIGN_WIDTH = 1920;
export const DESIGN_HEIGHT = 1080;

const PHOTON_TRAVEL_DURATION_SECONDS = 6;
// Measurement outcomes shown on successive trips. The entangled pair always
// collapses to the same axis, so both photons read from this list in lockstep.
// Order: horizontal, vertical, diagonal, anti-diagonal.
const POLARIZATION_OUTCOMES_DEGREES = [0, 90, 45, 135];
const PHOTON_CYCLE_DURATION_SECONDS =
  PHOTON_TRAVEL_DURATION_SECONDS * POLARIZATION_OUTCOMES_DEGREES.length;
// Fractions of each trip at which the photon fades in and out.
const TRIP_FADE_IN = 0.035;
const TRIP_FADE_OUT = 0.94;
// Fraction of each path at which the photon passes its half-waveplate icon
// (measured along the path), where the superposition collapses to one axis.
const LAB_COLLAPSE_AT = 0.5116;
const LIBRARY_COLLAPSE_AT = 0.6122;
const COLLAPSE_HALF_WINDOW = 0.02;
// Under reduced motion every SMIL timeline is paused here: first trip, both
// photons past their waveplates and collapsed to the horizontal axis.
export const REDUCED_MOTION_FRAME_SECONDS =
  PHOTON_TRAVEL_DURATION_SECONDS * 0.8;

/** SMIL timing shared by the photons and the waveplate dials. */
function polarizationTiming() {
  const outcomeCount = POLARIZATION_OUTCOMES_DEGREES.length;
  return {
    tripDur: `${PHOTON_TRAVEL_DURATION_SECONDS}s`,
    cycleDur: `${PHOTON_CYCLE_DURATION_SECONDS}s`,
    outcomeCount,
    // Discrete steps, one per trip, for the collapsed photon arrow.
    outcomeKeyTimes: [
      ...POLARIZATION_OUTCOMES_DEGREES.map((_, i) => i / outcomeCount),
      1,
    ].join(';'),
    outcomeValues: [
      ...POLARIZATION_OUTCOMES_DEGREES,
      POLARIZATION_OUTCOMES_DEGREES[outcomeCount - 1],
    ].join(';'),
  };
}

// Waveplate plate geometry, in the unmirrored icon's coordinates. The front
// face faces the viewer, so it keeps its size at every angle; its edge
// recedes along WAVEPLATE_DEPTH, the beam's direction, which gives the 3D
// look of Figma's Group 10. The centre keeps the whole plate, edge included,
// centred in the 26x58 box.
const WAVEPLATE_CENTRE = [16.5, 31.5];
const WAVEPLATE_HALF_LENGTH = 20;
const WAVEPLATE_HALF_WIDTH = 12;
const WAVEPLATE_DEPTH = [-7, -5];
const WAVEPLATE_FACE_TRANSFORM = `translate(${WAVEPLATE_CENTRE.join(' ')})`;
// Samples per turn, so the redrawn edge follows the plate smoothly.
const WAVEPLATE_TURN_STEPS = 8;

/**
 * The plate's four edge faces at a given angle, as one path. The front face
 * is the plate rotated in its own plane; each edge face joins
 * two neighbouring front corners to the same corners pushed back by the depth.
 */
function waveplateEdgePath(angleDegrees: number) {
  const radians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(([u, v]) => {
    const x = u * WAVEPLATE_HALF_LENGTH * cos - v * WAVEPLATE_HALF_WIDTH * sin;
    const y = u * WAVEPLATE_HALF_LENGTH * sin + v * WAVEPLATE_HALF_WIDTH * cos;
    return [WAVEPLATE_CENTRE[0] + x, WAVEPLATE_CENTRE[1] + y];
  });
  const point = ([x, y]: number[], dx = 0, dy = 0) =>
    `${(x + dx).toFixed(2)} ${(y + dy).toFixed(2)}`;
  const [dx, dy] = WAVEPLATE_DEPTH;
  return corners
    .map((corner, i) => {
      const next = corners[(i + 1) % corners.length];
      return `M${point(corner)}L${point(next)}L${point(next, dx, dy)}L${point(corner, dx, dy)}Z`;
    })
    .join('');
}

/**
 * Waveplate turn: hold the current outcome while the photon is visible, then
 * turn to the next outcome after the photon fades out. The final turn goes to
 * the first outcome plus 180deg, which is the same axis, so the loop is smooth.
 * Angles are negated because the icon is mirrored, which reverses rotation.
 * Each turn is sampled so the plate's edge can be redrawn along the way.
 */
function waveplateTiming() {
  const outcomeCount = POLARIZATION_OUTCOMES_DEGREES.length;
  const angles = [
    ...POLARIZATION_OUTCOMES_DEGREES,
    POLARIZATION_OUTCOMES_DEGREES[0] + 180,
  ].map((angle) => -angle);
  const keyTimes: number[] = [];
  const values: number[] = [];
  for (let i = 0; i < outcomeCount; i += 1) {
    keyTimes.push(i / outcomeCount);
    values.push(angles[i]);
    for (let step = 0; step < WAVEPLATE_TURN_STEPS; step += 1) {
      const progress = step / WAVEPLATE_TURN_STEPS;
      keyTimes.push(
        (i + TRIP_FADE_OUT + (1 - TRIP_FADE_OUT) * progress) / outcomeCount
      );
      values.push(angles[i] + (angles[i + 1] - angles[i]) * progress);
    }
  }
  keyTimes.push(1);
  values.push(angles[outcomeCount]);
  return {
    cycleDur: `${PHOTON_CYCLE_DURATION_SECONDS}s`,
    keyTimes: keyTimes.map((t) => t.toFixed(5)).join(';'),
    rotateValues: values.join(';'),
    edgeValues: values.map(waveplateEdgePath).join(';'),
  };
}

// Both paths run along the centreline of the Figma fiber shapes (frame
// 195:892), in stage coordinates. Each fiber stops at the edges of its
// waveplate card, so the photon crosses the waveplate icon in a straight gap.
// Lab: right source orb -> fiber A1 -> waveplate A -> fiber A2 -> Vector 4,
// which hooks up into the detector from the left.
export const LAB_PHOTON_PATH = [
  'M 822 384',
  'C 850 384 880 357.5 909 357.5',
  'L 1368 357.5',
  'C 1397.1 356.75 1407.25 359.03 1414.25 370.25',
  'C 1421.25 381.47 1431.02 413.28 1446.75 417.75',
  'C 1454.5 419.75 1461.75 417.75 1463.43 406.93',
].join(' ');
// Library: left source orb -> down fiber B1 through its self-crossing loop
// (up the right side, over the top, down the left) -> waveplate B -> back up
// fiber B2 -> Vector 6, which enters the detector from below.
export const LIBRARY_PHOTON_PATH = [
  'M 748 384',
  'C 760 400 784 430 784 460',
  'L 784 508',
  'C 784 568.5 824 578.3 869.5 601.5',
  'C 882 607.87 898.69 611.81 917.19 613.93',
  'C 935.69 616.06 956 616.38 975.72 615.52',
  'C 1002.6 614.37 1028.4 611.03 1047.09 607.15',
  // Through the crossing, then round the loop the way the fiber turns:
  // up the right side, over the top, down the left side, out the crossing.
  'L 1051 606.3',
  'C 1057.98 604.73 1063.77 603.1 1068 601.5',
  'C 1084.5 595.25 1095.88 580.62 1097.44 567.56',
  'C 1098.22 561.03 1096.55 554.89 1091.84 550.38',
  'C 1087.12 545.88 1079.37 543 1068 543',
  'C 1061 543 1055.68 547.16 1052.29 554.43',
  'C 1048.83 561.7 1047.13 572.09 1047.24 584.56',
  'C 1047.29 590.81 1047.8 597.58 1048.76 604.74',
  'L 1049.33 608.71',
  'C 1052.5 629.21 1059.27 652.6 1069.71 676',
  'C 1099.12 741.89 1161.59 808.27 1251 809.48',
  'L 1507.5 809.5',
  'C 1545.64 809.15 1576.44 801 1597.12 788.1',
  'C 1618.26 774.92 1631.33 756.78 1638.39 736.94',
  'C 1652.52 697.25 1642.6 650.75 1625 623.5',
  'C 1617.34 611.62 1605.29 600.7 1591.52 589.8',
  'C 1584.63 584.35 1577.32 578.9 1569.91 573.35',
  'C 1562.51 567.8 1555 562.14 1547.75 556.25',
  'C 1518.71 532.71 1493.5 505.58 1493.5 467.5',
  'L 1493.5 465.5',
  'C 1493.5 454.63 1492.35 447.41 1490.61 442.22',
  'C 1488.88 437.04 1486.56 433.88 1484.25 431.13',
  'C 1481.94 428.38 1479.63 426.03 1477.89 422.47',
  'C 1476.16 418.91 1475 414.13 1475 406.5',
].join(' ');

const POLARIZATION_ARROW_PATH =
  'M -14 0 L 14 0 M 8 -6 L 14 0 L 8 6 M -8 -6 L -14 0 L -8 6';

/** Double-headed arrow marking a polarization axis (an axis, not a direction). */
function PolarizationArrow({ transform }: { transform?: string }) {
  return (
    <g
      transform={transform}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="#fff" strokeWidth={7} d={POLARIZATION_ARROW_PATH} />
      <path
        stroke="currentColor"
        strokeWidth={3.5}
        d={POLARIZATION_ARROW_PATH}
      />
    </g>
  );
}

function TravelingPhoton({
  color,
  path,
  collapseAt,
}: {
  color: string;
  path: string;
  collapseAt: number;
}) {
  const { tripDur, cycleDur, outcomeKeyTimes, outcomeValues } =
    polarizationTiming();
  const collapseStart = collapseAt - COLLAPSE_HALF_WINDOW;
  const collapseEnd = collapseAt + COLLAPSE_HALF_WINDOW;

  return (
    <g color={color}>
      <circle fill="currentColor" opacity={0.35} r="15">
        <animate
          attributeName="r"
          dur={tripDur}
          keyTimes={`0;${collapseStart};${collapseEnd};${collapseEnd + 0.08};1`}
          repeatCount="indefinite"
          values="15;15;24;15;15"
        />
      </circle>

      {/* In flight: a steady cross, no preferred axis (superposition). */}
      <g>
        <PolarizationArrow />
        <PolarizationArrow transform="rotate(90)" />
        <animate
          attributeName="opacity"
          dur={tripDur}
          keyTimes={`0;${TRIP_FADE_IN};${collapseStart};${collapseEnd};1`}
          repeatCount="indefinite"
          values="0;1;1;0;0"
        />
      </g>

      {/* On arrival: collapses to one axis, cycling through outcomes per trip. */}
      <g>
        <PolarizationArrow />
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="discrete"
          dur={cycleDur}
          keyTimes={outcomeKeyTimes}
          repeatCount="indefinite"
          values={outcomeValues}
        />
        <animate
          attributeName="opacity"
          dur={tripDur}
          keyTimes={`0;${collapseStart};${collapseEnd};${TRIP_FADE_OUT};1`}
          repeatCount="indefinite"
          values="0;0;1;1;0"
        />
      </g>

      <animateMotion dur={tripDur} path={path} repeatCount="indefinite" />
      <animate
        attributeName="opacity"
        dur={tripDur}
        keyTimes={`0;${TRIP_FADE_IN};${TRIP_FADE_OUT};1`}
        repeatCount="indefinite"
        values="0;1;1;0"
      />
    </g>
  );
}

export function PhotonPairAnimation() {
  return (
    <Box
      component="svg"
      data-smil=""
      viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 3,
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <TravelingPhoton
        color="#00a8e8"
        path={LAB_PHOTON_PATH}
        collapseAt={LAB_COLLAPSE_AT}
      />
      <TravelingPhoton
        color="#ff6b00"
        path={LIBRARY_PHOTON_PATH}
        collapseAt={LIBRARY_COLLAPSE_AT}
      />
    </Box>
  );
}

/**
 * Figma's half-waveplate icon (26x58), redrawn so the whole plate can turn
 * about the beam in step with the photons.
 */
export function WaveplateIcon() {
  const { cycleDur, keyTimes, rotateValues, edgeValues } = waveplateTiming();
  return (
    <Box
      component="svg"
      data-smil=""
      viewBox="0 0 26 58"
      fill="none"
      aria-hidden="true"
      sx={{ display: 'block', width: 26, height: 58, overflow: 'visible' }}
    >
      {/*
        The plate turns about the beam, like a rotation mount, to the outcome
        the photon will collapse to; the line on its face marks its axis.
        Mirrored so the front face is on the left and the edge on the right.
      */}
      <g transform="matrix(-1 0 0 1 26 0)" stroke="#70B1BE">
        <path
          fill="#8DE8F9"
          fillOpacity="0.72"
          strokeWidth={1.26}
          strokeLinejoin="round"
        >
          <animate
            attributeName="d"
            calcMode="linear"
            dur={cycleDur}
            keyTimes={keyTimes}
            repeatCount="indefinite"
            values={edgeValues}
          />
        </path>
        <g transform={WAVEPLATE_FACE_TRANSFORM}>
          <g>
            <rect
              x={-WAVEPLATE_HALF_LENGTH}
              y={-WAVEPLATE_HALF_WIDTH}
              width={2 * WAVEPLATE_HALF_LENGTH}
              height={2 * WAVEPLATE_HALF_WIDTH}
              fill="#8DE8F9"
              fillOpacity="0.72"
              strokeWidth={2}
              strokeLinejoin="round"
            />
            <line
              x1={3 - WAVEPLATE_HALF_LENGTH}
              x2={WAVEPLATE_HALF_LENGTH - 3}
              stroke="#1c5a68"
              strokeWidth={1.8}
              strokeLinecap="round"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              calcMode="linear"
              dur={cycleDur}
              keyTimes={keyTimes}
              repeatCount="indefinite"
              values={rotateValues}
            />
          </g>
        </g>
      </g>
    </Box>
  );
}
