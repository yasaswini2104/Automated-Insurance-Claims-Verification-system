import { useState, useCallback } from 'react';
import {
  Card, CardContent, Box, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, IconButton, Tooltip, TableContainer,
  Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Chip,
} from '@mui/material';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import VerifiedRoundedIcon from '@mui/icons-material/VerifiedRounded';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import PageHeader from '../components/common/PageHeader';
import StatusChip from '../components/common/StatusChip';
import LoadingTable from '../components/common/LoadingTable';
import EmptyState from '../components/common/EmptyState';
import { useApi } from '../context/ApiContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { uploadDocument, getDocumentsByClaim, verifyDocument } from '../services/documentService';
import { formatDate } from '../utils/helpers';

const DOC_TYPES = ['MEDICAL_REPORT', 'POLICE_REPORT', 'INVOICE', 'ID_PROOF', 'PHOTO', 'OTHER'];

const Documents = () => {
  const api = useApi();
  const { showSnackbar } = useUI();
  const { role } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [claimId, setClaimId] = useState('');
  const [openUpload, setOpenUpload] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    claimId: '', documentType: 'INVOICE', documentUrl: '', description: '',
  });

  const fetchDocuments = useCallback(async (cid) => {
    if (!cid) return;
    setLoading(true);
    try {
      const data = await getDocumentsByClaim(api, cid);
      setDocuments(data || []);
    } catch { setDocuments([]); } finally { setLoading(false); }
  }, [api]);

  const validate = () => {
    const e = {};
    if (!form.claimId) e.claimId = 'Required';
    if (!form.documentType) e.documentType = 'Required';
    if (!form.documentUrl.trim()) e.documentUrl = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpload = async () => {
    if (!validate()) return;
    setFormLoading(true);
    try {
      await uploadDocument(api, {
        claimId: +form.claimId,
        documentType: form.documentType,
        documentUrl: form.documentUrl,
        description: form.description,
      });
      showSnackbar('Document uploaded successfully', 'success');
      setOpenUpload(false);
      setForm({ claimId: '', documentType: 'INVOICE', documentUrl: '', description: '' });
      if (claimId) fetchDocuments(claimId);
    } catch { /* global */ } finally { setFormLoading(false); }
  };

  const handleVerify = async (docId, approved) => {
    try {
      await verifyDocument(api, docId, approved);
      showSnackbar(`Document ${approved ? 'approved' : 'rejected'}`, approved ? 'success' : 'warning');
      if (claimId) fetchDocuments(claimId);
    } catch { /* global */ }
  };

  return (
    <Box>
      <PageHeader
        title="Documents"
        subtitle="Upload and manage claim documents"
        action="Upload Document"
        onAction={() => setOpenUpload(true)}
      />

      {/* Lookup */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ py: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1.5 }}>Load Documents by Claim ID</Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Enter Claim ID"
              value={claimId}
              onChange={e => setClaimId(e.target.value)}
              size="small"
              type="number"
              sx={{ width: 200 }}
            />
            <Button variant="contained" onClick={() => fetchDocuments(claimId)} disabled={!claimId}>
              Load Documents
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? <LoadingTable cols={5} rows={4} /> : documents.length === 0 ? (
            <EmptyState
              message={claimId ? 'No documents found for this claim' : 'Enter a Claim ID to load documents'}
              icon={<FolderRoundedIcon sx={{ fontSize: 56 }} />}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Doc ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Uploaded</TableCell>
                    <TableCell>Status</TableCell>
                    {(role === 'ADMIN' || role === 'FRAUD_ANALYST') && <TableCell align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documents.map(doc => (
                    <TableRow key={doc.id} hover>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', fontWeight: 700 }}>#{doc.id}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={doc.documentType?.replace(/_/g, ' ')} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 200 }}>
                        <Typography variant="body2" sx={{ color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {doc.description || doc.documentUrl || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.82rem' }}>{formatDate(doc.uploadedAt)}</TableCell>
                      <TableCell><StatusChip status={doc.verificationStatus || doc.status || 'PENDING'} /></TableCell>
                      {(role === 'ADMIN' || role === 'FRAUD_ANALYST') && (
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                            <Tooltip title="Approve">
                              <IconButton size="small" sx={{ color: 'success.main' }} onClick={() => handleVerify(doc.id, true)}>
                                <VerifiedRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reject">
                              <IconButton size="small" sx={{ color: 'error.main' }} onClick={() => handleVerify(doc.id, false)}>
                                <CancelRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={openUpload} onClose={() => { setOpenUpload(false); setErrors({}); }} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Document</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
            <TextField label="Claim ID" type="number" value={form.claimId}
              onChange={e => setForm(f => ({ ...f, claimId: e.target.value }))}
              fullWidth error={!!errors.claimId} helperText={errors.claimId} />
            <FormControl fullWidth error={!!errors.documentType}>
              <InputLabel>Document Type</InputLabel>
              <Select value={form.documentType} label="Document Type"
                onChange={e => setForm(f => ({ ...f, documentType: e.target.value }))}>
                {DOC_TYPES.map(t => <MenuItem key={t} value={t}>{t.replace(/_/g, ' ')}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Document URL / Reference" value={form.documentUrl}
              onChange={e => setForm(f => ({ ...f, documentUrl: e.target.value }))}
              fullWidth error={!!errors.documentUrl} helperText={errors.documentUrl}
              placeholder="https://storage.example.com/doc.pdf" />
            <TextField label="Description (optional)" multiline rows={2} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setOpenUpload(false); setErrors({}); }} variant="outlined">Cancel</Button>
          <Button onClick={handleUpload} variant="contained" color="secondary" disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} color="inherit" /> : null}>
            Upload Document
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documents;