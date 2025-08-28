"use client"

import {useState, useEffect, SetStateAction} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, Button, Box, Stack,TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import CHSHTextbox from '@/components/CHSHTextbox';
import { Padding, VerticalAlignCenter } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Router } from 'next/router';



export async function chshPost(basis: number[]) {
  const response = await fetch(`http://127.0.0.1:8000/chsh?follower_node_address=${process.env.NEXT_PUBLIC_FOLLOWER_NODE_ADDRESS}&timetagger_address=${process.env.NEXT_PUBLIC_TIMETAGGER_ADDRESS}`, {
    method: "POST",
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(basis)

  });

  return response
}


async function chshSubmit(currentAngle: number, 
    setAngleChoices: React.Dispatch<SetStateAction<number []>>,
    arrowRotation: number, angleChoices: number[], setCurrentAngle: React.Dispatch<SetStateAction<number>>, router: Router) {
      if (currentAngle == 1) {
        setAngleChoices([arrowRotation])
      } else if (currentAngle == 2) {
        setAngleChoices([...angleChoices, arrowRotation])
        const response = await chshPost([...angleChoices, arrowRotation])

        if (response.status == 200) {
          router.push(`/chsh/page3`);
        } else {
          router.push(`/chsh/page3?fail=true}`);
        }

      } else {
        console.error("Something went wrong please refresh the page")
      }
        
      setCurrentAngle(currentAngle+1)
  }

 export default function MyComponent() {

    const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
    const router = useRouter();
    //console.log("Unique", process.env)


  const setLinks=()=>{
    setBackArrowLink("/chsh/page1/");
    setForwardArrowLink("/chsh/page2/");
  }

  

  useEffect(()=>{setLinks()},[])



    const [open, setOpen] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const [data, setData] = useState(null);
    const [arrowRotation, setArrowRotation] = useState(0);
    const [currentAngle, setCurrentAngle] = useState(1); // Index of angle choice
    const [angleChoices, setAngleChoices] = useState<number []>([])
    const [textValue, setTextValue] = useState('');
    const [triggerSubmit, setTriggerSubmit] = useState(0);
   


    useEffect(() => {
      const interval = setInterval(() => {
        fetchData();
      }, 100);

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      if (triggerSubmit != 0) {
        //console.log("in useEffect")
        chshSubmit(currentAngle, setAngleChoices, arrowRotation, angleChoices, setCurrentAngle, router)
        if (currentAngle == 2) {
          setOpenModal(true)
        }
    }
    }, [triggerSubmit])

    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/polarimeter/theta');
        const data = await response.json();
        setData(data.theta);
        console.log(data.theta);
        setArrowRotation(data.theta || 0);
      } catch (error) {
        setArrowRotation(0);
        console.error('Error fetching data:', error);
      }
    };


    const handleClick = () => {
      setOpen(true);
    };

    const handleSecondClick = () => {
      setSecondOpen(true);
    };

    const handleSubmitClick = () => {
      // chshPost(arrowRotation, currentAngle)
      //console.log("here boi")
      setTriggerSubmit(triggerSubmit+1)
      
    };

    return (
    <Container maxWidth="lg">

        <Dialog open={openModal} onClose={()=>{}}>
          <DialogContent sx={{height:'550 px',}}>
            <Box
              component="img"
              src="/images/gif_pqn.gif"
              alt="Your photons in action!"
              sx={{
                width: 'auto',
                height: '18em',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'left',
                float: 'left',
              }}
            />

            <Typography variant="body1" sx={{ fontWeight: 'bold', float: 'left' }}>
              What is really happening here?
            </Typography>
          </DialogContent>
        </Dialog>


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

                        <CHSHTextbox handleClick = {handleClick} handleSecondClick = {handleSecondClick} angleNumber = {currentAngle} />

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
                      <Stack 
                          direction="row"
                          >
                      <Stack 
                          direction="row" 
                          sx={{
                            backgroundImage: 'url(/images/circle.png)', 
                            Height: '600px', 
                            backgroundRepeat: 'no-repeat', 
                            width:'600px', 
                            backgroundPosition: 'center',
                            position:'relative',
                            left:'40%',
                            }}>
                        <Typography
                          variant="h5"
                          component="h1"
                          sx={{
                            position: 'absolute',
                            top: '20%',
                            left: '18%',
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
                            top: '8%',
                            left: '50%',
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
                            top: '20%',
                            left: '82%',
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
                            left: '94%',
                            transform: 'translate(-50%, -50%)',
                            fontSize:'2.5em',
                            color: '#000000',
                          }}
                        >
                          H
                        </Typography>

                         <Stack 
                          direction="row" 
                          sx={{
                            position: 'relative',
                            zIndex: 2,
                            minHeight:'600px',
                            minWidth:'600px',
                            alignContent: 'center',
                            justifyContent: 'center', // Center the content horizontally
                            }}>
                          <Box
                            sx={{
                              position: 'relative',
                              zIndex: 2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              height: '100%',
                            }}
                            >
                              <img
                              src="/images/arrow.png"
                               alt="Arrow"
                              height={'432px'}
                              style={{
                                transform: `rotate(${arrowRotation}deg)`,
                                transformOrigin: 'center center',
                              }}
                              ></img>

                          </Box>

                          </Stack>
                          
                          <Stack
                           sx={{
                              position:'relative',
                              justifyContent: 'flex-end',
                              paddingBottom: '60px'
                            }}
                          > 
                           <Button
                            variant="contained"
                            component="a"
                            href="#"
                            onClick={handleSubmitClick}
                            sx={{
                              height: '4em',
                              border: '1px solid #000',
                              backgroundColor: '#FFFFFF;',
                              color: '#000000;',
                            }}
                          >
                            Submit
                          </Button>
                          </Stack>
                            
                          </Stack>

                        </Stack>  


                    </Stack>
                </Stack>

            </Stack>




        </Box>
    </Container>
    )
  }





