'use client';
import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import { attractLoopEnabled, requestAttractLoop } from '@/attractLoop';

const HeaderImage = styled('img')(({ theme }) => ({
  height: 64,
  objectFit: 'contain',
  marginBottom: theme.spacing(2),
}));

export default function HeaderBar() {
  const pathname = usePathname();
  // The attract loop only exists on the home page, so the button that replays it
  // is offered only there — elsewhere it would be a control that does nothing.
  const showAttractButton = pathname === '/' && attractLoopEnabled();
  const showMapButton = pathname === '/';
  const showMapHeading = pathname === '/map';

  return (
    <Stack
      direction="row"
      sx={{
        minHeight: 128,
        mt: 4,
        px: 4,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {/* Left group */}
      <Stack direction="row" spacing={6} alignItems="center">
        <Box
          component="img"
          src="/images/PQN-blue-ufl-website-image-blue4-small.png"
          alt="Public Quantum Network"
          sx={{
            height: 'auto',
            maxWidth: '100%',
          }}
        />

        <HeaderImage
          src="/images/qrcode.png"
          alt="Visit the PQN website"
          sx={(theme) => ({
            border: `1px solid ${theme.palette.grey[900]}`,
          })}
        />

        {showMapHeading && (
          <Stack component="header" spacing={0.5}>
            <Box
              component="h1"
              sx={{
                m: 0,
                color: '#0d2436',
                fontFamily: "'PP Museum', Georgia, 'Times New Roman', serif",
                fontSize: 26,
                fontWeight: 400,
                lineHeight: 1.2,
              }}
            >
              How the experiment works
            </Box>
            <Box
              component="p"
              sx={{
                m: 0,
                color: '#3c5568',
                fontSize: 16,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
              }}
            >
              Tap any numbered element to learn more about that step in the
              process!
            </Box>
          </Stack>
        )}
      </Stack>

      {/* Right group */}
      <Stack direction="row" spacing={6} alignItems="center">
        {showAttractButton && (
          <Button
            variant="contained"
            aria-label="Play the intro video"
            onClick={requestAttractLoop}
            sx={{ minWidth: 64 }}
          >
            <OndemandVideoIcon /> &nbsp; Intro Video
          </Button>
        )}

        {showMapButton && (
          <Button
            variant="contained"
            component="a"
            href="/map"
            aria-label="Open the experiment map"
            sx={{ minWidth: 96 }}
          >
            <MapOutlinedIcon /> &nbsp; Map
          </Button>
        )}

        <Button
          variant="contained"
          component="a"
          href="/"
          sx={{
            minWidth: 120,
          }}
        >
          Start Over
        </Button>

        <Button variant="contained" component="a" href="/survey">
          Survey
        </Button>

        <HeaderImage
          src="/images/block-I.png"
          alt="University of Illinois Urbana-Champaign"
        />
      </Stack>
    </Stack>
  );
}
