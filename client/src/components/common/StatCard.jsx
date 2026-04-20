import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

const StatCard = ({ title, value, icon, color = '#e94560', trend, trendLabel, subtitle }) => {
  return (
    <Card sx={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Box sx={{
        position: 'absolute', top: -20, right: -20,
        width: 100, height: 100, borderRadius: '50%',
        background: `${color}12`,
      }} />
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.7rem' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mt: 0.5, lineHeight: 1.1 }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: `${color}18`, color, width: 48, height: 48, borderRadius: '12px' }}>
            {icon}
          </Avatar>
        </Box>
        {(trend !== undefined || subtitle) && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {trend !== undefined && (
              <>
                {trend >= 0
                  ? <TrendingUpRoundedIcon sx={{ fontSize: 16, color: '#00b894' }} />
                  : <TrendingDownRoundedIcon sx={{ fontSize: 16, color: '#e17055' }} />}
                <Typography variant="caption" sx={{ fontWeight: 700, color: trend >= 0 ? '#00b894' : '#e17055' }}>
                  {Math.abs(trend)}%
                </Typography>
              </>
            )}
            {trendLabel && (
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                {trendLabel}
              </Typography>
            )}
            {subtitle && !trendLabel && (
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;