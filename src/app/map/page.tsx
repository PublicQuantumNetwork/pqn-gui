'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  MouseEvent as ReactMouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, ButtonBase, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import ssmQuestions from '@/app/ssm/page3/questions';
import PageTimeout from '@/components/PageTimeout';
import StepDialog, { INK, INK_SOFT, SANS, SERIF, SUB_FILL } from './StepDialog';
import {
  DESIGN_HEIGHT,
  DESIGN_WIDTH,
  PhotonPairAnimation,
  REDUCED_MOTION_FRAME_SECONDS,
  WaveplateIcon,
} from './photons';
import { ASSET_ROOT, StepNumber, stepNumbers } from './steps';

const MAP_CONTENT_TOP = 110;
const MAP_CONTENT_HEIGHT = DESIGN_HEIGHT - MAP_CONTENT_TOP;
const MAP_TIMEOUT_MS = 5 * 60 * 1000;
const MAP_WARNING_DURATION_MS = 30 * 1000;
const FUZZY_QUESTION_MIN_DELAY_MS = 12 * 1000;
const FUZZY_QUESTION_MAX_DELAY_MS = 20 * 1000;
const FUZZY_QUESTION_VISIBLE_MS = 9 * 1000;
const FUZZY_REPLY_VISIBLE_MS = 5 * 1000;
const HINT_VISIBLE_MS = 2600;

// Layout of Figma frame 195:892, in stage pixels. Each building is a tag,
// then a location card and a content panel; equipment inside a panel is
// positioned relative to that panel, as in Figma.
const BUILDING_LEFT = 206;
const LOCATION_CARD_WIDTH = 394;
const PANEL_LEFT = BUILDING_LEFT + LOCATION_CARD_WIDTH;
const PANEL_WIDTH = 1076;
const PANEL_BORDER = 2;
const STATION_HEIGHT = 344;
const BUILDING_ONE_TOP = 140;
const BUILDING_TWO_TOP = 590;
// Tag (27px) plus a 16px gap sits above each station.
const STATION_OFFSET = 43;
// Origin of the Building 1 content panel's children in stage coordinates.
const LAB_PANEL_X = PANEL_LEFT + PANEL_BORDER;
const LAB_PANEL_Y = BUILDING_ONE_TOP + STATION_OFFSET;

// Centrelines of Figma's dashed relay paths (195:1035, 195:1032), rebuilt
// from the dash outlines Figma exports so the dashes can march. Both run
// from the Digital Relay pill to the receiver chip of a waveplate.
const RELAY_PATH_A =
  'M 738.8 921.0 C 743.6 927.3 755.5 949.1 767.5 958.8 C 779.6 968.4 796.2 973.2 811.2 978.7 C 826.2 984.3 842.0 988.1 857.6 992.0 C 873.1 995.8 888.9 998.8 904.7 1001.7 C 920.4 1004.6 936.3 1007.0 952.2 1009.2 C 968.1 1011.5 984.0 1013.4 999.9 1015.2 C 1015.9 1017.0 1031.8 1018.6 1047.8 1020.0 C 1063.8 1021.5 1079.7 1022.8 1095.7 1023.9 C 1111.7 1025.1 1127.8 1026.1 1143.8 1027.1 C 1159.8 1028.0 1175.8 1028.8 1191.8 1029.6 C 1207.9 1030.3 1223.9 1031.0 1239.9 1031.6 C 1255.9 1032.1 1272.0 1032.6 1288.0 1033.0 C 1304.0 1033.5 1320.1 1033.8 1336.1 1034.1 C 1352.2 1034.4 1368.2 1034.6 1384.3 1034.7 C 1400.3 1034.9 1416.4 1035.0 1432.4 1035.0 C 1448.4 1034.9 1464.3 1035.0 1480.1 1034.4 C 1496.0 1033.9 1511.8 1033.1 1527.6 1031.6 C 1543.4 1030.1 1559.2 1028.3 1574.8 1025.5 C 1590.4 1022.7 1605.9 1019.5 1621.0 1014.9 C 1636.1 1010.3 1651.4 1005.0 1665.4 997.8 C 1679.4 990.7 1693.3 982.2 1705.1 971.9 C 1716.9 961.6 1727.6 949.2 1736.0 936.0 C 1744.5 922.9 1750.8 907.8 1755.9 892.9 C 1761.0 878.0 1763.9 862.2 1766.4 846.6 C 1768.9 831.0 1770.1 817.1 1770.9 799.3 C 1771.8 781.4 1773.3 757.2 1771.5 739.5 C 1769.7 721.9 1766.4 707.7 1760.1 693.4 C 1753.8 679.1 1744.1 665.5 1733.6 653.7 C 1723.1 642.0 1710.1 632.0 1697.0 623.0 C 1683.9 614.0 1669.5 606.6 1655.1 599.7 C 1640.7 592.8 1625.7 587.1 1610.7 581.7 C 1595.7 576.3 1580.3 571.7 1564.9 567.4 C 1549.6 563.0 1534.1 559.2 1518.5 555.5 C 1503.0 551.8 1487.3 548.5 1471.7 545.2 C 1456.0 541.8 1440.3 538.8 1424.7 535.6 C 1409.0 532.4 1393.3 529.5 1377.7 526.1 C 1362.1 522.7 1346.4 519.5 1331.0 515.3 C 1315.6 511.1 1299.4 507.6 1285.3 500.7 C 1271.2 493.8 1253.8 480.4 1246.6 473.7 C 1239.4 467.0 1242.9 462.7 1242.2 460.5';
