'use client';

import Container from '@mui/material/Container';
import { Box, Stack, CircularProgress } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { requestFollower } from '@/calls';
import Whobit from '@/components/Whobit';
import Decorations from '@/components/Decorations';
import type { Scene } from '@/themes';

export default function MyComponent() {
  const router = useRouter();
  const [hasError, setHasError] = useState(false);
  const [wasAccepted, setWasAccepted] = useState<boolean | null>(null);
  // Whether the collect_follower request has answered, which tells the
  // asking and waiting Scenes apart.
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    const fetchFollowerRequest = async () => {
      const result = await requestFollower();

      setHasAnswered(true);
      if (!result.success) {
        setHasError(true);
      } else if (result.data && result.data.accepted !== undefined) {
        setWasAccepted(result.data.accepted);
        if (result.data.accepted === true) {
          router.push('/ssm/page3?role=leader');
        }
      }
    };

    fetchFollowerRequest();
  }, [router]);

  // The Scene the page's state calls for: asking while the
  // request is still in flight, waiting once it has answered without an
  // answer, declined when the friend declined.
  const scene: Scene =
    wasAccepted === false
      ? 'ssm2-declined'
      : hasAnswered
        ? 'ssm2-waiting'
        : 'ssm2-asking';

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Decorations scene={scene} />
      <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
        <Whobit variant="right-wing-up" speechBubbleHeight="250px">
          <Box sx={{ fontSize: '1em' }}>
            {hasError ? (
              <p>
                There was an error connecting to the other computer. Please
                press the `START OVER` button and try again.
              </p>
            ) : wasAccepted === false ? (
              <p>
                Other computer has said no to playing the game, please press the
                `START OVER` button and try again
              </p>
            ) : (
              <>
                <p>
                  Asking your friend to join. Please accept the popup that
                  appears in the other computer.
                </p>
                <p>
                  If no popup appeared please press the `START OVER` button and
                  try again.
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
          {hasError ? (
            <Box
              component="img"
              src="/images/broken-computer.png"
              alt="Error - request denied"
              sx={{
                width: '200px',
                height: 'auto',
              }}
            />
          ) : wasAccepted === false ? (
            <Typography
              // The Halloween Decorations' waiting-status anchor, on the
              // declined face that takes the spinner's place: the SSM2-declined
              // board draws its sad pieces around this spot. Non-visual, so no
              // theme changes the look.
              data-decoration-anchor="ssm2-status"
              sx={{
                fontSize: '150px',
              }}
            >
              😞
            </Typography>
          ) : (
            <>
              <CircularProgress
                // The Halloween Decorations' waiting-status anchor: the SSM2
                // boards draw their waiting pieces around this spot.
                // Non-visual, so no theme changes the look.
                data-decoration-anchor="ssm2-status"
                size={80}
                thickness={4}
                sx={{
                  color: 'black',
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  color: 'black',
                }}
              >
                Waiting for response...
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}
