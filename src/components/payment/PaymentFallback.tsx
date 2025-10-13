import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Alert,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  CreditCard,
  Email,
  Phone,
  Schedule
} from '@mui/icons-material';

interface PaymentFallbackProps {
  selectedPlan: {
    name: string;
    price: number;
    billing: string;
  };
  onSkipPayment: () => void;
  onBackToPlan: () => void;
  userEmail: string;
}

const PaymentFallback: React.FC<PaymentFallbackProps> = ({
  selectedPlan,
  onSkipPayment,
  onBackToPlan,
  userEmail
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD'
    }).format(price);
  };

  return (
    <Box sx={{ textAlign: 'center', maxWidth: 500, mx: 'auto' }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>PayPal Integration Temporarily Unavailable</strong><br/>
        Due to a compatibility issue with the current system version, 
        PayPal payments are temporarily disabled.
      </Alert>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Selected Plan: {selectedPlan.name}
          </Typography>
          <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
            {formatPrice(selectedPlan.price)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            per {selectedPlan.billing === 'annual' ? 'year' : 'month'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
            <CreditCard />
            Alternative Payment Methods
          </Typography>
          
          <List>
            <ListItem>
              <ListItemIcon>
                <Schedule />
              </ListItemIcon>
              <ListItemText 
                primary="Set Up Payment Later"
                secondary="Complete registration now and add payment details from your dashboard"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText 
                primary="Email Support"
                secondary="Contact support@accounteezy.com for manual payment setup"
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <Phone />
              </ListItemIcon>
              <ListItemText 
                primary="Phone Payment"
                secondary="Call us to set up payment over the phone"
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Alert severity="success" sx={{ mb: 3 }}>
        <strong>Recommended:</strong> Complete your registration now and set up payment later. 
        You'll have full access to create your account and can add payment details at any time.
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          onClick={onBackToPlan}
        >
          Back to Plan Selection
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onSkipPayment}
          sx={{ px: 4 }}
        >
          Continue Without Payment
        </Button>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        Account for: {userEmail}
      </Typography>
    </Box>
  );
};

export default PaymentFallback;