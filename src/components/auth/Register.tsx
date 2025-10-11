import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Chip,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,

} from '@mui/material';
import { 
  CheckCircle, 
  Person
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { authApi, businessApi } from '../../services/api';
import PayPalWrapper from '../payment/PayPalWrapper';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  trn: string;
  role: string;
}

interface SelectedPlan {
  name: string;
  price: number;
  billing: 'monthly' | 'annual';
  features: string[];
}

const Register: React.FC = () => {
  const { isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  const steps = ['Account Details', 'Plan Selection', 'Payment', 'Complete'];

  // Check for selected plan and payment details from pricing/payment pages
  useEffect(() => {
    const planFromStorage = localStorage.getItem('selectedPlan');
    const paymentFromStorage = localStorage.getItem('paymentDetails');
    
    if (planFromStorage) {
      try {
        const plan = JSON.parse(planFromStorage);
        setSelectedPlan(plan);
      } catch (error) {
        console.error('Error parsing selected plan:', error);
      }
    }
    
    if (paymentFromStorage) {
      try {
        const payment = JSON.parse(paymentFromStorage);
        setPaymentDetails(payment);
        setPaymentComplete(true);
        setCurrentStep(3); // Skip to final step if payment is complete
      } catch (error) {
        console.error('Error parsing payment details:', error);
      }
    } else if (planFromStorage) {
      setCurrentStep(1); // Skip to plan confirmation if plan selected but no payment
    }
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (currentStep === 0) {
      // Move to plan selection step
      setCurrentStep(1);
      return;
    }

    if (currentStep === 2 && !paymentComplete) {
      // Don't proceed without payment
      return;
    }

    if (currentStep === 3) {
      // Final registration step with Django backend
      clearError();
      setRegistrationError(null);
      try {
        const { firstName, lastName } = data;
        
        // Register user with Django backend
        const registrationData = {
          email: data.email.trim(),
          password: data.password,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        };
        
        console.log('Registering user with Django backend:', registrationData);
        
        // Register user
        const registrationResponse = await authApi.register(registrationData);
        
        if (registrationResponse.data?.token) {
          // Store auth token
          localStorage.setItem('token', registrationResponse.data.token);
          
          // Create business after successful user registration
          const businessData = {
            business_name: `${firstName} ${lastName}'s Business`, // Default name
            subscription_plan: selectedPlan?.name.toLowerCase() || 'starter',
            payment_id: paymentDetails?.id,
            // Add other business fields as needed
          };
          
          console.log('Creating business:', businessData);
          
          try {
            const businessResponse = await businessApi.createBusiness(businessData);
            console.log('Business created successfully:', businessResponse.data);
          } catch (businessError) {
            console.warn('Business creation failed, but user registration succeeded:', businessError);
            // Don't fail the entire process if business creation fails
          }
          
          // Login the user automatically
          const loginResponse = await authApi.login({
            email: data.email,
            password: data.password,
          });
          
          if (loginResponse.data?.token) {
            localStorage.setItem('token', loginResponse.data.token);
          }
          
          console.log('✅ Registration successful! Navigating to dashboard...');
          localStorage.removeItem('selectedPlan'); // Clean up
          localStorage.removeItem('paymentDetails'); // Clean up payment details
          navigate('/dashboard');
        } else {
          throw new Error('Registration failed - no token received');
        }
        
      } catch (error: any) {
        console.error('❌ Registration failed:', error);
        const message = error.response?.data?.message || error.message || 'Registration failed';
        setRegistrationError(message);
        
        // If registration fails, allow user to try again
        // Don't navigate away from the registration page
      }
    }
  };

  const handlePlanSelect = (plan: SelectedPlan) => {
    setSelectedPlan(plan);
    setCurrentStep(2); // Move to payment step
  };



  const renderPlanSelection = () => {
    const plans = [
      {
        name: 'Starter',
        description: 'Perfect for small businesses',
        monthlyPrice: 2500,
        annualPrice: 25000,
        features: ['Up to 5 employees', 'Basic payroll', 'Tax compliance', 'Email support']
      },
      {
        name: 'Professional',
        description: 'Best for growing businesses',
        monthlyPrice: 5000,
        annualPrice: 50000,
        popular: true,
        features: ['Up to 25 employees', 'Advanced payroll', 'Priority support', 'Advanced reports']
      },
      {
        name: 'Enterprise',
        description: 'For large businesses',
        monthlyPrice: 10000,
        annualPrice: 100000,
        features: ['Unlimited employees', 'Full suite', '24/7 support', 'Custom integrations']
      }
    ];

    return (
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 4 }}>
          Choose Your Plan
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
          {plans.map((plan, index) => (
            <Card 
              key={index}
              sx={{ 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 8
                },
                ...(plan.popular && {
                  border: '2px solid #1976d2'
                })
              }}
              onClick={() => handlePlanSelect({
                name: plan.name,
                price: plan.monthlyPrice,
                billing: 'monthly',
                features: plan.features
              })}
            >
              {plan.popular && (
                <Chip 
                  label="Most Popular" 
                  color="primary" 
                  sx={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)' }}
                />
              )}
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  {plan.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {plan.description}
                </Typography>
                <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 2 }}>
                  {formatPrice(plan.monthlyPrice)}
                  <Typography component="span" variant="body2" color="text.secondary">
                    /month
                  </Typography>
                </Typography>
                <List dense>
                  {plan.features.map((feature, featureIndex) => (
                    <ListItem key={featureIndex} sx={{ px: 0, justifyContent: 'center' }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircle sx={{ color: 'success.main', fontSize: 20 }} />
                      </ListItemIcon>
                      <ListItemText primary={feature} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  };

  const renderPayment = () => {
    const convertToUSD = (jmdAmount: number) => {
      // Simple conversion for demo - in production, use real exchange rates
      const exchangeRate = 0.0066; // 1 JMD = ~0.0066 USD
      return (jmdAmount * exchangeRate).toFixed(2);
    };

    const handlePaymentSuccess = (paymentDetails: any) => {
      console.log('Payment successful:', paymentDetails);
      setPaymentDetails(paymentDetails);
      setPaymentComplete(true);
      
      // Store payment details for registration
      localStorage.setItem('paymentDetails', JSON.stringify(paymentDetails));
      
      setCurrentStep(3); // Move to final step
    };

    const handlePaymentError = (error: any) => {
      console.error('Payment error:', error);
      setRegistrationError('Payment failed. Please try again.');
    };

    const handlePaymentProcessing = (processing: boolean) => {
      // You can add loading state here if needed
      console.log('Payment processing:', processing);
    };

    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Complete Your Payment
        </Typography>
        
        {selectedPlan && (
          <Card sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedPlan.name} Plan
              </Typography>
              <Typography variant="h4" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                {formatPrice(selectedPlan.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                per {selectedPlan.billing === 'annual' ? 'year' : 'month'}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box sx={{ maxWidth: 500, mx: 'auto' }}>
          {selectedPlan && (
            <PayPalWrapper
              selectedPlan={selectedPlan}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onProcessing={handlePaymentProcessing}
              convertToUSD={convertToUSD}
              userEmail={watch('email')}
            />
          )}
          
          <Button
            variant="text"
            onClick={() => setCurrentStep(1)}
            sx={{ mt: 2 }}
          >
            Back to Plan Selection
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography component="h1" variant="h4" color="primary" gutterBottom>
              Create Your Account
            </Typography>
            <Typography variant="h6" color="textSecondary">
              Join AccountEezy - Jamaica's Leading Financial Management Platform
            </Typography>
          </Box>

          {/* Progress Stepper */}
          <Stepper activeStep={currentStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

        {(error || registrationError) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || registrationError}
          </Alert>
        )}          {/* Step Content */}
          {currentStep === 0 && (
            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
                Account Details
              </Typography>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />

                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />
              </Box>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  type="tel"
                  {...register('phone', {
                    pattern: {
                      value: /^[1-9]\d{9,14}$/,
                      message: 'Please enter a valid phone number (digits only, 10-15 characters)',
                    },
                  })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message || 'Format: 8765551234 (digits only)'}
                />

                <TextField
                  fullWidth
                  label="TRN (Tax Registration Number)"
                  {...register('trn', {
                    pattern: {
                      value: /^\d{9}$/,
                      message: 'TRN must be 9 digits',
                    },
                  })}
                  error={!!errors.trn}
                  helperText={errors.trn?.message || 'Optional: 9-digit TRN'}
                />
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  label="Role"
                  defaultValue="employee"
                  {...register('role')}
                >
                  <MenuItem value="employee">Employee</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
                startIcon={<Person />}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Continue to Plan Selection'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link component={RouterLink} to="/login" variant="body2">
                  Already have an account? Sign In
                </Link>
              </Box>
            </Box>
          )}

          {currentStep === 1 && renderPlanSelection()}
          {currentStep === 2 && renderPayment()}
          
          {currentStep === 3 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Complete Registration
              </Typography>
              
              {selectedPlan && (
                <Card sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                  <CardContent>
                    <CheckCircle sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Payment Successful!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedPlan.name} Plan - {formatPrice(selectedPlan.price)}/{selectedPlan.billing === 'annual' ? 'year' : 'month'}
                    </Typography>
                  </CardContent>
                </Card>
              )}

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit(onSubmit)}
                disabled={isLoading}
                sx={{ py: 1.5, px: 4, fontSize: '1.1rem', mb: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Complete Registration'}
              </Button>
              
              <Typography variant="body2" color="text.secondary">
                You'll be redirected to your dashboard after account creation.
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
