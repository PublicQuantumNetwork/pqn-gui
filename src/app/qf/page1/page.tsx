"use client"

import {useState, useEffect, useRef} from 'react';
import Container from '@mui/material/Container';
import { Dialog, DialogContent, Button, Box, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import QFTextbox from '@/components/QFTextbox';
import ModalBox from '@/components/ModalBox';
import { useRouter } from 'next/navigation';
import { submitFortune } from '@/calls';
import {useEnterKey} from "@/hooks/useEnterKey";


 export default function MyComponent() {

  const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
  const router = useRouter();

  const setLinks=()=>{
    setBackArrowLink("/");
    setForwardArrowLink("/qf/page2/");
  }

  useEffect(()=>{setLinks()},[])

    const [open, setOpen] = useState(false);
    const [openModal,setOpenModal] = useState(false);
    const [secondOpen, setSecondOpen] = useState(false);
    const [currentAngle, setCurrentAngle] = useState(1); // Index of angle choice

    const enterOnRef = useRef(true);  // Controls if the enter key press is executed. Needs to be a ref to avoid async updates.

    const handleSubmitClick = async () => {
      if (currentAngle == 7) {
        enterOnRef.current = false;
        setOpenModal(true);
        const response = await submitFortune();

        if (response.success) {
          const value = response.data[0] + 1; // Add 1 to make it 1-indexed
          router.push(`/qf/page2?fail=false&value=${value}`);
        } else {
          router.push(`/qf/page2?fail=true`);
        }
      }
      else {
        setCurrentAngle(currentAngle + 1);
      }
    };

    useEnterKey(() => {
        if (enterOnRef.current) {
            handleSubmitClick();
        }
    });

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

             <Dialog open={openModal} onClose={()=>{}}>
              <ModalBox />
              </Dialog>
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
                            <p>Press the red button seven times to generate your fortune. </p>
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
                          sx={{ width:'50%'}}
                        >
                          <Stack
                              direction="row"
                              sx={{
                                backgroundImage: 'url(/images/circle.png)',
                                Height: '560px',
                                backgroundRepeat: 'no-repeat',
                                width:'560px',
                                backgroundPosition: 'center',
                                position:'relative',
                                left:'40%',
                                }}
                              >
                          <Stack
                              direction="row"
                              >
                            <Stack
                              direction="row"
                              sx={{
                                position: 'relative',
                                zIndex: 2,
                                minHeight:'560px',
                                minWidth:'560px',
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
                                  
                                <QFTextbox questionNumber = {currentAngle} />

                                <Dialog open={open} onClose={() => setOpen(false)}>
                                <DialogContent sx={{ padding: '0em 2.8em', fontSize:'1.45em' }}>
                                <p>&nbsp;</p>
                                
                                <p>&nbsp;</p>
                                </DialogContent>
                            </Dialog>

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





