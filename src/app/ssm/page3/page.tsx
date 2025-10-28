"use client"

import {useState, useEffect} from 'react';
import Container from '@mui/material/Container';
import {Dialog, DialogContent, Button, Box, Stack, CircularProgress} from '@mui/material';
import Typography from '@mui/material/Typography';
import {usePageRedirect} from '@/app/contexts/PageRedirectContext';
import { useRouter } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import { fetchRotatorAngle, fetchQuestionOrder, submitSSMAnswers } from '@/calls';
import questions from './questions';

export default function MyComponent() {

  const {setBackArrowLink, setForwardArrowLink} = usePageRedirect();
  const router = useRouter();

  const setLinks=()=>{
    setBackArrowLink("/ssm/page2/");
    setForwardArrowLink("/ssm/page3/");
  }

  useEffect(()=>{setLinks()},[])

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerChoices, setAnswerChoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch question order on component mount
  useEffect(() => {
    const getQuestionOrder = async () => {
      const result = await fetchQuestionOrder();
      if (result.success && result.questionOrder.length > 0) {
        setQuestionOrder(result.questionOrder);
        setLoading(false);
      } else {
        setError(true);
        setLoading(false);
      }
    };
    getQuestionOrder();
  }, []);

  const currentQuestionNumber = questionOrder[currentQuestionIndex];
  const currentQuestionData = questions[currentQuestionNumber - 1] || questions[0];

  // Fetch rotator angle continuously
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchRotatorAngle();
      setArrowRotation(result.theta);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setOpen(true);
  };

  const handleSubmitClick = async () => {
    // Determine which answer based on arrow rotation
    // If arrow points left (180-360 degrees), select answer 'a'
    // If arrow points right (0-180 degrees), select answer 'b'
    const answer = (arrowRotation >= 180 && arrowRotation < 360)
      ? 'a'
      : 'b';

    // Add the answer to the list
    const newAnswers = [...answerChoices, answer];
    setAnswerChoices(newAnswers);

    // Check if this was the last question
    if (currentQuestionIndex === questionOrder.length - 1) {
      // All questions answered, show modal and submit to backend
      setOpenModal(true);

      const result = await submitSSMAnswers(newAnswers);

      if (result.success) {
        // Navigate to results page or handle success
        // router.push(`/ssm/page4?success=true`);
      } else {
        // Handle error
        console.error("Failed to submit answers:", result.error);
      }
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  useEnterKey(() => {
    handleSubmitClick();
  });

  return (
    <Container maxWidth="lg" sx={{}}>
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
              alignItems: 'flex-end',
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
                {loading ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <CircularProgress
                      size={60}
                      thickness={4}
                      sx={{ color: 'black' }}
                    />
                    <p>Loading questions...</p>
                  </Box>
                ) : error ? (
                  <p>Error fetching questions. The question order is not available. Please try again.</p>
                ) : (
                  <>
                    <p>Share your secret message by rotating the wheel to select your answer.</p>
                    <p>Question {currentQuestionIndex + 1} of {questionOrder.length}</p>
                  </>
                )}
              </Typography>

              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogContent sx={{ padding: '0em 2.8em', fontSize:'1.45em' }}>
                  <p>&nbsp;</p>
                  This game uses quantum entanglement to share secret messages between players!
                  <p>&nbsp;</p>
                </DialogContent>
              </Dialog>

              {/* Modal for when all questions are answered */}
              <Dialog open={openModal} onClose={() => {}}>
                <DialogContent sx={{ padding: '2.8em', fontSize:'1.45em', textAlign: 'center' }}>
                  <CircularProgress
                    size={80}
                    thickness={4}
                    sx={{
                      color: 'black',
                      mb: 3,
                    }}
                  />
                  <Typography variant="h5" sx={{ mt: 2 }}>
                    Processing your answers...
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    The backend is executing the quantum game!
                  </Typography>
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
                  backgroundPosition: 'left',
                }}
              />
            </Stack>

            {!loading && !error && (
              <Stack
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{ width:'50%'}}
              >
                {/* Question at the top */}
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    textAlign: 'center',
                    mb: 2,
                    color: '#000000',
                    fontWeight: 'bold',
                  }}
                >
                  {currentQuestionData.question}
                </Typography>

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
                  <Stack direction="row">
                    {/* Left answer (a) */}
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '6%',
                        transform: 'translate(-50%, -50%)',
                        fontSize:'2em',
                        color: '#000000',
                        fontWeight: 'bold',
                      }}
                    >
                      {currentQuestionData.a}
                    </Typography>

                    {/* Right answer (b) */}
                    <Typography
                      variant="h5"
                      component="h1"
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '94%',
                        transform: 'translate(-50%, -50%)',
                        fontSize:'2em',
                        color: '#000000',
                        fontWeight: 'bold',
                      }}
                    >
                      {currentQuestionData.b}
                    </Typography>

                    {/* Vertical divider line to split circle in half */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        height: '430px',
                        width: '4px',
                        backgroundColor: 'grey',
                        zIndex: 1,
                      }}
                    />

                    <Stack
                      direction="row"
                      sx={{
                        position: 'relative',
                        zIndex: 2,
                        minHeight:'560px',
                        minWidth:'560px',
                        alignContent: 'center',
                        justifyContent: 'center',
                      }}
                    >
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
                        />
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
            )}
          </Stack>
        </Stack>
      </Box>
    </Container>
  )
}