const RELAY_PATH_B =
  'M 974.0 902.4 C 982.3 903.2 1007.5 904.8 1023.7 907.3 C 1039.8 909.9 1055.4 913.7 1071.1 917.6 C 1086.9 921.6 1102.4 926.3 1117.9 930.8 C 1133.5 935.4 1148.9 940.4 1164.4 945.0 C 1179.9 949.6 1195.4 954.5 1211.1 958.5 C 1226.8 962.5 1242.6 966.5 1258.6 968.8 C 1274.6 971.1 1290.8 971.8 1307.2 972.2 C 1323.5 972.5 1340.3 972.5 1356.7 970.9 C 1373.0 969.3 1390.3 968.1 1405.4 962.6 C 1420.5 957.1 1438.8 946.2 1447.3 937.9 C 1455.9 929.6 1454.9 917.1 1456.4 913.0';

// Fiber artwork from Figma, placed in stage coordinates: [file, x, y, w, h].
const FIBER_IMAGES: [string, number, number, number, number][] = [
  ['optical-fiber-a1.svg', 946, 353, 133, 9],
  ['optical-fiber-a2.svg', 1257, 353, 111, 9],
  ['optical-fiber-a-detector.svg', 1366, 353, 101.981, 69.8895],
  ['optical-fiber-b1.svg', 780, 506, 510, 307.488],
  ['optical-fiber-b2.svg', 1470, 465.5, 179.609, 348.492],
  ['optical-fiber-b-detector.svg', 1470.5, 402, 27.5, 65.5],
  // Ticks that show fiber B1 passing under itself at the loop.
  ['fiber-crossing-1.svg', 1042.29, 602.02, 9.912, 3.957],
  ['fiber-crossing-2.svg', 1042.79, 607.02, 14.419, 4.956],
];
// Direction arrows (Figma Polygon 1 and 2): centre and rotation.
const FIBER_ARROWS: [number, number, number][] = [
  [LAB_PANEL_X + 321.5, LAB_PANEL_Y + 175, 90],
  [LAB_PANEL_X + 182, LAB_PANEL_Y + 296.5, 180],
];

type FuzzySpeaker = 'alice' | 'bob';

type FuzzyConversation = {
  speaker: FuzzySpeaker;
  kind: 'question' | 'reply';
  text: string;
  options?: [string, string];
};

const ping = keyframes`
  0% {
    transform: scale(0.82);
    opacity: 0;
  }
  18% {
    opacity: 0.75;
  }
  70%,
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

const marchingDashes = keyframes`
  to {
    stroke-dashoffset: -85;
  }
