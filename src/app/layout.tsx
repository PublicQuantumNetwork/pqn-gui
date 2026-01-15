'use client';
import * as React from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import { Box, Stack} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { PageRedirectProvider } from '@/app/contexts/PageRedirectContext';
import HeaderBar from "@/components/HeaderBar";
import './globals.css';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={{ touchAction: 'pan-y pan-x' }}
    >
      <body
      >
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <PageRedirectProvider>
              <Stack  // Main component
                display="flex"
                flexDirection="column"
                position="relative"
                justifyContent="center"
                sx={{
                  width: '100%',
                  minHeight: '100vh',
                  touchAction: 'pan-y pan-x',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <HeaderBar />
                <Box
                  sx={{
                    backgroundImage: 'url(/images/GUI-background.png)',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
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
