import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: '#2563eb', // Indigo Blue
        light: '#60a5fa',
        dark: '#1d4ed8',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#06b6d4', // Cyan
        light: '#22d3ee',
        dark: '#0891b2',
      },
      background: {
        default: mode === 'dark' ? '#0b0f19' : '#f8fafc',
        paper: mode === 'dark' ? '#111827' : '#ffffff',
        sidenav: mode === 'dark' ? '#0f172a' : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? '#f3f4f6' : '#1e293b',
        secondary: mode === 'dark' ? '#9ca3af' : '#64748b',
      },
      divider: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 500 },
      subtitle2: { fontWeight: 500 },
      body1: { fontSize: '0.925rem', lineHeight: 1.6 },
      body2: { fontSize: '0.825rem', lineHeight: 1.5 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: '8px 16px',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow:
              mode === 'dark'
                ? '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.03), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
            border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(0, 0, 0, 0.04)',
            backgroundImage: 'none',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 650,
            color: mode === 'dark' ? '#f3f4f6' : '#1e293b',
            backgroundColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.01)',
          },
          root: {
            fontSize: '0.85rem',
            padding: '12px 16px',
          },
        },
      },
    },
  });
