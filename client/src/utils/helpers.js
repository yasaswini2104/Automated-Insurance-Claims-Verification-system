import { jwtDecode } from 'jwt-decode';

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const extractUserFromToken = (token) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  return {
    id: decoded.id || decoded.userId || decoded.sub,
    email: decoded.sub || decoded.email,
    name: decoded.name || decoded.sub,
    role: decoded.role || decoded.roles?.[0] || 'POLICYHOLDER',
  };
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const statusColor = (status) => {
  const map = {
    ACTIVE: 'success',
    APPROVED: 'success',
    VERIFIED: 'success',
    PENDING: 'warning',
    SUBMITTED: 'info',
    INACTIVE: 'default',
    REJECTED: 'error',
    EXPIRED: 'error',
    CANCELLED: 'error',
    FRAUD: 'error',
    NOT_FRAUD: 'success',
    UNDER_REVIEW: 'warning',
  };
  return map[status?.toUpperCase()] || 'default';
};