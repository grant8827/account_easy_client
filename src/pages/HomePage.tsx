import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  useTheme,
  alpha
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Business,
  People,
  AccountBalance,
  Security,
  Speed,
  Support
} from '@mui/icons-material';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Business sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Business Management',
      description: 'Manage multiple businesses with ease. Track expenses, revenue, and compliance requirements.'
    },
    {
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Employee Management',
      description: 'Handle payroll, benefits, and employee records with Jamaica-specific tax calculations.'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Tax Compliance',
      description: 'Stay compliant with Jamaica tax laws including GCT, PAYE, and statutory deductions.'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Secure & Reliable',
      description: 'Bank-level security with encrypted data storage and secure authentication.'
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Fast & Efficient',
      description: 'Streamlined workflows designed specifically for Jamaica financial operations.'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: '24/7 Support',
      description: 'Local support team familiar with Jamaica business requirements and regulations.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 12,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4, 
            alignItems: 'center' 
          }}>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  color: '#fac83e'
                }}
              >
                Financial Management
                <br />
                Made Easy for your Business
              </Typography>
              <Typography 
                variant="h5" 
                component="p" 
                paragraph
                sx={{ 
                  opacity: 0.9,
                  mb: 4,
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                Streamline your business finances, payroll, and tax compliance 
                with our Jamaica-focused financial management platform.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    backgroundColor: '#fac83e',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha('#eaeaeaff', 0.9)
                    },
                    py: 1.5,
                    px: 4
                  }}
                >
                  Start Free Trial
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderColor: '#ffffff',
                    color: '#fac83e',
                    '&:hover': {
                      borderColor: '#fac83e',
                      backgroundColor: alpha('#ffffff', 0.1)
                    },
                    py: 1.5,
                    px: 4
                  }}
                >
                  Login
                </Button>
              </Box>
            </Box>
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 300
                }}
              >
                <Box
                  sx={{
                    width: 200,
                    height: 200,
                    backgroundColor: alpha('#ffffff', 0.1),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                >
                  <AccountBalance sx={{ fontSize: 80, color: '#fac83e' }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          Everything You Need to Manage Your Business
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 6 }}
        >
          Built specifically for Jamaica businesses with local compliance and tax requirements in mind
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {features.map((feature, index) => (
            <Card 
              key={index}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Ready to Simplify Your Business Finance?
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              paragraph
              sx={{ mb: 4 }}
            >
              Join hundreds of businesses already using AccountEezy to streamline their operations
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/register')}
              sx={{ 
                py: 1.5,
                px: 6,
                fontSize: '1.1rem'
              }}
            >
              Get Started Today
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;