import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Card, 
  CardContent,
  useTheme
} from '@mui/material';
import { 
  Groups,
  LocalAtm,
  Security,
  Support,
  BusinessCenter
} from '@mui/icons-material';

const AboutPage: React.FC = () => {
  const theme = useTheme();

  const values = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Security First',
      description: 'We prioritize the security of your financial data with bank-grade encryption and security protocols.'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Local Support',
      description: 'Our team understands Jamaica business regulations and provides expert local support.'
    },
    {
      icon: <BusinessCenter sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Business Focus',
      description: 'Built specifically for Jamaica businesses with features that matter to local operations.'
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Community Driven',
      description: 'We listen to our users and continuously improve based on real business needs.'
    }
  ];

  const milestones = [
    { year: '2024', title: 'Company Founded', description: 'AccountEezy was established with a vision to simplify financial management for Jamaica businesses.' },
    { year: '2024', title: 'First Release', description: 'Launched our core platform with business registration and basic financial tools.' },
    { year: '2025', title: 'Tax Integration', description: 'Added comprehensive Jamaica tax compliance features including GCT, PAYE, and statutory deductions.' },
    { year: '2025', title: 'Growing Community', description: 'Now serving hundreds of businesses across Jamaica with continued growth and expansion.' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 12
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#fac83e',
                mb: 3
              }}
            >
              About AccountEezy
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '800px',
                margin: '0 auto',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              We're on a mission to empower Jamaica businesses with simple, powerful financial management tools 
              that help them grow and succeed in today's competitive market.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 6, 
          alignItems: 'center' 
        }}>
          <Box>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 3 }}
            >
              Our Story
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              AccountEezy was born from the frustration of small business owners in Jamaica who struggled 
              with complex financial software that wasn't designed for local needs. Our founders, 
              experienced entrepreneurs themselves, understood the unique challenges of running a business 
              in Jamaica.
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              We set out to create a solution that would simplify financial management while ensuring 
              full compliance with Jamaica's tax laws and business regulations. Today, AccountEezy 
              serves businesses of all sizes across the island.
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our commitment goes beyond just software – we're building a community of successful 
              Jamaica businesses, supported by technology that truly understands their needs.
            </Typography>
          </Box>
          <Box>
            <Box
              sx={{
                backgroundColor: theme.palette.grey[100],
                borderRadius: 2,
                p: 4,
                textAlign: 'center',
                height: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LocalAtm sx={{ fontSize: 120, color: theme.palette.primary.main, opacity: 0.7 }} />
            </Box>
          </Box>
        </Box>
      </Container>

      {/* Our Values Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Our Values
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 6 }}
          >
            The principles that guide everything we do
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 4 
          }}>
            {values.map((value, index) => (
              <Card 
                key={index}
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ mb: 2 }}>
                    {value.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Timeline Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Our Journey
        </Typography>
        
        <Box sx={{ position: 'relative' }}>
          {milestones.map((milestone, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                mb: 4,
                alignItems: 'flex-start',
                '&:last-child': { mb: 0 }
              }}
            >
              <Box
                sx={{
                  minWidth: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.main,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  mr: 3,
                  position: 'relative',
                  zIndex: 1
                }}
              >
                {milestone.year}
              </Box>
              <Box sx={{ flex: 1, pt: 1 }}>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {milestone.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {milestone.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Team Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Our Team
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 6 }}
          >
            Passionate professionals dedicated to your business success
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, 
            gap: 4,
            justifyContent: 'center',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.grey[300],
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Groups sx={{ fontSize: 40, color: theme.palette.grey[600] }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Development Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Expert developers building robust, secure financial solutions
                </Typography>
              </CardContent>
            </Card>
            <Card sx={{ textAlign: 'center' }}>
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    backgroundColor: theme.palette.grey[300],
                    margin: '0 auto 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Support sx={{ fontSize: 40, color: theme.palette.grey[600] }} />
                </Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Support Team
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Local experts providing exceptional customer support
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutPage;