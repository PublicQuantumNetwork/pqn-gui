'use client';
import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { usePageRedirect } from '@/app/contexts/PageRedirectContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import confetti from 'canvas-confetti';

export default function Home() {
  const { setBackArrowLink, setForwardArrowLink } = usePageRedirect();
  const router = useRouter();

  const setLinks = useCallback(() => {
    setBackArrowLink('/ssm/page3/');
    setForwardArrowLink('/survey/');
  }, [setBackArrowLink, setForwardArrowLink]);

  useEffect(() => {
    setLinks();
  }, [setLinks]);

  useEnterKey(() => {
    router.push('/survey/');
  });

  function MyComponent() {
    const searchParams = useSearchParams();

    const successParam = searchParams.get('success');
    const success = successParam === 'true';

    const n_matching_bits = searchParams.get('n_matching_bits') ?? '0';
    const n_total_bits = searchParams.get('n_total_bits') ?? '0';
    const emoji = searchParams.get('emoji') ?? '';
    const role = searchParams.get('role') ?? '';

    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');
    const emojiRef = useRef<HTMLDivElement>(null);
    const confettiFiredRef = useRef(false);

    // Calculate blur pixels based on matching bits ratio
    const calculateBlurPixels = (
      matchingBits: string,
      totalBits: string
    ): number => {
      const minPixels = 0;
      const maxPixels = 25;

      const matching = Number(matchingBits);
      const total = Number(totalBits);

      if (total === 0) return maxPixels;

      const matchRatio = matching / total;
      return (1 - matchRatio) * (maxPixels - minPixels) + minPixels;
    };

    // Set the message based on the 'success' prop and role
    useEffect(() => {
      if (!success) {
        setMessage('There was an error, we will work on this.');
        setMessage2('Please try a different game.');
      } else {
        if (role === 'leader') {
          setMessage(
            'You sent the message now. If it is too blurry you might need to agree on more questions.'
          );
        } else if (role === 'follower') {
          setMessage(
            'You have received this message. If it is too blurry you might need to agree on more questions.'
          );
        } else {
          setMessage('Your quantum key distribution result is...');
        }
      }
    }, [success, role]);

    // Trigger emoji explosion when bits match perfectly
    useEffect(() => {
      if (success && emoji && n_matching_bits === n_total_bits && Number(n_total_bits) > 0 && !confettiFiredRef.current) {
        confettiFiredRef.current = true;

        // Wait for DOM to be ready
        setTimeout(() => {
          if (emojiRef.current) {
            const rect = emojiRef.current.getBoundingClientRect();
            const scalar = 2;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const emojiShape = (confetti as any).shapeFromText({ text: emoji, scalar });

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (confetti as any)({
              particleCount: 80,
              spread: 360,
              ticks: 60,
              gravity: 0,
              decay: 0.96,
              startVelocity: 20,
              shapes: [emojiShape],
              scalar,
              origin: {
                x: (rect.left + rect.width / 2) / window.innerWidth,
                y: (rect.top + rect.height / 2) / window.innerHeight,
              },
            });
          }
        }, 100);
      }
    }, [success, emoji, n_matching_bits, n_total_bits]);

    return (
      <Container maxWidth="lg">
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Stack
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{ width: '100%' }}
          >
            <Stack
              direction="row"
              sx={{
                justifyContent: 'left',
                alignItems: 'flex-end',
              }}
            >
              <Stack
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{ width: '50%' }}
              >
                <Box
                  component="img"
                  src="/images/speech-bubble-white-small.png"
                  alt="Whobit welcomes you"
                  sx={{
                    width: 'auto',
                    height: '18em',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'left',
                  }}
                />
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    position: 'absolute',
                    top: '23%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#000000',
                    width: '75%',
                  }}
                >
                  {!success ? (
                    <p>
                      {message}
                      <br />
                      <br />
                      {message2}
                    </p>
                  ) : (
                    <div>{message}</div>
                  )}
                </Typography>

                <Box
                  component="img"
                  src="/images/whobit-arms-down.png"
                  alt="Whobit showing results"
                  sx={{
                    width: '14.8em',
                    height: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'left',
                    paddingLeft: '12px',
                    marginLeft: '-10px',
                  }}
                />
              </Stack>

              <Stack
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{ width: '50%' }}
              >
                <Stack
                  direction="row"
                  sx={{
                    minHeight: '7em',
                    justifyContent: 'left',
                    alignItems: 'flex-end',
                  }}
                >
                  <Stack
                    display="flex"
                    flexDirection="column"
                    position="relative"
                    sx={{ width: '100%', marginLeft: '232px' }}
                  >
                    <Box
                      component="img"
                      src="/images/circle.png"
                      alt="Circle background"
                      sx={{
                        width: '560px',
                        height: '560px',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'right',
                      }}
                    />

                    {success && (
                      <>
                        <Typography
                          ref={emojiRef}
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '30%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#000000',
                            width: '60%',
                            fontSize: '7em',
                            textAlign: 'center',
                            filter: `blur(${calculateBlurPixels(n_matching_bits, n_total_bits)}px)`,
                          }}
                        >
                          {emoji}
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '60%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#000000',
                            width: '60%',
                            fontSize: '1.2em',
                            textAlign: 'center',
                          }}
                        >
                          Matching bits: {n_matching_bits} / {n_total_bits}
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '70%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            color: '#000000',
                            width: '60%',
                            fontSize: '1.1em',
                            textAlign: 'center',
                          }}
                        >
                          Success rate:{' '}
                          {n_total_bits !== '0'
                            ? (
                                (Number(n_matching_bits) /
                                  Number(n_total_bits)) *
                                100
                              ).toFixed(1)
                            : '0'}
                          %
                        </Typography>
                      </>
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
