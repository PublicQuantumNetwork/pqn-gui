'use client';
import { useEffect, useState, useRef } from 'react';
import Container from '@mui/material/Container';
import {
  Box,
  Dialog,
  DialogContent,
  Stack,
  Button,
  Snackbar,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useRouter } from 'next/navigation';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';
import { submitQKDEmoji } from '@/calls';
import Whobit from '@/components/Whobit';

export default function Home() {
  const router = useRouter();
  const [emojiText, setEmojiText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [emojiSentError, setEmojiSentError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEnterKey(() => {
    handleNextPageCheck();
  });

  // Setup drag-to-scroll for the emoji picker's scrollable area
  useEffect(() => {
    console.log(
      'Effect running. pickerOpen:',
      pickerOpen,
      'dialogRef.current:',
      !!dialogRef.current
    );
    if (!pickerOpen) return;

    let cleanupFn: (() => void) | null = null;
    let attempts = 0;
    const maxAttempts = 20;

    // Poll for the dialog and emoji body to be ready
    const intervalId = setInterval(() => {
      attempts++;
      console.log(`Attempt ${attempts}: Looking for dialog and .epr-body`);

      if (!dialogRef.current) {
        console.log('dialogRef.current is null, waiting...');
        if (attempts >= maxAttempts) {
          console.error(
            'Failed to find dialogRef after',
            maxAttempts,
            'attempts'
          );
          clearInterval(intervalId);
        }
        return;
      }

      const emojiBody = dialogRef.current.querySelector(
        '.epr-body'
      ) as HTMLElement;
      console.log('EmojiPicker body found:', !!emojiBody);

      if (!emojiBody) {
        console.log('epr-body not found yet, waiting...');
        if (attempts >= maxAttempts) {
          console.error(
            'Failed to find .epr-body after',
            maxAttempts,
            'attempts'
          );
          clearInterval(intervalId);
        }
        return;
      }

      // Success! Found both the dialog and the emoji body
      console.log('Successfully found .epr-body, attaching event listeners');
      clearInterval(intervalId);

      let isDragging = false;
      let hasMoved = false;
      let startY = 0;
      let startX = 0;
      let scrollTop = 0;
      const dragThreshold = 5; // pixels - if user moves more than this, it's a drag

      const handlePointerDown = (e: PointerEvent) => {
        console.log('PointerDown event fired', e.pointerType, e.button);
        if (e.button !== 0) return; // Only left click

        isDragging = true;
        hasMoved = false;
        startY = e.pageY;
        startX = e.pageX;
        scrollTop = emojiBody.scrollTop;
        // Don't capture pointer - let events propagate normally
      };

      const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging) return;

        const deltaY = Math.abs(e.pageY - startY);
        const deltaX = Math.abs(e.pageX - startX);

        // Check if user has moved beyond threshold
        if (deltaY > dragThreshold || deltaX > dragThreshold) {
          if (!hasMoved) {
            console.log('Movement detected, starting scroll');
            hasMoved = true;
            emojiBody.style.cursor = 'grabbing';
            emojiBody.style.userSelect = 'none';
          }

          e.preventDefault();
          e.stopPropagation();

          const y = e.pageY;
          const walk = (y - startY) * 1.5; // scroll speed multiplier
          emojiBody.scrollTop = scrollTop - walk;
        }
      };

      const handlePointerUp = () => {
        if (isDragging) {
          // If user dragged, prevent emoji clicks
          if (hasMoved) {
            // Prevent any clicks from firing for a brief moment
            const preventClick = (clickEvent: Event) => {
              clickEvent.preventDefault();
              clickEvent.stopPropagation();
              emojiBody.removeEventListener('click', preventClick, true);
            };
            emojiBody.addEventListener('click', preventClick, true);

            setTimeout(() => {
              emojiBody.removeEventListener('click', preventClick, true);
            }, 100);
          }
        }
        isDragging = false;
        hasMoved = false;
        emojiBody.style.cursor = 'grab';
        emojiBody.style.userSelect = 'auto';
      };

      emojiBody.style.cursor = 'grab';
      emojiBody.addEventListener(
        'pointerdown',
        handlePointerDown as EventListener
      );
      emojiBody.addEventListener(
        'pointermove',
        handlePointerMove as EventListener
      );
      emojiBody.addEventListener('pointerup', handlePointerUp as EventListener);

      cleanupFn = () => {
        emojiBody.removeEventListener(
          'pointerdown',
          handlePointerDown as EventListener
        );
        emojiBody.removeEventListener(
          'pointermove',
          handlePointerMove as EventListener
        );
        emojiBody.removeEventListener(
          'pointerup',
          handlePointerUp as EventListener
        );
      };
    }, 100); // Check every 100ms

    return () => {
      clearInterval(intervalId);
      if (cleanupFn) cleanupFn();
    };
  }, [pickerOpen]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmojiText(emojiData.emoji);
    setPickerOpen(false);
  };

  const handleNextPageCheck = async () => {
    if (!emojiText) {
      setSnackbarOpen(true);
      return;
    }

    const result = await submitQKDEmoji(emojiText);

    if (!result.success) {
      setEmojiSentError(true);
      return;
    }

    router.push('/ssm/page2/');
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
        <Whobit variant="arms-down" speechBubbleHeight="250px">
          <Box sx={{ fontSize: '0.85em' }}>
            {emojiSentError ? (
              <p>
                There was an error sending your emoji to the backend. Please
                press the `START OVER` button and try again.
              </p>
            ) : (
              <>
                <p>
                  Choose a message to send to your friend! To keep this a
                  secret, you and your friend will send a secret emoji by
                  answering questions.
                </p>
                <p>
                  Try to guess the answer <b>YOU</b> think the other person will
                  choose. Your friend will guess the answers they think{' '}
                  <b>YOU</b> would answer
                </p>
              </>
            )}
          </Box>
        </Whobit>

        <Stack
          flexDirection="column"
          flex={1}
          alignItems="center"
          justifyContent="center"
          sx={{ paddingLeft: '150px' }}
        >
          {emojiSentError ? (
            <Box
              component="img"
              src="/images/broken-computer.png"
              alt="Error submitting emoji"
              sx={{
                width: '200px',
                height: 'auto',
              }}
            />
          ) : (
            <Stack
              direction="row"
              alignItems="flex-end"
              spacing={4}
              sx={{
                backgroundImage: 'url(/images/circle.png)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                width: '560px',
                height: '560px',
                position: 'relative',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '200px',
                  height: '200px',
                  border: '3px solid #1976d2',
                  borderRadius: '12px',
                  padding: '20px',
                  backgroundColor: '#f5f5f5',
                  fontSize: '5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    transform: 'translate(-50%, -50%) scale(1.05)',
                  },
                  '&:active': {
                    transform: 'translate(-50%, -50%) scale(0.95)',
                  },
                }}
                onClick={() => setPickerOpen(true)}
              >
                {emojiText || (
                  <Typography sx={{ fontSize: '1rem', color: '#666' }}>
                    Tap
                  </Typography>
                )}
              </Box>

              <Button
                variant="contained"
                component="a"
                href="#"
                onClick={handleNextPageCheck}
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: -50,
                  height: '4em',
                  width: '8em',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                }}
              >
                Next
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>

      <Dialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent
          ref={dialogRef}
          sx={{
            padding: '20px',
            overflow: 'hidden',
            '& .epr-body': {
              overflowY: 'auto !important',
            },
          }}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            width="100%"
            height="500px"
            searchDisabled
            emojiStyle={EmojiStyle.NATIVE}
            style={
              {
                '--epr-emoji-size': '48px',
              } as React.CSSProperties
            }
          />
        </DialogContent>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Please choose an emoji before going to the next page"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          content: {
            sx: {
              fontSize: '1.2rem',
            },
          },
        }}
      />
    </Container>
  );
}
