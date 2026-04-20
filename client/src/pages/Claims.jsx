import { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, Box, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, IconButton, Tooltip, TableContainer,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  InputAdornment, Chip, LinearProgress,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import PageHeader from '../components/common/PageHeader';
import StatusChip from '../components/common/StatusChip';
import LoadingTable from '../components/common/LoadingTable';
import EmptyState from '../components/common/EmptyState';
import { useApi } from '../context/ApiContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { createClaim, getClaimsByUser, getClaimById } from '../services/claimService';
import { formatCurrency, formatDate } from '../utils/helpers';

const CLAIM_TYPES = ['HEALTH', 'VEHICLE', 'PROPERTY', 'LIFE', 'TRAVEL', 'ACCIDENT'];

const Claims = () => {
  const api = useApi();
  const { showSnackbar } = useUI();
  const { user, role } = useAuth();

  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [lookupUserId, setLookupUserId] = useState(user?.id || '');
  const [form, setForm] = useState({
    policyId: '', claimantId: user?.id || '', claimAmount: '',
    claimType: 'HEALTH', description: '', incidentDate: '',
  });

  const fetchClaims = useCallback(async (uid) => {
    if (!uid) return;
    setLoading(true);
    try {
      const data = await getClaimsByUser(api, uid);
      setClaims(data || []);
    } catch { setClaims([]); } finally { setLoading(false); }
  }, [api]);

  useEffect(() => {
    if (role !== 'ADMIN') fetchClaims(user?.id);
  }, [role, user, fetchClaims]);

  const filtered = claims.filter(c =>
    String(c.id).includes(search) ||
    c.claimType?.toLowerCase().includes(search.toLowerCase()) ||
    c.status?.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!form.policyId) e.policyId = 'Required';
    if (!form.claimantId) e.claimantId = 'Required';
    if (!form.claimAmount || +form.claimAmount <= 0) e.claimAmount = 'Must be positive';
    if (!form.claimType) e.claimType = 'Required';
    if (!form.incidentDate) e.incidentDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setFormLoading(true);
    try {
      await createClaim(api, {
        policyId: +form.policyId,
        claimantId: +form.claimantId,
        claimAmount: +form.claimAmount,
        claimType: form.claimType,
        description: form.description,
        incidentDate: form.incidentDate,
      });
      showSnackbar('Claim submitted successfully!', 'success');
      setOpenCreate(false);
      setForm({ policyId: '', claimantId: user?.id || '', claimAmount: '', claimType: 'HEALTH', description: '', incidentDate: '' });
      if (role !== 'ADMIN') fetchClaims(user?.id);
    } catch { /* global */ } finally { setFormLoading(false); }
  };

  const handleViewDetail = async (id) => {
    try {
      const data = await getClaimById(api, id);
      setSelectedClaim(data);
      setOpenDetail(true);
    } catch { /* global */ }
  };

  const statusProgress = (status) => {
    const map = { SUBMITTED: 20, PENDING: 40, UNDER_REVIEW: 60, APPROVED: 100, REJECTED: 100 };
    return map[status] || 0;
  };

  return (
    <Box>
      <PageHeader
        title="Claims"
        subtitle="Submit and track insurance claims"
        action="Submit Claim"
        onAction={() => setOpenCreate(true)}
      />

      {role === 'ADMIN' && (
        <Card sx={{ mb: 2.5 }}>
          <CardContent sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>Lookup Claims by User ID</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Enter User ID"
                value={lookupUserId}
                onChange={e => setLookupUserId(e.target.value)}
                size="small"
                type="number"
                sx={{ width: 200 }}
              />
              <Button variant="contained" onClick={() => fetchClaims(lookupUserId)} disabled={!lookupUserId}>
                Fetch Claims
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 2.5, pb: 2 }}>
            <TextField
              placeholder="Search claims..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              sx={{ minWidth: 240 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>
              }}
            />
          </Box>

          {loading ? <LoadingTable cols={6} rows={5} /> : filtered.length === 0 ? (
            <EmptyState message="No claims found" icon={<AssignmentRoundedIcon sx={{ fontSize: 56 }} />} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Claim ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Incident Date</TableCell>
                    <TableCell>Progress</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(c => (
                    <TableRow key={c.id} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', fontWeight: 700 }}>#{c.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={c.claimType} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{formatCurrency(c.claimAmount)}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>{formatDate(c.incidentDate)}</TableCell>
                      <TableCell sx={{ minWidth: 120 }}>
                        <LinearProgress
                          variant="determinate"
                          value={statusProgress(c.status)}
                          color={c.status === 'REJECTED' ? 'error' : c.status === 'APPROVED' ? 'success' : 'primary'}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </TableCell>
                      <TableCell><StatusChip status={c.status} /></TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewDetail(c.id)}>
                            <InfoRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Submit Claim Dialog */}
      <Dialog open={openCreate} onClose={() => { setOpenCreate(false); setErrors({}); }} maxWidth="sm" fullWidth>
        <DialogTitle>Submit New Claim</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Policy ID" type="number" value={form.policyId}
                onChange={e => setForm(f => ({ ...f, policyId: e.target.value }))}
                fullWidth error={!!errors.policyId} helperText={errors.policyId} />
              <TextField label="Claimant User ID" type="number" value={form.claimantId}
                onChange={e => setForm(f => ({ ...f, claimantId: e.target.value }))}
                fullWidth error={!!errors.claimantId} helperText={errors.claimantId} />
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <TextField label="Claim Amount (₹)" type="number" value={form.claimAmount}
                onChange={e => setForm(f => ({ ...f, claimAmount: e.target.value }))}
                fullWidth error={!!errors.claimAmount} helperText={errors.claimAmount} />
              <FormControl fullWidth error={!!errors.claimType}>
                <InputLabel>Claim Type</InputLabel>
                <Select value={form.claimType} label="Claim Type"
                  onChange={e => setForm(f => ({ ...f, claimType: e.target.value }))}>
                  {CLAIM_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <TextField label="Incident Date" type="date" value={form.incidentDate}
              onChange={e => setForm(f => ({ ...f, incidentDate: e.target.value }))}
              fullWidth InputLabelProps={{ shrink: true }} error={!!errors.incidentDate} helperText={errors.incidentDate} />
            <TextField label="Description" multiline rows={3} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setOpenCreate(false); setErrors({}); }} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="secondary" disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} color="inherit" /> : null}>
            Submit Claim
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Claim Details #{selectedClaim?.id}</DialogTitle>
        <DialogContent>
          {selectedClaim && (
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 1 }}>
              {[
                { label: 'Claim ID', value: `#${selectedClaim.id}` },
                { label: 'Policy ID', value: `#${selectedClaim.policyId}` },
                { label: 'Claimant ID', value: `#${selectedClaim.claimantId}` },
                { label: 'Claim Type', value: selectedClaim.claimType },
                { label: 'Amount', value: formatCurrency(selectedClaim.claimAmount) },
                { label: 'Incident Date', value: formatDate(selectedClaim.incidentDate) },
                { label: 'Status', value: <StatusChip status={selectedClaim.status} /> },
                { label: 'Filed Date', value: formatDate(selectedClaim.filedDate) },
              ].map(item => (
                <Box key={item.label} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ mt: 0.3 }}>
                    {typeof item.value === 'string' ? (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>{item.value}</Typography>
                    ) : item.value}
                  </Box>
                </Box>
              ))}
              {selectedClaim.description && (
                <Box sx={{ gridColumn: '1 / -1', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>Description</Typography>
                  <Typography variant="body2" sx={{ mt: 0.3 }}>{selectedClaim.description}</Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpenDetail(false)} variant="contained">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Claims;