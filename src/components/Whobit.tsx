import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';

type WhobitVariant = 'right-wing-up' | 'arms-up' | 'arms-down';

interface WhobitProps {
  children: ReactNode;
  variant?: WhobitVariant;
  speechBubbleHeight?: string;
}

export default function Whobit({
  children,
  variant = 'right-wing-up',
  speechBubbleHeight = '250px',
}: WhobitProps) {
  const getWhobitImage = () => {
    switch (variant) {
      case 'arms-up':
        return '/images/whobit-arms-up.svg';
      case 'arms-down':
        return '/images/whobit-arms-down.svg';
      case 'right-wing-up':
      default:
        return '/images/whobit-right-wing-up.svg';
    }
  };
  return (
    <Stack position="relative" sx={{ minWidth: 'fit-content' }}>
      {/* Speech bubble */}
      <Box
        sx={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '2px solid #000000',
          padding: '0px 40px',
          marginBottom: '10px',
          width: '500px',
          height: speechBubbleHeight,
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-20px',
            left: '240px',
            width: '0',
            height: '0',
            borderLeft: '20px solid transparent',
            borderRight: '20px solid transparent',
            borderTop: '20px solid #FFFFFF',
            filter: 'drop-shadow(0px 2px 0px #000000)',
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: '-23px',
            left: '118px',
            width: '0',
            height: '0',
            borderLeft: '22px solid transparent',
            borderRight: '22px solid transparent',
            borderTop: '23px solid #000000',
            zIndex: -1,
          },
        }}
      >
        <Typography
          variant="h5"
          component="div"
          sx={{
            color: '#000000',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          {children}
        </Typography>
      </Box>

      {/* Whobit character */}
      <Box
        component="img"
        src={getWhobitImage()}
        alt="Whobit"
        sx={{
          width: '288px',
          height: '288px',
          transformOrigin: 'top center',
        }}
      />
    </Stack>
  );
}
