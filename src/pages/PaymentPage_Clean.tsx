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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import { 
  Check,
  CreditCard,
  Security,
  ArrowBack,
  AccountBalanceWallet
} from '@mui/icons-material';
import SharedHeader from '../components/SharedHeader';
import Footer from '../components/Footer';

interface SelectedPlan {
  name: string;
  price: number;
  billing: string;
  features: string[];
}

const PaymentPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    // Get selected plan from localStorage
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      // If no plan selected, redirect to pricing
      navigate('/pricing');
    }
  }, [navigate]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Convert JMD to USD for PayPal (approximate rate: 1 USD = 160 JMD)
  const convertToUSD = (jmdAmount: number) => {
    return (jmdAmount / 160).toFixed(2);
  };

  const handlePayPalPayment = () => {
    setProcessing(true);
    setPaymentError(null);
    
    // Simulate PayPal payment processing
    setTimeout(() => {
      // Simulate successful payment
      const paymentDetails = {
        transactionId: `PAY-${Date.now()}`,
        payerEmail: 'customer@example.com',
        amount: convertToUSD(selectedPlan?.price || 0),
        currency: 'USD',
        status: 'COMPLETED'
      };
      
      // Store payment details for registration
      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
      
      setProcessing(false);
      setCompleted(true);
      
      // After successful payment, navigate to registration
      setTimeout(() => {
        navigate('/register');
      }, 2000);
    }, 3000);
  };

  const handleCreditCardPayment = () => {
    setPaymentError('Credit card payment coming soon. Please use PayPal for now.');
  };

  const steps = ['Plan Selection', 'Payment', 'Account Setup'];

  if (!selectedPlan) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Box>
      <SharedHeader showAuthButtons={false} />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Stepper activeStep={completed ? 2 : 1} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {!completed ? (
          <Box sx={{ 
            display: { xs: 'block', md: 'grid' }, 
            gridTemplateColumns: { md: '1fr 1fr' }, 
            gap: 4 
          }}>
            {/* Plan Summary */}
            <Card sx={{ mb: { xs: 4, md: 0 } }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Order Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  {selectedPlan.name} Plan
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {selectedPlan.billing === 'annual' ? 'Annual Billing' : 'Monthly Billing'}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
                    {formatPrice(selectedPlan.price)}
                  </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ≈ ${convertToUSD(selectedPlan.price)} USD
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Plan Features:
                </Typography>
                <List dense>
                  {selectedPlan.features.slice(0, 5).map((feature, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <Check sx={{ color: theme.palette.success.main, fontSize: 16 }} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={feature}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                  {selectedPlan.features.length > 5 && (
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText 
                        primary={`+ ${selectedPlan.features.length - 5} more features`}
                        primaryTypographyProps={{ variant: 'body2', fontStyle: 'italic' }}
                      />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Complete Your Payment
                </Typography>
                <Divider sx={{ my: 2 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Security sx={{ color: theme.palette.success.main, mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    SSL Encrypted & PCI Compliant
                  </Typography>
                </Box>

                {paymentError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {paymentError}
                  </Alert>
                )}

                {!processing ? (
                  <Box sx={{ mb: 2 }}>
                    {/* PayPal Payment Button */}
                    <Button 
                      variant="contained" 
                      size="large"
                      fullWidth
                      onClick={handlePayPalPayment}
                      startIcon={<AccountBalanceWallet />}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1.1rem',
                        backgroundColor: '#0070ba',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: '#005ea6'
                        },
                        mb: 2
                      }}
                    >
                      Pay with PayPal
                    </Button>

                    {/* Credit Card Payment Button */}
                    <Button 
                      variant="outlined" 
                      size="large"
                      fullWidth
                      onClick={handleCreditCardPayment}
                      startIcon={<CreditCard />}
                      sx={{ 
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        '&:hover': {
                          borderColor: theme.palette.primary.dark,
                          backgroundColor: theme.palette.primary.light + '10'
                        }
                      }}
                    >
                      Pay with Credit Card
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, py: 4 }}>
                    <CircularProgress size={24} />
                    <Typography>Processing Payment...</Typography>
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                  * You will be redirected to create your account after payment
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ) : (
          /* Payment Success */
          <Card>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Check sx={{ fontSize: 80, color: theme.palette.success.main, mb: 2 }} />
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: theme.palette.success.main }}>
                Payment Successful!
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Thank you for choosing AccountEezy {selectedPlan.name} Plan
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Transaction ID: PAY-{Date.now()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You will be redirected to create your account in a few seconds...
              </Typography>
              <Box sx={{ mt: 3 }}>
                <CircularProgress size={24} />
              </Box>
            </CardContent>
          </Card>
        )}
      </Container>
      
      <Footer />
    </Box>
  );
};

export default PaymentPage;