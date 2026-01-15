'use client';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Button, Stack, styled, ButtonProps } from '@mui/material';
import { useWebSocket } from '@/app/hooks/WebSocketHook';
import FollowRequestEventModal from '@/components/FollowRequestEventModal';
import { resetBackendState } from '@/calls';

interface StyledHomeButtonProps extends ButtonProps {
  leftMargin?: string;
}

const StyledHomeButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'leftMargin',
})<StyledHomeButtonProps>(({ leftMargin = '220px' }) => ({
  height: '6em',
  fontSize: '1.2em',
  margin: `0 0 20px ${leftMargin}`,
}));

export default function Home() {
  const { lastMessage, sendMessage, connect, disconnect } = useWebSocket();
  const [isFollowRequestModalOpen, setIsFollowRequestModalOpen] =
    useState(false);
  const [followRequestModalMessage, setFollowRequestModalMessage] = useState<
    string | null
  >(null);

  useEffect(() => {
    resetBackendState().then(() => {});
  }, []);

  useEffect(() => {
    if (lastMessage) {
      setFollowRequestModalMessage(lastMessage.data);
      setIsFollowRequestModalOpen(true);
    }
  }, [lastMessage]);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  const handleCloseModal = () => {
    setIsFollowRequestModalOpen(false);
    setFollowRequestModalMessage(null);
  };

  return (
    <Container maxWidth="lg"
      sx={{my: 4,}}>
      <FollowRequestEventModal
        isOpen={isFollowRequestModalOpen}
        onClose={handleCloseModal}
        message={followRequestModalMessage}
        sendMessage={sendMessage}
      />
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
              <StyledHomeButton
                variant="contained"
                component="a"
                href="/chsh/page1"
              >
                Verify Quantum Link (single player)
              </StyledHomeButton>

              <StyledHomeButton
                variant="contained"
                component="a"
                href="/qf/page1"
              >
                Quantum Fortune (single player)
              </StyledHomeButton>
            </Stack>
          </Stack>

          <Stack
            direction="row"
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
                backgroundPosition: 'left',
              }}
            />

            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{ width: '100%' }}
            >
              <StyledHomeButton
                variant="contained"
                component="a"
                href="/ssm/page1"
                leftMargin="368px"
              >
                Share a secret message (Preview)
              </StyledHomeButton>

              <StyledHomeButton
                variant="contained"
                component="a"
                href="#"
                leftMargin="368px"
                disabled
              >
                Get to know someone (Coming soon)
              </StyledHomeButton>
            </Stack>
          </Stack>
        </Stack>
    </Container>
  );
}
