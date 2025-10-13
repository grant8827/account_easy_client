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


} from '@mui/material';
import { 
  Person
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';


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
  
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const password = watch('password');

  // Check for selected plan from pricing page
  useEffect(() => {
    const planFromStorage = localStorage.getItem('selectedPlan');
    
    if (planFromStorage) {
      try {
        const plan = JSON.parse(planFromStorage);
        setSelectedPlan(plan);
      } catch (error) {
        console.error('Error parsing selected plan:', error);
      }
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
    // This simplified registration just creates the account and redirects to payment
    clearError();
    setRegistrationError(null);
    
    try {
      const { firstName, lastName } = data;
      
      // Create a basic registration without payment
      const registrationData = {
        email: data.email.trim(),
        password: data.password,
        password_confirm: data.confirmPassword,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        role: data.role || 'business_owner',
        phone: data.phone || '',
        trn: data.trn || '',
        // Basic business info
        business_name: `${firstName.trim()} ${lastName.trim()}'s Business`,
        business_type: 'general',
        parish: 'Kingston'
      };
      
      console.log('Creating account:', registrationData);
      
      // Store registration data for payment page
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Store selected plan for payment page
      if (selectedPlan) {
        localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      }
      
      // Redirect to payment page to complete the flow
      navigate('/payment');
      
    } catch (error: any) {
      console.error('❌ Registration preparation failed:', error);
      setRegistrationError('Failed to prepare registration. Please try again.');
    }
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

          {selectedPlan && (
            <Card sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  {selectedPlan.name} Plan Selected
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

          {(error || registrationError) && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error || registrationError}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
              Create Your Account
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
                defaultValue="business_owner"
                {...register('role')}
              >
                <MenuItem value="business_owner">Business Owner</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="employee">Employee</MenuItem>
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
              {isLoading ? <CircularProgress size={24} /> : 'Continue to Payment'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
