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

// The active theme is fixed at build time, so its Palette and
// background are computed once here, not on every render.
const muiTheme = activeMuiTheme();
const backgroundImage = `url(${activeImages().background})`;

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
          <ThemeProvider theme={muiTheme}>
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
                  // The Halloween Decorations' stage anchor: the content box
                  // whose edges are the design boards' stage edges.
                  // Non-visual, so no theme changes the look.
                  data-decoration-anchor="stage"
                  sx={{
                    backgroundImage,
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
