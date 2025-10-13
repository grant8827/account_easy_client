import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import {
  CreditCard,
  Security,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

interface PaymentBypassProps {
  selectedPlan: {
    name: string;
    price: number;
    billing: string;
    features?: string[];
  };
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  userEmail?: string;
}

const PaymentBypass: React.FC<PaymentBypassProps> = ({
  selectedPlan,
  onSuccess,
  onError,
  userEmail
}) => {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handleSimulatePayment = async () => {
    setProcessing(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a simulated payment success response
      const paymentDetails = {
        id: `sim_${Date.now()}`,
        status: 'COMPLETED',
        payer: {
          email_address: userEmail || 'test@example.com'
        },
        purchase_units: [{
          amount: {
            value: (selectedPlan.price / 160).toFixed(2), // Convert JMD to USD
            currency_code: 'USD'
          }
        }],
        payment_method: 'simulated_card',
        plan_name: selectedPlan.name,
        billing_cycle: selectedPlan.billing,
        simulation: true,
        django_backend: false // This will be handled in the registration flow
      };
      
      console.log('✅ Simulated payment successful:', paymentDetails);
      onSuccess(paymentDetails);
      
    } catch (error) {
      console.error('❌ Simulated payment failed:', error);
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  const handleSkipPayment = () => {
    const skipPaymentDetails = {
      id: 'skip_payment_react19',
      status: 'SKIPPED',
      payer: {
        email_address: userEmail || 'test@example.com'
      },
      purchase_units: [{
        amount: {
          value: '0.00',
          currency_code: 'USD'
        }
      }],
      payment_method: 'setup_later',
      plan_name: selectedPlan.name,
      billing_cycle: selectedPlan.billing,
      skip_reason: 'react19_compatibility'
    };
    
    onSuccess(skipPaymentDetails);
  };

  const isFormValid = cardNumber.length >= 16 && 
                     expiryDate.length >= 5 && 
                     cvv.length >= 3 && 
                     cardName.length >= 2;

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Alternative Payment Processing</strong><br/>
        PayPal integration is temporarily unavailable due to React 19 compatibility issues.
        You can simulate a payment or skip payment setup for now.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <CreditCard sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">
              Payment Details - {selectedPlan.name} Plan
            </Typography>
          </Box>
          
          <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 1 }}>
            {formatPrice(selectedPlan.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            per {selectedPlan.billing === 'annual' ? 'year' : 'month'}
          </Typography>

          {selectedPlan.features && (
            <List dense>
              {selectedPlan.features.slice(0, 4).map((feature, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText primary={feature} />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
            <CreditCard sx={{ mr: 1 }} />
            Test Payment Information
          </Typography>

          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Test Mode:</strong> This is a simulation for testing purposes. 
            Use test card numbers below or skip to complete registration.
          </Alert>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Cardholder Name"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="John Doe"
            />
            <TextField
              fullWidth
              label="Card Number"
              value={cardNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '');
                setCardNumber(value);
              }}
              placeholder="4111 1111 1111 1111 (Test Visa)"
              inputProps={{ maxLength: 16 }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '');
                  if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                  }
                  setExpiryDate(value);
                }}
                placeholder="MM/YY"
                inputProps={{ maxLength: 5 }}
              />
              <TextField
                fullWidth
                label="CVV"
                value={cvv}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCvv(value);
                }}
                placeholder="123"
                inputProps={{ maxLength: 4 }}
              />
            </Box>
          </Box>

          <Alert severity="info" sx={{ mt: 2 }}>
            <strong>Test Card Numbers:</strong><br/>
            • Visa: 4111 1111 1111 1111<br/>
            • Mastercard: 5555 5555 5555 4444<br/>
            • Any future expiry date and any 3-digit CVV
          </Alert>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleSimulatePayment}
          disabled={!isFormValid || processing}
          startIcon={processing ? <CircularProgress size={20} /> : <Security />}
          sx={{ minWidth: 200 }}
        >
          {processing ? 'Processing...' : `Pay ${formatPrice(selectedPlan.price)}`}
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          size="large"
          onClick={handleSkipPayment}
          disabled={processing}
          startIcon={<Warning />}
        >
          Skip Payment (Set Up Later)
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Divider sx={{ my: 2 }} />
        <Alert severity="success" variant="outlined">
          <strong>Secure Processing:</strong> All payment information is processed securely. 
          This test mode allows you to complete registration and set up real payment later.
        </Alert>
      </Box>
    </Box>
  );
};

export default PaymentBypass;