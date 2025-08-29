
"use client";

import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    message: string | null;
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, message }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <Box sx={style}>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Typography id="modal-title" variant="h6" component="h2">
                    New Message Received
                </Typography>
                <Typography id="modal-description" sx={{ mt: 2 }}>
                    {message || "No message content"}
                </Typography>
            </Box>
        </Modal>
    );
};

export default EventModal;
