'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  CSSProperties,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import ssmQuestions from '@/app/ssm/page3/questions';
import PageTimeout from '@/components/PageTimeout';
import styles from './map.module.css';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;
const MAP_CONTENT_TOP = 110;
const MAP_CONTENT_HEIGHT = DESIGN_HEIGHT - MAP_CONTENT_TOP;
const ASSET_ROOT = '/images/interactive-map';
const MAP_TIMEOUT_MS = 5 * 60 * 1000;
const MAP_WARNING_DURATION_MS = 30 * 1000;
const FUZZY_QUESTION_MIN_DELAY_MS = 12 * 1000;
const FUZZY_QUESTION_MAX_DELAY_MS = 20 * 1000;
const FUZZY_QUESTION_VISIBLE_MS = 9 * 1000;
const FUZZY_REPLY_VISIBLE_MS = 5 * 1000;
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
const LAB_COLLAPSE_AT = 0.66;
const LIBRARY_COLLAPSE_AT = 0.64;
const COLLAPSE_HALF_WINDOW = 0.02;

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
 */
function waveplateDialTiming() {
  const outcomeCount = POLARIZATION_OUTCOMES_DEGREES.length;
  const keyTimes: number[] = [];
  const values: number[] = [];
  POLARIZATION_OUTCOMES_DEGREES.forEach((angle, i) => {
    keyTimes.push(i / outcomeCount, (i + TRIP_FADE_OUT) / outcomeCount);
    values.push(angle, angle);
  });
  keyTimes.push(1);
  values.push(POLARIZATION_OUTCOMES_DEGREES[0] + 180);
  return {
    cycleDur: `${PHOTON_CYCLE_DURATION_SECONDS}s`,
    keyTimes: keyTimes.join(';'),
    values: values.join(';'),
  };
}

const LAB_PHOTON_PATH = 'M 783 359 L 1367 359';
// Traced from optical-fiber-b1.svg (placed at 780,506, 472x307) and
// optical-fiber-b2.svg (placed at 1489,467, 161x349). The loop is the
// centreline between the ribbon's two edges, entered straight through the
// self-crossing, up the right side, over the top and down the left.
const LIBRARY_PHOTON_PATH = [
  'M 783 359',
  'L 787.0 508.0',
  'C 787.0 522.8 789.5 534.4 793.8 543.8',
  'C 798.1 553.2 804.3 560.6 812.0 566.8',
  'C 819.6 573.0 828.7 578.2 838.7 583.2',
  'C 843.7 585.7 849.0 588.2 854.4 590.7',
  'C 859.8 593.3 865.3 596.0 871.0 598.8',
  'C 883.0 605.0 899.3 608.8 917.7 611.0',
  'C 936.0 613.1 956.2 613.4 975.8 612.5',
  'C 1002.2 611.4 1027.6 608.1 1049.8 606.5',
  'C 1058.8 604.6 1064.3 603.0 1068.3 601.5',
  'C 1084.8 595.3 1096.2 580.6 1097.8 567.6',
  'C 1098.6 561.0 1096.9 554.9 1092.2 550.4',
  'C 1087.5 545.9 1079.7 543.0 1068.3 543.0',
  'C 1061.2 543.1 1056.0 547.3 1052.6 554.4',
  'C 1049.1 561.7 1047.4 572.1 1047.5 584.6',
  'C 1047.6 590.5 1048.0 596.9 1049.8 606.5',
  'C 1055.9 629.1 1062.5 651.9 1072.8 674.8',
  'C 1102.2 740.8 1160.9 806.0 1250.0 806.0',
  'L 1507.5 808.0',
  'C 1546.5 808.0 1575.0 799.9 1595.5 787.1',
  'C 1616.0 774.3 1628.6 756.8 1635.4 737.7',
  'C 1649.2 699.1 1639.5 653.6 1622.4 627.1',
  'C 1615.0 615.7 1603.3 605.1 1589.6 594.2',
  'C 1582.7 588.8 1575.4 583.4 1568.0 577.8',
  'C 1560.6 572.2 1553.0 566.5 1545.7 560.6',
  'C 1516.5 537.0 1490.0 508.9 1490.0 469.0',
].join(' ');

