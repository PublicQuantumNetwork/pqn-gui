'use client';
import { useState, useEffect, Suspense, useCallback, useRef } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { usePageRedirect } from '@/app/contexts/PageRedirectContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import EmojiConfetti from '@/components/EmojiConfetti';
import Whobit from '@/components/Whobit';

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
    const [confettiTrigger, setConfettiTrigger] = useState(0);

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

    // Trigger emoji explosion continuously when bits match perfectly
    useEffect(() => {
      if (success && emoji && n_matching_bits === n_total_bits && Number(n_total_bits) > 0) {
        // Wait for DOM to be ready, then start interval
        const initialTimeout = setTimeout(() => {
          setConfettiTrigger((prev) => prev + 1);
          const interval = setInterval(() => {
            setConfettiTrigger((prev) => prev + 1);
          }, 2000);
          return () => {
            clearInterval(interval);
          };
        }, 100);

        return () => {
          clearTimeout(initialTimeout);
        };
      }
    }, [success, emoji, n_matching_bits, n_total_bits]);

    return (
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
          <Whobit variant="arms-down" speechBubbleHeight="250px">
            <Box sx={{ fontSize: '0.85em' }}>
              {!success ? (
                <>
                  <p>{message}</p>
                  <p>{message2}</p>
                </>
              ) : (
                <p>{message}</p>
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
            <Box
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
                          (Number(n_matching_bits) / Number(n_total_bits)) *
                          100
                        ).toFixed(1)
                      : '0'}
                    %
                  </Typography>
                </>
              )}
            </Box>
          </Stack>
        </Stack>
        {success && emoji && (
          <EmojiConfetti
            emoji={emoji}
            triggerKey={confettiTrigger}
            emojiRef={emojiRef}
          />
        )}
      </Container>
    );
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}
