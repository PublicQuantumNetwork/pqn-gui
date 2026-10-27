'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Box, ButtonBase, Dialog, Stack, useMediaQuery } from '@mui/material';
import { keyframes } from '@mui/material/styles';
import { StepNumber, stepDetails, stepNumbers } from './steps';

export const INK = '#0d2436';
export const INK_SOFT = '#3c5568';
export const SUB_FILL = '#f3f8fb';
export const LIBRARY_BLUE = '#1b3a6b';
export const SANS = 'Inter, Arial, sans-serif';
export const SERIF = "'PP Museum', Georgia, 'Times New Roman', serif";
const ACCENT_GRADIENT = 'linear-gradient(to right, #155f82, #e84a27)';

const cardPop = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
`;

function NavButton({
  label,
  disabled = false,
  onClick,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      sx={{
        px: '20px',
        py: '10px',
        borderRadius: '8px',
        bgcolor: LIBRARY_BLUE,
        color: '#fff',
        fontFamily: SANS,
        fontSize: 15,
        fontWeight: 500,
        '&.Mui-disabled': { bgcolor: '#e4ebef', color: '#999' },
      }}
    >
      {label}
    </ButtonBase>
  );
}

export default function StepDialog({
  step,
  container,
  topOffset,
  onClose,
  onStepChange,
}: {
  step: StepNumber | null;
  /** The scaled stage, so the dialog scales with the map. */
  container: () => HTMLElement | null;
  /** Height of the stage hidden under the header; the dialog centres below it. */
  topOffset: number;
  onClose: () => void;
  onStepChange: (step: StepNumber) => void;
}) {
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  // Keep the last step on screen while the dialog fades out.
  const [shownStep, setShownStep] = useState<StepNumber>(step ?? 1);
  if (step !== null && step !== shownStep) setShownStep(step);
  const detail = stepDetails[shownStep];
  const isLastStep = shownStep === stepNumbers.length;

  return (
    <Dialog
      open={step !== null}
      onClose={onClose}
      container={container}
      disableScrollLock
      transitionDuration={reduceMotion ? 0 : 220}
      aria-labelledby="map-dialog-title"
      sx={{
        position: 'absolute',
        top: topOffset,
        // The stage is letterboxed inside the page; overshoot it so the
        // backdrop dims the whole map area (the page clips the overflow).
        '& .MuiBackdrop-root': {
          position: 'absolute',
          inset: -2000,
          bgcolor: 'rgba(9, 26, 38, 0.62)',
        },
      }}
      slotProps={{
        paper: {
          sx: {
            m: 0,
            width: 1180,
            maxWidth: 'none',
            height: 758,
            maxHeight: 'none',
            flexDirection: 'row',
            bgcolor: 'transparent',
            backgroundImage: 'none',
            boxShadow: 'none',
            borderRadius: 0,
            overflow: 'visible',
            color: INK,
            fontFamily: SANS,
            animation: reduceMotion
              ? 'none'
              : `${cardPop} 0.24s cubic-bezier(0.2, 0.8, 0.3, 1)`,
            '& button:focus-visible': {
              outline: '4px solid #ff5f05',
              outlineOffset: '3px',
            },
          },
        },
      }}
    >
      <Stack
        component="nav"
        aria-label="How it works steps"
        spacing="4px"
        sx={{
          width: 300,
          flexShrink: 0,
          px: '18px',
          py: '28px',
          bgcolor: SUB_FILL,
          border: '1px solid #0186d3',
          borderRadius: '26px 0 0 26px',
          filter: 'drop-shadow(0 20px 25px rgba(9, 26, 38, 0.45))',
        }}
      >
        <Box
          component="p"
          sx={{
            m: 0,
            pb: '14px',
            color: INK_SOFT,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '1.2px',
            textTransform: 'uppercase',
          }}
        >
          How it works
        </Box>
        {stepNumbers.map((stepNumber) => {
          const active = stepNumber === shownStep;
          return (
            <ButtonBase
              key={stepNumber}
              onClick={() => onStepChange(stepNumber)}
              aria-current={active ? 'step' : undefined}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                gap: '12px',
                pl: '10px',
                pr: '12px',
                py: '10px',
                borderRadius: '12px',
                bgcolor: active ? '#cce5f5' : 'transparent',
                color: INK,
                fontFamily: SANS,
                fontSize: 15,
                fontWeight: active ? 700 : 600,
                lineHeight: 1.25,
                textAlign: 'left',
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                  width: 26,
                  height: 26,
                  borderRadius: '13px',
                  bgcolor: '#fff',
                  border: active ? 'none' : '1.5px solid #c7d6de',
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {stepNumber}
              </Box>
              {stepDetails[stepNumber].title}
            </ButtonBase>
          );
        })}
      </Stack>

      <Stack
        component="article"
        sx={{
          width: 880,
          flexShrink: 0,
          bgcolor: '#fff',
          borderRadius: '0 24px 24px 0',
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(9, 26, 38, 0.45)',
        }}
      >
        <Box sx={{ height: 12, flexShrink: 0, background: ACCENT_GRADIENT }} />

        {/* gap, not spacing: the absolutely placed close button comes first. */}
        <Stack
          sx={{
            position: 'relative',
            flex: 1,
            gap: '16px',
            pt: '32px',
            pb: '40px',
            px: '48px',
          }}
        >
          <ButtonBase
            onClick={onClose}
            aria-label="Close how it works"
            autoFocus
            sx={{
              position: 'absolute',
              top: 14,
              left: 788,
              width: 44,
              height: 44,
              borderRadius: '22px',
              bgcolor: SUB_FILL,
              color: INK,
              fontFamily: SANS,
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            <span aria-hidden="true">×</span>
          </ButtonBase>

          <Box
            component="p"
            sx={{
              m: 0,
              color: INK_SOFT,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
            }}
          >
            {detail.kicker}
          </Box>
          <Box
            component="h2"
            id="map-dialog-title"
            sx={{
              m: 0,
              pt: '12px',
              fontFamily: SERIF,
              fontSize: 34,
              fontWeight: 400,
              lineHeight: 'normal',
            }}
          >
            {detail.title}
          </Box>

          <Stack component="figure" spacing="8px" sx={{ m: 0 }}>
            <Box
              sx={{
                position: 'relative',
                height: 280,
                borderRadius: '14px',
                overflow: 'hidden',
                background: ACCENT_GRADIENT,
              }}
            >
              {detail.image && (
                <Image
                  src={detail.image}
                  alt={detail.imageAlt ?? ''}
                  fill
                  sizes="784px"
                  style={{
                    objectFit: 'cover',
                    objectPosition: detail.imagePosition,
                  }}
                  priority
                />
              )}
            </Box>
            {detail.caption && (
              <Box
                component="figcaption"
                sx={{
                  color: INK_SOFT,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.4px',
                }}
              >
                {detail.caption}
              </Box>
            )}
          </Stack>

          <Stack
            spacing="16px"
            sx={{ py: '16px', fontSize: 20, lineHeight: 1.45 }}
          >
            <Box component="p" sx={{ m: 0, fontWeight: 600 }}>
              {detail.summary}
            </Box>
            <Box component="p" sx={{ m: 0 }}>
              {detail.description}
            </Box>
          </Stack>
        </Stack>

        <Stack
          component="footer"
          direction="row"
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            p: '20px',
            borderTop: '1px solid #d0d0d0',
          }}
        >
          <NavButton
            label="Previous Step"
            disabled={shownStep === 1}
            onClick={() => onStepChange((shownStep - 1) as StepNumber)}
          />
          <NavButton
            label={isLastStep ? 'Return to Beginning' : 'Next Step'}
            onClick={() =>
              onStepChange(isLastStep ? 1 : ((shownStep + 1) as StepNumber))
            }
          />
        </Stack>
      </Stack>
    </Dialog>
  );
}
