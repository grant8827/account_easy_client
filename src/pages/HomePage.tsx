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
      comment: 'Accountseezy completely transformed how I manage my catering business. The automated payroll system and tax calculations save me 10+ hours every week!',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Marcus Brown',
      role: 'Financial Manager',
      company: 'Brown & Associates',
      rating: 5,
      comment: 'The compliance features in Accountseezy are game-changing. We never miss tax deadlines and GCT calculations are always perfect. Best business investment ever!',
      avatar: '/api/placeholder/60/60'
    },
    {
      name: 'Jennifer Williams',
      role: 'Restaurant Owner',
      company: 'Spice Garden Restaurant',
      rating: 5,
      comment: 'Managing 25 employees used to be a nightmare. With Accountseezy, payroll processing takes just minutes and everything stays compliant automatically.',
      avatar: '/api/placeholder/60/60'
    }
  ];

  const faqs = [
    {
      question: 'Is Accountseezy compliant with Jamaica tax laws?',
      answer: 'Absolutely! Accountseezy is fully compliant with all Jamaica tax regulations including GCT, PAYE, NIS contributions, and statutory requirements. Our system automatically updates with any tax law changes.'
    },
    {
      question: 'Can I manage multiple businesses?',
      answer: 'Yes! Accountseezy supports unlimited business management from one unified dashboard. Each business maintains separate books while providing consolidated reporting across all your ventures.'
    },
    {
      question: 'What kind of support do you provide?',
      answer: 'We provide 24/7 world-class customer support via phone, email, and live chat. Our Jamaica-based support team understands local business needs and offers free onboarding and training.'
    },
    {
      question: 'How secure is my data?',
      answer: 'Data security is paramount at Accountseezy. We employ bank-level 256-bit encryption, secure cloud servers, automatic backups, and multi-factor authentication. All data complies with international security standards.'
    },
    {
      question: 'Can I try Accountseezy before committing?',
      answer: 'Definitely! We offer a comprehensive 30-day free trial with full feature access—no credit card required. Schedule a personalized demo to see how Accountseezy can transform your business.'
    }
  ];

  const stats = [
    { label: 'Active Businesses', value: 2500, suffix: '+' },
    { label: 'Transactions Processed', value: 1200000, suffix: '+' },
    { label: 'Tax Returns Filed', value: 15000, suffix: '+' },
    { label: 'Customer Satisfaction', value: 99, suffix: '%' }
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
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(16, 185, 129, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Fade in timeout={1000}>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
              gap: 6, 
              alignItems: 'center' 
            }}>
              <Box>
                <Chip 
                  label="🚀 Trusted by 2,500+ businesses across Jamaica" 
                  sx={{ 
                    mb: 3, 
                    backgroundColor: alpha('#C7AE6A', 0.15),
                    color: '#C7AE6A',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    border: '1px solid rgba(199, 174, 106, 0.3)'
                  }} 
                />
                <Typography 
                  variant="h1" 
                  component="h1" 
                  gutterBottom
                  sx={{ 
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '4rem' },
                    background: 'linear-gradient(135deg, #C7AE6A 0%, #b99a45 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1,
                    mb: 3
                  }}
                >
                  Accountseezy
                  <br />
                  <span style={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Smart Business Finance
                  </span>
                </Typography>
                <Typography 
                  variant="h5" 
                  component="p" 
                  paragraph
                  sx={{ 
                    opacity: 0.95,
                    mb: 4,
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                    lineHeight: 1.5,
                    color: '#f1f5f9',
                    fontWeight: 400
                  }}
                >
                  The most intuitive financial management platform designed for modern Jamaica businesses. 
                  Streamline payroll, master tax compliance, and unlock powerful business insights—all in one place.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 3, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#C7AE6A', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Automate Everything</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#C7AE6A', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Scale Faster</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ color: '#C7AE6A', fontSize: 20 }} />
                    <Typography sx={{ fontSize: '0.95rem', fontWeight: 500 }}>Stay Compliant</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', sm: 'row' } }}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/pricing')}
                    endIcon={<ArrowForward />}
                    sx={{ 
                      background: 'linear-gradient(135deg, #C7AE6A 0%, #b99a45 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #b99a45 0%, #d5c28f 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(199, 174, 106, 0.35)'
                      },
                      py: 2.5,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{ 
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                      color: '#ffffff',
                      borderWidth: 2,
                      '&:hover': {
                        borderColor: '#C7AE6A',
                        backgroundColor: alpha('#C7AE6A', 0.1),
                        transform: 'translateY(-2px)',
                        color: '#C7AE6A'
                      },
                      py: 2.5,
                      px: 5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                    height: { xs: 300, md: 450 },
                    position: 'relative'
                  }}
                >
                  {/* Main Dashboard Card */}
                  <Box
                    sx={{
                      width: { xs: 240, md: 350 },
                      height: { xs: 240, md: 350 },
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      position: 'relative',
                      transform: 'rotateY(-5deg) rotateX(5deg)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        width: 60,
                        height: 60,
                        background: 'linear-gradient(135deg, #C7AE6A 0%, #b99a45 100%)',
                        borderRadius: '50%',
                        opacity: 0.9,
                        animation: 'pulse 2s infinite'
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -15,
                        left: -15,
                        width: 40,
                        height: 40,
                        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                        borderRadius: '50%',
                        opacity: 0.8
                      },
                      '@keyframes pulse': {
                        '0%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                        '100%': { transform: 'scale(1)' }
                      }
                    }}
                  >
                    <Dashboard sx={{ 
                      fontSize: { xs: 100, md: 140 }, 
                      background: 'linear-gradient(135deg, #C7AE6A 0%, #d5c28f 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }} />
                  </Box>
                  
                  {/* Floating Elements */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 20,
                      left: 20,
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <MonetizationOn sx={{ color: 'white', fontSize: 30 }} />
                  </Box>
                  
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 30,
                      right: 10,
                      width: 50,
                      height: 50,
                      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 6px 16px rgba(0, 0, 0, 0.3)',
                      animation: 'float 3s ease-in-out infinite 1s',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-10px)' }
                      }
                    }}
                  >
                    <People sx={{ color: 'white', fontSize: 25 }} />
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
              <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', color: '#C7AE6A' }}>
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
                      backgroundColor: alpha('#C7AE6A', 0.2), 
                      borderRadius: '50%', 
                      p: 1, 
                      mr: 3,
                      color: '#C7AE6A'
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
                    background: 'linear-gradient(135deg, #C7AE6A 0%, #b99a45 100%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #b99a45 0%, #d5c28f 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(199, 174, 106, 0.35)'
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
          Don't just take our word for it - hear from real businesses using Accountseezy
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
            Everything you need to know about Accountseezy
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
              sx={{ fontWeight: 'bold', mb: 2, color: '#C7AE6A' }}
            >
              Ready to Transform Your Business?
            </Typography>
            <Typography 
              variant="h5" 
              paragraph
              sx={{ mb: 4, opacity: 0.9 }}
            >
              Join over 2,500 businesses already using Accountseezy to streamline operations,
              ensure compliance, and accelerate growth.
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 4, flexWrap: 'wrap' }}>
              <Box sx={{ textAlign: 'center' }}>
                <Schedule sx={{ fontSize: 40, color: '#C7AE6A', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>30-Day Free Trial</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>No credit card required</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Support sx={{ fontSize: 40, color: '#C7AE6A', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Expert Support</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>24/7 Jamaica-based team</Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Lock sx={{ fontSize: 40, color: '#C7AE6A', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Bank-Level Security</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>Enterprise-grade protection</Typography>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/pricing')}
              endIcon={<ArrowForward />}
              sx={{ 
                py: 2.5,
                px: 6,
                fontSize: '1.2rem',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #C7AE6A 0%, #b99a45 100%)',
                color: 'white',
                borderRadius: 3,
                '&:hover': {
                  background: 'linear-gradient(135deg, #b99a45 0%, #d5c28f 100%)',
                  transform: 'translateY(-3px)',
                  boxShadow: '0 12px 30px rgba(199, 174, 106, 0.4)'
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              Start Free Trial Today
            </Button>
            
            <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
              Questions? <Button sx={{ color: '#C7AE6A', textDecoration: 'underline', fontWeight: 500 }}>Contact our team</Button>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;