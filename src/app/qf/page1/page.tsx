'use client';

import { useState, useRef } from 'react';
import Container from '@mui/material/Container';
import { Dialog, Button, Box, Stack } from '@mui/material';
import QFTextbox from '@/components/QFTextbox';
import ModalBox from '@/components/ModalBox';
import Whobit from '@/components/Whobit';
import { useRouter } from 'next/navigation';
import { submitFortune } from '@/calls';
import { useEnterKey } from '@/hooks/useEnterKey';

export default function MyComponent() {
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const [currentAngle, setCurrentAngle] = useState(1); // Index of angle choice

  const enterOnRef = useRef(true); // Controls if the enter key press is executed. Needs to be a ref to avoid async updates.

  const handleSubmitClick = async () => {
    if (currentAngle == 7) {
      enterOnRef.current = false;
      setOpenModal(true);
      const response = await submitFortune();

      if (response.success) {
        const value = response.data[0] + 1; // Add 1 to make it 1-indexed
        router.push(`/qf/page2?fail=false&value=${value}`);
      } else {
        router.push(`/qf/page2?fail=true`);
      }
    } else {
      setCurrentAngle(currentAngle + 1);
    }
  };

  useEnterKey(() => {
    if (enterOnRef.current) {
      handleSubmitClick();
    }
  });

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 9, mb: 4, display: 'flex', alignItems: 'center' }}>
        <Dialog open={openModal} onClose={() => {}}>
          <ModalBox />
        </Dialog>

        <Stack direction="row" alignItems="center" sx={{ width: '100%' }}>
          <Whobit variant="left-wing-up">
            <p>
              Press the red button seven times to generate your fortune.
            </p>
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
              <QFTextbox questionNumber={currentAngle} />

              <Button
                variant="contained"
                onClick={handleSubmitClick}
                sx={{
                  position: 'absolute',
                  bottom: '60px',
                  right: '-100px',
                  height: '5em',
                  width: '10em',
                  fontSize: '1.2em',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF',
                  color: '#000000',
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}
