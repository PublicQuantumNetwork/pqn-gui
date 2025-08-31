"use client"
import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useSearchParams } from 'next/navigation';
import CelebrationIcon from '@mui/icons-material/Celebration';

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

  const value = searchParams.get('value') ?? 0;
  const error = searchParams.get('error') ?? 0;

  const fail = searchParams.get('fail').replace(/\}/g, '') ?? true;

 const [message, setMessage] = useState('');
 const [message2, setMessage2] = useState('');

  // Set the message based on the 'fail' prop
  useEffect(() => {
    if (fail === 'true') {
      setMessage('Some angles are better than others for this test.');
      setMessage2('Try different angles to see this for yourself!');
    } else {
      setMessage('Woo!! Hoo!!');
    }
  }, [fail]);

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
                 {fail === 'true' ? (
                    <p>{message}<br></br><br></br>{message2}</p>
                  ) : (
                       <p>
                        <Box
                          component="img"
                          src="/images/fireworks.gif"
                          alt="Entanglement was achieved!!"
                          sx={{
                            position: 'absolute',
                            top: '-150px',
                            left: '0',
                            width: '100%',
                            height: '15em',
                            zIndex: '0',
                          }}
                        />
                      
                      {/* <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'top', margin: '0' }}>
                        <CelebrationIcon sx={{ color: 'red', paddingLeft: '10px', fontSize: '2em' }} />
                        <CelebrationIcon sx={{ color: 'orange', paddingLeft: '10px', fontSize: '2em' }} />
                        <CelebrationIcon sx={{ color: 'yellow', paddingLeft: '10px', fontSize: '2em' }} />
                        <CelebrationIcon sx={{ color: 'green', paddingLeft: '10px', fontSize: '2em' }} />
                        <CelebrationIcon sx={{ color: 'blue', paddingLeft: '10px', fontSize: '2em' }} />
                        <CelebrationIcon sx={{ color: 'purple', paddingLeft: '10px', fontSize: '2em' }} />
                      </div> */}

                      

                       </p>
                  )}
                  
                </Typography>
            {fail == "true" ? (
              <Box
                component="img"
                src="/images/whobit-arms-down.png"
                alt="Entanglement was not achieved, try again."
                sx={{
                  width: '14.8em',
                  height: 'auto',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain',
                  backgroundPosition: 'left',
                  paddingLeft:'12px',
                  marginLeft:'-10px'
                }}
              />
              ) : (
                <Box
                  component="img"
                  src="/images/whobit-arms-up.png"
                  alt="You achieved entanglement!"
                  sx={{
                    width: '20.85em',
                    height: 'auto',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                    backgroundPosition: 'left',
                    marginLeft:'-54px'
                  }}
                />
                )}

              </Stack>

              <Stack
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{ width:'50%'}}
              >

                <Stack direction="row" 
                  sx={{
                    minHeight: '7em', 
                    justifyContent: 'left',
                    alignItems: 'flex-end', // Align items to the bottom of the row
                  }}
                >

                  <Stack
                    display="flex"
                    flexDirection="column"
                    position="relative"
                    sx={{ width:'100%', marginLeft:'232px'}}
                  >
                  <Box
                    component="img"
                    src="/images/circle.png"
                    alt="Circle background"
                    sx={{
                      width: '560px',
                      height: '560px',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                      backgroundPosition: 'right',
                    }}
                  />
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        position: 'absolute',
                        top: '45%',
                        left: '53%',
                        transform: 'translate(-50%, -50%)',
                        color: '#000000',
                        width: '50%',
                        fontSize:'2em'
                      }}
                    >
                        Your value was {value} with an error of {error}
                    </Typography>

                    <Typography
                       variant="h5"
                       sx={{
                        position: 'absolute',
                        top: '60%',
                        left: '29%',
                        color: '#000000',
                        fontSize:'.85em',
                        textAlign: 'center'
                      }}
                    >
                      {fail == "true" ? (
                        <>This result means the test was unable<br></br>to show the photons are entangled.</>
                      ) : (
                        <>This result means the test was able to <br></br>show the photons are entangled.</>
                      )}
                      </Typography>
                  </Stack>
                </Stack>          
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