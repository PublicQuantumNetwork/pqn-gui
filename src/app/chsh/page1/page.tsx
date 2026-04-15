'use client';
import { useState } from 'react';
import Container from '@mui/material/Container';
import { Link, Dialog, DialogContent, Stack, Button } from '@mui/material';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useRouter } from 'next/navigation';
import Whobit from '@/components/Whobit';

export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleNextPageClick = () => {
    router.push('/chsh/page2/');
  };

  useEnterKey(() => {
    handleNextPageClick();
  });

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent sx={{ padding: '2.8em', fontSize: '1.45em' }}>
          Entangled photons are light particles that act as if they&apos;re
          connected, even if they are very far apart.
        </DialogContent>
      </Dialog>

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ width: '100%', height: '100%' }}
      >
        <Whobit variant="arms-down" speechBubbleHeight="250px">
          <p>
            <Link
              component="button"
              onClick={handleClick}
              sx={{ cursor: 'pointer' }}
            >
              Entangled photons
            </Link>
            &nbsp;are flying through the library.
          </p>
          <p>
            We are going to check that they are entangled using a Bell Test.
          </p>
        </Whobit>

        <Stack flex={1} justifyContent="flex-end" alignItems="flex-end">
          <Button
            variant="contained"
            component="a"
            href="#"
            onClick={handleNextPageClick}
            sx={{
              height: '5em',
              width: '8em',
              fontSize: '1.2rem',
              bottom: 50,
              left: 200,
            }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
