import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './utils/theme';
import { UIProvider } from './context/UIContext';
import { AuthProvider } from './context/AuthContext';
import { ApiProvider } from './context/ApiContext';
import ProtectedRoute from './routes/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Policies from './pages/Policies';
import Claims from './pages/Claims';
import Documents from './pages/Documents';
import FraudAnalysis from './pages/FraudAnalysis';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UIProvider>
        <AuthProvider>
          <ApiProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Navigate to="/dashboard" replace />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Dashboard />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                      <MainLayout>
                        <Users />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/policies"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'POLICYHOLDER']}>
                      <MainLayout>
                        <Policies />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/claims"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Claims />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/documents"
                  element={
                    <ProtectedRoute>
                      <MainLayout>
                        <Documents />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/fraud"
                  element={
                    <ProtectedRoute allowedRoles={['ADMIN', 'FRAUD_ANALYST']}>
                      <MainLayout>
                        <FraudAnalysis />
                      </MainLayout>
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </ApiProvider>
        </AuthProvider>
      </UIProvider>
    </ThemeProvider>
  );
};

export default App;