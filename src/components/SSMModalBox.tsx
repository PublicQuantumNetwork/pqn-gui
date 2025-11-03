"use client"

import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Typography } from '@mui/material';
import { DialogContent, Box, Stack } from '@mui/material';

interface SSMModalBoxProps {
  title?: string;
  description?: string;
}

export default function SSMModalBox(
  props: SSMModalBoxProps
): React.ReactElement {
  const {
    title = "Processing your answers...",
    description = "The backend is executing the quantum game!"
  } = props;

  return (
      <DialogContent sx={{ padding:'50px'}}>
        <Stack
          flexDirection="column"
          sx={{}}
        >
            <Typography
              sx={{color:'#FF5F05', textAlign:'center', paddingBottom:'0px', fontSize:'1.45em'}}
            ><ShareOutlinedIcon/> {title}</Typography>
        </Stack>
        <Stack
          flexDirection="column"
        >
        <Stack
          display="flex"
          flexDirection="row"
          position="relative"
          sx={{}}
        >
          <Box
            component="img"
            src="/images/gif_pqn.gif"
            alt="Your photons in action!"
            sx={{
              width: 'auto',
              height: '25em',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'left',
              float: 'left',
              display: 'flex',
              alignItems: 'center',
              paddingTop:'80px',
              paddingRight:'30px'
            }}
          />

          <Stack
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{ marginTop:'30px'}}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold', float: 'left' }}>
              What is really happening here?
            </Typography>

            <Typography variant="body1" sx={{ float: 'left' }}>
              {description}
            </Typography>

            <Box
              component="img"
              src="/images/pqnbehindthescenesQRcode.png"
              alt="Visit PQN behind the scenes page"
              sx={{
                height:'auto',
                width:'150px',
                padding: '20px 0px',
              }}
            />

            <Typography variant="body1" sx={{ float: 'left' }}>
              Scan the code for a full explanation.<br></br>
              This may take a few minutes.
            </Typography>

          </Stack>
        </Stack>
        </Stack>
      </DialogContent>
  );
}