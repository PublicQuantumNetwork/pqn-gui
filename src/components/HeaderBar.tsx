import { Box, Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import * as React from 'react';

const HeaderImage = styled('img')(({ theme }) => ({
  height: 64,
  objectFit: 'contain',
  marginBottom: theme.spacing(2),
}));

export default function HeaderBar() {
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
      </Stack>

      {/* Right group */}
      <Stack direction="row" spacing={6} alignItems="center">
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
