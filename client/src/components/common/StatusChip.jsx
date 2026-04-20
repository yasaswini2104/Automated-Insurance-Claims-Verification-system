import { Box, Typography, Button } from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';

const PageHeader = ({ title, subtitle, action, onAction, actionIcon, secondaryAction, onSecondaryAction }) => (
  <Box sx={{ display: 'flex', alignItems: { sm: 'center' }, justifyContent: 'space-between', mb: 3, flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary' }}>{title}</Typography>
      {subtitle && <Typography variant="body2" sx={{ mt: 0.5 }}>{subtitle}</Typography>}
    </Box>
    {(action || secondaryAction) && (
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {secondaryAction && (
          <Button variant="outlined" onClick={onSecondaryAction} sx={{ borderColor: 'divider', color: 'text.primary' }}>
            {secondaryAction}
          </Button>
        )}
        {action && (
          <Button variant="contained" color="secondary" startIcon={actionIcon || <AddRoundedIcon />} onClick={onAction}>
            {action}
          </Button>
        )}
      </Box>
    )}
  </Box>
);

export default PageHeader;