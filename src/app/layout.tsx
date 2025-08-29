"use client"
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, styled, keyframes } from '@mui/material/styles';
import { Box, Stack, Icon, Button } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {PageRedirectProvider} from '@/app/contexts/PageRedirectContext';
import { WebSocketProvider } from '@/app/contexts/WebSocketContext';
import RedirectArrow from '@/components/RedirectArrow';

export default function RootLayout(props: { children: React.ReactNode }) {

 
  
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', marginRight: 'auto', marginLeft: 'auto' }}>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {/* <ModeSwitch /> */}
            <WebSocketProvider>
              <PageRedirectProvider>
              <Stack
                  display="flex"
                  flexDirection="column"
                  position="relative"
                  sx={{ width:'100%'}}
                >
                  {/*<Stack direction="row" 
                  sx={{backgroundImage: 'url(images/PQN-blue-ufl-website-image-blue4-small.png)', minHeight: '8em', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center', marginTop: '2em',}}
                  >*/}

                  <Stack direction="row" 
                    sx={{
                      minHeight: '8em', 
                      marginTop: '2em',
                      justifyContent: 'center',
                      alignItems: 'flex-end', // Align items to the bottom of the row
                    }}
                  >
                    <Box
                      component="img"
                      src="/images/PQN-blue-ufl-website-image-blue4-small.png"
                      alt="Public Quantum Network"
                      sx={{
                        maxWidth: '100%',
                        height: 'auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center'
                      }}
                    />

                    <Box
                      component="img"
                      src="/images/qrcode.png"
                      alt="Visit the PQN website"
                      sx={{
                        maxWidth: '100%',
                        height: '4em',
                        display:'block',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center bottom',
                        margin: '0 68.5em 20px 3em', // Add this line to set the padding
                        border: '1px solid #000'
                      }}
                    />

                    <Button
                    variant="contained"
                    component="a"
                    href="/"
                    sx={{
                      maxWidth: '100%',
                      height: '4em',
                      display: 'block',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center bottom',
                      margin: '0 0 20px 3em',
                      paddingTop:'15px',
                      border: '1px solid #000',
                      backgroundColor: '#FFFFFF;',
                      color: '#000000;'
                    }}
                  >
                    Start Over
                  </Button>

                  <Box
                      component="img"
                      src="/images/block-I.png"
                      alt="University of Illinois Urbana-Champaign"
                      sx={{
                        maxWidth: '100%',
                        height: '3.8em',
                        display:'block',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'contain',
                        backgroundPosition: 'right bottom',
                        margin: '0 0em 16px 4em', // Add this line to set the padding
                      }}
                    />

                  </Stack>
                    
                  {/* </Stack>*/}
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{backgroundImage: 'url(/images/GUI-background.png)', minHeight: '40em', backgroundRepeat: 'no-repeat', width:'100%', backgroundPosition: 'center'}}>
                    <RedirectArrow direction="back">
                    {<Icon><ArrowBackIosNewIcon/></Icon>}
                  </RedirectArrow>
                    {props.children}
                    <RedirectArrow direction="forward">
                    <Icon><ArrowForwardIosIcon/></Icon>
                  </RedirectArrow>
                  </Stack>
              </Stack>
              </PageRedirectProvider>
            </WebSocketProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
