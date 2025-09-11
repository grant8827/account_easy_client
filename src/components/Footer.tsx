import React from 'react';
import { 
  Box, 
  Container, 
  Typography,
  useTheme
} from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ backgroundColor: theme.palette.grey[900], color: 'white', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' }, 
          gap: 4 
        }}>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              AccountEezy Jamaica
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8 }}>
              Professional financial management software designed specifically for Jamaica businesses.
              Stay compliant, save time, and grow your business with confidence.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Features
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Business Management
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Payroll Processing
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Tax Compliance
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Support
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Help Center
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" color="inherit" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
              Documentation
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.6 }}>
            © 2025 AccountEezy Jamaica. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;