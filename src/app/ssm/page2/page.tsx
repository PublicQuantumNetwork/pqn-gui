"use client"

import Container from '@mui/material/Container';
import { Box, Stack, CircularProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter } from 'next/navigation';


export default function MyComponent() {

  const router = useRouter();

  return (
    <Container maxWidth="lg">

      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Stack
          display="flex"
          flexDirection="column"
          position="relative"
          sx={{ width:'100%'}}
        >
          <Stack direction="row"
                 sx={{
                   minHeight: '8em',
                   justifyContent: 'left',
                   alignItems: 'center', // Align items to the center of the row
                 }}
          >
            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{ width:'50%'}}
            >
              <Box
                component="img"
                src="/images/speech-bubble-white-small.png"
                alt="Whobit welcomes you"
                sx={{
                  width: 'auto',
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
                  position: 'absolute',
                  top: '23%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#000000',
                  width: '75%',
                }}
              >
                <p>Asking your friend to join. Please accept the popup that appears in the other computer.</p>
                <p>If no popup appeared please press the `START OVER` button and try again.</p>
              </Typography>

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

            </Stack>

            <Stack
              display="flex"
              flexDirection="column"
              position="relative"
              sx={{
                width:'50%',
                justifyContent: 'center',
                alignItems: 'flex-end',
                pr: 4,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <CircularProgress
                  size={80}
                  thickness={4}
                  sx={{
                    color: 'black',
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    color: 'black',
                  }}
                >
                  Waiting for response...
                </Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Container>

  )
}





