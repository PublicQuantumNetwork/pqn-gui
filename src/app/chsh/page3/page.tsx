'use client';
import { Suspense } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import Whobit from '@/components/Whobit';
import CircleContainer from '@/components/CircleContainer';
import Decorations from '@/components/Decorations';
import { activeCelebration, activeFlavourCopy, type Scene } from '@/themes';

// The active theme is fixed at build time, so its Celebration
// is computed once here, not on every render.
const Celebration = activeCelebration();

export default function Home() {
  const router = useRouter();

  useEnterKey(() => {
    router.push('/survey/');
  });

  function MyComponent() {
    const searchParams = useSearchParams();
    const flavourCopy = activeFlavourCopy();

    const value = Number(searchParams.get('value')) ?? 0;
    const error = Number(searchParams.get('error')) ?? 0;

    const failParam = searchParams.get('fail');
    const fail = failParam ? failParam.replace(/\}/g, '') : true;

    // The Scene the page's state calls for.
    const scene: Scene =
      fail === 'true'
        ? 'chsh3-error'
        : value >= 2
          ? 'chsh3-entangled'
          : 'chsh3-weak';

    // Determine Whobit variant based on results
    const getWhobitVariant = () => {
      if (fail === 'true') return 'arms-down';
      if (value >= 2) return 'arms-up';
      return 'arms-down';
    };

    return (
      <Container maxWidth="lg">
        <Decorations scene={scene} />
        <Box
          sx={{
            my: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
            {/* Left side: Whobit with message and fireworks */}
            <Box sx={{ position: 'relative' }}>
              <Whobit variant={getWhobitVariant()} speechBubbleHeight="250px">
                {fail === 'true' ? (
                  <p>
                    There was an error, we will work on this.
                    <br />
                    <br />
                    Please try a different game.
                  </p>
                ) : value >= 2 ? (
                  <p>Woo!! Hoo!!</p>
                ) : (
                  <p>
                    Some angles are better than others for this test.
                    <br />
                    <br />
                    Try different angles to see this for yourself!
                  </p>
                )}
              </Whobit>

              {/* The Celebration positioned as siblings to Whobit */}
              {value >= 2 && fail !== 'true' && <Celebration />}
            </Box>

            {/* Right side: Results circle */}
            <Box sx={{ flex: 1 }}>
              <CircleContainer sx={{ left: '20%' }}>
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    position: 'absolute',
                    top: '45%',
                    left: '55%',
                    transform: 'translate(-50%, -50%)',
                    color: '#000000',
                    width: '50%',
                    fontSize: '2em',
                  }}
                >
                  Your value was {value.toFixed(2)} with an error of{' '}
                  {error.toFixed(2)}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    position: 'absolute',
                    top: '60%',
                    left: '29%',
                    color: '#000000',
                    fontSize: '.85em',
                    textAlign: 'center',
                  }}
                >
                  {fail === 'true' ? (
                    <>
                      This result means the test was unable
                      <br />
                      to show the photons are entangled.
                    </>
                  ) : value >= 2 ? (
                    <>
                      This result means the test was able to
                      <br />
                      show the photons are entangled.
                    </>
                  ) : (
                    ''
                  )}
                </Typography>

                {/* Flavour copy: nothing under an entangled result in the
                    Default Theme. Placed as the boards place
                    it: top 70%, the full circle's width, centred, 22px. */}
                {fail !== 'true' &&
                  value >= 2 &&
                  flavourCopy['chsh3-entangled-line'] && (
                    <Typography
                      variant="h5"
                      sx={{
                        position: 'absolute',
                        top: '70%',
                        left: 0,
                        right: 0,
                        color: '#000000',
                        fontSize: '22px',
                        lineHeight: '34px',
                        textAlign: 'center',
                      }}
                    >
                      {flavourCopy['chsh3-entangled-line']}
                    </Typography>
                  )}
              </CircleContainer>
            </Box>
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
