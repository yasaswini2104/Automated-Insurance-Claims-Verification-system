import { Box, Typography } from '@mui/material';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';

const EmptyState = ({ message = 'No records found', icon }) => (
  <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
    <Box sx={{ color: 'text.disabled', opacity: 0.4, fontSize: 56 }}>
      {icon || <InboxRoundedIcon sx={{ fontSize: 56 }} />}
    </Box>
    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
      {message}
    </Typography>
  </Box>
);

export default EmptyState;