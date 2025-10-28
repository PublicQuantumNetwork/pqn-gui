"use client"
import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { Box, Dialog, DialogContent, Stack, Button, Snackbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import { usePageRedirect } from '@/app/contexts/PageRedirectContext';
import { useEnterKey } from "@/hooks/useEnterKey";
import { useRouter } from 'next/navigation';
import EmojiPicker, { EmojiClickData, EmojiStyle } from 'emoji-picker-react';

export default function Home() {
  const { setBackArrowLink, setForwardArrowLink } = usePageRedirect();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [emojiText, setEmojiText] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const setLinks = () => {
    setBackArrowLink("/");
    setForwardArrowLink("/ssm/page2/");
  }

  useEffect(() => {
    setLinks()
  }, [])

  useEnterKey(() => {
    handleNextPageCheck()
  });

  const handleClick = () => {
    setOpen(true);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setEmojiText(emojiData.emoji);
    setPickerOpen(false);
  };

  const handleNextPageCheck = () => {
    if (!emojiText) {  // FIXME: probably want to have better validation here, make sure its character, make sure its an emoji, etc.
      setSnackbarOpen(true);
      return;
    }
    router.push("/ssm/page2/");
  }


  return (<Container maxWidth="lg">
    <Box
      sx={{
        my: 4, display: 'flex', flexDirection: 'column', top: '10'
      }}
    >
      <Stack
        display="flex"
        flexDirection="column"
        position="relative"
        sx={{ width: '100%', }}
      >

        <Stack direction="row"
          sx={{
            minHeight: '8em', justifyContent: 'left', alignItems: 'flex-end', // Align items to the bottom of the row
          }}
        >

          <Stack
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{ width: '50%' }}
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
              <p>Share a Secret message is a 2 player game that requires another player to join you.</p>
              <p>Press the big red button to ask the terminal next to you if they want to join you. Please make sure you have a second player ready.</p>
            </Typography>

            <Dialog open={open} onClose={() => setOpen(false)}>
              <DialogContent sx={{ padding: '2.8em', fontSize: '1.45em' }}>
                Entangled photons are light particles that act as if they're connected, even if they
                are very
                &nbsp; far apart.
              </DialogContent>
            </Dialog>

            <Box
              component="img"
              src="/images/whobit-arms-down.png"
              alt="Whobit welcomes you"
              sx={{
                width: '14.3em',
                height: 'auto',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain',
                backgroundPosition: 'left',
                paddingLeft: '4px',
              }}
            />

          </Stack>

          <Stack
            display="flex"
            flexDirection="column"
            position="relative"
            sx={{ width: '50%' }}
          >
            <Stack
              direction="row"
              sx={{
                backgroundImage: 'url(/images/circle.png)',
                Height: '560px',
                backgroundRepeat: 'no-repeat',
                width: '560px',
                backgroundPosition: 'center',
                position: 'relative',
                left: '40%',
              }}
            >
              <Stack direction="row">
                <Stack
                  direction="row"
                  sx={{
                    position: 'relative',
                    zIndex: 2,
                    minHeight: '560px',
                    minWidth: '560px',
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
                    <Box
                      sx={{
                        width: '200px',
                        height: '200px',
                        border: '3px solid #1976d2',
                        borderRadius: '12px',
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        fontSize: '5rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          transform: 'scale(1.05)',
                        },
                        '&:active': {
                          transform: 'scale(0.95)',
                        },
                      }}
                      onClick={() => setPickerOpen(true)}
                    >
                      {emojiText || <Typography sx={{ fontSize: '1rem', color: '#666' }}>Tap</Typography>}
                    </Box>
                  </Box>
                </Stack>

                <Stack
                  sx={{
                    position: 'relative',
                    justifyContent: 'flex-end',
                    paddingBottom: '60px'
                  }}
                >
                  <Button
                    variant="contained"
                    component="a"
                    href="#"
                    onClick={handleNextPageCheck}
                    sx={{
                      height: '4em',
                      border: '1px solid #000',
                      backgroundColor: '#FFFFFF',
                      color: '#000000',
                    }}
                  >
                    Next
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Dialog
              open={pickerOpen}
              onClose={() => setPickerOpen(false)}
              maxWidth="md"
              fullWidth
            >
              <DialogContent sx={{ padding: '20px' }}>
                <EmojiPicker
                  onEmojiClick={handleEmojiClick}
                  width="100%"
                  height="500px"
                  searchDisabled
                  emojiStyle={EmojiStyle.NATIVE}
                  style={{
                    '--epr-emoji-size': '48px',
                  } as React.CSSProperties}
                />
              </DialogContent>
            </Dialog>
          </Stack>
        </Stack>
      </Stack>

    </Box>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={4000}
      onClose={() => setSnackbarOpen(false)}
      message="Please choose an emoji before going to the next page"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      ContentProps={{
        sx: {
          fontSize: '1.2rem',
          backgroundColor: '#f44336',
        }
      }}
    />
  </Container>);
}
