import { useState, useEffect, useCallback } from 'react';
import {
  Card, CardContent, Box, Table, TableHead, TableRow, TableCell,
  TableBody, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Select, FormControl, InputLabel, Chip,
  Typography, Avatar, IconButton, Tooltip, TableContainer,
  InputAdornment, Tab, Tabs, CircularProgress,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import PageHeader from '../components/common/PageHeader';
import LoadingTable from '../components/common/LoadingTable';
import EmptyState from '../components/common/EmptyState';
import { useApi } from '../context/ApiContext';
import { useUI } from '../context/UIContext';
import { useAuth } from '../context/AuthContext';
import { getUsers, createUser, getUserById } from '../services/userService';

const ROLES = ['ADMIN', 'POLICYHOLDER', 'FRAUD_ANALYST'];

const roleColor = { ADMIN: 'error', POLICYHOLDER: 'info', FRAUD_ANALYST: 'secondary' };

const Users = () => {
  const api = useApi();
  const { showSnackbar } = useUI();
  const { role: currentRole } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState('POLICYHOLDER');
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'POLICYHOLDER' });
  const [errors, setErrors] = useState({});

  const fetchUsers = useCallback(async (roleFilter) => {
    setLoading(true);
    try {
      const data = await getUsers(api, roleFilter);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => { fetchUsers(tab); }, [tab, fetchUsers]);

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password.trim()) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (!form.role) e.role = 'Role is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setFormLoading(true);
    try {
      await createUser(api, form);
      showSnackbar('User created successfully', 'success');
      setOpenCreate(false);
      setForm({ name: '', email: '', password: '', role: 'POLICYHOLDER' });
      setErrors({});
      fetchUsers(tab);
    } catch {
      /* handled globally */
    } finally {
      setFormLoading(false);
    }
  };

  const handleViewDetail = async (userId) => {
    try {
      const data = await getUserById(api, userId);
      setSelectedUser(data);
      setOpenDetail(true);
    } catch { /* handled globally */ }
  };

  if (currentRole !== 'ADMIN') {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Access Denied</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <PageHeader
        title="Users"
        subtitle="Manage system users and their roles"
        action="Add User"
        onAction={() => setOpenCreate(true)}
      />

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ px: 3, pt: 2.5, pb: 0 }}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <TextField
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                size="small"
                sx={{ minWidth: 240 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>
                }}
              />
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
              {ROLES.map(r => <Tab key={r} label={r.replace('_', ' ')} value={r} />)}
            </Tabs>
          </Box>

          {loading ? (
            <LoadingTable cols={4} rows={5} />
          ) : filtered.length === 0 ? (
            <EmptyState message="No users found" icon={<PersonRoundedIcon sx={{ fontSize: 56 }} />} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(u => (
                    <TableRow key={u.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{
                            width: 34, height: 34, fontSize: '0.8rem', fontWeight: 700,
                            bgcolor: u.role === 'ADMIN' ? '#e94560' : u.role === 'FRAUD_ANALYST' ? '#6c5ce7' : '#0984e3',
                          }}>
                            {u.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{u.name}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>{u.email}</TableCell>
                      <TableCell>
                        <Chip label={u.role} color={roleColor[u.role] || 'default'} size="small" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', color: 'text.secondary' }}>
                          #{u.id}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewDetail(u.id)}>
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

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={() => { setOpenCreate(false); setErrors({}); }} maxWidth="xs" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 0.5 }}>
            <TextField label="Full Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              fullWidth error={!!errors.name} helperText={errors.name} />
            <TextField label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              fullWidth error={!!errors.email} helperText={errors.email} />
            <TextField label="Password" type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              fullWidth error={!!errors.password} helperText={errors.password} />
            <FormControl fullWidth error={!!errors.role}>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
                {ROLES.map(r => <MenuItem key={r} value={r}>{r.replace('_', ' ')}</MenuItem>)}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => { setOpenCreate(false); setErrors({}); }} variant="outlined">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" color="secondary" disabled={formLoading}
            startIcon={formLoading ? <CircularProgress size={16} color="inherit" /> : <AddRoundedIcon />}>
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="xs" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 56, height: 56, fontSize: '1.3rem', fontWeight: 700, bgcolor: '#e94560' }}>
                  {selectedUser.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>{selectedUser.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                {[
                  { label: 'User ID', value: `#${selectedUser.id}` },
                  { label: 'Role', value: selectedUser.role },
                ].map(item => (
                  <Box key={item.label} sx={{ p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.65rem' }}>{item.label}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.3 }}>{item.value}</Typography>
                  </Box>
                ))}
              </Box>
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

export default Users;