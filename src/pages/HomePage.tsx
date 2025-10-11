import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  useTheme,
  alpha,
  Chip,
  Avatar,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Paper,
  Fade,
  Slide
} from '@mui/material';

import {
  Business,
  People,
  AccountBalance,
  Security,
  Support,
  CheckCircle,
  ExpandMore,
  PlayArrow,
  ArrowForward,
  Schedule,
  MonetizationOn,
  Dashboard,
  CloudSync,
  Lock,
  Smartphone,
  Language,
  GroupWork
} from '@mui/icons-material';

// Animated Counter Component
const AnimatedCounter: React.FC<{ end: number; duration?: number; suffix?: string }> = ({ 
  end, 
  duration = 2000, 
  suffix = '' 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationId: number;

    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationId = requestAnimationFrame(updateCount);
      }
    };

    animationId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationId);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
};

interface HomePageProps {
  onPageChange?: (page: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: <Business sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Multi-Business Management',
      description: 'Seamlessly manage multiple businesses from one dashboard. Track expenses, revenue, and compliance requirements across all your ventures.',
      benefits: ['Unlimited business profiles', 'Cross-business reporting', 'Consolidated dashboards']
    },
    {
      icon: <People sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Smart Payroll System',
      description: 'Automated payroll processing with Jamaica-specific tax calculations, statutory deductions, and compliance reporting.',
      benefits: ['PAYE calculations', 'NIS contributions', 'Statutory deductions']
    },
    {
      icon: <AccountBalance sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Tax Compliance Suite',
      description: 'Stay compliant with Jamaica tax laws including GCT, PAYE, and all statutory requirements with automated calculations.',
      benefits: ['GCT management', 'Tax return preparation', 'Compliance alerts']
    },
    {
      icon: <Security sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Enterprise Security',
      description: 'Bank-level security with 256-bit encryption, secure authentication, and regular security audits.',
      benefits: ['End-to-end encryption', 'Multi-factor authentication', 'Regular backups']
    },
    {
      icon: <Dashboard sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Real-Time Analytics',
      description: 'Advanced reporting and analytics with real-time insights into your business performance and financial health.',
      benefits: ['Live dashboards', 'Custom reports', 'Predictive analytics']
    },
    {
      icon: <CloudSync sx={{ fontSize: 50, color: theme.palette.primary.main }} />,
      title: 'Cloud Integration',
      description: 'Access your data anywhere with secure cloud storage, automatic syncing, and offline capabilities.',
      benefits: ['24/7 access', 'Automatic sync', 'Mobile apps']
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Campbell',
      role: 'Small Business Owner',
      company: 'Campbell\'s Catering',
      rating: 5,
      comment: 'AccountEezy transformed how I manage my catering business. The payroll system handles all the tax calculations automatically, saving me hours each week.',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Marcus Brown',
      role: 'Financial Manager',
      company: 'Brown & Associates',
      rating: 5,
      comment: 'The compliance features are outstanding. We never miss a tax deadline and the GCT calculations are always accurate. Best investment we\'ve made.',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Jennifer Williams',
      role: 'Restaurant Owner',
      company: 'Spice Garden Restaurant',
      rating: 5,
      comment: 'Managing 25 employees was a nightmare before AccountEezy. Now payroll takes minutes instead of hours, and everything is compliant.',
      avatar: '/api/placeholder/60/60'
    }
  ];

  const faqs = [
    {
      question: 'Is AccountEezy compliant with Jamaica tax laws?',
      answer: 'Yes, AccountEezy is fully compliant with all Jamaica tax regulations including GCT, PAYE, NIS contributions, and other statutory requirements. Our system is regularly updated to reflect any changes in tax laws.'
    },
    {
      question: 'Can I manage multiple businesses?',
      answer: 'Absolutely! AccountEezy allows you to manage unlimited businesses from a single dashboard. Each business has its own separate books while giving you consolidated reporting across all ventures.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We offer 24/7 customer support via phone, email, and live chat. Our support team is based in Jamaica and understands local business requirements. We also provide free onboarding and training.'
    },
    {
      question: 'How secure is my data?',
      answer: 'Your data security is our top priority. We use bank-level 256-bit encryption, secure servers, regular backups, and multi-factor authentication. All data is stored in compliance with international security standards.'
    },
    {
      question: 'Can I try AccountEezy before committing?',
      answer: 'Yes! We offer a 30-day free trial with full access to all features. No credit card required. You can also schedule a free demo with our team to see how AccountEezy can benefit your business.'
    }
  ];

  const stats = [
    { label: 'Active Businesses', value: 1250, suffix: '+' },
    { label: 'Transactions Processed', value: 500000, suffix: '+' },
    { label: 'Tax Returns Filed', value: 8500, suffix: '+' },
    { label: 'Customer Satisfaction', value: 98, suffix: '%' }
  ];

  return (
    <Box>
      {/* Enhanced Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 4, 
              alignItems: 'center' 
            }}>
              <Box>
                <Chip 
                  label="🚀 Now serving 1,250+ businesses across Jamaica" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: alpha('#fac83e', 0.2),
                    color: '#fac83e',
                    fontWeight: 'bold'
                  }} 
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    color: '#fac83e',
                    lineHeight: 1.1,
                    mb: 3
                  }}
                >
                  Transform Your Business
                  <br />
                  <span style={{ color: 'white' }}>with Smart Finance</span>
                </Typography>
                <Typography 
                  variant="h5" 
                  component="p" 
                  paragraph
                  sx={{ 
                    opacity: 0.9,
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                    lineHeight: 1.4
                  }}
                >
                  The complete financial management solution built specifically for Jamaica businesses. 
                  Automate payroll, ensure tax compliance, and gain real-time insights into your business performance.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#fac83e', fontSize: 20 }} />
                    <Typography>Simplify Work</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#fac83e', fontSize: 20 }} />
                    <Typography>Amplify Growth</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#fac83e', fontSize: 20 }} />
                    <Typography>24/7 Availability</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/pricing')}
                    endIcon={<ArrowForward />}
                    sx={{ 
                      backgroundColor: '#fac83e',
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha('#fac83e', 0.9),
                        transform: 'translateY(-2px)'
                      },
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{ 
                      borderColor: '#ffffff',
                      color: '#fac83e',
                      '&:hover': {
                        borderColor: '#fac83e',
                        backgroundColor: alpha('#ffffff', 0.1),
                        transform: 'translateY(-2px)'
                      },
                      py: 2,
                      px: 4,
                      fontSize: '1.1rem',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Watch Demo
                  </Button>
                </Box>
              </Box>
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: { xs: 250, md: 400 }
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 200, md: 300 },
                      height: { xs: 200, md: 300 },
                      backgroundColor: alpha('#ffffff', 0.1),
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '3px solid rgba(255,255,255,0.3)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -20,
                        right: -20,
                        width: 40,
                        height: 40,
                        backgroundColor: '#fac83e',
                        borderRadius: '50%',
                        opacity: 0.8
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -15,
                        left: -15,
                        width: 30,
                        height: 30,
                        backgroundColor: alpha('#ffffff', 0.3),
                        borderRadius: '50%'
                      }
                    }}
                  >
                    <Dashboard sx={{ fontSize: { xs: 80, md: 120 }, color: '#fac83e' }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Box sx={{ py: 8, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
            gap: 4 
          }}>
            {stats.map((stat, index) => (
              <Fade in timeout={1000 + index * 200} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold', 
                      color: theme.palette.primary.main,
                      mb: 1
                    }}
                  >
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    {stat.label}
                  </Typography>
                </Box>
              </Fade>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Enhanced Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Powerful Features for Modern Businesses
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ maxWidth: 600, mx: 'auto' }}
          >
            Everything you need to run your business efficiently, stay compliant, 
            and make data-driven decisions for growth.
          </Typography>
        </Box>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {features.map((feature, index) => (
              <Slide in timeout={500 + index * 100} direction="up">
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[16]
                    },
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 3
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ textAlign: 'center' }}>
                      {feature.description}
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <Box key={benefitIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <CheckCircle sx={{ color: theme.palette.success.main, fontSize: 18, mr: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            {benefit}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Slide>
          ))}
        </Box>
      </Container>

      {/* Benefits for Jamaica Businesses */}
      <Box sx={{ py: 10, backgroundColor: theme.palette.primary.main, color: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 6,
            alignItems: 'center'
          }}>
            <Box>
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#fac83e' }}>
                Built for Jamaica Businesses
              </Typography>
              <Typography variant="h6" paragraph sx={{ opacity: 0.9, mb: 4 }}>
                We understand the unique challenges of doing business in Jamaica. 
                Our platform is designed with local regulations, tax laws, and business practices in mind.
              </Typography>
              
              <Box sx={{ mb: 4 }}>
                {[
                  { icon: <MonetizationOn />, title: 'Jamaica Tax Compliance', desc: 'Automated GCT, PAYE, and NIS calculations' },
                  { icon: <GroupWork />, title: 'Local Support Team', desc: '24/7 support from Jamaica-based experts' },
                  { icon: <Language />, title: 'Multi-Currency Support', desc: 'Handle JMD, USD, and other currencies seamlessly' },
                  { icon: <Smartphone />, title: 'Mobile-First Design', desc: 'Manage your business on-the-go with our mobile app' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                    <Box sx={{ 
                      backgroundColor: alpha('#fac83e', 0.2), 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 3,
                      color: '#fac83e'
                    }}>
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      <Typography variant="body1" sx={{ opacity: 0.8 }}>
                        {item.desc}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
            
            <Box>
              <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}>
                  Success Stories
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                    95%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    of customers report time savings of 10+ hours per week
                  </Typography>
                </Box>
                <Divider sx={{ my: 3 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h2" sx={{ color: theme.palette.success.main, fontWeight: 'bold' }}>
                    100%
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    tax compliance rate with automated calculations
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/pricing')}
                  sx={{ 
                    backgroundColor: '#fac83e',
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: alpha('#fac83e', 0.9)
                    }
                  }}
                >
                  Get Started
                </Button>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Customer Testimonials */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ mb: 2, fontWeight: 'bold' }}
        >
          What Our Customers Say
        </Typography>
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary" 
          paragraph
          sx={{ mb: 6 }}
        >
          Don't just take our word for it - hear from real businesses using AccountEezy
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
          gap: 4 
        }}>
          {testimonials.map((testimonial, index) => (
              <Card sx={{ 
                height: '100%', 
                p: 3,
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)'
                }
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={testimonial.avatar} 
                    sx={{ width: 60, height: 60, mr: 2, backgroundColor: theme.palette.primary.main }}
                  >
                    {testimonial.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.role}, {testimonial.company}
                    </Typography>
                  </Box>
                </Box>
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  "{testimonial.comment}"
                </Typography>
              </Card>
          ))}
        </Box>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ py: 10, backgroundColor: '#f8f9fa' }}>
        <Container maxWidth="md">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 2, fontWeight: 'bold' }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 6 }}
          >
            Everything you need to know about AccountEezy
          </Typography>

          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body1" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Container>
      </Box>

      {/* Enhanced CTA Section */}
      <Box sx={{ 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: 'white',
        py: 10
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom
              sx={{ fontWeight: 'bold', mb: 2, color: '#fac83e' }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography 
              variant="h5" 
              paragraph
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join over 1,250 businesses already using AccountEezy to streamline their operations,
              ensure compliance, and drive growth.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Schedule sx={{ fontSize: 40, color: '#fac83e', mb: 1 }} />
                <Typography variant="h6">30-Day Free Trial</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>No credit card required</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Support sx={{ fontSize: 40, color: '#fac83e', mb: 1 }} />
                <Typography variant="h6">Expert Support</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>24/7 local support team</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Lock sx={{ fontSize: 40, color: '#fac83e', mb: 1 }} />
                <Typography variant="h6">Bank-Level Security</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Your data is safe with us</Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/pricing')}
              endIcon={<ArrowForward />}
              sx={{ 
                py: 2,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                backgroundColor: '#fac83e',
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha('#fac83e', 0.9),
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Get Started Today
            </Button>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Questions? <Button sx={{ color: '#fac83e', textDecoration: 'underline' }}>Contact our team</Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;