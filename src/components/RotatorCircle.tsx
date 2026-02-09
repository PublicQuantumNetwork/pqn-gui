'use client';

import { Box } from '@mui/material';
import { ReactNode, useEffect, useState } from 'react';
import { fetchRotatorAngle } from '@/calls';

interface RotatorCircleProps {
  angleMultiplier?: number;
  children?: ReactNode;
  onRotationChange?: (rotation: number) => void;
}

export default function RotatorCircle({
  angleMultiplier = 1,
  children,
  onRotationChange,
}: RotatorCircleProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchRotatorAngle();
      const newRotation = result.theta * 2;
      setRotation(newRotation);
      onRotationChange?.(newRotation);
    }, 100);

    return () => clearInterval(interval);
  }, [onRotationChange]);
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
