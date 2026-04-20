import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Card, CardContent, Typography, TextField,
  Button, InputAdornment, IconButton, Alert, CircularProgress,
} from '@mui/material';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import { useAuth } from '../context/AuthContext';
import { loginRequest } from '../services/authService';
import { extractUserFromToken } from '../utils/helpers';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    try {
      const token = await loginRequest(email, password);
      const userData = extractUserFromToken(token);
      if (!userData) throw new Error('Invalid token received');
      login(token, userData);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data || err.message || 'Login failed';
      setError(typeof msg === 'string' ? msg : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      bgcolor: '#0f0f1a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative bg */}
      <Box sx={{
        position: 'absolute', top: '-10%', left: '-5%',
        width: '50%', height: '70%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(233,69,96,0.15) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <Box sx={{
        position: 'absolute', bottom: '-10%', right: '-5%',
        width: '40%', height: '60%', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(9,132,227,0.10) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Left panel */}
      <Box sx={{
        display: { xs: 'none', lg: 'flex' }, flex: 1,
        flexDirection: 'column', justifyContent: 'center', p: 8,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6 }}>
          <Box sx={{
            width: 52, height: 52, borderRadius: '14px',
            background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>InsureFlow</Typography>
        </Box>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.1, mb: 2 }}>
          Protect what<br />
          <Box component="span" sx={{ color: '#e94560' }}>matters most.</Box>
        </Typography>
        <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.45)', maxWidth: 420, lineHeight: 1.8 }}>
          A unified platform to manage insurance claims, policies, documents, and fraud detection — built for modern insurance teams.
        </Typography>

        {/* Feature bullets */}
        {['End-to-end claim lifecycle management', 'AI-powered fraud detection & analysis', 'Role-based access for teams of any size'].map((f, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: i === 0 ? 4 : 1.5 }}>
            <Box sx={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
              flexShrink: 0,
            }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{f}</Typography>
          </Box>
        ))}
      </Box>

      {/* Right panel - Login Form */}
      <Box sx={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flex: { xs: 1, lg: 'none' }, width: { lg: 480 },
        p: { xs: 3, sm: 4 },
        bgcolor: { lg: 'rgba(255,255,255,0.03)' },
        borderLeft: { lg: '1px solid rgba(255,255,255,0.06)' },
      }}>
        <Box sx={{ width: '100%', maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box sx={{ display: { lg: 'none' }, mb: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '14px',
              background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 1.5,
            }}>
              <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800 }}>InsureFlow</Typography>
          </Box>

          <Card sx={{ bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)' }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>Sign in</Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 3 }}>
                Enter your credentials to continue
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.82rem' }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <TextField
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  fullWidth
                  autoComplete="email"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#e94560' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
                  }}
                />
                <TextField
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  fullWidth
                  autoComplete="current-password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockRoundedIcon sx={{ fontSize: 18, color: 'rgba(255,255,255,0.3)' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setShowPass(p => !p)} edge="end" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                          {showPass ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255,255,255,0.12)' },
                      '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.3)' },
                      '&.Mui-focused fieldset': { borderColor: '#e94560' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#e94560' },
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled={loading}
                  size="large"
                  sx={{ mt: 1, py: 1.5, fontSize: '0.95rem', fontWeight: 700 }}
                >
                  {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign in'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.2)' }}>
            © 2024 InsureFlow CMS · All rights reserved
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;