import { Box, Stack, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { activeImages, activeWhobitAccessory, type WhobitPose } from '@/themes';

interface WhobitProps {
  children: ReactNode;
  variant?: WhobitPose;
  speechBubbleHeight?: string;
  /** Whether Whobit wears the theme's accessory (decision 9: never on
   * Maintenance; Survey does not use Whobit). */
  accessory?: boolean;
}

export default function Whobit({
  children,
  variant = 'right-wing-up',
  speechBubbleHeight = '250px',
  accessory = true,
}: WhobitProps) {
  const getWhobitImage = () => {
    const images = activeImages();
    switch (variant) {
      case 'arms-up':
        return images['whobit-arms-up'];
      case 'arms-down':
        return images['whobit-arms-down'];
      case 'right-wing-up':
      default:
        return images['whobit-right-wing-up'];
    }
  };

  const whobitAccessory = accessory ? activeWhobitAccessory() : undefined;
  return (
    <Stack position="relative" sx={{ minWidth: 'fit-content' }}>
      {/* Speech bubble */}
      <Box
        // The Halloween Decorations' speech-bubble anchor (agent decision
        // A8). Non-visual, so no theme changes the look.
        data-decoration-anchor="whobit-bubble"
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

      {/* Whobit character, with the active theme's accessory over the pose */}
      <Box
        // The Halloween Decorations' pose anchor (agent decision A8).
        // Non-visual, so no theme changes the look.
        data-decoration-anchor="whobit-pose"
        sx={{
          position: 'relative',
          display: 'flex',
          width: '288px',
          height: '288px',
        }}
        // The boards place the accessory in a 70px gap above the pose
        // (every board's Whobit container has padding-top: 70px). The gap
        // moves only Whobit's own pose (agent decision A6): the box grows
        // to hold it and gives the 70px straight back as a bottom margin,
        // so its layout height contribution stays today's 288px and no
        // other element moves. Inline, so the layout contract is testable;
        // the Default Theme wears no accessory and keeps today's box.
        style={
          whobitAccessory
            ? { paddingTop: '70px', height: '358px', marginBottom: '-70px' }
            : undefined
        }
      >
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
        {whobitAccessory && (
          <Box
            component="img"
            src={whobitAccessory.svg}
            alt=""
            style={{
              position: 'absolute',
              ...whobitAccessory.positions[variant],
            }}
          />
        )}
      </Box>
    </Stack>
  );
}
