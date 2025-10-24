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
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ minHeight: '40em', backgroundRepeat: 'no-repeat', width: '100%', backgroundPosition: 'center' }}>
      {props.children}
      <RedirectArrow direction="forward">
        <Icon sx={{height:'30px'}}><ArrowForwardIosIcon /></Icon>
      </RedirectArrow>
    </Stack>

  );
}
