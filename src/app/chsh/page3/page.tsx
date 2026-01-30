'use client';
import { Suspense } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import Whobit from '@/components/Whobit';
import CircleContainer from '@/components/CircleContainer';
import Fireworks from '@/components/Fireworks';

export default function Home() {
  const router = useRouter();

  useEnterKey(() => {
    router.push('/survey/');
  });

  function MyComponent() {
    const searchParams = useSearchParams();

    const value = Number(searchParams.get('value')) ?? 0;
    const error = Number(searchParams.get('error')) ?? 0;

    const failParam = searchParams.get('fail');
    const fail = failParam ? failParam.replace(/\}/g, '') : true;

    // Determine Whobit variant based on results
    const getWhobitVariant = () => {
      if (fail === 'true') return 'arms-down';
      if (value >= 2) return 'arms-up';
      return 'arms-down';
    };

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
            direction="row"
            alignItems="flex-start"
            sx={{ width: '100%' }}
          >
            {/* Left side: Whobit with message and fireworks */}
            <Box sx={{ position: 'relative' }}>
              <Whobit
                variant={getWhobitVariant()}
                speechBubbleHeight="250px"
              >
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

              {/* Fireworks positioned as siblings to Whobit */}
              {value >= 2 && fail !== 'true' && <Fireworks />}
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
