'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Container from '@mui/material/Container';
import { Button, Stack, styled, ButtonProps } from '@mui/material';
import { useWebSocket } from '@/hooks/WebSocketHook';
import FollowRequestEventModal from '@/components/FollowRequestEventModal';
import Whobit from '@/components/Whobit';
import { resetBackendState, fetchGamesAvailability, GamesAvailability } from '@/calls';

const StyledHomeButton = styled(Button)<ButtonProps>({
  height: '6em',
  fontSize: '1.2em',
  marginBottom: '20px',
});

export default function Page() {
  const router = useRouter();
  const { lastMessage, sendMessage, connect, disconnect } = useWebSocket();
  const [isFollowRequestModalOpen, setIsFollowRequestModalOpen] =
    useState(false);
  const [followRequestModalMessage, setFollowRequestModalMessage] = useState<
    string | null
  >(null);
  const [gamesAvailability, setGamesAvailability] = useState<GamesAvailability>(
    { chsh: true, qf: true, ssm: true }
  );

  useEffect(() => {
    resetBackendState().then(() => {});
    fetchGamesAvailability().then((avail) => {
      setGamesAvailability(avail);
      if (!avail.chsh && !avail.qf && !avail.ssm) {
        router.replace('/maintenance');
      }
    });
  }, [router]);

  useEffect(() => {
    if (lastMessage) {
      // Legitimate: updating local state in response to an external WebSocket event.
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <FollowRequestEventModal
        isOpen={isFollowRequestModalOpen}
        onClose={handleCloseModal}
        message={followRequestModalMessage}
        sendMessage={sendMessage}
      />
      <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
        <Whobit>
          <p>Hi, Quantum Adventurer!</p>
          <p>I&apos;m Whobit.</p>
          <p>What would you like to do?</p>
        </Whobit>

        {/* Right side: All buttons */}
        <Stack flexDirection="column" flex={1} sx={{ paddingLeft: '150px' }}>
          <StyledHomeButton
            variant="contained"
            component="a"
            href="/chsh/page1"
            disabled={!gamesAvailability.chsh}
          >
            Verify Quantum Link (single player)
          </StyledHomeButton>

          <StyledHomeButton
            variant="contained"
            component="a"
            href="/qf/page1"
            disabled={!gamesAvailability.qf}
          >
            Quantum Fortune (single player)
          </StyledHomeButton>

          <StyledHomeButton
            variant="contained"
            component="a"
            href="/ssm/page1"
            sx={{ marginTop: '40px' }}
            disabled={!gamesAvailability.ssm}
          >
            Share a secret message (Two players)
          </StyledHomeButton>

          {/*<StyledHomeButton variant="contained" component="a" href="#" disabled>*/}
          {/*  Get to know someone (Coming soon)*/}
          {/*</StyledHomeButton>*/}
        </Stack>
      </Stack>
    </Container>
  );
}
