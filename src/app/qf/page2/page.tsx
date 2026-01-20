'use client';
import { Suspense } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack, Typography } from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Whobit from '@/components/Whobit';
import fortune from '@/app/qf/page2/fortunes';
import { useEnterKey } from '@/hooks/useEnterKey';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const value = Number(searchParams.get('value')).toFixed(0) ?? 42;

  const failParam = searchParams.get('fail');
  const fail = failParam ? failParam.replace(/}/g, '') : true;

  useEnterKey(() => {
    router.push('/survey/');
  });

  const fortuneText = fortune.find(
    (item) => Number(item.number) === Number(value)
  )?.description;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Container maxWidth="lg">
        <Box sx={{ mt: 9, mb: 4 }}>
          <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
            <Whobit variant="arms-down">
              {fail === 'true' ? (
                <p>
                  There was an error, we will work on this.
                  <br />
                  <br />
                  Please try a different game.
                </p>
              ) : (
                <p>Your fortune is...</p>
              )}
            </Whobit>

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingLeft: '150px',
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  backgroundImage: 'url(/images/circle.png)',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  width: '560px',
                  height: '560px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    position: 'absolute',
                    top: '35%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#000000',
                    fontSize: '5em',
                  }}
                >
                  #{value}
                </Typography>

                <Typography
                  variant="h5"
                  component="h1"
                  sx={{
                    position: 'absolute',
                    top: '62%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: '#000000',
                    width: '60%',
                    fontSize: '1.2em',
                    textAlign: 'center',
                  }}
                >
                  {fortuneText}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Suspense>
  );
}
