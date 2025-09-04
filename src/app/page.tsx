'use client'
import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Stack, Button } from '@mui/material';
import { usePageRedirect } from '@/app/contexts/PageRedirectContext';
import { useWebSocket } from '@/app/hooks/WebSocketHook';
import EventModal from '@/components/EventModal';

export default function Home() {
  const { setBackArrowLink, setForwardArrowLink } = usePageRedirect();
  const { lastMessage, sendMessage, connect, disconnect } = useWebSocket();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState<string | null>(null);

  const setLinks = () => {
    setForwardArrowLink("chsh/page1");
  }

  useEffect(() => { setLinks() }, [])

  useEffect(() => {
    if (lastMessage) {
      setModalMessage(lastMessage.data);
      setIsModalOpen(true);
    }
  }, [lastMessage]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalMessage(null);
  };

  return (
    <Container maxWidth="lg">
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} message={modalMessage} sendMessage={sendMessage}/>
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
          display="flex"
          flexDirection="column"
          position="relative"
          sx={{ width: '100%' }}
        >

          <Stack direction="row"
            sx={{
              minHeight: '8em',
              justifyContent: 'left',
              alignItems: 'flex-end', // Align items to the bottom of the row
            }}
          >
            <Box
              component="img"
              src="/images/speech-bubble-white-small.png"
              alt="Whobit welcomes you"
              sx={{
                maxWidth: '100%',
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
                position: 'absolute', // Add this line to position the text
                top: '23%', // Adjust the top position as needed
                left: '19%', // Adjust the left position as needed
                transform: 'translate(-50%, -50%)', // Center the text
                color: '#000000', // Set the text color
              }}
            >
              <p>Hi, Quantum Adventurer!</p>

              <p>I'm Whobit.</p>

              <p>What would you like to do?</p>
            </Typography>

            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{ width: '100%' }}
            >

              <Button
                variant="contained"
                component="a"
                href="/chsh/page1"
                sx={{
                  minWidth: '464px',
                  height: '6em',
                  fontSize: '1.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  margin: '0 0 20px 220px',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF;',
                  color: '#000000;',
                }}
              >
                Verify Quantum Link (single player)
              </Button>

              <Button
                variant="contained"
                component="a"
                href="#"
                sx={{
                  minWidth: '464px',
                  height: '6em',
                  fontSize: '1.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  margin: '0 0 20px 220px',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF;',
                  color: '#000000;',
                }}
              >
                Quantum Fortune (single player)
              </Button>

            </Stack>
          </Stack>

          <Stack direction="row"
            sx={{
              marginTop: '0em',
              justifyContent: 'left',
              alignItems: 'flex-end', // Align items to the bottom of the row
            }}
          >
            <Box
              component="img"
              src="/images/whobit-left-wing-up.png"
              alt="Whobit welcomes you"
              sx={{
                width: '18em',
                height: 'auto',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'left'
              }}
            />

            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{ width: '100%' }}
            >

              <Button
                variant="contained"
                component="a"
                href="#"
                sx={{
                  minWidth: '464px',
                  height: '6em',
                  fontSize: '1.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  margin: '0 0 20px 368px',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF;',
                  color: '#000000;',
                }}
              >
                Share a secret message (multi-player)
              </Button>

              <Button
                variant="contained"
                component="a"
                href="#"
                sx={{
                  minWidth: '464px',
                  height: '6em',
                  fontSize: '1.2em',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  margin: '0 0 20px 368px',
                  border: '1px solid #000',
                  backgroundColor: '#FFFFFF;',
                  color: '#000000;',
                }}
              >
                Get to know someone (multi-player)
              </Button>

            </Stack>
          </Stack>
        </Stack>


      </Box>
    </Container>
  );
}
