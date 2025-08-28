"use client"
import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useSearchParams } from 'next/navigation';

export default function Home() {
 const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();



  const setLinks=()=>{
    setBackArrowLink("/chsh/page2/");
    setForwardArrowLink("/");
  }

  useEffect(()=>{setLinks()},[])

  function MyComponent() {
     const searchParams = useSearchParams();
     const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const value = searchParams.get('value');
  const error = searchParams.get('error');


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
                alignItems: 'flex-end', // Align items to the bottom of the row
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
                   <div>
                    <p>ID: {value}</p>
                    <p>Name: {error}</p>
                    </div>
                </Typography>

                <Dialog open={open} onClose={() => setOpen(false)}>
                  <DialogContent>
                    Entangled photons are light particles that act as if they're connected,<p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p> even if they are very far apart.
                  </DialogContent>
                </Dialog>

              <Box
                component="img"
                src="/images/whobit-left-wing-up.png"
                alt="Whobit welcomes you"
                sx={{
                  width: '18em',
                  height: 'auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'left'
                }}
              />

              </Stack>

              <Stack
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{ width:'50%'}}
              >

                
              </Stack>
            </Stack>
      </Stack>

      </Box>
    </Container>
  );
}

return (
    <MyComponent />
  );
}