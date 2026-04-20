import { useState, useCallback } from 'react';
import {
  Card, CardContent, Box, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, IconButton, Tooltip, TableContainer,
  CircularProgress, Alert, Chip, Grid,
} from '@mui/material';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import GppGoodRoundedIcon from '@mui/icons-material/GppGoodRounded';
import GppBadRoundedIcon from '@mui/icons-material/GppBadRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PageHeader from '../components/common/PageHeader';
import StatusChip from '../components/common/StatusChip';
import LoadingTable from '../components/common/LoadingTable';
import EmptyState from '../components/common/EmptyState';
import { useApi } from '../context/ApiContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { analyzeClaim, getFraudsByClaim, markFraud } from '../services/fraudService';
import { formatDate } from '../utils/helpers';

const FraudAnalysis = () => {
  const api = useApi();
  const { showSnackbar } = useUI();
  const { role } = useAuth();

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [analyzeClaimId, setAnalyzeClaimId] = useState('');
  const [lastResult, setLastResult] = useState(null);
  const [openMark, setOpenMark] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [markLoading, setMarkLoading] = useState(false);

  const fetchAlerts = useCallback(async (cid) => {
    if (!cid) return;
    setLoading(true);
    try {
      const data = await getFraudsByClaim(api, cid);
      setAlerts(data || []);
    } catch { setAlerts([]); } finally { setLoading(false); }
  }, [api]);

  const handleAnalyze = async () => {
    if (!analyzeClaimId) return;
    setAnalyzing(true);
    setLastResult(null);
    try {
      const result = await analyzeClaim(api, analyzeClaimId);
      setLastResult(result);
      showSnackbar('Fraud analysis complete', 'success');
      if (claimId === analyzeClaimId) fetchAlerts(claimId);
    } catch { /* global */ } finally { setAnalyzing(false); }
  };

  const handleMarkFraud = async (isFraud) => {
    if (!selectedAlert) return;
    setMarkLoading(true);
    try {
      await markFraud(api, selectedAlert.id, isFraud);
      showSnackbar(`Alert marked as ${isFraud ? 'FRAUD' : 'NOT FRAUD'}`, isFraud ? 'error' : 'success');
      setOpenMark(false);
      if (claimId) fetchAlerts(claimId);
    } catch { /* global */ } finally { setMarkLoading(false); }
  };

  if (role === 'POLICYHOLDER') {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <GppMaybeRoundedIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">Access Denied</Typography>
        <Typography variant="body2" color="text.disabled">Fraud analysis is restricted to Admins and Fraud Analysts</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Fraud Analysis"
        subtitle="Analyze claims and manage fraud alerts"
      />

      <Grid container spacing={2.5} sx={{ mb: 2.5 }}>
        {/* Analyze Panel */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Box sx={{
                  width: 40, height: 40, borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <GppMaybeRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Run Fraud Analysis</Typography>
                  <Typography variant="caption" color="text.secondary">Analyze a claim for potential fraud</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  placeholder="Enter Claim ID"
                  value={analyzeClaimId}
                  onChange={e => setAnalyzeClaimId(e.target.value)}
                  size="small"
                  type="number"
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="contained"
                  sx={{ background: 'linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%)', whiteSpace: 'nowrap' }}
                  onClick={handleAnalyze}
                  disabled={analyzing || !analyzeClaimId}
                  startIcon={analyzing ? <CircularProgress size={16} color="inherit" /> : <SearchRoundedIcon />}
                >
                  {analyzing ? 'Analyzing...' : 'Analyze'}
                </Button>
              </Box>

              {lastResult && (
                <Alert
                  severity={lastResult.fraudulent ? 'error' : 'success'}
                  icon={lastResult.fraudulent ? <GppBadRoundedIcon /> : <GppGoodRoundedIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>
                    {lastResult.fraudulent ? '⚠️ Potential Fraud Detected' : '✅ No Fraud Detected'}
                  </Typography>
                  {lastResult.reason && (
                    <Typography variant="caption">{lastResult.reason}</Typography>
                  )}
                  {lastResult.riskScore !== undefined && (
                    <Typography variant="caption" display="block">
                      Risk Score: <strong>{lastResult.riskScore}</strong>
                    </Typography>
                  )}
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Lookup Panel */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 0.5 }}>View Fraud Alerts</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                Load all fraud alerts for a specific claim
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  placeholder="Enter Claim ID"
                  value={claimId}
                  onChange={e => setClaimId(e.target.value)}
                  size="small"
                  type="number"
                  sx={{ flex: 1 }}
                />
                <Button variant="contained" onClick={() => fetchAlerts(claimId)} disabled={!claimId}>
                  Load Alerts
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Fraud Alerts</Typography>
            {alerts.length > 0 && <Chip label={`${alerts.length} alerts`} size="small" color="error" variant="outlined" />}
          </Box>

          {loading ? <LoadingTable cols={5} rows={4} /> : alerts.length === 0 ? (
            <EmptyState
              message={claimId ? 'No fraud alerts for this claim' : 'Enter a Claim ID to view alerts'}
              icon={<GppMaybeRoundedIcon sx={{ fontSize: 56 }} />}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Alert ID</TableCell>
                    <TableCell>Claim ID</TableCell>
                    <TableCell>Risk Score</TableCell>
                    <TableCell>Analyzed</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {alerts.map(alert => (
                    <TableRow key={alert.id} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', fontWeight: 700 }}>#{alert.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={`Claim #${alert.claimId}`} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: alert.riskScore > 0.7 ? 'error.main' : alert.riskScore > 0.4 ? 'warning.main' : 'success.main' }}>
                            {alert.riskScore !== undefined ? `${(alert.riskScore * 100).toFixed(0)}%` : '—'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>{formatDate(alert.analyzedAt || alert.createdAt)}</TableCell>
                      <TableCell><StatusChip status={alert.status || (alert.fraudulent ? 'FRAUD' : 'NOT_FRAUD')} /></TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                          <Tooltip title="Mark as Fraud">
                            <IconButton size="small" sx={{ color: 'error.main' }}
                              onClick={() => { setSelectedAlert(alert); setOpenMark(true); }}>
                              <GppBadRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Mark as Not Fraud">
                            <IconButton size="small" sx={{ color: 'success.main' }}
                              onClick={() => handleMarkFraud(false)}>
                              <GppGoodRoundedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Mark Fraud Dialog */}
      <Dialog open={openMark} onClose={() => setOpenMark(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Mark Fraud Alert</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Alert #{selectedAlert?.id} — How would you like to classify this alert?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button onClick={() => setOpenMark(false)} variant="outlined">Cancel</Button>
          <Button
            onClick={() => handleMarkFraud(false)}
            variant="contained"
            color="success"
            disabled={markLoading}
            startIcon={<GppGoodRoundedIcon />}
          >
            Not Fraud
          </Button>
          <Button
            onClick={() => handleMarkFraud(true)}
            variant="contained"
            color="error"
            disabled={markLoading}
            startIcon={markLoading ? <CircularProgress size={16} color="inherit" /> : <GppBadRoundedIcon />}
          >
            Confirm Fraud
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FraudAnalysis;