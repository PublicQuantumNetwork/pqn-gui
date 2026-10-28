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

/**
 * Waveplate dial: hold the current outcome while the photon is visible, then
 * turn to the next outcome after the photon fades out. The final turn goes to
 * the first outcome plus 180deg, which is the same axis, so the loop is smooth.
 * Angles are negated because the icon is mirrored, which reverses rotation.
 */
function waveplateDialTiming() {
  const outcomeCount = POLARIZATION_OUTCOMES_DEGREES.length;
  const keyTimes: number[] = [];
  const values: number[] = [];
  POLARIZATION_OUTCOMES_DEGREES.forEach((angle, i) => {
    keyTimes.push(i / outcomeCount, (i + TRIP_FADE_OUT) / outcomeCount);
    values.push(-angle, -angle);
  });
  keyTimes.push(1);
  values.push(-(POLARIZATION_OUTCOMES_DEGREES[0] + 180));
  return {
    cycleDur: `${PHOTON_CYCLE_DURATION_SECONDS}s`,
    keyTimes: keyTimes.join(';'),
    values: values.join(';'),
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

/** Figma's half-waveplate icon (26x58) with a dial that turns in step with the photons. */
export function WaveplateIcon() {
  const { cycleDur, keyTimes, values } = waveplateDialTiming();
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
        The plate is drawn in perspective with the beam passing through it
        left to right, so it turns about the beam: the slab stays put and only
        the axis line on its front face turns, to the outcome the photon will
        collapse to, like a rotation mount. Figma's Group 10 is mirrored so
        the front face is on the left and the edge on the right.
      */}
      <g transform="matrix(-1 0 0 1 26 0)">
        <path
          d="M1.26294 15.9511C1.26294 15.5404 1.64898 15.239 2.04749 15.3386L7.09876 16.6014C7.37985 16.6717 7.57703 16.9242 7.57703 17.214V55.6911C7.57703 56.1019 7.191 56.4033 6.79249 56.3036L1.74121 55.0408C1.46013 54.9706 1.26294 54.718 1.26294 54.4283V15.9511Z"
          fill="#8DE8F9"
          fillOpacity="0.72"
        />
        <path
          d="M18.4464 1.38502C18.563 1.29862 18.7059 1.25505 18.8509 1.26164L23.8969 1.491C24.4789 1.51746 24.7176 2.25086 24.2626 2.61481L8.4492 15.2656C8.29727 15.3871 8.09779 15.4318 7.90851 15.3867L2.89825 14.1938C2.3761 14.0695 2.23736 13.3917 2.66866 13.0722L18.4464 1.38502Z"
          fill="#8DE8F9"
          fillOpacity="0.72"
        />
        <path
          d="M0 15.9511C1.1756e-05 15.1163 6.08557e-05 14.1938 0.315644 13.5639C0.947114 12.9325 1.20141 12.5873 1.91704 12.0572L17.6949 0.369966L17.8293 0.279325C18.1057 0.109191 18.4213 0.0131057 18.7456 0H18.9084L23.6853 0.444268C24.5236 0.482377 25.5762 0.959984 25.8878 1.56712C26.2251 2.22437 25.761 3.03342 25.0517 3.60101L9.23806 16.2514C9.07938 16.3783 8.90297 16.4767 8.71703 16.5461C8.79589 16.7552 8.83973 16.9803 8.83973 17.2139V55.6911C8.83973 56.9234 7.68167 57.8274 6.48613 57.5285L1.43485 56.2657C0.5916 56.0549 0 55.2974 0 54.4282V15.9511ZM18.851 1.26159C18.7061 1.255 18.5631 1.29862 18.4465 1.38491L2.66869 13.0721C2.23741 13.3916 2.37598 14.0694 2.89807 14.1938L7.90865 15.3869C8.09779 15.4318 8.29696 15.3868 8.4488 15.2654L23.9936 2.82994C24.4201 2.48869 24.237 1.82238 23.7327 1.7188L23.6279 1.70585L18.851 1.26159ZM1.26282 54.4282C1.26282 54.718 1.46023 54.9703 1.74131 55.0405L6.79258 56.3033C7.19105 56.4029 7.57691 56.1018 7.57691 55.6911V17.2139C7.5769 16.9605 7.42605 16.7356 7.20016 16.6362L7.09842 16.6016L2.04715 15.3388C1.6487 15.2393 1.26284 15.5404 1.26282 15.9511V54.4282Z"
          fill="#70B1BE"
        />
        <path
          d="M24.8877 3.37732V39.0375L8.57715 55.348V16.8754L24.8877 3.37732Z"
          fill="#8DE8F9"
          fillOpacity="0.72"
          stroke="#70B1BE"
          strokeWidth="2"
        />
        {/*
              Polarization axis dial drawn on the front face. The face is a
              parallelogram with vertical sides and slanted top/bottom, so the
              dial is skewed to match: vertical stays vertical, horizontal
              follows the slant. Centre of the face is (16.73, 28.66).
            */}
        <g transform="matrix(1 -0.8278 0 1 16.73 28.66)" stroke="#1c5a68">
          <circle r="6.5" fill="none" strokeWidth={0.9} opacity={0.55} />
          <g>
            <line x1="-7" x2="7" strokeWidth={1.8} strokeLinecap="round" />
            <animateTransform
              attributeName="transform"
              type="rotate"
              calcMode="linear"
              dur={cycleDur}
              keyTimes={keyTimes}
              repeatCount="indefinite"
              values={values}
            />
          </g>
        </g>
      </g>
    </Box>
  );
}
