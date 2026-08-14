'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, ButtonBase, Stack, Typography } from '@mui/material';
import { keyframes } from '@mui/material/styles';

export type PageTimeoutMode = 'absolute' | 'activity';

export interface PageTimeoutProps {
  durationMs: number;
  warningDurationMs: number;
  enabled: boolean;
  mode: PageTimeoutMode;
  onTimeout: () => void;
}

type ActivePageTimeoutProps = Omit<PageTimeoutProps, 'enabled'>;

const RING_RADIUS = 58;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const enter = keyframes`
  from {
    opacity: 0;
    transform: translate3d(24px, 16px, 0) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1);
  }
`;

const drawAttention = keyframes`
  0%, 72%, 100% { transform: rotate(0deg) scale(1); }
  78% { transform: rotate(-2deg) scale(1.03); }
  84% { transform: rotate(2deg) scale(1.03); }
  90% { transform: rotate(0deg) scale(1); }
`;

const drainRing = keyframes`
  from { stroke-dashoffset: 0; }
  to { stroke-dashoffset: ${RING_CIRCUMFERENCE}; }
`;

export default function PageTimeout({
  durationMs,
  warningDurationMs,
  enabled,
  mode,
  onTimeout,
}: PageTimeoutProps) {
  if (!enabled) return null;

  return (
    <ActivePageTimeout
      key={`${durationMs}:${warningDurationMs}:${mode}`}
      durationMs={durationMs}
      warningDurationMs={warningDurationMs}
      mode={mode}
      onTimeout={onTimeout}
    />
  );
}

function ActivePageTimeout({
  durationMs,
  warningDurationMs,
  mode,
  onTimeout,
}: ActivePageTimeoutProps) {
  const [warningVisible, setWarningVisible] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [timerCycle, setTimerCycle] = useState(0);
  const warningVisibleRef = useRef(false);
  const warningButtonRef = useRef<HTMLButtonElement>(null);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const acknowledgeWarning = useCallback(() => {
    if (!warningVisibleRef.current) return;

    warningVisibleRef.current = false;
    setWarningVisible(false);
    setTimerCycle((cycle) => cycle + 1);
  }, []);

  useEffect(() => {
    const pageDuration = Math.max(0, durationMs);
    const warningDuration = Math.max(0, warningDurationMs);
    let pageTimer: number | undefined;
    let warningTimer: number | undefined;
    let countdownTimer: number | undefined;

    const clearWarningTimers = () => {
      if (warningTimer !== undefined) window.clearTimeout(warningTimer);
      if (countdownTimer !== undefined) window.clearInterval(countdownTimer);
    };

    const showWarning = () => {
      const warningDeadline = Date.now() + warningDuration;

      warningVisibleRef.current = true;
      setWarningVisible(true);

      const updateCountdown = () => {
        const remainingMs = Math.max(0, warningDeadline - Date.now());
        setSecondsRemaining(Math.ceil(remainingMs / 1000));
      };

      updateCountdown();
      countdownTimer = window.setInterval(updateCountdown, 250);
      warningTimer = window.setTimeout(() => {
        clearWarningTimers();
        warningVisibleRef.current = false;
        setWarningVisible(false);
        setSecondsRemaining(0);
        onTimeoutRef.current();
      }, warningDuration);
    };

    const startPageTimer = () => {
      if (pageTimer !== undefined) window.clearTimeout(pageTimer);
      pageTimer = window.setTimeout(showWarning, pageDuration);
    };

    const handleActivity = () => {
      if (warningVisibleRef.current) acknowledgeWarning();
      else startPageTimer();
    };

    startPageTimer();

    if (mode === 'activity') {
      window.addEventListener('pointerdown', handleActivity, true);
      window.addEventListener('keydown', handleActivity, true);
      window.addEventListener('wheel', handleActivity, true);
    }

    return () => {
      if (pageTimer !== undefined) window.clearTimeout(pageTimer);
      clearWarningTimers();
      window.removeEventListener('pointerdown', handleActivity, true);
      window.removeEventListener('keydown', handleActivity, true);
      window.removeEventListener('wheel', handleActivity, true);
    };
  }, [acknowledgeWarning, durationMs, mode, timerCycle, warningDurationMs]);

  useEffect(() => {
    if (!warningVisible) return;

    warningButtonRef.current?.focus();

    if (mode === 'activity') return;

    const handleEnter = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;

      event.preventDefault();
      event.stopImmediatePropagation();
      acknowledgeWarning();
    };

    window.addEventListener('keydown', handleEnter, true);
    return () => window.removeEventListener('keydown', handleEnter, true);
  }, [acknowledgeWarning, mode, warningVisible]);

  if (!warningVisible) return null;

  const keepGoingInstruction =
    mode === 'activity'
      ? 'Touch anywhere or press the red button to keep going.'
      : 'Press the red button or tap me to keep going.';

  return (
    <ButtonBase
      ref={warningButtonRef}
      onClick={acknowledgeWarning}
      aria-label={`Still there? ${secondsRemaining} seconds remaining. ${keepGoingInstruction}`}
      sx={(theme) => ({
        position: 'fixed',
        right: 32,
        bottom: 32,
        zIndex: theme.zIndex.tooltip,
        width: 'min(470px, calc(100vw - 48px))',
        p: 2,
        border: `4px solid ${theme.palette.error.main}`,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        boxShadow: theme.shadows[12],
        color: theme.palette.text.primary,
        textAlign: 'left',
        animation: `${enter} 280ms ease-out`,
        '&:focus-visible': {
          outline: `6px solid ${theme.palette.warning.main}`,
          outlineOffset: 4,
        },
      })}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            position: 'relative',
            width: 132,
            height: 132,
            flex: '0 0 132px',
            display: 'grid',
            placeItems: 'center',
            animation: `${drawAttention} 3.2s ease-in-out infinite`,
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          <Box
            component="svg"
            viewBox="0 0 132 132"
            aria-hidden="true"
            sx={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="66"
              cy="66"
              r={RING_RADIUS}
              fill="none"
              stroke="#e0e0e0"
              strokeWidth="9"
            />
            <Box
              component="circle"
              key={timerCycle}
              cx="66"
              cy="66"
              r={RING_RADIUS}
              fill="none"
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              sx={{
                stroke: 'error.main',
                animation: `${drainRing} ${Math.max(
                  0,
                  warningDurationMs
                )}ms linear forwards`,
              }}
            />
          </Box>
          <Box
            component="img"
            src="/images/purple-fuzzy.svg"
            alt=""
            sx={{ width: 94, height: 94, objectFit: 'contain' }}
          />
        </Box>

        <Stack spacing={0.75}>
          <Typography component="span" variant="h5" fontWeight={800}>
            Still there?
          </Typography>
          <Typography component="span" variant="body1" fontWeight={600}>
            {keepGoingInstruction}
          </Typography>
          <Typography
            component="span"
            variant="h6"
            color="error.main"
            fontWeight={800}
            aria-live="polite"
            aria-atomic="true"
          >
            {secondsRemaining} seconds remaining
          </Typography>
        </Stack>
      </Stack>
    </ButtonBase>
  );
}
