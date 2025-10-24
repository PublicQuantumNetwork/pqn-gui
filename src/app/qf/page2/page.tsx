"use client"
import {useState, useEffect, Suspense} from 'react';
import Container from '@mui/material/Container';
import {Link, Dialog, DialogContent, styled, Box, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useSearchParams, useRouter } from 'next/navigation';
import fortune from '@/app/qf/page2/fortunes';
import { useEnterKey } from '@/hooks/useEnterKey';

 export default function Home() {
 const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
 const router = useRouter();



  const setLinks=()=>{
    setBackArrowLink("/qf/page1/");
    setForwardArrowLink("/survey/");
  }

  useEffect(()=>{setLinks()},[])

  useEnterKey(() => {
    router.push("/survey/");
  });

 function MyComponent() {
  const searchParams = useSearchParams();

  const value = Number(searchParams.get('value')).toFixed(0) ?? 42;

  const failParam = searchParams.get('fail');
  const fail = failParam ? failParam.replace(/\}/g, '') : true;

 const [message, setMessage] = useState('');
 const [message2, setMessage2] = useState('');

  // Set the message based on the 'fail' prop
  useEffect(() => {
    if (fail === 'true') {
      setMessage('There was an error, we will work on this.');
      setMessage2('Please try a different game.');
    } else {
      setMessage('Your fortune is...');
    } 
  }, [fail]);

  interface FortuneItem {
    number: number;
    description: string;
  } 

  const DisplayPage: React.FC = () => {
    const handleClick = (value: number) => {
      // Function to display the description for the given number
      const item = fortune.find((item) => item.number === value);
      if (item) {
        alert(item.description);
      } else {
        alert('No item found with that number.');
      }
    };

  return (
    <div>
        {fortune.map((item) => (
          (Number(item.number) === Number(value)) ? (
            <div key={item.number}>{item.description}</div>
          ) : null
        ))}
    </div>
  );
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
                       <div>
                          {message}
                       </div>
                       
                      ) 
                  }
                  
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
                }

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
                        top: '35%',
                        left: '62%',
                        transform: 'translate(-50%, -50%)',
                        color: '#000000',
                        width: '50%',
                        fontSize:'5em'
                      }}
                    >
                      #{value}
                    </Typography>

                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        position: 'absolute',
                        top: '62%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#000000',
                        width: '60%',
                        fontSize:'1.2em',
                        textAlign:'center'
                      }}
                    >
                      <DisplayPage />
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
    <Suspense fallback={<div>Loading...</div>}>
      <MyComponent />
    </Suspense>
  );
}