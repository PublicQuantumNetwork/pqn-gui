"use client"

import { Typography, Link } from '@mui/material';

function envStuff() {
  return process.env
}

export default function CHSHTextbox(
  props
): React.ReactElement {
    const handleClick = props.handleClick;
    const handleSecondClick = props.handleSecondClick;
    const angleNumber = props.angleNumber;
    console.log("what are my arguments", handleClick)
    console.log(handleSecondClick)
    console.log(angleNumber)
  return (
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
        to offer the <Link href="#" onClick={handleSecondClick}>photons</Link>.{' '}
        <br />
        <br />
        Turn the wheel and press the button to choose <strong>angle #{angleNumber}</strong>!
      </p>
      <p>{envStuff().keys}</p>
    </Typography>
  );
}