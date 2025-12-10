import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  TextField,
  Card, 
  CardContent,
  useTheme,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Email,
  Phone,
  LocationOn,
  AccessTime,
  Send
} from '@mui/icons-material';
import SharedHeader from '../components/SharedHeader';
import Footer from '../components/Footer';

interface ContactPageProps {
  onPageChange?: (page: string) => void;
}

const ContactPage: React.FC<ContactPageProps> = ({ onPageChange }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const contactInfo = [
    {
      icon: <Email sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Email Us',
      description: 'Get in touch via email',
      contact: 'support@accounteezy.com'
    },
    {
      icon: <Phone sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Call Us',
      description: 'Speak with our support team',
      contact: '+1 (876) 555-0123'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Visit Us',
      description: 'Our office location',
      contact: 'Kingston, Jamaica'
    },
    {
      icon: <AccessTime sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Business Hours',
      description: 'Monday - Friday',
      contact: '9:00 AM - 6:00 PM'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setShowSuccess(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <Box>
      {!onPageChange && <SharedHeader />}
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
              Contact Us
            </Typography>
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                opacity: 0.9,
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              Have questions? We're here to help. Get in touch with our team 
              and we'll respond as soon as possible.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Information Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, 
          gap: 4,
          mb: 8
        }}>
          {contactInfo.map((info, index) => (
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
                  {info.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {info.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {info.description}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}>
                  {info.contact}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        {/* Contact Form Section */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
          gap: 6, 
          alignItems: 'flex-start' 
        }}>
          {/* Form */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Send us a Message
              </Typography>
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Your Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  multiline
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<Send />}
                  sx={{ 
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem'
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Box>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
              Get Support
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
              Our support team is ready to help you with any questions about AccountEezy. 
              Whether you need help getting started, have technical questions, or want to 
              learn more about our features, we're here for you.
            </Typography>
            
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Quick Response Times
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Email support: Within 24 hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Phone support: During business hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Critical issues: Within 4 hours
              </Typography>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Local Expertise
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem', lineHeight: 1.7 }}>
                Our team understands Jamaica business requirements and can provide 
                specialized guidance on tax compliance, payroll regulations, and 
                local business practices.
              </Typography>
            </Box>

            <Card sx={{ backgroundColor: theme.palette.grey[50] }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Need Immediate Help?
                </Typography>
                <Typography variant="body2" paragraph>
                  For urgent technical issues or billing questions, 
                  call us directly during business hours.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<Phone />}
                  href="tel:+18765550123"
                >
                  Call Now: +1 (876) 555-0123
                </Button>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>

      {/* FAQ Section */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8 }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ mb: 6, fontWeight: 'bold' }}
          >
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, 
            gap: 4 
          }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  How do I get started with AccountEezy?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Simply register for a free account, set up your business profile, 
                  and start using our financial management tools immediately.
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Is my financial data secure?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes, we use bank-level encryption and security protocols to 
                  protect your data. Your information is always safe with us.
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Do you support Jamaica tax regulations?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Absolutely! AccountEezy is built specifically for Jamaica businesses 
                  with full support for GCT, PAYE, and other local tax requirements.
                </Typography>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Can I export my financial data?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Yes, you can export your data in various formats including PDF, 
                  Excel, and CSV for your records or accountant.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Message sent successfully! We'll get back to you soon.
        </Alert>
      </Snackbar>
      
      {!onPageChange && <Footer />}
    </Box>
  );
};

export default ContactPage;