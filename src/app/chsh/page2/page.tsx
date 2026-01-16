'use client';

import { useState, useEffect, SetStateAction } from 'react';
import Container from '@mui/material/Container';
import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Stack,
  Link, styled,
} from '@mui/material';
import Whobit from '@/components/Whobit';
import ModalBox from '@/components/ModalBox';
import RotatorCircle from '@/components/RotatorCircle';
import { useRouter } from 'next/navigation';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useEnterKey } from '@/hooks/useEnterKey';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import PolylineIcon from '@mui/icons-material/Polyline';
import { chshPost, fetchRotatorAngle } from '@/calls';

const AngleLabel = styled(Box)<{ top: string; left: string }>(
  ({ top, left }) => ({
    position: 'absolute',
    top,
    left,
    transform: 'translate(-50%, -50%)',
    fontSize: '2.5em',
    color: '#000000',
  })
);

async function chshSubmit(
  currentAngle: number,
  setAngleChoices: React.Dispatch<SetStateAction<number[]>>,
  arrowRotation: number,
  angleChoices: number[],
  setCurrentAngle: React.Dispatch<SetStateAction<number>>,
  router: AppRouterInstance
) {
  if (currentAngle == 1) {
    setAngleChoices([arrowRotation]);
  } else if (currentAngle == 2) {
    setAngleChoices([...angleChoices, arrowRotation]);
    const response = await chshPost([...angleChoices, arrowRotation]);

    if (response.status == 200) {
      const data = await response.json();
      const value = data.chsh_value;
      const error = data.chsh_error;
      router.push(`/chsh/page3?fail=false&value=${value}&error=${error}`);
    } else {
      router.push(`/chsh/page3?fail=true`);
    }
  } else {
    console.error('Something went wrong please refresh the page');
  }

  setCurrentAngle(currentAngle + 1);
}

export default function Page() {
  const router = useRouter();
  const [openMeasuringModal, setOpenMeasuringModal] = useState(false);
  const [openPolarizationModal, setOpenPolarizationModal] = useState(false);
  const [openPhotonModal, setOpenPhotonModal] = useState(false);

  const [arrowRotation, setArrowRotation] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(1); // Index of angle choice
  const [angleChoices, setAngleChoices] = useState<number[]>([]);
  const [triggerSubmit, setTriggerSubmit] = useState(0);

  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await fetchRotatorAngle();
      console.log(result.theta);
      setArrowRotation(result.theta * 2);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (triggerSubmit != 0) {
      chshSubmit(
        currentAngle,
        setAngleChoices,
        arrowRotation,
        angleChoices,
        setCurrentAngle,
        router
      );
      if (currentAngle == 2) {
        setOpenMeasuringModal(true);
      }
    }
  }, [triggerSubmit]);

  const handleClick = () => {
    setOpenPolarizationModal(true);
  };

  const handleSecondClick = () => {
    setOpenPhotonModal(true);
  };

  const handleSubmitClick = () => {
    setTriggerSubmit(triggerSubmit + 1);
  };

  useEnterKey(() => {
    handleSubmitClick();
  });

  return (
    <Container maxWidth="lg"
               sx={{
                 my: 4,
    }}>

      <Dialog maxWidth="md" open={openMeasuringModal} onClose={() => {}}>
        <ModalBox />
      </Dialog>

      <Dialog open={openPolarizationModal} onClose={() => setOpenPolarizationModal(false)}>
        <DialogContent
          sx={{ padding: '0em 2.8em', fontSize: '1.45em' }}
        >
          <p>&nbsp;</p>
          Polarization is the direction light wiggles.{' '}
          <MovingIcon fontSize="large" /> <br></br>
          <br></br>
          The wheel has a polarizer that asks the photons if they are
          wiggling a certain direction or not. <TrendingFlatIcon />{' '}
          <DoDisturbIcon />
          <br></br>
          <br></br>
          Because the photons are entangled, their answers should be
          connected. <PolylineIcon />
          <p>&nbsp;</p>
        </DialogContent>
      </Dialog>

      <Dialog open={openPhotonModal} onClose={() => setOpenPhotonModal(false)}>
        <DialogContent
          sx={{ padding: '0em 2.8em', fontSize: '1.45em' }}
        >
          <p>&nbsp;</p>
          Photons are the faintest possible specks of light.{' '}
          <WbSunnyIcon
            fontSize="small"
            sx={{ color: 'orange', paddingTop: '10px' }}
          />
          <p>&nbsp;</p>
        </DialogContent>
      </Dialog>

      <Stack
        direction="row"
        sx={{
          minHeight: '8em',
          alignItems: 'center',
        }}
      >
        <Whobit variant="left-wing-up">
          {currentAngle === 1 && (
            <p>
              By turning the wheel, you choose which{' '}
              <Link href="#" onClick={handleClick}>
                polarization
              </Link>{' '}
              to offer the{' '}
              <Link href="#" onClick={handleSecondClick}>
                photons
              </Link>
              . <br />
              <br />
              Turn the wheel and press the button to choose{' '}
              <strong>angle #{currentAngle}</strong>!
            </p>
          )}
          {currentAngle === 2 && (
            <p>
              Great job!
              <br />
              <br />
              Now choose <strong>angle #{currentAngle}</strong>!
            </p>
          )}
        </Whobit>

        <Box sx={{ position: 'relative' }}>
          <RotatorCircle rotation={arrowRotation}>
            <AngleLabel top="20%" left="18%">A</AngleLabel>
            <AngleLabel top="6%" left="50%">V</AngleLabel>
            <AngleLabel top="20%" left="82%">D</AngleLabel>
            <AngleLabel top="50%" left="94%">H</AngleLabel>
          </RotatorCircle>

          <Button
            variant="contained"
            onClick={handleSubmitClick}
            sx={{
              position: 'absolute',
              bottom: -35,
              right: -35,
              height: '5em',
              width: '10em',
              fontSize: '1.2em',
            }}
          >
            Submit
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
