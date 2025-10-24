'use client'
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider, styled, keyframes } from '@mui/material/styles';
import { Box, Stack, Icon, Button } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
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
            <PageRedirectProvider>


                {/* </Stack>*/}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: '40em', backgroundRepeat: 'no-repeat', width: '100%', backgroundPosition: 'center' }}>
                  {/*<RedirectArrow direction="back">
                    {<Icon sx={{height:'30px'}}><ArrowBackIosNewIcon /></Icon>}
                  </RedirectArrow>*/}
                  {props.children}
                  <RedirectArrow direction="forward">
                    <Icon sx={{height:'30px'}}><ArrowForwardIosIcon /></Icon>
                  </RedirectArrow>
                </Stack>
            </PageRedirectProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