type StepNumber = 1 | 2 | 3 | 4 | 5;
type FuzzySpeaker = 'alice' | 'bob';

type FuzzyConversation = {
  speaker: FuzzySpeaker;
  kind: 'question' | 'reply';
  text: string;
  options?: [string, string];
};

type StepDetail = {
  kicker: string;
  title: string;
  image: string;
  imageAlt: string;
  imagePosition?: string;
  caption?: string;
  summary: string;
  description: string;
};

const stepDetails: Record<StepNumber, StepDetail> = {
  1: {
    kicker: 'ON THE LAB SIDE',
    title: 'Entangled Photon-Pair Source',
    image: `${ASSET_ROOT}/step-1-source.png`,
    imageAlt: 'Entangled photon-pair source optical equipment',
    summary:
      'A pair of photons is born. All it took was a laser and some glass.',
    description:
      'A laser goes through a polarizer and enters the source, where photon pairs are created in an entangled state of |HH⟩+|VV⟩.',
  },
  2: {
    kicker: 'IN AND BETWEEN BOTH BUILDINGS',
    title: 'Optical Fiber',
    image: `${ASSET_ROOT}/step-2-optical-fiber.png`,
    imageAlt: 'Optical fiber equipment connecting the experiment',
    imagePosition: 'center bottom',
    summary:
      'The pair is separated at birth and sent to different destinations.',
    description:
      'A dichroic mirror splits the pairs, and each photon goes through optical fiber to its destination.',
  },
  3: {
    kicker: 'AT THE LIBRARY',
    title: 'Interaction Points',
    image: `${ASSET_ROOT}/step-3-interaction-points.png`,
    imageAlt: 'A visitor turning the interaction point rotator',
    summary: "The photons' fates are in your hands!",
    description:
      'At your location there is accessible equipment that remotely controls what the photons will experience next.',
  },
  4: {
    kicker: 'AT EACH BUILDING',
    title: 'Half-waveplate and Polarizer',
    image: `${ASSET_ROOT}/step-4-waveplate-polarizer.png`,
    imageAlt: 'Half-waveplate and polarizer rotation mounts',
    imagePosition: 'center 65%',
    caption:
      'Stand-in photo of the half-waveplate rotation mount — final photography pending',
    summary:
      'When the photons arrive, they are prepared by an outside power (you!) to answer a yes/no question.',
    description:
      'Each photon goes through a user-controlled half-waveplate which prepares the photons to be offered a polarization state using the polarizers.',
  },
  5: {
    kicker: 'ON THE LAB SIDE',
    title: 'Detection System',
    image: `${ASSET_ROOT}/step-5-detection-system.png`,
    imageAlt: 'Photon detection system equipment',
    imagePosition: 'center 31%',
    summary:
      'Their choices made, the pair of photons are seen for what they are.',
    description:
      'They enter very sensitive light detectors and their time of arrival is recorded. Because they were born at the same time, their arrival times are coincident.',
  },
};

const stepNumbers: StepNumber[] = [1, 2, 3, 4, 5];

function StepBadge({ step }: { step: StepNumber }) {
  return <span className={styles.stepBadge}>{step}</span>;
}

const POLARIZATION_ARROW_PATH =
  'M -14 0 L 14 0 M 8 -6 L 14 0 L 8 6 M -8 -6 L -14 0 L -8 6';

/** Double-headed arrow marking a polarization axis (an axis, not a direction). */
function PolarizationArrow({ transform }: { transform?: string }) {
  return (
    <g transform={transform}>
      <path
        className={styles.polarizationOutline}
        d={POLARIZATION_ARROW_PATH}
      />
      <path className={styles.polarizationStroke} d={POLARIZATION_ARROW_PATH} />
    </g>
  );
}

