import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  Container,
  Alert,
  CardHeader,
  CardContent,
  Typography,
  Box,
  ButtonGroup
} from '@mui/material';

interface Feature {
  name: string;
  enabled: boolean;
  limit?: number | string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: Feature[];
  billingCycle: 'monthly' | 'yearly';
}

interface SubscriptionManagerProps {
  businessId: string;
}

const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ businessId }) => {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [selectedCycle, setSelectedCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 29.99,
      features: [
        { name: 'Employee Management', enabled: true },
        { name: 'Basic Payroll Processing', enabled: true },
        { name: 'Basic Reporting', enabled: true },
        { name: 'Up to 10 Employees', enabled: true },
      ],
      billingCycle: 'monthly'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 49.99,
      features: [
        { name: 'Employee Management', enabled: true },
        { name: 'Advanced Payroll Processing', enabled: true },
        { name: 'Advanced Reporting', enabled: true },
        { name: 'Tax Calculation', enabled: true },
        { name: 'Up to 50 Employees', enabled: true },
      ],
      billingCycle: 'monthly'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 99.99,
      features: [
        { name: 'Employee Management', enabled: true },
        { name: 'Advanced Payroll Processing', enabled: true },
        { name: 'Advanced Reporting', enabled: true },
        { name: 'Tax Calculation', enabled: true },
        { name: 'Custom Reports', enabled: true },
        { name: 'API Access', enabled: true },
        { name: 'Unlimited Employees', enabled: true },
      ],
      billingCycle: 'monthly'
    }
  ];

  const fetchCurrentSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/subscriptions/businesses/${businessId}/subscription`);
      setCurrentPlan(response.data.data.subscription.plan);
    } catch (err) {
      console.error('Error fetching subscription:', err);
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchCurrentSubscription();
  }, [fetchCurrentSubscription]);

  const handlePlanSelect = async (planId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.put(
        `/api/subscriptions/businesses/${businessId}/subscription`,
        {
          plan: planId,
          billingCycle: selectedCycle
        }
      );

      setCurrentPlan(planId);
      setSuccess('Subscription updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating subscription');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await axios.post(`/api/subscriptions/businesses/${businessId}/subscription/cancel`);
      
      setCurrentPlan(null);
      setSuccess('Subscription cancelled successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error cancelling subscription');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = (basePrice: number) => {
    if (selectedCycle === 'yearly') {
      return (basePrice * 12 * 0.9).toFixed(2); // 10% discount for yearly
    }
    return basePrice.toFixed(2);
  };

  return (
    <Container sx={{ py: 5 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
      
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Choose Your Plan
        </Typography>
        <ButtonGroup sx={{ mt: 3 }}>
          <Button
            variant={selectedCycle === 'monthly' ? 'contained' : 'outlined'}
            onClick={() => setSelectedCycle('monthly')}
          >
            Monthly
          </Button>
          <Button
            variant={selectedCycle === 'yearly' ? 'contained' : 'outlined'}
            onClick={() => setSelectedCycle('yearly')}
          >
            Yearly (10% off)
          </Button>
        </ButtonGroup>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
        {plans.map((plan) => (
          <Box key={plan.id}>
            <Card>
              <CardHeader
                title={plan.name}
                titleTypographyProps={{ align: 'center', variant: 'h5' }}
              />
              <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                  <Typography variant="h4" component="div">
                    ${calculatePrice(plan.price)}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    /{selectedCycle === 'monthly' ? 'month' : 'year'}
                  </Typography>
                </Box>
                <Box component="ul" sx={{ listStyle: 'none', p: 0 }}>
                  {plan.features.map((feature, index) => (
                    <Box
                      component="li"
                      key={index}
                      sx={{ 
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        '&::before': {
                          content: '"✓"',
                          mr: 1,
                          color: 'success.main'
                        }
                      }}
                    >
                      <Typography>{feature.name}</Typography>
                    </Box>
                  ))}
                </Box>
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Button
                    variant="contained"
                    color={currentPlan === plan.id ? 'success' : 'primary'}
                    disabled={loading || currentPlan === plan.id}
                    onClick={() => handlePlanSelect(plan.id)}
                    fullWidth
                  >
                    {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

      {currentPlan && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleCancel} 
            disabled={loading}
          >
            Cancel Subscription
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default SubscriptionManager;
