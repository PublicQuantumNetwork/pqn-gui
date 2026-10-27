'use client';
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Stack } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { activeImages, activeMuiTheme } from '@/themes';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
import HeaderBar from '@/components/HeaderBar';
import './globals.css';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ touchAction: 'pan-y pan-x' }}
    >
      <body>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={activeMuiTheme()}>
            <CssBaseline />
            <PageRedirectProvider>
              <Stack // Main component
                display="flex"
                flexDirection="column"
                position="relative"
                sx={{
                  width: '100%',
                  height: '100vh',
                  touchAction: 'pan-y pan-x',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <HeaderBar />
                <Box
                  sx={{
                    backgroundImage: `url(${activeImages().background})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center top',
                    backgroundSize: '100% 100%',
                    position: 'relative',
                    width: '100%',
                    height: '60vh',
                    overflow: 'hidden',
                  }}
                >
                  {props.children}
                </Box>
              </Stack>
            </PageRedirectProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
