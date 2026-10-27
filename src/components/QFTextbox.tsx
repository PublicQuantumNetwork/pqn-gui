'use client';

import { Typography } from '@mui/material';

interface QFTextboxProps {
  questionNumber: number;
}

export default function QFTextbox(props: QFTextboxProps): React.ReactElement {
  const questionNumber = props.questionNumber;
  return (
    <Typography
      // The Halloween Decorations' counter anchor (agent decision A8): the
      // ball's mist is cut to shape around it. Non-visual, so no theme
      // changes the look.
      data-decoration-anchor="qf-counter"
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
