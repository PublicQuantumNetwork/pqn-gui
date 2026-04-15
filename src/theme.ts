'use client';
import { createTheme } from '@mui/material/styles';
import { Roboto } from 'next/font/google';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#FF5F05', // Illini Orange
      light: '#FF8A47',
      dark: '#C84113', // Altgeld Orange (accessibility variant)
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#13294B', // Illini Blue
      light: '#1D58A7', // Industrial (supporting blue)
      dark: '#0D1B33',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
      contrastText: '#FFFFFF',
    },
    warning: {
      main: '#FCB316', // Harvest (Illinois brand gold)
      light: '#FDCA5C',
      dark: '#C88F11',
      contrastText: '#000000',
    },
    info: {
      main: '#009FD4', // Arches (Illinois brand blue)
      light: '#33B3DD',
      dark: '#007FA9',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#006230', // Prairie (Illinois brand green)
      light: '#338659',
      dark: '#004422',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#C8C6C7', // Storm Gray Light (Illinois brand)
      300: '#E0E0E0',
      400: '#9C9A9D', // Storm Gray Medium (Illinois brand)
      500: '#707372', // Storm Gray Dark (Illinois brand)
      600: '#616161',
      700: '#424242',
      800: '#212121',
      900: '#000000',
    },
    text: {
      primary: '#000000',
      secondary: '#707372', // Storm Gray
      disabled: '#9C9A9D',
    },
    background: {
      default: '#FFFFFF',
      paper: '#F5F5F5',
    },
    divider: '#C8C6C7', // Storm Gray Light
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: {
          variants: [
            {
              props: { severity: 'info' },
              style: {
                backgroundColor: '#009FD4',
                color: '#FFFFFF',
              },
            },
          ],
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          border: '1px solid black',
          height: theme.spacing(7),
          '&:hover': {
            backgroundColor: '#F5F5F5',
          },
          '&.Mui-disabled': {
            backgroundColor: '#e0e0e0',
            color: '#757575',
          },
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'royalblue',
          textDecorationColor: 'royalblue',
          '&:hover': {
            color: 'royalblue',
          },
          '&:visited': {
            color: 'royalblue',
          },
        },
      },
    },
  },
});

export default theme;
