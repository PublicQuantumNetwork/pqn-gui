'use client';

import React from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string | null;
  sendMessage: (message: string) => void;
}

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const FollowRequestEventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  message,
  sendMessage,
}) => {
  const router = useRouter();

  const handleAccept = () => {
    sendMessage('true');
    // Add a short delay to allow the WebSocket message to be sent before navigating
    setTimeout(() => {
      router.push('/ssm/page3?role=follower');
      onClose();
    }, 500);
  };

  const handleReject = () => {
    sendMessage('false');
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={(_, reason) => {
        if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
          return;
        }
        onClose();
      }}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      disableEscapeKeyDown
    >
      <Box sx={style}>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          {message || 'No message content'}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleReject} sx={{ mr: 1 }}>
            Reject
          </Button>
          <Button onClick={handleAccept} variant="contained">
            Accept
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FollowRequestEventModal;
