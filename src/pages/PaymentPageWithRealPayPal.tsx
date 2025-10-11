import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PayPalWrapper from '../components/payment/PayPalWrapper';
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
  ArrowBack
} from '@mui/icons-material';

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
  const [useRealPayPal, setUseRealPayPal] = useState(false);

  useEffect(() => {
    // Get selected plan from localStorage
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      setSelectedPlan(JSON.parse(planData));
    } else {
      // If no plan selected, redirect to pricing
      navigate('/pricing');
    }

    // Check if PayPal client ID is configured
    if (process.env.REACT_APP_PAYPAL_CLIENT_ID && process.env.REACT_APP_PAYPAL_CLIENT_ID !== 'your_paypal_client_id_here') {
      setUseRealPayPal(true);
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

  const handlePayPalSuccess = (details: any) => {
    console.log('PayPal payment successful:', details);
    
    const paymentDetails = {
      transactionId: details.id,
      payerEmail: details.payer.email_address,
      amount: details.purchase_units[0].amount.value,
      currency: details.purchase_units[0].amount.currency_code,
      status: details.status,
      paypalDetails: details
    };
    
    // Store payment details for registration
    localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
    
    setCompleted(true);
    
    // After successful payment, navigate to registration
    setTimeout(() => {
      navigate('/register');
    }, 2000);
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error);
    let errorMessage = 'Payment failed. Please try again.';
    
    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.name === 'INSTRUMENT_DECLINED') {
      errorMessage = 'Your payment method was declined. Please try a different payment method.';
    } else if (error?.name === 'PAYER_ACTION_REQUIRED') {
      errorMessage = 'Please complete the payment process in the PayPal window.';
    } else if (error?.name === 'VALIDATION_ERROR') {
      errorMessage = 'Invalid payment information. Please check your details and try again.';
    }
    
    setPaymentError(errorMessage);
    setProcessing(false);
  };

  const handleSimulatedPayPalPayment = () => {
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
    <PaymentPageContent 
      selectedPlan={selectedPlan}
      processing={processing}
      completed={completed}
      paymentError={paymentError}
      setPaymentError={setPaymentError}
      setProcessing={setProcessing}
      setCompleted={setCompleted}
      formatPrice={formatPrice}
      convertToUSD={convertToUSD}
      handlePayPalSuccess={handlePayPalSuccess}
      handlePayPalError={handlePayPalError}
      handleSimulatedPayPalPayment={handleSimulatedPayPalPayment}
      handleCreditCardPayment={handleCreditCardPayment}
      useRealPayPal={useRealPayPal}
      navigate={navigate}
      theme={theme}
    />
  );
};

// Separate component for the payment content
interface PaymentPageContentProps {
  selectedPlan: SelectedPlan;
  processing: boolean;
  completed: boolean;
  paymentError: string | null;
  setPaymentError: (error: string | null) => void;
  setProcessing: (processing: boolean) => void;
  setCompleted: (completed: boolean) => void;
  formatPrice: (price: number) => string;
  convertToUSD: (jmdAmount: number) => string;
  handlePayPalSuccess: (details: any) => void;
  handlePayPalError: (error: any) => void;
  handleSimulatedPayPalPayment: () => void;
  handleCreditCardPayment: () => void;
  useRealPayPal: boolean;
  navigate: any;
  theme: any;
}

const PaymentPageContent: React.FC<PaymentPageContentProps> = ({
  selectedPlan,
  processing,
  completed,
  paymentError,
  setPaymentError,
  setProcessing,
  setCompleted,
  formatPrice,
  convertToUSD,
  handlePayPalSuccess,
  handlePayPalError,
  handleSimulatedPayPalPayment,
  handleCreditCardPayment,
  useRealPayPal,
  navigate,
  theme
}) => {
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
            <Button 
              startIcon={<ArrowBack />}
              onClick={() => navigate('/pricing')}
              sx={{ color: theme.palette.primary.main }}
            >
              Back to Pricing
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Progress Stepper */}
        <Stepper activeStep={completed ? 2 : 1} sx={{ mb: 4 }}>
          {['Plan Selection', 'Payment', 'Account Setup'].map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* PayPal Configuration Alert */}
        {!useRealPayPal && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              <strong>Demo Mode:</strong> PayPal is not configured. Add your PayPal Client ID to the .env file to enable real payments.
              <br />
              <code>REACT_APP_PAYPAL_CLIENT_ID=your_actual_client_id</code>
            </Typography>
          </Alert>
        )}

        {!completed ? (
          <Box sx={{ 
            display: { xs: 'block', md: 'grid' }, 
            gridTemplateColumns: { md: '1fr 1fr' }, 
            gap: 4 
          }}>
            {/* Plan Summary */}
            <Box sx={{ mb: { xs: 4, md: 0 } }}>
              <Card>
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
            </Box>

            {/* Payment Section */}
            <Box>
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
                      {/* PayPal Payment */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: 'center' }}>
                          {useRealPayPal ? 'Pay with PayPal (Real Payment) - Secure Checkout' : 'PayPal Demo Mode'}
                        </Typography>
                        <PayPalWrapper
                          selectedPlan={selectedPlan}
                          onSuccess={handlePayPalSuccess}
                          onError={handlePayPalError}
                          onProcessing={setProcessing}
                          convertToUSD={convertToUSD}
                        />
                      </Box>



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
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, py: 4 }}>
                      <CircularProgress size={32} />
                      <Typography variant="h6">Processing Payment...</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                        Please do not close this window or refresh the page.
                      </Typography>
                    </Box>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    * You will be redirected to create your account after payment
                  </Typography>
                </CardContent>
              </Card>
            </Box>
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
    </Box>
  );
};

export default PaymentPage;