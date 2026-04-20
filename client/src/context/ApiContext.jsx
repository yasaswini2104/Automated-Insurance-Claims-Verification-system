import { createContext, useContext, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useUI } from './UIContext';

const ApiContext = createContext(null);

export const ApiProvider = ({ children }) => {
  const { token, logout } = useAuth();
  const { showSnackbar } = useUI();

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
      headers: { 'Content-Type': 'application/json' },
    });
    return instance;
  }, []);

  useEffect(() => {
    const reqInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    const resInterceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || error?.response?.data || error.message;

        if (status === 401) {
          logout();
          showSnackbar('Session expired. Please log in again.', 'error');
        } else if (status === 403) {
          showSnackbar('Access denied.', 'error');
        } else if (status >= 500) {
          showSnackbar('Server error. Please try again later.', 'error');
        } else if (message && typeof message === 'string') {
          showSnackbar(message, 'error');
        }

        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(reqInterceptor);
      api.interceptors.response.eject(resInterceptor);
    };
  }, [token, logout, showSnackbar, api]);

  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};

export const useApi = () => {
  const ctx = useContext(ApiContext);
  if (!ctx) throw new Error('useApi must be used inside ApiProvider');
  return ctx;
};