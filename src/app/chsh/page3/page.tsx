'use client';
import { useState, useEffect, Suspense } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import Whobit from '@/components/Whobit';
import CircleContainer from '@/components/CircleContainer';

export default function Home() {
  const router = useRouter();

  useEnterKey(() => {
    router.push('/survey/');
  });

  function MyComponent() {
    const searchParams = useSearchParams();

    const value = Number(searchParams.get('value')).toFixed(2) ?? 0;
    const error = Number(searchParams.get('error')).toFixed(2) ?? 0;

    const failParam = searchParams.get('fail');
    const fail = failParam ? failParam.replace(/\}/g, '') : true;

    const [message, setMessage] = useState('');
    const [message2, setMessage2] = useState('');

    const [showFireworks, setShowFireworks] = useState(false);
    const [showFireworks2, setShowFireworks2] = useState(false);

    // Set the message based on the 'fail' prop
    useEffect(() => {
      if (fail === 'true') {
        setMessage('There was an error, we will work on this.');
        setMessage2('Please try a different game.');
      } else {
        if (parseFloat(value) >= 2) {
          setMessage('Woo!! Hoo!!');
        } else {
          setMessage('Some angles are better than others for this test.');
          setMessage2('Try different angles to see this for yourself!');
        }
      }
    }, [fail]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFireworks(true);
      }, 1000);

      return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFireworks2(true);
      }, 3000);

      return () => clearTimeout(timer);
    }, []);

    // Determine Whobit variant based on results
    const getWhobitVariant = () => {
      if (fail === 'true') return 'arms-down';
      if (parseFloat(value) >= 2) return 'arms-up';
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
                speechBubbleMinHeight="250px"
              >
                {fail === 'true' ? (
                  <p>
                    {message}
                    <br />
                    <br />
                    {message2}
                  </p>
                ) : parseFloat(value) >= 2 ? (
                  <p>{message}</p>
                ) : (
                  <p>
                    {message}
                    <br />
                    <br />
                    {message2}
                  </p>
                )}
              </Whobit>

              {/* Fireworks positioned as siblings to Whobit */}
              {parseFloat(value) >= 2 && showFireworks && (
                <Box
                  component="img"
                  src="/images/red-fireworks.gif"
                  alt="Entanglement was achieved!!"
                  sx={{
                    position: 'absolute',
                    top: '0px',
                    left: '-300px',
                    width: '12em',
                    height: '10em',
                    zIndex: 0,
                  }}
                />
              )}

              {parseFloat(value) >= 2 && (
                <Box
                  component="img"
                  src="/images/green-fireworks.gif"
                  alt="Entanglement was achieved!!"
                  sx={{
                    position: 'absolute',
                    top: '0px',
                    left: '420px',
                    width: '12em',
                    height: '10em',
                    zIndex: 0,
                  }}
                />
              )}

              {parseFloat(value) >= 2 && showFireworks2 && (
                <Box
                  component="img"
                  src="/images/yellow-fireworks.gif"
                  alt="Entanglement was achieved!!"
                  sx={{
                    position: 'absolute',
                    top: '200px',
                    left: '180px',
                    width: '12em',
                    height: '10em',
                    zIndex: 0,
                  }}
                />
              )}
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
                    Your value was {value} with an error of {error}
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
                    ) : parseFloat(value) >= 2 ? (
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
