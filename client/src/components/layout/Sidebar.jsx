import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Box, Typography, Divider, Tooltip, Avatar,
} from '@mui/material';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import PolicyRoundedIcon from '@mui/icons-material/PolicyRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import GppMaybeRoundedIcon from '@mui/icons-material/GppMaybeRounded';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard', icon: <DashboardRoundedIcon />, path: '/dashboard', roles: ['ADMIN', 'POLICYHOLDER', 'FRAUD_ANALYST'] },
  { label: 'Users', icon: <PeopleRoundedIcon />, path: '/users', roles: ['ADMIN'] },
  { label: 'Policies', icon: <PolicyRoundedIcon />, path: '/policies', roles: ['ADMIN', 'POLICYHOLDER'] },
  { label: 'Claims', icon: <AssignmentRoundedIcon />, path: '/claims', roles: ['ADMIN', 'POLICYHOLDER', 'FRAUD_ANALYST'] },
  { label: 'Documents', icon: <FolderRoundedIcon />, path: '/documents', roles: ['ADMIN', 'POLICYHOLDER', 'FRAUD_ANALYST'] },
  { label: 'Fraud Analysis', icon: <GppMaybeRoundedIcon />, path: '/fraud', roles: ['ADMIN', 'FRAUD_ANALYST'] },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useAuth();

  const allowed = navItems.filter(item => item.roles.includes(role));

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a1a2e' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldRoundedIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 800, fontSize: '1rem', lineHeight: 1.2 }}>
              InsureFlow
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"DM Mono", monospace', fontSize: '0.65rem' }}>
              Claims Management
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* Nav */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', pt: 1.5 }}>
        <List dense disablePadding>
          {allowed.map((item) => {
            const active = location.pathname.startsWith(item.path);
            return (
              <Tooltip key={item.path} title="" placement="right">
                <ListItemButton
                  selected={active}
                  onClick={() => { navigate(item.path); onClose?.(); }}
                  sx={{
                    color: active ? '#e94560' : 'rgba(255,255,255,0.6)',
                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.05)' },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(233,69,96,0.15)',
                      color: '#e94560',
                      '& .MuiListItemIcon-root': { color: '#e94560' },
                      '&:hover': { bgcolor: 'rgba(233,69,96,0.20)' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: 'inherit', fontSize: 20 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: '0.875rem' }}
                  />
                  {active && (
                    <Box sx={{
                      width: 4, height: 4, borderRadius: '50%',
                      bgcolor: '#e94560', flexShrink: 0,
                    }} />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      {/* User footer */}
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{
          width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700,
          background: 'linear-gradient(135deg, #e94560 0%, #c0392b 100%)',
        }}>
          {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography variant="body2" sx={{ color: '#fff', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            {user?.name || user?.email || 'User'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {role}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
          },
        }}
        open
      >
        {content}
      </Drawer>
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, border: 'none' },
        }}
      >
        {content}
      </Drawer>
    </>
  );
};

export { DRAWER_WIDTH };
export default Sidebar;