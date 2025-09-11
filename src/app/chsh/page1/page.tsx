"use client"
import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';

export default function Home() {
 const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();



  const setLinks=()=>{
    setBackArrowLink("/");
    setForwardArrowLink("/chsh/page2/");
  }

  useEffect(()=>{setLinks()},[])

  function MyComponent() {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };


  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          top:'10'
        }}
      >
        <Stack
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{ width:'100%',}}
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
                  <p>
                    
                    <Link href="#" onClick={handleClick}>
                      Entangled photons 
                    </Link>
                     &nbsp;are flying through the library.</p>
                    <p>We are going to check that they are entangled using a Bell Test.{' '}</p>
                </Typography>

                <Dialog open={open} onClose={() => setOpen(false)}>
                  <DialogContent sx={{ padding: '2.8em', fontSize:'1.45em' }}>
                    Entangled photons are light particles that act as if they're connected, even if they are very
                    &nbsp; far apart.
                  </DialogContent>
                </Dialog>

              <Box
                component="img"
                src="/images/whobit-arms-down.png"
                alt="Whobit welcomes you"
                sx={{
                  width: '14.3em',
                  height: 'auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'left',
                  paddingLeft:'4px',
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
