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
    setForwardArrowLink("/");
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
                  <p>Please take a moment to fill out this short survey.</p>
                  <p>Press the "START OVER" button to play another game.</p>
                </Typography>


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
                sx={{ width:'600px', marginLeft:'60px', top:'-2px', scrollbarWidth: 'thick', scrollbarColor: '#888 #f1f1f1' }}
              >
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfdGIL2c6nmcvaOU4PKZwy5imlwrGXgCu6nASd1tla6-DvtGQ/viewform?usp=sharing&ouid=104503430832388474561"
                  width="143%"
                  height="570"
                  style={{ border: '3.5px solid #000' }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                
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
