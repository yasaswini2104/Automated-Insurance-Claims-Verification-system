import { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Backdrop, CircularProgress } from '@mui/material';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [globalLoading, setGlobalLoading] = useState(false);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <UIContext.Provider value={{ showSnackbar, setGlobalLoading, globalLoading }}>
      {children}
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={globalLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 500 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used inside UIProvider');
  return ctx;
};