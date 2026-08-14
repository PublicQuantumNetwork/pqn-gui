'use client';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import { Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';
import { usePageRedirect } from '@/app/contexts/PageRedirectContext';
import PageTimeout from '@/components/PageTimeout';

const SURVEY_TIMEOUT_MS = 5 * 60 * 1000;
const SURVEY_WARNING_DURATION_MS = 30 * 1000;

function SurveyContent() {
  const router = useRouter();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          top: '10',
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
              minHeight: '8em',
              justifyContent: 'left',
              alignItems: 'flex-end', // Align items to the bottom of the row
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
                <p>Please take a moment to fill out this short survey.</p>
                <p>
                  Press the &quot;START OVER&quot; button to play another game.
                </p>
              </Typography>

              <Box
                component="img"
                src="/images/whobit-arms-down.png"
                alt="Whobit welcomes you"
                sx={{
                  width: '14.3em',
                  height: 'auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'left',
                  paddingLeft: '4px',
                }}
              />
            </Stack>

            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{
                width: '600px',
                marginLeft: '60px',
                top: '-2px',
                scrollbarWidth: 'thick',
                scrollbarColor: '#888 #f1f1f1',
              }}
            >
              <iframe
                src={
                  process.env.NEXT_PUBLIC_SURVEY_FORM_URL ||
                  'https://surveys.illinois.edu/sec/1160990162'
                }
                width="143%"
                height="570"
                style={{
                  border: '3.5px solid #000',
                  backgroundColor: '#fff',
                }}
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Stack>
          </Stack>
        </Stack>
      </Box>
      <PageTimeout
        durationMs={SURVEY_TIMEOUT_MS}
        warningDurationMs={SURVEY_WARNING_DURATION_MS}
        enabled
        mode="absolute"
        onTimeout={() => router.replace('/')}
      />
    </Container>
  );
}

export default function Home() {
  const { setBackArrowLink, setForwardArrowLink } = usePageRedirect();

  useEffect(() => {
    setBackArrowLink('/');
    setForwardArrowLink('/');
  }, [setBackArrowLink, setForwardArrowLink]);

  return <SurveyContent />;
}
