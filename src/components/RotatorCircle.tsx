'use client';

import { Box, styled } from '@mui/material';
import { ReactNode } from 'react';

interface RotatorCircleProps {
  rotation: number;
  angleMultiplier?: number;
  children?: ReactNode;
}

export default function RotatorCircle({
  rotation,
  angleMultiplier = 1,
  children,
}: RotatorCircleProps) {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/images/circle.png)',
        height: '560px',
        width: '560px',
        position: 'relative',
        left: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 'calc(50% - 4px)',
          left: '50%',
          zIndex: 2,
          height: '432px',
          width: '432px',
          backgroundImage: 'url(/images/arrow.png)',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transform: `translate(-50%, -50%) rotate(${rotation * angleMultiplier}deg)`,
        }}
      />

      {children}
    </Box>
  );
}