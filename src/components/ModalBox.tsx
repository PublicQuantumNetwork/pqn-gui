"use client"

import {useState, useEffect, SetStateAction} from 'react';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Typography } from '@mui/material';
import {Link, Dialog, DialogContent, Button, Box, Stack,TextField, Paper } from '@mui/material';

function envStuff() {
  return process.env
}

interface ModalBoxProps {
}


const setLinks=()=>{
  
}

export default function ModalBox(
  props: ModalBoxProps
): React.ReactElement {
  return (

      <DialogContent sx={{ padding:'50px'}}>
        <Stack
          flexDirection="column"
          sx={{}}
        >
            <Typography
              sx={{color:'#FF5F05', textAlign:'center', paddingBottom:'0px', fontSize:'1.45em'}}
            ><ShareOutlinedIcon/> Photons are being measured back at the lab</Typography>
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
              The entangled photons are being measured at the first angle you chose for one photon and at a slightly offset angle for the other photon.
              These measurements are repeated for the second angle. By comparing the results, we can tell whether the photons are entangled.
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