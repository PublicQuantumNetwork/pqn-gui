"use client"
import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';

 export default function Home() {
 const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
 const router = useRouter();



  const setLinks=()=>{
    setBackArrowLink("/chsh/page2/");
    setForwardArrowLink("/survey/");
  }

  useEffect(()=>{setLinks()},[])

  useEnterKey(() => {
    router.push("/survey/");
  });

 function MyComponent() {
  const searchParams = useSearchParams();

  const value = Number(searchParams.get('value')).toFixed(2) ?? 0;
  const error = Number(searchParams.get('error')).toFixed(2) ?? 0;

  const failParam = searchParams.get('fail');
  const fail = failParam ? failParam.replace(/\}/g, '') : true;

  const [message, setMessage] = useState('');
  const [message2, setMessage2] = useState('');

  const [showFireworks, setShowFireworks] = useState(false);
  const [showFireworks2, setShowFireworks2] = useState(false);

  // Set the message based on the 'fail' prop
  useEffect(() => {
    if (fail === 'true') {
      setMessage('There was an error, we will work on this.');
      setMessage2('Please try a different game.');
    } else {
      if (parseFloat(value) >= 2) {
        setMessage('Woo!! Hoo!!');
      } else {
        setMessage('Some angles are better than others for this test.');
        setMessage2('Try different angles to see this for yourself!');
      }
    }
  }, [fail]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

    useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks2(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
                    <p>{message}<br /><br />{message2}</p>
                  ) : (
                      parseFloat(value) >= 2 ? (
                       <p>
                          {message}

                        
                      {showFireworks && (<Box
                          component="img"
                          src="/images/red-fireworks.gif"
                          alt="Entanglement was achieved!!"
                          sx={{
                            position: 'absolute',
                            top: '-150px',
                            left: '-380px',
                            width: '12em',
                            height: '10em',
                            zIndex: '0',
                          }}
                        /> )}
                        
                      <Box
                          component="img"
                          src="/images/green-fireworks.gif"
                          alt="Entanglement was achieved!!"
                          sx={{
                            position: 'absolute',
                            top: '-150px',
                            left: '420px',
                            width: '12em',
                            height: '10em',
                            zIndex: '0',
                          }}
                        />

                        {showFireworks2 && (<Box
                          component="img"
                          src="/images/yellow-fireworks.gif"
                          alt="Entanglement was achieved!!"
                          sx={{
                            position: 'absolute',
                            top: '150px',
                            left: '180px',
                            width: '12em',
                            height: '10em',
                            zIndex: '0',
                          }}
                        />)}

                       </p>

                        )  : (
                          <p>{message}<br /><br />{message2}</p>
                        ) 
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
                parseFloat(value) >= 2 ? (
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

                ) : (
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
                )
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
                      {fail == "true" ? (  
                        
                        <>Your value was {value} with an error of {error}</>
                      ) : (
                          parseFloat(value) >= 2 ? (
                            <>Your value was {value} with an error of {error}</>

                          ) : (
                            <>Your value was {value} with an error of {error}</>
                          )
                      )                    
                      }
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
                      {fail === "true" ? (
                        <>This result means the test was unable<br></br>to show the photons are entangled.</>
                      ) : (
                          parseFloat(value) >= 2 ? (
                            <>This result means the test was able to <br></br>show the photons are entangled.</>
                            ) : (
                            ''
                          )
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