"use client"

import { Typography, Link } from '@mui/material';

function envStuff() {
  return process.env
}

interface QFTextboxProps {
  handleClick: () => void;
  handleSecondClick: () => void;
  angleNumber: number;
}

export default function QFTextbox(
  props: QFTextboxProps
): React.ReactElement {
    const handleClick = props.handleClick;
    const handleSecondClick = props.handleSecondClick;
    const angleNumber = props.angleNumber;
    console.log("what are my arguments", handleClick)
    console.log(handleSecondClick)
    console.log(angleNumber)
  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        position: 'absolute',
        top: '20%',
        color: '#000000',
      }}
    >
      <p>
        <strong>{angleNumber}</strong>
      </p>
    </Typography>
  );
}