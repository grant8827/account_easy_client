import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel
} from '@mui/material';
import { 
  Check,
  Star,
  Support,
  Security,
  CloudSync,
  Assessment
} from '@mui/icons-material';

interface PricingPageProps {
  onPageChange?: (page: string) => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onPageChange }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses just getting started',
      monthlyPrice: 2500,
      annualPrice: 25000,
      popular: false,
      features: [
        'Up to 5 employees',
        'Basic payroll processing',
        'Tax compliance (GCT, PAYE)',
        'Financial reports',
        'Email support',
        '1 business registration'
      ],
      limitations: [
        'Limited advanced reports',
        'No API access'
      ]
    },
    {
      name: 'Professional',
      description: 'Best for growing businesses with more complex needs',
      monthlyPrice: 7500,
      annualPrice: 75000,
      popular: true,
      features: [
        'Up to 25 employees',
        'Advanced payroll features',
        'All tax compliance features',
        'Advanced financial reports',
        'Priority email & phone support',
        'Up to 3 business registrations',
        'Employee self-service portal',
        'Data export capabilities'
      ],
      limitations: []
    },
    {
      name: 'Enterprise',
      description: 'For large businesses requiring premium features',
      monthlyPrice: 12500,
      annualPrice: 125000,
      popular: false,
      features: [
        '50 employees',
        'Full payroll suite',
        'Complete tax & compliance tools',
        'Custom reports & analytics',
        '24/7 phone & email support',
        'Unlimited business registrations',
        'API access',
        'Custom integrations',
        'Dedicated account manager',
        'On-site training available'
      ],
      limitations: []
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const features = [
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Bank-Level Security',
      description: 'Your data is protected with enterprise-grade encryption'
    },
    {
      icon: <CloudSync sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Cloud-Based',
      description: 'Access your data anywhere, anytime from any device'
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Advanced Reports',
      description: 'Comprehensive financial and payroll reporting'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Local Support',
      description: 'Expert support team familiar with Jamaica regulations'
    }
  ];

  return (
    <Box>
      {/* Navigation Bar */}
      <Box
        sx={{
          backgroundColor: '#d9d9d9ff',
          borderBottom: '1px solid #e0e0e0',
          py: 1
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box
              onClick={() => navigate('/')}
              sx={{ cursor: 'pointer' }}
            >
              <img 
                src="/accounteezy-logo-bg.png" 
                alt="AccountEezy Logo" 
                style={{ height: 60, width: 108 }} 
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                color="primary" 
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{ 
                  backgroundColor: '#fac83e', 
                  color: theme.palette.primary.main, 
                  '&:hover': { backgroundColor: '#e6b835' } 
                }}
              >
                Sign Up
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
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
              Simple, Transparent Pricing
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                mb: 4
              }}
            >
              Choose the plan that's right for your business. 
              All plans include our core features with no hidden fees.
            </Typography>
            
            <FormControlLabel
              control={
                <Switch
                  checked={isAnnual}
                  onChange={(e) => setIsAnnual(e.target.checked)}
                  color="default"
                  sx={{
                    '& .MuiSwitch-thumb': {
                      backgroundColor: '#fac83e'
                    },
                    '& .MuiSwitch-track': {
                      backgroundColor: 'rgba(255,255,255,0.3)'
                    }
                  }}
                />
              }
              label={
                <Typography sx={{ color: '#fac83e', fontWeight: 'bold' }}>
                  Annual Billing (Save 17%)
                </Typography>
              }
            />
          </Box>
        </Container>
      </Box>

      {/* Pricing Cards Section */}
      <Container maxWidth="lg" sx={{ py: 8, mt: -2 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {plans.map((plan, index) => (
            <Card 
              key={index}
              sx={{ 
                position: 'relative',
                height: '100%',
                display: 'flex',
                paddingTop: '25px',
                flexDirection: 'column',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[12]
                },
                ...(plan.popular && {
                  border: `2px solid ${theme.palette.primary.main}`,
                  transform: 'scale(1.05)',
                  zIndex: 1
                })
              }}
            >
              {plan.popular && (
                <Chip
                  label="Most Popular"
                  icon={<Star />}
                  sx={{
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    marginTop: '10px',
                    transform: 'translateX(-50%)',
                    backgroundColor: theme.palette.primary.main,
                    color: 'white',
                    fontWeight: 'bold'
                  }}
                />
              )}
              
              <CardContent sx={{ p: 4, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                
                <Box sx={{ my: 3 }}>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}
                  >
                    {formatPrice(isAnnual ? plan.annualPrice : plan.monthlyPrice)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    per {isAnnual ? 'year' : 'month'}
                  </Typography>
                  {isAnnual && (
                    <Typography variant="body2" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                      Save {formatPrice(plan.monthlyPrice * 12 - plan.annualPrice)} annually!
                    </Typography>
                  )}
                </Box>

                <List dense sx={{ flex: 1 }}>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Check sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>

                <Button
                  variant={plan.popular ? "contained" : "outlined"}
                  size="large"
                  fullWidth
                  onClick={() => {
                    // Store selected plan in localStorage for the payment process
                    localStorage.setItem('selectedPlan', JSON.stringify({
                      name: plan.name,
                      price: isAnnual ? plan.annualPrice : plan.monthlyPrice,
                      billing: isAnnual ? 'annual' : 'monthly',
                      features: plan.features
                    }));
                    // Navigate to registration page with selected plan
                    navigate('/register');
                  }}
                  sx={{ 
                    mt: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    ...(plan.popular && {
                      backgroundColor: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    })
                  }}
                >
                  Choose {plan.name}
                </Button>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            What's Included in Every Plan
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 6 }}
          >
            All plans include our core features designed for Jamaica businesses
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 4 
          }}>
            {features.map((feature, index) => (
              <Card 
                key={index}
                sx={{ 
                  textAlign: 'center',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
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
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 6, fontWeight: 'bold' }}
        >
          Pricing FAQ
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
          gap: 4 
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Can I change plans anytime?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, you can upgrade or downgrade your plan at any time. 
                Changes take effect at your next billing cycle.
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Is there a free trial?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes! All plans come with a 14-day free trial. 
                No credit card required to get started.
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                What payment methods do you accept?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We accept all major credit cards, bank transfers, and 
                local Jamaica payment methods.
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Do you offer discounts for non-profits?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Yes, we offer special pricing for registered non-profit 
                organizations. Contact us for more details.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: theme.palette.primary.main, color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2, color: '#fac83e' }}
            >
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              paragraph
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join hundreds of Jamaica businesses already using AccountEezy. 
              Start your free trial today - no credit card required.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => {
                  // Scroll to pricing cards
                  window.scrollTo({ top: 400, behavior: 'smooth' });
                }}
                sx={{ 
                  backgroundColor: '#fac83e',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: '#e6b835'
                  },
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem'
                }}
              >
                Choose Your Plan
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                onClick={() => navigate('/#contact')}
                sx={{ 
                  borderColor: '#fac83e',
                  color: '#fac83e',
                  '&:hover': {
                    borderColor: '#fac83e',
                    backgroundColor: 'rgba(250, 200, 62, 0.1)'
                  },
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem'
                }}
              >
                Contact Sales
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default PricingPage;