function TravelingPhoton({
  className,
  path,
  collapseAt,
}: {
  className: string;
  path: string;
  collapseAt: number;
}) {
  const { tripDur, cycleDur, outcomeKeyTimes, outcomeValues } =
    polarizationTiming();
  const collapseStart = collapseAt - COLLAPSE_HALF_WINDOW;
  const collapseEnd = collapseAt + COLLAPSE_HALF_WINDOW;

  return (
    <g className={className}>
      <circle className={styles.photonHalo} r="15">
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

function PhotonPairAnimation() {
  return (
    <svg
      className={styles.photonLayer}
      viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <TravelingPhoton
        className={styles.labPhoton}
        path={LAB_PHOTON_PATH}
        collapseAt={LAB_COLLAPSE_AT}
      />
      <TravelingPhoton
        className={styles.libraryPhoton}
        path={LIBRARY_PHOTON_PATH}
        collapseAt={LIBRARY_COLLAPSE_AT}
      />
    </svg>
  );
}

function LocationCard({
  accent,
  photo,
  photoAlt,
  logo,
  logoAlt,
  logoClassName,
  name,
  address,
}: {
  accent: string;
  photo: string;
  photoAlt: string;
  logo: string;
  logoAlt: string;
  logoClassName: string;
  name: string;
  address: string;
}) {
  return (
    <section className={styles.locationCard}>
      <span className={styles.locationAccent} style={{ background: accent }} />
      <div className={styles.locationBody}>
        <div className={styles.locationPhoto}>
          <Image src={photo} alt={photoAlt} fill sizes="346px" priority />
          <div className={`${styles.locationLogo} ${logoClassName}`}>
            <Image src={logo} alt={logoAlt} fill sizes="229px" />
          </div>
        </div>
        <div className={styles.locationDetails}>
          <Image
            src={`${ASSET_ROOT}/map-pin.svg`}
            alt=""
            width={28}
            height={28}
            aria-hidden="true"
          />
          <div>
            <h2>{name}</h2>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WaveplateIcon() {
  const { cycleDur, keyTimes, values } = waveplateDialTiming();
  return (
    <span className={styles.waveplateIcon} aria-hidden="true">
      <svg
        className={styles.waveplateImage}
        viewBox="0 0 26 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
          The whole plate turns to the outcome the photon will collapse to,
          like a rotation mount. Rotation is about the plate centre.
        */}
        <g transform="translate(13 29)">
          <g>
            <g transform="translate(-13 -29)">
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
              <g
                className={styles.waveplateDial}
                transform="matrix(1 -0.8278 0 1 16.73 28.66)"
              >
                <circle className={styles.waveplateDialRing} r="6.5" />
                <line className={styles.waveplateDialAxis} x1="-7" x2="7" />
              </g>
            </g>
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
      </svg>
    </span>
  );
}

function WaveplateHotspot({
  className,
  label,
  onSelect,
}: {
  className: string;
  label: string;
  onSelect: () => void;
}) {
  return (
    <button
      className={`${styles.hotspot} ${styles.largeHotspot} ${styles.waveplateHotspot} ${className}`}
      type="button"
      onClick={onSelect}
      aria-label={`Step 4: ${label}`}
    >
      <span className={styles.waveplateContent}>
        <WaveplateIcon />
        <span>{label}</span>
      </span>
      <Image
        className={styles.deviceLine}
        src={`${ASSET_ROOT}/device-line.svg`}
        alt=""
        width={224}
        height={4}
        aria-hidden="true"
      />
      <Image
        className={styles.waveplateAntenna}
        src={`${ASSET_ROOT}/antenna.svg`}
        alt=""
        width={34}
        height={34}
        aria-hidden="true"
      />
      <StepBadge step={4} />
    </button>
  );
}

function MapDialog({
  step,
  onClose,
  onStepChange,
}: {
  step: StepNumber;
  onClose: () => void;
  onStepChange: (step: StepNumber) => void;
}) {
  const detail = stepDetails[step];

  return (
    <div className={styles.dialogBackdrop} onClick={onClose}>
      <section
        className={styles.dialogShell}
        role="dialog"
        aria-modal="true"
        aria-labelledby="map-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <nav className={styles.dialogSidebar} aria-label="How it works steps">
          <p className={styles.sidebarLabel}>How it works</p>
          <ol className={styles.stepList}>
            {stepNumbers.map((stepNumber) => (
              <li key={stepNumber}>
                <button
                  className={stepNumber === step ? styles.activeStep : ''}
                  type="button"
                  onClick={() => onStepChange(stepNumber)}
                  aria-current={stepNumber === step ? 'step' : undefined}
                >
                  <span>{stepNumber}</span>
                  {stepDetails[stepNumber].title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className={styles.dialogCard}>
          <div className={styles.dialogAccent} aria-hidden="true" />
          <button
            className={styles.dialogClose}
            type="button"
            onClick={onClose}
            aria-label="Close how it works"
            autoFocus
          >
            <span aria-hidden="true">×</span>
          </button>

          <div className={styles.dialogContent}>
            <p className={styles.dialogKicker}>{detail.kicker}</p>
            <h2 id="map-dialog-title">{detail.title}</h2>
            <figure className={styles.dialogFigure}>
              <div className={styles.dialogPhoto}>
                <Image
                  src={detail.image}
                  alt={detail.imageAlt}
                  fill
                  sizes="784px"
                  style={{ objectPosition: detail.imagePosition }}
                  priority
                />
              </div>
              {detail.caption && <figcaption>{detail.caption}</figcaption>}
            </figure>
            <p className={styles.dialogSummary}>{detail.summary}</p>
            <p className={styles.dialogDescription}>{detail.description}</p>
          </div>

          <footer className={styles.dialogFooter}>
            <button
              className={styles.previousButton}
              type="button"
              onClick={() => onStepChange((step - 1) as StepNumber)}
              disabled={step === 1}
            >
              <span aria-hidden="true">←</span> Previous
            </button>
            <button
              className={styles.nextButton}
              type="button"
              onClick={() =>
                onStepChange(step === 5 ? 1 : ((step + 1) as StepNumber))
              }
            >
              {step === 5 ? 'Return to Beginning' : 'Next'}
              <span aria-hidden="true">→</span>
            </button>
          </footer>
        </article>
      </section>
    </div>
  );
}

export default function MapPage() {
  const router = useRouter();
  const viewportRef = useRef<HTMLElement>(null);
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

  useEffect(() => {
    if (activeStep === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveStep(null);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [activeStep]);

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

    if (activeStep !== null) {
      setFuzzyConversation(null);
      return;
    }

    // Fast Refresh can preserve a conversation object from an older state
    // shape. Clear it before scheduling the next complete exchange.
    setFuzzyConversation(null);

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
    };
  }, [activeStep]);

  const clearInteractionHints = () => {
    if (hintTimeoutRef.current !== null) {
      window.clearTimeout(hintTimeoutRef.current);
      hintTimeoutRef.current = null;
    }
    setShowInteractionHints(false);
  };

  const openStep = (step: StepNumber) => {
    clearInteractionHints();
    setActiveStep(step);
  };

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
    }, 2600);
  };

  const stageStyle = { transform: stageTransform } as CSSProperties;

  return (
    <main
      ref={viewportRef}
      className={styles.viewport}
      aria-label="How the PQN experiment works"
      onClick={handleMissedTap}
    >
      {showInteractionHints && (
        <div className={styles.touchHint} role="status" aria-live="polite">
          Tap a highlighted element to learn more
        </div>
      )}

      <div
        className={`${styles.stage} ${
          showInteractionHints ? styles.showHints : ''
        }`}
        style={stageStyle}
      >
        <section className={`${styles.building} ${styles.buildingOne}`}>
          <div className={styles.buildingLabel}>Building 1</div>
          <div className={styles.station}>
            <LocationCard
              accent="#e84a27"
              photo={`${ASSET_ROOT}/loomis-lab.png`}
              photoAlt="Loomis Laboratory at the University of Illinois"
              logo={`${ASSET_ROOT}/uiuc-logo.png`}
              logoAlt="University of Illinois Urbana-Champaign"
              logoClassName={styles.uiucLogo}
              name="Loomis Lab"
              address="1110 W Green St, Urbana, IL"
            />

            <div className={`${styles.stationContent} ${styles.loomisContent}`}>
              <button
                className={`${styles.hotspot} ${styles.largeHotspot} ${styles.sourceHotspot}`}
                type="button"
                onClick={() => openStep(1)}
                aria-label="Step 1: Entangled photon-pair source"
              >
                <Image
                  src={`${ASSET_ROOT}/photon-source.png`}
                  alt=""
                  width={106}
                  height={106}
                  aria-hidden="true"
                />
                <span>Entangled Photon-Pair Source</span>
                <StepBadge step={1} />
              </button>

              <div
                className={`${styles.connectorGraphic} ${styles.fiberA1}`}
                aria-hidden="true"
              >
                <Image
                  src={`${ASSET_ROOT}/optical-fiber-a1.svg`}
                  alt=""
                  fill
                  sizes="95px"
                />
              </div>
              <Image
                className={styles.arrowRight}
                src={`${ASSET_ROOT}/arrow-right.svg`}
                alt=""
                width={30}
                height={37}
                aria-hidden="true"
              />

              <WaveplateHotspot
                className={styles.waveplateA}
                label={'Half-waveplate A /\nPolarizer A'}
                onSelect={() => openStep(4)}
              />

              <div
                className={`${styles.connectorGraphic} ${styles.fiberA2}`}
                aria-hidden="true"
              >
                <Image
                  src={`${ASSET_ROOT}/optical-fiber-a2.svg`}
                  alt=""
                  fill
                  sizes="73px"
                />
              </div>

              <button
                className={`${styles.hotspot} ${styles.largeHotspot} ${styles.detectorHotspot}`}
                type="button"
                onClick={() => openStep(5)}
                aria-label="Step 5: Detection system"
              >
                <Image
                  src={`${ASSET_ROOT}/radar.svg`}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
                <span>Detection System</span>
                <StepBadge step={5} />
              </button>

              <Image
                className={styles.arrowDown}
                src={`${ASSET_ROOT}/arrow-down.svg`}
                alt=""
                width={30}
                height={37}
                aria-hidden="true"
              />
            </div>
          </div>
        </section>

        <section className={`${styles.building} ${styles.buildingTwo}`}>
          <div className={styles.buildingLabel}>
            <strong>Building 2</strong> <span>(You are here!)</span>
          </div>
          <div className={styles.station}>
            <LocationCard
              accent="#1b3a6b"
              photo={`${ASSET_ROOT}/urbana-library.png`}
              photoAlt="The Urbana Free Library"
              logo={`${ASSET_ROOT}/library-logo.png`}
              logoAlt="The Urbana Free Library"
              logoClassName={styles.libraryLogo}
              name="Urbana Free Library"
              address="210 W Green St, Urbana, IL"
            />

            <div
              className={`${styles.stationContent} ${styles.libraryContent}`}
            >
              <div className={`${styles.subpanel} ${styles.interactionPanel}`}>
                <span className={styles.subpanelLabel}>Interaction Points</span>
              </div>
              <button
                className={`${styles.stepOnlyButton} ${styles.interactionBadge}`}
                type="button"
                onClick={() => openStep(3)}
                aria-label="Step 3: Interaction points"
              >
                <StepBadge step={3} />
              </button>

              <button
                className={`${styles.hotspot} ${styles.publicStation} ${styles.publicStationA}`}
                type="button"
                onClick={() => openStep(3)}
                aria-label="Step 3: Public Station A"
              >
                <Image
                  src={`${ASSET_ROOT}/user-control.svg`}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
                <span>Public Station A</span>
              </button>

              <button
                className={`${styles.hotspot} ${styles.publicStation} ${styles.publicStationB}`}
                type="button"
                onClick={() => openStep(3)}
                aria-label="Step 3: Public Station B"
              >
                <Image
                  src={`${ASSET_ROOT}/user-control.svg`}
                  alt=""
                  width={40}
                  height={40}
                  aria-hidden="true"
                />
                <span>Public Station B</span>
              </button>

              <button
                className={styles.digitalRelay}
                type="button"
                onClick={() => openStep(3)}
                aria-label="Step 3: Digital relay system"
              >
                <span>Digital Relay System</span>
                <Image
                  className={styles.relayDivider}
                  src={`${ASSET_ROOT}/relay-line.svg`}
                  alt=""
                  width={32}
                  height={2}
                  aria-hidden="true"
                />
                <Image
                  className={styles.relayAntenna}
                  src={`${ASSET_ROOT}/antenna.svg`}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </button>

              <div className={`${styles.subpanel} ${styles.networkPanel}`}>
                <span className={styles.subpanelLabel}>Network Closet</span>
              </div>

              <WaveplateHotspot
                className={styles.waveplateB}
                label={'Half-waveplate B /\nPolarizer B'}
                onSelect={() => openStep(4)}
              />

              <Image
                className={styles.digitalRelayB}
                src={`${ASSET_ROOT}/digital-relay-b.svg`}
                alt=""
                width={428}
                height={68}
                aria-hidden="true"
              />
              <Image
                className={styles.digitalRelayA}
                src={`${ASSET_ROOT}/digital-relay-a.svg`}
                alt=""
                width={742}
                height={594}
                aria-hidden="true"
              />
              <div
                className={`${styles.connectorGraphic} ${styles.fiberB2}`}
                aria-hidden="true"
              >
                <Image
                  src={`${ASSET_ROOT}/optical-fiber-b2.svg`}
                  alt=""
                  fill
                  sizes="157px"
                />
              </div>
            </div>
          </div>
        </section>

        <div
          className={`${styles.connectorGraphic} ${styles.fiberB1}`}
          aria-hidden="true"
        >
          <Image
            src={`${ASSET_ROOT}/optical-fiber-b1.svg`}
            alt=""
            fill
            sizes="468px"
            priority
          />
        </div>

        <PhotonPairAnimation />

        <button
          className={styles.fiberLabel}
          type="button"
          onClick={() => openStep(2)}
          aria-label="Step 2: Optical fiber"
        >
          Optical Fiber
          <StepBadge step={2} />
        </button>

        <Image
          className={styles.alice}
          src="/images/purple-fuzzy.svg"
          alt="Alice at Public Station A"
          width={63}
          height={59}
        />
        <Image
          className={styles.bob}
          src={`${ASSET_ROOT}/bob.svg`}
          alt="Bob at Public Station B"
          width={63}
          height={59}
        />

        {fuzzyConversation && fuzzyConversation.text?.trim() && (
          <aside
            key={`${fuzzyConversation.kind}:${fuzzyConversation.speaker}:${fuzzyConversation.text}`}
            className={`${styles.fuzzyQuestion} ${
              fuzzyConversation.speaker === 'alice'
                ? styles.aliceQuestion
                : styles.bobQuestion
            } ${fuzzyConversation.kind === 'reply' ? styles.fuzzyReply : ''}`}
            aria-label={
              fuzzyConversation.kind === 'reply'
                ? `${fuzzyConversation.speaker === 'alice' ? 'Alice' : 'Bob'} replies`
                : fuzzyConversation.speaker === 'alice'
                  ? 'Alice asks Bob'
                  : 'Bob asks Alice'
            }
          >
            <strong>
              {fuzzyConversation.kind === 'reply'
                ? `${fuzzyConversation.speaker === 'alice' ? 'Alice' : 'Bob'} replies`
                : fuzzyConversation.speaker === 'alice'
                  ? 'Alice asks Bob'
                  : 'Bob asks Alice'}
            </strong>
            <span>
              {fuzzyConversation.text}
              {fuzzyConversation.kind === 'question' &&
                fuzzyConversation.options &&
                ` "${fuzzyConversation.options[0]}" or "${fuzzyConversation.options[1]}"?`}
            </span>
          </aside>
        )}

        {activeStep !== null && (
          <MapDialog
            step={activeStep}
            onClose={() => setActiveStep(null)}
            onStepChange={setActiveStep}
          />
        )}
      </div>

      <PageTimeout
        durationMs={MAP_TIMEOUT_MS}
        warningDurationMs={MAP_WARNING_DURATION_MS}
        enabled
        mode="activity"
        onTimeout={() => router.replace('/')}
      />
    </main>
  );
}
