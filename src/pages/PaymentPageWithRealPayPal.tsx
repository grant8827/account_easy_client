import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentBypass from '../components/payment/PaymentBypass';
import { authApi } from '../services/api';
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
  Security,
  ArrowBack
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
  const [useRealPayPal, setUseRealPayPal] = useState(false);

  useEffect(() => {
    // Get selected plan from localStorage
    const planData = localStorage.getItem('selectedPlan');
    if (planData) {
      try {
        const parsedPlan = JSON.parse(planData);
        if (parsedPlan && parsedPlan.name && parsedPlan.price) {
          setSelectedPlan(parsedPlan);
        } else {
          console.warn('Invalid plan data found, redirecting to pricing');
          navigate('/pricing');
        }
      } catch (error) {
        console.error('Error parsing plan data:', error);
        localStorage.removeItem('selectedPlan'); // Clear corrupted data
        navigate('/pricing');
      }
    } else {
      // If no plan selected, redirect to pricing to start the flow
      console.log('No plan selected, redirecting to pricing page');
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

  const handlePayPalSuccess = async (details: any) => {
    console.log('Payment successful:', details);
    setProcessing(true);
    
    try {
      // Get registration data from localStorage
      const registrationData = localStorage.getItem('registrationData');
      if (!registrationData) {
        throw new Error('Registration data not found. Please start registration again.');
      }
      
      const regData = JSON.parse(registrationData);
      
      // Prepare complete registration with payment data
      const completeRegistrationData = {
        ...regData,
        payment_id: details.id,
        plan_name: selectedPlan?.name || 'Starter',
        payment_status: details.status || 'COMPLETED',
        payment_amount: details.purchase_units?.[0]?.amount?.value || '0.00',
        payment_currency: details.purchase_units?.[0]?.amount?.currency_code || 'USD'
      };
      
      console.log('Completing registration with payment:', completeRegistrationData);
      
      // Call Django backend to complete registration
      const response = await authApi.registerWithBusiness(completeRegistrationData);
      
      if (response.data?.success && response.data?.data?.tokens?.token) {
        // Store auth token
        localStorage.setItem('token', response.data.data.tokens.token);
        
        console.log('✅ Registration completed successfully!');
        console.log('User:', response.data.data.user);
        console.log('Business:', response.data.data.business);
        console.log('Subscription:', response.data.data.subscription);
        
        // Store user and business info
        if (response.data.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        if (response.data.data.business) {
          localStorage.setItem('businessInfo', JSON.stringify(response.data.data.business));
        }
        
        // Clean up registration data
        localStorage.removeItem('registrationData');
        localStorage.removeItem('selectedPlan');
        
        setCompleted(true);
        
        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
        
      } else {
        throw new Error(response.data?.message || 'Registration failed after payment');
      }
      
    } catch (error: any) {
      console.error('❌ Failed to complete registration:', error);
      setPaymentError(
        error.response?.data?.message || 
        error.message || 
        'Failed to complete registration. Please contact support.'
      );
    } finally {
      setProcessing(false);
    }
  };

  const handlePayPalError = (error: any) => {
    console.error('PayPal payment error:', error);
    let errorMessage = 'Payment failed. Please try again.';
    
    if (error?.message) {
      errorMessage = error.message;
      // Check for React 19 compatibility issues
      if (error.message.includes('useReducer') || 
          error.message.includes('Invalid hook call') ||
          error.message.includes('Cannot read properties of null')) {
        errorMessage = 'PayPal integration is temporarily unavailable due to a compatibility issue. Please use the "Skip Payment" option or contact support.';
      }
    } else if (error?.name === 'INSTRUMENT_DECLINED') {
      errorMessage = 'Your payment method was declined. Please try a different payment method.';
    } else if (error?.name === 'PAYER_ACTION_REQUIRED') {
      errorMessage = 'Please complete the payment process in the PayPal window.';
    } else if (error?.name === 'VALIDATION_ERROR') {
      errorMessage = 'Invalid payment information. Please check your details and try again.';
    } else if (error?.name === 'NETWORK_ERROR') {
      errorMessage = 'Network error occurred. Please check your internet connection and try again.';
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
      
      // After successful payment, navigate to dashboard
      setTimeout(() => {
        navigate('/dashboard');
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
      <SharedHeader showAuthButtons={false} />

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
        
        {/* Payment Options Info */}
        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Flexible Payment Options:</strong> You can complete your registration now and set up payment later from your dashboard. 
            No credit card required to get started!
          </Typography>
        </Alert>

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
                      {/* Payment Processing - React 19 Compatible */}
                      <PaymentBypass
                        selectedPlan={selectedPlan}
                        onSuccess={handlePayPalSuccess}
                        onError={handlePayPalError}
                        userEmail="customer@example.com"
                      />
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
      
      <Footer />
    </Box>
  );
};

export default PaymentPage;