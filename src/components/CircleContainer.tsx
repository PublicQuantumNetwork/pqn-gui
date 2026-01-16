'use client';

import { Box, SxProps, Theme } from '@mui/material';
import { ReactNode } from 'react';

interface CircleContainerProps {
  children?: ReactNode;
  sx?: SxProps<Theme>;
}

/**
 * A reusable component that displays content inside a circular background.
 * The circle image is used as a background, allowing flexible positioning of children.
 */
export default function CircleContainer({
  children,
  sx,
}: CircleContainerProps) {
  return (
    <Box
      sx={{
        backgroundImage: 'url(/images/circle.png)',
        height: '560px',
        width: '560px',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}