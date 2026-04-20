import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Chip,
  Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, LinearProgress,
} from '@mui/material';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import StatCard from '../components/common/StatCard';
import StatusChip from '../components/common/StatusChip';
import { useApi } from '../context/ApiContext';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatDate } from '../utils/helpers';
import { getClaimsByUser } from '../services/claimService';
import { getPoliciesByUser, getPoliciesByStatus } from '../services/policyService';

const Dashboard = () => {
  const api = useApi();
  const { user, role } = useAuth();
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = user?.id;
        if (role === 'ADMIN') {
          const [active, pending] = await Promise.allSettled([
            getPoliciesByStatus(api, 'ACTIVE'),
            getPoliciesByStatus(api, 'PENDING'),
          ]);
          const all = [
            ...(active.status === 'fulfilled' ? active.value : []),
            ...(pending.status === 'fulfilled' ? pending.value : []),
          ];
          setPolicies(all);
        } else if (userId) {
          const [c, p] = await Promise.allSettled([
            getClaimsByUser(api, userId),
            getPoliciesByUser(api, userId),
          ]);
          if (c.status === 'fulfilled') setClaims(c.value);
          if (p.status === 'fulfilled') setPolicies(p.value);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api, user, role]);

  const activePolicies = policies.filter(p => p.status === 'ACTIVE').length;
  const pendingClaims = claims.filter(c => c.status === 'PENDING' || c.status === 'SUBMITTED').length;

  return (
    <Box>
      {/* Welcome */}
      <Box sx={{
        mb: 3, p: 3, borderRadius: 3,
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute', top: -30, right: -30,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(233,69,96,0.12)',
        }} />
        <Typography variant="h5" sx={{ color: '#fff', fontWeight: 800, mb: 0.5 }}>
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! 👋
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
          Here's your insurance dashboard overview
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={`Role: ${role}`}
            size="small"
            sx={{ bgcolor: 'rgba(233,69,96,0.2)', color: '#ff6b81', fontWeight: 700, fontSize: '0.7rem' }}
          />
          <Chip
            label={new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}
          />
        </Box>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Policies"
            value={loading ? '—' : policies.length}
            icon={<PolicyRoundedIcon />}
            color="#e94560"
            subtitle="All policies"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Active Policies"
            value={loading ? '—' : activePolicies}
            icon={<PolicyRoundedIcon />}
            color="#00b894"
            subtitle="Currently active"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Total Claims"
            value={loading ? '—' : claims.length}
            icon={<AssignmentRoundedIcon />}
            color="#0984e3"
            subtitle="All time claims"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Pending Claims"
            value={loading ? '—' : pendingClaims}
            icon={<GppMaybeRoundedIcon />}
            color="#fdcb6e"
            subtitle="Awaiting review"
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Recent Claims */}
        {(role !== 'ADMIN') && (
          <Grid item xs={12} lg={7}>
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>Recent Claims</Typography>
                  <Chip label={`${claims.length} total`} size="small" variant="outlined" />
                </Box>
                {loading ? (
                  <LinearProgress sx={{ mx: 3, mt: 2 }} />
                ) : claims.length === 0 ? (
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">No claims found</Typography>
                  </Box>
                ) : (
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Claim ID</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {claims.slice(0, 5).map(claim => (
                        <TableRow key={claim.id} hover>
                          <TableCell>
                            <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', fontWeight: 600 }}>
                              #{claim.id}
                            </Typography>
                          </TableCell>
                          <TableCell>{claim.claimType}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(claim.claimAmount)}</TableCell>
                          <TableCell>{formatDate(claim.incidentDate)}</TableCell>
                          <TableCell><StatusChip status={claim.status} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Policies summary */}
        <Grid item xs={12} lg={role !== 'ADMIN' ? 5 : 12}>
          <Card>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ px: 3, py: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {role === 'ADMIN' ? 'Policy Overview' : 'My Policies'}
                </Typography>
                <Chip label={`${policies.length} total`} size="small" variant="outlined" />
              </Box>
              {loading ? (
                <LinearProgress sx={{ mx: 3, mt: 2 }} />
              ) : policies.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No policies found</Typography>
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Policy ID</TableCell>
                      <TableCell>Coverage</TableCell>
                      <TableCell>Premium</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {policies.slice(0, 6).map(policy => (
                      <TableRow key={policy.id} hover>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: '"DM Mono", monospace', fontWeight: 600 }}>
                            #{policy.id}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{formatCurrency(policy.coverageAmount)}</TableCell>
                        <TableCell>{formatCurrency(policy.premiumAmount)}</TableCell>
                        <TableCell><StatusChip status={policy.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;