`;

const breathe = keyframes`
  0%,
  100% {
    transform: scale(0.94);
    opacity: 0.88;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
`;

const aliceBob = keyframes`
  0%,
  100% {
    transform: translateY(0) rotate(-3deg);
  }
  50% {
    transform: translateY(-7px) rotate(3deg);
  }
`;

const bobBob = keyframes`
  0%,
  100% {
    transform: translateY(-5px) rotate(4deg);
  }
  50% {
    transform: translateY(2px) rotate(-4deg);
  }
`;

const hintEntrance = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -8px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const hintPulse = keyframes`
  0%,
  100% {
    outline-color: rgba(244, 216, 120, 0.68);
    outline-offset: 4px;
  }
  50% {
    outline-color: rgba(244, 216, 120, 0.3);
    outline-offset: 7px;
  }
`;

const fuzzyQuestionCycle = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  7%,
  90% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateY(4px) scale(0.99);
  }
`;

// Badge glow rings are staggered so they don't all pulse together.
const PING_DELAYS_SECONDS = [0, 0.9, 1.7];

/** Equipment card as drawn in Figma: soft gradient, white rim, drop shadow. */
function hotspotCardSx(
  left: number,
  top: number,
  width: number,
  height: number,
  gradientAngle = 54.65
): SxProps<Theme> {
  return {
    position: 'absolute',
    left,
    top,
    width,
    height,
    flexDirection: 'column',
    px: '12px',
    py: '10px',
    border: '2px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '12px',
    background: `linear-gradient(${gradientAngle}deg, #edeeee 16.667%, #fff 89.13%)`,
    filter: 'drop-shadow(0 4px 5px rgba(13, 36, 54, 0.28))',
  };
}

const cardLabelSx: SxProps<Theme> = {
  color: '#2d2d2d',
  fontFamily: SERIF,
  fontSize: 16,
  lineHeight: 'normal',
  textAlign: 'center',
  whiteSpace: 'pre-line',
};

function StepBadge({
  step,
  index,
  left = -14,
  top = -14,
}: {
  step: StepNumber;
  /** Position among the badges, for the staggered glow. */
  index: number;
  left?: number;
  top?: number;
}) {
  return (
    <Box
      component="span"
      className="map-step-badge"
      aria-hidden="true"
      sx={{
        position: 'absolute',
        left,
        top,
        display: 'grid',
        placeItems: 'center',
        width: 30,
        height: 30,
        borderRadius: '15px',
        border: `2px solid ${INK}`,
        bgcolor: '#fff',
        boxShadow: '0 2px 4px rgba(13, 36, 54, 0.3)',
        color: INK,
        fontFamily: SANS,
        fontSize: 15,
        fontWeight: 700,
        lineHeight: 1,
        transition:
          'background-color 0.16s ease, border-color 0.16s ease, color 0.16s ease, transform 0.16s ease',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: '2px solid rgba(31, 122, 224, 0.55)',
          opacity: 0,
          animation: `${ping} 2.6s ease-out infinite`,
          animationDelay: `${PING_DELAYS_SECONDS[index % PING_DELAYS_SECONDS.length]}s`,
        },
      }}
    >
      {step}
    </Box>
  );
}

function Hotspot({
  step,
  label,
  onOpen,
  sx,
  children,
}: {
  step: StepNumber;
  label: string;
  onOpen: (step: StepNumber) => void;
  sx: SxProps<Theme>;
  children: ReactNode;
}) {
  return (
    <ButtonBase
      className="map-hotspot"
      aria-label={`Step ${step}: ${label}`}
      onClick={() => onOpen(step)}
      sx={sx}
    >
      {children}
    </ButtonBase>
  );
}

function BuildingTag({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: 'inline-block',
        px: '12px',
        py: '4px',
        borderRadius: '30px',
        bgcolor: '#b9e5fe',
        color: '#000',
        fontFamily: SANS,
        fontSize: 16,
        fontStyle: 'italic',
        fontWeight: 300,
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
        '& strong': { fontWeight: 500 },
      }}
    >
      {children}
    </Box>
  );
}

