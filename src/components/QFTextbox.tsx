'use client';

import { Typography } from '@mui/material';

interface QFTextboxProps {
  questionNumber: number;
}

export default function QFTextbox(props: QFTextboxProps): React.ReactElement {
  const questionNumber = props.questionNumber;
  return (
    <Typography
      variant="h1"
      component="h1"
      sx={{
        position: 'absolute',
        top: '20%',
        color: '#000000',
        // Above the Decorations layer (zIndex 999), so a theme's ball mist
        // passes behind the counter, as on the boards. No visual change
        // without Decorations.
        zIndex: 1000,
      }}
    >
      <p>
        <strong>{questionNumber}</strong>
      </p>
    </Typography>
  );
}
