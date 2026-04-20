import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a2e',
      light: '#16213e',
      dark: '#0f0f1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e94560',
      light: '#ff6b81',
      dark: '#c0392b',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
    success: { main: '#00b894' },
    warning: { main: '#fdcb6e' },
    error: { main: '#e17055' },
    info: { main: '#0984e3' },
    text: {
      primary: '#1a1a2e',
      secondary: '#636e72',
    },
    divider: 'rgba(26,26,46,0.08)',
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 600, letterSpacing: '-0.01em' },
    h4: { fontWeight: 600, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 500, color: '#636e72' },
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400, color: '#636e72' },
    button: { fontWeight: 600, textTransform: 'none', letterSpacing: '0' },
    caption: { fontFamily: '"DM Mono", monospace', fontSize: '0.72rem' },
  },
  shape: { borderRadius: 12 },
  shadows: [
    'none',
    '0 1px 3px rgba(26,26,46,0.06)',
    '0 2px 6px rgba(26,26,46,0.08)',
    '0 4px 12px rgba(26,26,46,0.10)',
    '0 8px 24px rgba(26,26,46,0.12)',
    '0 12px 32px rgba(26,26,46,0.14)',
    ...Array(19).fill('none'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { backgroundColor: '#f5f6fa' },
        '::-webkit-scrollbar': { width: '6px', height: '6px' },
        '::-webkit-scrollbar-track': { background: 'transparent' },
        '::-webkit-scrollbar-thumb': { background: '#b2bec3', borderRadius: '3px' },
        '::-webkit-scrollbar-thumb:hover': { background: '#636e72' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 20px',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #16213e 0%, #0f0f1a 100%)' },
        },
        containedSecondary: {
          background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #c0392b 0%, #a93226 100%)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 2px 12px rgba(26,26,46,0.07)',
          border: '1px solid rgba(26,26,46,0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 6, fontSize: '0.72rem' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            fontWeight: 700,
            fontSize: '0.72rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#636e72',
            backgroundColor: '#f5f6fa',
            borderBottom: '2px solid rgba(26,26,46,0.08)',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(26,26,46,0.05)',
          fontSize: '0.875rem',
          padding: '14px 16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
            '& fieldset': { borderColor: 'rgba(26,26,46,0.15)' },
            '&:hover fieldset': { borderColor: '#1a1a2e' },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: { fontWeight: 700, fontSize: '1.1rem' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          margin: '2px 8px',
          padding: '10px 14px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(233,69,96,0.12)',
            color: '#e94560',
            '& .MuiListItemIcon-root': { color: '#e94560' },
            '&:hover': { backgroundColor: 'rgba(233,69,96,0.16)' },
          },
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
        },
      },
    },
  },
});

export default theme;