function LocationCard({
  accent,
  photo,
  photoAlt,
  logo,
  logoAlt,
  logoWidth,
  logoHeight,
  logoTop,
  name,
  address,
}: {
  accent: string;
  photo: string;
  photoAlt: string;
  logo: string;
  logoAlt: string;
  logoWidth: number;
  logoHeight: number;
  logoTop: number;
  name: string;
  address: string;
}) {
  return (
    <Stack
      direction="row"
      sx={{
        width: LOCATION_CARD_WIDTH,
        height: STATION_HEIGHT,
        flexShrink: 0,
        bgcolor: '#fff',
        borderRadius: '20px 0 0 20px',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ width: 8, flexShrink: 0, bgcolor: accent }} />
      <Box sx={{ p: '20px' }}>
        <Box
          sx={{
            position: 'relative',
            width: 346,
            height: 207,
            border: '1.066px solid #c7d6de',
            borderRadius: '8px 8px 0 0',
            overflow: 'hidden',
          }}
        >
          <Image
            src={photo}
            alt={photoAlt}
            fill
            sizes="346px"
            style={{ objectFit: 'cover' }}
            priority
          />
          <Box
            sx={{
              position: 'absolute',
              left: 10.93,
              top: logoTop,
              px: '12px',
              py: '6px',
              borderRadius: '6px',
              bgcolor: 'rgba(255, 255, 255, 0.64)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: logoWidth,
                height: logoHeight,
              }}
            >
              <Image
                src={logo}
                alt={logoAlt}
                fill
                sizes={`${logoWidth}px`}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Box>
        </Box>
        <Stack
          direction="row"
          spacing="19.2px"
          sx={{
            p: '20px',
            bgcolor: '#f2f2f2',
            borderRadius: '0 0 8px 8px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', height: 33 }}>
            <Image
              src={`${ASSET_ROOT}/map-pin.svg`}
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
            />
          </Box>
          <Stack
            spacing="4.8px"
            sx={{ lineHeight: 'normal', whiteSpace: 'nowrap' }}
          >
            <Box
              component="h2"
              sx={{
                m: 0,
                color: '#000',
                fontFamily: SERIF,
                fontSize: 24,
                fontWeight: 400,
                lineHeight: 'normal',
              }}
            >
              {name}
            </Box>
            <Box
              component="p"
              sx={{ m: 0, color: '#505050', fontFamily: SANS, fontSize: 16 }}
            >
              {address}
            </Box>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
}

function Building({
  top,
  tag,
  card,
  panelBorderColor,
  children,
}: {
  top: number;
  tag: ReactNode;
  card: ReactNode;
  panelBorderColor: string;
  children: ReactNode;
}) {
  return (
    <>
      <Box sx={{ position: 'absolute', left: BUILDING_LEFT, top }}>
        <BuildingTag>{tag}</BuildingTag>
      </Box>
      <Stack
        component="section"
        direction="row"
        sx={{
          position: 'absolute',
          left: BUILDING_LEFT,
          top: top + STATION_OFFSET,
          filter: 'drop-shadow(0 4px 2px rgba(0, 0, 0, 0.25))',
        }}
      >
        {card}
        <Box
          sx={{
            position: 'relative',
            width: PANEL_WIDTH,
            height: STATION_HEIGHT,
            bgcolor: '#fff',
            borderLeft: `${PANEL_BORDER}px solid ${panelBorderColor}`,
            borderRadius: '0 20px 20px 0',
          }}
        >
          {children}
        </Box>
      </Stack>
    </>
  );
}

function WaveplateCard({
  side,
  left,
  top,
  badgeIndex,
  onOpen,
}: {
  side: 'A' | 'B';
  left: number;
  top: number;
  badgeIndex: number;
  onOpen: (step: StepNumber) => void;
}) {
  return (
    <Hotspot
      step={5}
      label={`Half-waveplate ${side} and Polarizer ${side}`}
      onOpen={onOpen}
      sx={{
        ...hotspotCardSx(left, top, 248, 218),
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: '20px',
      }}
    >
      <Stack spacing="12px" sx={{ width: '100%', alignItems: 'center' }}>
        <Box sx={cardLabelSx}>
          {`Half-waveplate ${side} /\nPolarizer ${side}`}
        </Box>
        <WaveplateIcon />
      </Stack>
      <Box sx={{ position: 'relative', width: '100%', height: 0 }}>
        <Image
          src={`${ASSET_ROOT}/device-line.svg`}
          alt=""
          width={224}
          height={2}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            bottom: 0,
            width: '100%',
            height: 2,
          }}
        />
      </Box>
      <ReceiverChip label={side} icon="radio-receiver.svg" />
      <StepBadge step={5} index={badgeIndex} />
    </Hotspot>
  );
}

function ReceiverChip({ label, icon }: { label: string; icon: string }) {
  return (
    <Stack
      direction="row"
      spacing="16px"
      sx={{
        alignItems: 'center',
        height: 34,
        px: '12px',
        border: '1px solid #000',
        borderRadius: '8px',
        bgcolor: '#fff',
        color: '#000',
        fontFamily: SANS,
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      <Image src={`${ASSET_ROOT}/${icon}`} alt="" width={24} height={24} />
      <span>{label}</span>
    </Stack>
  );
}

function RelayDivider() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 0,
        height: 32,
      }}
    >
      <Image
        src={`${ASSET_ROOT}/relay-line.svg`}
        alt=""
        width={32}
        height={1}
        aria-hidden="true"
        style={{ flex: 'none', transform: 'rotate(90deg)' }}
      />
    </Box>
  );
}

function RelayEnd({ label }: { label: string }) {
  return (
    <Stack
      direction="row"
      spacing="12px"
      sx={{ alignItems: 'center', pl: '4px', fontSize: 12, fontWeight: 700 }}
    >
      <Image src={`${ASSET_ROOT}/radio.svg`} alt="" width={24} height={24} />
      <Box component="span" sx={{ color: '#000' }}>
        {label}
      </Box>
    </Stack>
  );
}

function PublicStation({
  side,
  left,
  onOpen,
}: {
  side: 'A' | 'B';
  left: number;
  onOpen: (step: StepNumber) => void;
}) {
  return (
    <Hotspot
      step={3}
      label={`Public Station ${side}`}
      onOpen={onOpen}
      sx={{ ...hotspotCardSx(left, 83, 160, 116, 49.3), gap: '6px' }}
    >
      <Box sx={cardLabelSx}>Public Station {side}</Box>
      <Box sx={{ position: 'relative', width: 40, height: 40 }}>
        <Image
          src={`${ASSET_ROOT}/user-control.svg`}
          alt=""
          width={28.3751}
          height={28.3334}
          aria-hidden="true"
          style={{ position: 'absolute', left: 5.83, top: 5.83 }}
        />
      </Box>
    </Hotspot>
  );
}

