'use client';
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { Button, Stack, styled, ButtonProps } from '@mui/material';
import { useWebSocket } from '@/app/hooks/WebSocketHook';
import FollowRequestEventModal from '@/components/FollowRequestEventModal';
import Whobit from '@/components/Whobit';
import { resetBackendState } from '@/calls';

const StyledHomeButton = styled(Button)<ButtonProps>({
  height: '6em',
  fontSize: '1.2em',
  marginBottom: '20px',
});

export default function Page() {
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
      <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
        <Whobit>
          <p>Hi, Quantum Adventurer!</p>
          <p>I'm Whobit.</p>
          <p>What would you like to do?</p>
        </Whobit>

        {/* Right side: All buttons */}
        <Stack flexDirection="column" flex={1} sx={{ paddingLeft: '150px' }}>
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

          <StyledHomeButton
            variant="contained"
            component="a"
            href="/ssm/page1"
            sx={{ marginTop: '40px' }}
          >
            Share a secret message (Preview)
          </StyledHomeButton>

          <StyledHomeButton
            variant="contained"
            component="a"
            href="#"
            disabled
          >
            Get to know someone (Coming soon)
          </StyledHomeButton>
        </Stack>
      </Stack>
    </Container>
  );
}
