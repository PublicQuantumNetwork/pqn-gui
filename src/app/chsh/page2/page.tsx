"use client"
import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { VerticalAlignCenter } from '@mui/icons-material';

export default function Home() {
 const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();



  const setLinks=()=>{
    setBackArrowLink("/chsh/page1/");
    setForwardArrowLink("/chsh/page2/");
  }

  useEffect(()=>{setLinks()},[])

  function MyComponent() {
    const [open, setOpen] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const [data, setData] = useState(null);
     const [arrowRotation, setArrowRotation] = useState(50);

    useEffect(() => {
      const interval = setInterval(() => {
        fetchData();
      }, 1000);

      return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polarimeter/theta');
        const data = await response.json();
        setData(data);
        console.log(data);
        setArrowRotation(data || 45);
      } catch (error) {
        setArrowRotation(45);
        console.error('Error fetching data:', error);
      }
    };


    const handleClick = () => {
      setOpen(true);
    };

    const handleSecondClick = () => {
      setSecondOpen(true);
    };

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
                          <p>
                            By turning the wheel, you choose which{' '}
                            <Link href="#" onClick={handleClick}>
                              polarization
                            </Link>{' '}
                            to offer the <Link href="#" onClick={handleSecondClick}>photons</Link>.{' '}<br></br><br></br>Turn the wheel and press the button to choose <strong>angle #1</strong>!
                          </p>
                        </Typography>

                        <Dialog open={open} onClose={() => setOpen(false)}>
                        <DialogContent>
                          <p>&nbsp;</p>
                          Polarization is the direction light wiggles. <br></br><br></br>The wheel has a polarizer that asks the photons if they are wiggling a certain direction or not. <br></br><br></br>Because the photons are entangled, their answers should be connected.
                          <p>&nbsp;</p>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={secondOpen} onClose={() => setSecondOpen(false)}>
                        <DialogContent>
                          <p>&nbsp;</p>
                          Photons are the faintest possible specks of light.
                          <p>&nbsp;</p>
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
                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '13%',
                            left: '56%',
                            transform: 'translate(-50%, -50%)',
                            fontSize:'2.5em',
                            color: '#000000',
                          }}
                        >
                          A
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '5%',
                            left: '82%',
                            transform: 'translate(-50%, -50%)',
                            fontSize:'2.5em',
                            color: '#000000',
                          }}
                        >
                          V
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '13%',
                            left: '108%',
                            transform: 'translate(-50%, -50%)',
                            fontSize:'2.5em',
                            color: '#000000',
                          }}
                        >
                          D
                        </Typography>

                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '127%',
                            transform: 'translate(-50%, -50%)',
                            fontSize:'2.5em',
                            color: '#000000',
                          }}
                        >
                          H
                        </Typography>


                          <Box
                            sx={{
                              position: 'relative',
                              top: '65%',
                              left: '70%',
                              transform: `rotate(${arrowRotation}deg)`,
                              width: '1.0em',
                              height: 'auto',
                              zIndex: 2,
                            }}
                            >
                              <img
                              src="/images/arrow.png"
                               alt="Arrow"
                              ></img>

                          </Box>
                          


                    </Stack>
                </Stack>

            </Stack>




        </Box>
    </Container>
    )
  }

  return (
    <MyComponent />
  );
}