/** Floating label chip on a subpanel's top edge (Figma "Label Chip"). */
function SubpanelLabel({ label }: { label: string }) {
  return (
    <Box
      component="span"
      sx={{
        position: 'absolute',
        left: 17.5,
        top: -18.5,
        px: '10px',
        py: '2px',
        borderRadius: '8px',
        bgcolor: '#cfe6f2',
        color: INK_SOFT,
        fontFamily: SERIF,
        fontSize: 15,
        lineHeight: 'normal',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </Box>
  );
}

const subpanelSx = (
  left: number,
  top: number,
  width: number,
  height: number
): SxProps<Theme> => ({
  position: 'absolute',
  left,
  top,
  width,
  height,
  bgcolor: SUB_FILL,
  border: '2.5px solid #e9eef0',
  borderRadius: '14px',
});

/** Fiber, direction arrows and relay lines, drawn over the cards as in Figma. */
function ConnectionLayer() {
  return (
    <Box
      component="svg"
      viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
      aria-hidden="true"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 2,
        width: DESIGN_WIDTH,
        height: DESIGN_HEIGHT,
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      {[RELAY_PATH_A, RELAY_PATH_B].map((path) => (
        <Box
          component="path"
          key={path}
          d={path}
          sx={{
            fill: 'none',
            stroke: '#9AAAB8',
            strokeWidth: 1.8,
            strokeLinecap: 'round',
            strokeDasharray: '1.5 7',
            animation: `${marchingDashes} 3.4s linear infinite`,
          }}
        />
      ))}
      {FIBER_IMAGES.map(([file, x, y, width, height]) => (
        <image
          key={file}
          href={`${ASSET_ROOT}/${file}`}
          x={x}
          y={y}
          width={width}
          height={height}
          preserveAspectRatio="none"
        />
      ))}
      {FIBER_ARROWS.map(([cx, cy, rotation]) => (
        <image
          key={rotation}
          href={`${ASSET_ROOT}/fiber-arrow.svg`}
          x={-12.9904}
          y={-18.5}
          width={25.9808}
          height={27.75}
          preserveAspectRatio="none"
          transform={`translate(${cx} ${cy}) rotate(${rotation})`}
        />
      ))}
    </Box>
  );
}

export default function MapPage() {
  const router = useRouter();
  const viewportRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hintTimeoutRef = useRef<number | null>(null);
  const lastQuestionIndexRef = useRef(-1);
  const [activeStep, setActiveStep] = useState<StepNumber | null>(null);
  const [fuzzyConversation, setFuzzyConversation] =
    useState<FuzzyConversation | null>(null);
  const [showInteractionHints, setShowInteractionHints] = useState(false);
  const [stageTransform, setStageTransform] = useState(
    'translate(0px, 0px) scale(1)'
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const fitStage = () => {
      const { clientWidth, clientHeight } = viewport;
      const scale = Math.min(
        clientWidth / DESIGN_WIDTH,
        clientHeight / MAP_CONTENT_HEIGHT
      );
      const left = (clientWidth - DESIGN_WIDTH * scale) / 2;
      const top =
        (clientHeight - MAP_CONTENT_HEIGHT * scale) / 2 -
        MAP_CONTENT_TOP * scale;
      setStageTransform(`translate(${left}px, ${top}px) scale(${scale})`);
    };

    const resizeObserver = new ResizeObserver(fitStage);
    resizeObserver.observe(viewport);
    fitStage();
    return () => resizeObserver.disconnect();
  }, []);

  // SMIL animations ignore CSS, so reduced motion pauses every photon and
  // waveplate timeline on the same readable frame.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    const applyMotionPreference = () => {
      stage.querySelectorAll<SVGSVGElement>('svg[data-smil]').forEach((svg) => {
        if (query.matches) {
          svg.pauseAnimations();
          svg.setCurrentTime(REDUCED_MOTION_FRAME_SECONDS);
        } else {
          svg.unpauseAnimations();
        }
      });
    };

    applyMotionPreference();
    query.addEventListener('change', applyMotionPreference);
    return () => query.removeEventListener('change', applyMotionPreference);
  }, []);

  useEffect(
    () => () => {
      if (hintTimeoutRef.current !== null) {
        window.clearTimeout(hintTimeoutRef.current);
      }
    },
    []
  );

  useEffect(() => {
    let showTimer: number | undefined;
    let replyTimer: number | undefined;
    let hideTimer: number | undefined;

    // Alice and Bob stay quiet while a step is open.
    if (activeStep !== null) return;

    const chooseQuestionIndex = () => {
      const questionCount = ssmQuestions.length;
      let nextIndex = Math.floor(Math.random() * questionCount);

      if (questionCount > 1 && nextIndex === lastQuestionIndexRef.current) {
        nextIndex = (nextIndex + 1) % questionCount;
      }

      lastQuestionIndexRef.current = nextIndex;
      return nextIndex;
    };

    const scheduleQuestion = () => {
      const delay =
        FUZZY_QUESTION_MIN_DELAY_MS +
        Math.random() *
          (FUZZY_QUESTION_MAX_DELAY_MS - FUZZY_QUESTION_MIN_DELAY_MS);

      showTimer = window.setTimeout(() => {
        const question = ssmQuestions[chooseQuestionIndex()];
        const speaker: FuzzySpeaker = Math.random() < 0.5 ? 'alice' : 'bob';
        const responder: FuzzySpeaker = speaker === 'alice' ? 'bob' : 'alice';
        const reply = Math.random() < 0.5 ? question.a : question.b;

        setFuzzyConversation({
          speaker,
          kind: 'question',
          text: question.leader_question,
          options: [question.a, question.b],
        });
        replyTimer = window.setTimeout(() => {
          setFuzzyConversation({
            speaker: responder,
            kind: 'reply',
            text: reply,
          });
          hideTimer = window.setTimeout(() => {
            setFuzzyConversation(null);
            scheduleQuestion();
          }, FUZZY_REPLY_VISIBLE_MS);
        }, FUZZY_QUESTION_VISIBLE_MS);
      }, delay);
    };

    scheduleQuestion();

    return () => {
      if (showTimer !== undefined) window.clearTimeout(showTimer);
      if (replyTimer !== undefined) window.clearTimeout(replyTimer);
      if (hideTimer !== undefined) window.clearTimeout(hideTimer);
      // Opening a step (or a Fast Refresh) ends the current exchange.
      setFuzzyConversation(null);
    };
  }, [activeStep]);

  const openStep = useCallback((step: StepNumber) => {
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setShowInteractionHints(false);
    setActiveStep(step);
  }, []);

  // Keys 1-6 open a step from anywhere; arrows move while the dialog is open.
  // Escape is handled by the dialog itself.
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const stepKey = Number(event.key);
      if (stepNumbers.includes(stepKey as StepNumber)) {
        event.preventDefault();
        openStep(stepKey as StepNumber);
        return;
      }
      if (activeStep === null) return;
      if (event.key === 'ArrowLeft' && activeStep > 1) {
        event.preventDefault();
        setActiveStep((activeStep - 1) as StepNumber);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveStep(
          activeStep === stepNumbers.length
            ? 1
            : ((activeStep + 1) as StepNumber)
        );
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeStep, openStep]);

  const handleMissedTap = (event: ReactMouseEvent<HTMLElement>) => {
    if (
      activeStep !== null ||
      !(event.target instanceof Element) ||
      event.target.closest('button, a')
    ) {
      return;
    }

    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
    }

    setShowInteractionHints(true);
    hintTimeoutRef.current = window.setTimeout(() => {
      setShowInteractionHints(false);
      hintTimeoutRef.current = null;
    }, HINT_VISIBLE_MS);
  };

  const getStage = useCallback(() => stageRef.current, []);

  const fuzzyHeading =
    fuzzyConversation?.kind === 'reply'
      ? `${fuzzyConversation.speaker === 'alice' ? 'Alice' : 'Bob'} replies`
      : fuzzyConversation?.speaker === 'alice'
        ? 'Alice asks Bob'
        : 'Bob asks Alice';

  return (
    <Box
      component="main"
      ref={viewportRef}
      aria-label="How the PQN experiment works"
      onClick={handleMissedTap}
      sx={{
        position: 'fixed',
        top: 160,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 1,
        overflow: 'hidden',
        bgcolor: '#fff',
        backgroundImage: 'url(/images/GUI-background.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundSize: '100% 100%',
        color: INK,
        fontFamily: SANS,
        '@media (prefers-reduced-motion: reduce)': {
          '& *, & *::before, & *::after': {
            animation: 'none !important',
            transition: 'none !important',
          },
        },
      }}
    >
      {showInteractionHints && (
        <Box
          role="status"
          aria-live="polite"
          sx={{
            position: 'absolute',
            top: 18,
            left: '50%',
            zIndex: 90,
            px: '18px',
            py: '11px',
            border: '2px solid #ff5f05',
            borderRadius: '999px',
            bgcolor: '#fff',
            boxShadow: '0 8px 24px rgba(13, 36, 54, 0.24)',
            color: INK,
            fontSize: 16,
            fontWeight: 700,
            lineHeight: 1.2,
            pointerEvents: 'none',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            animation: `${hintEntrance} 220ms ease-out both`,
          }}
        >
          Tap a highlighted element to learn more
        </Box>
      )}

      <Box
        ref={stageRef}
        data-hints={showInteractionHints ? 'on' : undefined}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: DESIGN_WIDTH,
          height: DESIGN_HEIGHT,
          transform: stageTransform,
          transformOrigin: 'top left',
          '& *, & *::before, & *::after': { boxSizing: 'border-box' },
          '& .map-hotspot:hover .map-step-badge, & .map-hotspot:focus-visible .map-step-badge':
            {
              bgcolor: '#13294B',
              borderColor: '#13294B',
              color: '#fff',
              transform: 'scale(1.1)',
            },
          '& .map-hotspot:focus-visible': {
            outline: 'none',
            boxShadow: '0 0 0 3px #fff, 0 0 0 6px #1F7AE0',
          },
          '&[data-hints="on"] .map-hotspot': {
            outline: '4px solid rgba(244, 216, 120, 0.68)',
            outlineOffset: '4px',
            animation: `${hintPulse} 1000ms ease-in-out infinite`,
          },
          '&[data-hints="on"] .map-step-badge': {
            borderColor: 'rgba(232, 194, 75, 0.76)',
            bgcolor: 'rgba(244, 216, 120, 0.82)',
            color: INK,
          },
        }}
      >
        <Building
          top={BUILDING_ONE_TOP}
          tag={<strong>Building 1</strong>}
          panelBorderColor="#f2f2f2"
          card={
            <LocationCard
              accent="#e84a27"
              photo={`${ASSET_ROOT}/loomis-lab.png`}
              photoAlt="Loomis Laboratory at the University of Illinois"
              logo={`${ASSET_ROOT}/uiuc-logo.png`}
              logoAlt="University of Illinois Urbana-Champaign"
              logoWidth={134}
              logoHeight={48}
              logoTop={133.93}
              name="Loomis Lab"
              address="1110 W Green St, Urbana, IL"
            />
          }
        >
          <Hotspot
            step={1}
            label="Entangled Photon-Pair Source"
            onOpen={openStep}
            sx={{ ...hotspotCardSx(59, 67, 248, 218), gap: '12px' }}
          >
            <Box sx={cardLabelSx}>{'Entangled Photon-Pair\nSource'}</Box>
            <Stack direction="row" sx={{ alignItems: 'center', height: 80 }}>
              {[0, 0.5].map((delay) => (
                <Box
                  key={delay}
                  sx={{
                    display: 'flex',
                    animation: `${breathe} 3.2s ease-in-out infinite`,
                    animationDelay: `${delay}s`,
                  }}
                >
                  <Image
                    src={`${ASSET_ROOT}/source-orb.png`}
                    alt=""
                    width={74}
                    height={74}
                    aria-hidden="true"
                  />
                </Box>
              ))}
            </Stack>
            <StepBadge step={1} index={0} />
          </Hotspot>

          <WaveplateCard
            side="A"
            left={441}
            top={67}
            badgeIndex={4}
            onOpen={openStep}
          />

          <Hotspot
            step={6}
            label="Detection System"
            onOpen={openStep}
            sx={{ ...hotspotCardSx(766, 64, 248, 218), gap: '14px' }}
          >
            <Box
              sx={{
                ...cardLabelSx,
                display: 'flex',
                alignItems: 'center',
                height: 28,
              }}
            >
              Detection System
            </Box>
            <Image
              src={`${ASSET_ROOT}/detection-system.svg`}
              alt=""
              width={72}
              height={72}
              aria-hidden="true"
            />
            <StepBadge step={6} index={6} />
          </Hotspot>
        </Building>

        <Building
          top={BUILDING_TWO_TOP}
          tag={
            <>
              <strong>Building 2</strong> (You are here!)
            </>
          }
          panelBorderColor="#c9c9c9"
          card={
            <LocationCard
              accent="#1b3a6b"
              photo={`${ASSET_ROOT}/urbana-library.png`}
              photoAlt="The Urbana Free Library"
              logo={`${ASSET_ROOT}/library-logo.png`}
              logoAlt="The Urbana Free Library"
              logoWidth={229}
              logoHeight={24}
              logoTop={157.93}
              name="Urbana Free Library"
              address="210 W Green St, Urbana, IL"
            />
          }
        >
          <Box sx={subpanelSx(607, 42, 346, 266)}>
            <SubpanelLabel label="Network Closet" />
          </Box>

          <Hotspot
            step={3}
            label="Interaction Points"
            onOpen={openStep}
            sx={subpanelSx(38, 43, 393, 265)}
          >
            <SubpanelLabel label="Interaction Points" />
            <StepBadge step={3} index={2} left={182} top={-16} />
          </Hotspot>

          <PublicStation side="A" left={62} onOpen={openStep} />
          <PublicStation side="B" left={252} onOpen={openStep} />

          <WaveplateCard
            side="B"
            left={654}
            top={69}
            badgeIndex={5}
            onOpen={openStep}
          />

          <Hotspot
            step={4}
            label="Digital Relay System"
            onOpen={openStep}
            sx={{
              position: 'absolute',
              left: 98,
              top: 253,
              gap: '8px',
              px: '12px',
              border: '1px solid #08446e',
              borderRadius: '8px',
              bgcolor: '#fff',
              fontFamily: SANS,
            }}
          >
            <RelayEnd label="A" />
            <RelayDivider />
            <Box
              component="span"
              sx={{ color: '#757575', fontSize: 12, whiteSpace: 'nowrap' }}
            >
              Digital Relay System
            </Box>
            <RelayDivider />
            <RelayEnd label="B" />
            <StepBadge step={4} index={3} left={121} top={-25} />
          </Hotspot>
        </Building>

        <ConnectionLayer />
        <PhotonPairAnimation />

        <Hotspot
          step={2}
          label="Optical Fiber"
          onOpen={openStep}
          sx={{
            position: 'absolute',
            left: 809,
            top: 569,
            zIndex: 4,
            px: '14px',
            py: '5px',
            border: '2px solid #08446e',
            borderRadius: '20px',
            bgcolor: '#fff',
            filter: 'drop-shadow(0 3px 4px rgba(13, 36, 54, 0.18))',
            color: INK,
            fontFamily: SERIF,
            fontSize: 15,
            lineHeight: 'normal',
            whiteSpace: 'nowrap',
          }}
        >
          Optical Fiber
          <StepBadge step={2} index={1} />
        </Hotspot>

        {[
          {
            name: 'Alice',
            station: 'A',
            src: 'alice.png',
            left: 634,
            top: 811,
            width: 70.904,
            animation: `${aliceBob} 4.4s ease-in-out infinite`,
          },
          {
            name: 'Bob',
            station: 'B',
            src: 'bob.png',
            left: 977,
            top: 807,
            width: 69.885,
            animation: `${bobBob} 5.1s ease-in-out infinite`,
          },
        ].map((fuzzy) => (
          <Box
            key={fuzzy.name}
            sx={{
              position: 'absolute',
              left: fuzzy.left,
              top: fuzzy.top,
              zIndex: 4,
              display: 'flex',
              transformOrigin: 'center bottom',
              animation: fuzzy.animation,
            }}
          >
            <Image
              src={`${ASSET_ROOT}/${fuzzy.src}`}
              alt={`${fuzzy.name} at Public Station ${fuzzy.station}`}
              width={fuzzy.width}
              height={64}
            />
          </Box>
        ))}

        {fuzzyConversation && fuzzyConversation.text?.trim() && (
          <Box
            component="aside"
            key={`${fuzzyConversation.kind}:${fuzzyConversation.speaker}:${fuzzyConversation.text}`}
            aria-label={fuzzyHeading}
            sx={(() => {
              const isReply = fuzzyConversation.kind === 'reply';
              const isAlice = fuzzyConversation.speaker === 'alice';
              const borderColor = isReply ? '#0186d3' : INK;
              const tailLeft = isAlice ? 153 : 128;
              return {
                position: 'absolute',
                bottom: 290,
                left: isAlice ? 470 : 835,
                zIndex: 5,
                display: 'flex',
                width: 370,
                flexDirection: 'column',
                gap: '7px',
                px: '18px',
                py: '16px',
                border: `2px solid ${borderColor}`,
                borderRadius: '18px',
                bgcolor: 'rgba(255, 255, 255, 0.96)',
                boxShadow: '0 8px 22px rgba(13, 36, 54, 0.2)',
                color: INK,
                fontSize: 16,
                lineHeight: 1.35,
                pointerEvents: 'none',
                animation: `${fuzzyQuestionCycle} ${isReply ? 5 : 9}s ease-in-out both`,
                '&::before, &::after': {
                  content: '""',
                  position: 'absolute',
                  width: 0,
                  height: 0,
                  borderStyle: 'solid',
                },
                '&::before': {
                  bottom: -18,
                  left: tailLeft,
                  borderWidth: '18px 13px 0',
                  borderColor: `${borderColor} transparent transparent`,
                },
                '&::after': {
                  bottom: -14,
                  left: tailLeft + 2,
                  borderWidth: '15px 11px 0',
                  borderColor: '#fff transparent transparent',
                },
              };
            })()}
          >
            <Box
              component="strong"
              sx={{
                color:
                  fuzzyConversation.kind === 'reply' ? '#e84a27' : '#39728e',
                fontSize: 12,
                letterSpacing: '0.08em',
                lineHeight: 1.2,
                textTransform: 'uppercase',
              }}
            >
              {fuzzyHeading}
            </Box>
            <span>
              {fuzzyConversation.text}
              {fuzzyConversation.kind === 'question' &&
                fuzzyConversation.options &&
                ` "${fuzzyConversation.options[0]}" or "${fuzzyConversation.options[1]}"?`}
            </span>
          </Box>
        )}

        <StepDialog
          step={activeStep}
          container={getStage}
          topOffset={MAP_CONTENT_TOP}
          onClose={() => setActiveStep(null)}
          onStepChange={setActiveStep}
        />
      </Box>

      <PageTimeout
        durationMs={MAP_TIMEOUT_MS}
        warningDurationMs={MAP_WARNING_DURATION_MS}
        enabled
        mode="activity"
        onTimeout={() => router.replace('/')}
      />
    </Box>
  );
}
