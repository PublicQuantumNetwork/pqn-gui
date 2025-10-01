"use client"

import { Typography } from '@mui/material';

function envStuff() {
  return process.env
}

interface QFTextboxProps {
  questionNumber: number;
}

export default function QFTextbox(
  props: QFTextboxProps
): React.ReactElement {
    const questionNumber = props.questionNumber;
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
        <strong>{questionNumber}</strong>
      </p>
    </Typography>
  );
}