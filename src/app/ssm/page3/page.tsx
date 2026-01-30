'use client';

import { useState, useEffect, Suspense } from 'react';
import Container from '@mui/material/Container';
import {
  Dialog,
  Button,
  Box,
  Stack,
  CircularProgress,
} from '@mui/material';
import Typography from '@mui/material/Typography';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEnterKey } from '@/hooks/useEnterKey';
import { useSSE } from '@/hooks/useSSE';
import {
  fetchRotatorAngle,
  fetchQuestionOrder,
  submitSSMAnswers,
} from '@/calls';
import questions from './questions';
import SSMModalBox from '@/components/SSMModalBox';
import Whobit from '@/components/Whobit';

// TODO: Remove the rotating arrow and cirle. Make it into a re-usable component that can be used with chsh.
// TODO: Make the selected option highlighted when the arrow enter its section.
function SSMPage3Content() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams.get('role') || 'leader'; // Default to 'leader' if no role specified

  const [openModal, setOpenModal] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const [questionOrder, setQuestionOrder] = useState<number[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerChoices, setAnswerChoices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);

  // SSE hook for receiving protocol cancellation events
  const { lastMessage: sseMessage } = useSSE(
    '/coordination/state_events',
    !submissionInProgress
  );

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

  // Handle protocol cancellation from SSE
  useEffect(() => {
    if (sseMessage?.event === 'protocol_cancelled') {
      alert('The other player cancelled the protocol. Returning to home.');
      router.push('/');
    }
  }, [sseMessage, router]);

  const currentQuestionNumber = questionOrder[currentQuestionIndex];
  const currentQuestionData =
    questions[currentQuestionNumber - 1] || questions[0];

  // Get the appropriate question text based on role
  const currentQuestion =
    role === 'leader'
      ? currentQuestionData.leader_question
      : currentQuestionData.follower_question;

  // Fetch rotator angle continuously
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchRotatorAngle();
      setArrowRotation(result.theta);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleSubmitClick = async () => {
    // Determine which answer based on arrow rotation
    // If arrow points left (180-360 degrees), select answer 'a'
    // If arrow points right (0-180 degrees), select answer 'b'
    const answer = arrowRotation >= 180 && arrowRotation < 360 ? 'a' : 'b';

    console.log('the answer is: ', answer);
    const newAnswers = [...answerChoices, answer];
    console.log('all answers so far are:', newAnswers);
    setAnswerChoices(newAnswers);

    if (currentQuestionIndex === questionOrder.length - 1) {
      setOpenModal(true);
      setSubmissionInProgress(true);
      const result = await submitSSMAnswers(newAnswers);
      if (result.success) {
        const { n_matching_bits, n_total_bits, emoji, role } = result.data;
        router.push(
          `/ssm/page4?n_matching_bits=${n_matching_bits}&n_total_bits=${n_total_bits}&emoji=${encodeURIComponent(emoji)}&role=${encodeURIComponent(role)}&success=true`
        );
      } else if (result.statusCode === 409) {
        setOpenModal(false);
        setSubmissionInProgress(false);
        alert('The other player has already submitted. Please try again later.');
        router.push('/');
      } else {
        router.push(`/ssm/page4?success=false`);
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
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Stack direction="row" alignItems="flex-start" sx={{ width: '100%' }}>
        <Whobit variant="right-wing-up" speechBubbleHeight="250px">
          <Box sx={{ fontSize: '1em' }}>
            {loading ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <CircularProgress
                  size={60}
                  thickness={4}
                  sx={{ color: 'black' }}
                />
                <p>Loading questions...</p>
              </Box>
            ) : error ? (
              <p>
                Error fetching questions. The question order is not available.
                Please try again.
              </p>
            ) : (
              <>
                {currentQuestionIndex === 0 && (
                  <p>
                    Share your secret message by rotating the wheel to select
                    your answer.
                  </p>
                )}
                <p>
                  Question {currentQuestionIndex + 1} of {questionOrder.length}
                </p>
              </>
            )}
          </Box>
        </Whobit>

        {/* Modal for when all questions are answered */}
        <Dialog maxWidth="md" open={openModal} onClose={() => {}}>
          <SSMModalBox
            title="Your secret message is being encoded and transmitted"
            description="The entangled photons are being measured at the first angle you chose for one photon and at a slightly offset angle for the other photon. These measurements are repeated for the second angle. By comparing the results, we can tell whether the photons are entangled."
          />
        </Dialog>

        {!loading && !error && (
          <Stack
            flexDirection="column"
            flex={1}
            sx={{ paddingRight: '0px', position: 'relative' }}
          >
            {/* Question at the top */}
            <Typography
              variant="h5"
              component="h1"
              sx={{
                position: 'absolute',
                top: '0px',
                left: '50%',
                transform: 'translateX(-50%)',
                textAlign: 'center',
                color: '#000000',
                fontWeight: 'bold',
                width: '80%',
                zIndex: 10,
              }}
            >
              {currentQuestion}
            </Typography>

            <Stack
              direction="row"
              sx={{
                backgroundImage: 'url(/images/circle.png)',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                width: '560px',
                height: '560px',
                position: 'relative',
                marginTop: '50px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              {/* Left answer (a) */}
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '6%',
                  transform: 'translate(-100%, -50%)',
                  fontSize: '1em',
                  color: '#000000',
                  fontWeight: 'bold',
                  width: '150px',
                  textAlign: 'right',
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
                  transform: 'translate(-30%, -50%)',
                  fontSize: '1em',
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

              <Box
                component="img"
                src="/images/arrow.png"
                alt="Arrow"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`,
                  transformOrigin: 'center center',
                  height: '432px',
                  zIndex: 2,
                }}
              />

              <Button
                variant="contained"
                onClick={handleSubmitClick}
                sx={{
                  position: 'absolute',
                  bottom: '60px',
                  right: '-50px',
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
        )}
      </Stack>
    </Container>
  );
}

export default function MyComponent() {
  return (
    // We need to keep SSMPage3Content in a separate Suspense boundary to avoid
    // hydration issues with useSearchParams in Next.js 13
    <Suspense
      fallback={
        <Container maxWidth="lg">
          <Box
            sx={{
              my: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress size={60} thickness={4} sx={{ color: 'black' }} />
          </Box>
        </Container>
      }
    >
      <SSMPage3Content />
    </Suspense>
  );
}
