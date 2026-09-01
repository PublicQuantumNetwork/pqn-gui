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
  return (
    <span className={styles.waveplateIcon} aria-hidden="true">
      <Image
        className={styles.polarizerImage}
        src={`${ASSET_ROOT}/polarizing-filter.png`}
        alt=""
        width={41}
        height={51}
      />
      <Image
        className={styles.waveplateImage}
        src={`${ASSET_ROOT}/half-wave-plate.png`}
        alt=""
        width={45}
        height={51}
      />
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
