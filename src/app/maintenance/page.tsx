'use client';
import Container from '@mui/material/Container';
import { Stack, Typography } from '@mui/material';
import Whobit from '@/components/Whobit';

export default function MaintenancePage() {
  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
        <Whobit variant="arms-down" speechBubbleHeight="250px">
          <p>Quantum networking is hard...</p>
          <p>But we&apos;re on it!</p>
        </Whobit>

        <Stack
          flexDirection="column"
          flex={1}
          justifyContent="center"
          sx={{ paddingLeft: '150px', paddingTop: '40px' }}
        >
          <Typography variant="h4" gutterBottom>
            All games are in maintenance mode
          </Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Sorry for the inconvenience and come back to us later!
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}
