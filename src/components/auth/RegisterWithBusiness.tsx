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
  Stepper,
  Step,
  StepLabel,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import { 
  Person,
  Business,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// Business types and industries
const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company',
  'Corporation',
  'Non-Profit Organization',
  'Cooperative',
  'Other'
];

const industries = [
  'Agriculture',
  'Mining',
  'Manufacturing',
  'Construction',
  'Retail Trade',
  'Wholesale Trade',
  'Transportation',
  'Information Technology',
  'Finance and Insurance',
  'Real Estate',
  'Professional Services',
  'Education',
  'Healthcare',
  'Hospitality',
  'Entertainment',
  'Media',
  'Government',
  'Other'
];

const parishes = [
  'Kingston',
  'St. Andrew',
  'St. Thomas',
  'Portland',
  'St. Mary',
  'St. Ann',
  'Trelawny',
  'St. James',
  'Hanover',
  'Westmoreland',
  'St. Elizabeth',
  'Manchester',
  'Clarendon',
  'St. Catherine'
];

interface SelectedPlan {
  name: string;
  price: number;
  billing: 'monthly' | 'annual';
  features: string[];
}

const RegisterWithBusiness: React.FC = () => {
  const { error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const [registrationError, setRegistrationError] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'business_owner',
    
    // Business Information
    business_name: '',
    registration_number: '',
    trn: '',
    nis: '',
    business_type: '',
    industry: '',
    
    // Business Address
    street: '',
    city: '',
    parish: '',
    postal_code: '',
    country: 'Jamaica',
    
    // Business Contact
    business_phone: '',
    business_email: '',
    website: ''
  });

  const steps = ['Personal Details', 'Business Information', 'Business Address', 'Contact & Review'];

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

  // Auto-populate business name when first/last name changes
  useEffect(() => {
    if (formData.firstName && formData.lastName && !formData.business_name) {
      setFormData(prev => ({
        ...prev,
        business_name: `${formData.firstName} ${formData.lastName}'s Business`
      }));
    }
  }, [formData.firstName, formData.lastName, formData.business_name]);

  // Auto-populate business email when personal email changes
  useEffect(() => {
    if (formData.email && !formData.business_email) {
      setFormData(prev => ({
        ...prev,
        business_email: formData.email
      }));
    }
  }, [formData.email, formData.business_email]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for TRN and NIS fields - only allow digits
    if (name === 'trn' || name === 'nis') {
      const digitsOnly = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: digitsOnly
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (registrationError) setRegistrationError(null);
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
    if (registrationError) setRegistrationError(null);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD',
      minimumFractionDigits: 0
    }).format(price);
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Personal Information
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.email &&
          formData.password &&
          formData.confirmPassword &&
          formData.password === formData.confirmPassword
        );
      case 1: // Business Information
        return !!(
          formData.business_name &&
          formData.registration_number &&
          formData.trn &&
          formData.trn.length === 9 &&
          formData.business_type &&
          formData.industry &&
          (!formData.nis || formData.nis.length === 9)
        );
      case 2: // Business Address
        return !!(
          formData.street &&
          formData.city &&
          formData.parish
        );
      case 3: // Contact & Review
        return !!(
          formData.business_phone &&
          formData.business_email
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setRegistrationError(null);
    } else {
      setRegistrationError('Please fill in all required fields correctly.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setRegistrationError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      setRegistrationError('Please complete all required fields.');
      return;
    }

    try {
      setLoading(true);
      clearError();
      setRegistrationError(null);

      // Prepare complete registration data with business information
      const registrationData = {
        email: formData.email.trim(),
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone || '',
        role: formData.role,
        
        // Business information
        business_name: formData.business_name.trim(),
        registration_number: formData.registration_number.trim(),
        trn: formData.trn,
        nis: formData.nis || '',
        business_type: formData.business_type,
        industry: formData.industry,
        
        // Business address
        street: formData.street.trim(),
        city: formData.city.trim(),
        parish: formData.parish,
        postal_code: formData.postal_code || '',
        country: formData.country,
        
        // Business contact
        business_phone: formData.business_phone.trim(),
        business_email: formData.business_email.trim(),
        website: formData.website.trim() || ''
      };
      
      console.log('Preparing registration with business data:', registrationData);
      
      // Store complete registration data for payment page
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Store selected plan for payment page
      if (selectedPlan) {
        localStorage.setItem('selectedPlan', JSON.stringify(selectedPlan));
      }
      
      // Navigate to payment page to complete the registration
      navigate('/payment');
      
    } catch (error: any) {
      console.error('❌ Registration preparation failed:', error);
      setRegistrationError('Failed to prepare registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Information
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
                fullWidth
                required
              />
              <TextField
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                fullWidth
                required
              />
            </Stack>
            <TextField
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              helperText="Optional personal phone number"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              fullWidth
              required
              error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
              helperText={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
            />
          </Stack>
        );

      case 1: // Business Information
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Business Information
            </Typography>
            <TextField
              name="business_name"
              label="Business Name"
              value={formData.business_name}
              onChange={handleChange}
              fullWidth
              required
              helperText="Legal name of your business"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="registration_number"
                label="Registration Number"
                value={formData.registration_number}
                onChange={handleChange}
                fullWidth
                required
                helperText="Official business registration number"
              />
              <TextField
                name="trn"
                label="TRN (Tax Registration Number)"
                value={formData.trn}
                onChange={handleChange}
                fullWidth
                required
                inputProps={{ 
                  maxLength: 9,
                  pattern: "\\d{9}",
                  inputMode: "numeric"
                }}
                error={formData.trn.length > 0 && formData.trn.length !== 9}
                helperText={
                  formData.trn.length > 0 && formData.trn.length !== 9 
                    ? `Must be exactly 9 digits (currently ${formData.trn.length})` 
                    : "9-digit TRN number"
                }
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="nis"
                label="NIS Number"
                value={formData.nis}
                onChange={handleChange}
                fullWidth
                inputProps={{ 
                  maxLength: 9,
                  pattern: "\\d{9}",
                  inputMode: "numeric"
                }}
                error={formData.nis.length > 0 && formData.nis.length !== 9}
                helperText={
                  formData.nis.length > 0 && formData.nis.length !== 9 
                    ? `Must be exactly 9 digits (currently ${formData.nis.length})` 
                    : "9-digit NIS number (optional)"
                }
              />
              <FormControl fullWidth required>
                <InputLabel>Business Type</InputLabel>
                <Select
                  name="business_type"
                  value={formData.business_type}
                  onChange={handleSelectChange('business_type')}
                  label="Business Type"
                >
                  {businessTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <FormControl fullWidth required>
              <InputLabel>Industry</InputLabel>
              <Select
                name="industry"
                value={formData.industry}
                onChange={handleSelectChange('industry')}
                label="Industry"
              >
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        );

      case 2: // Business Address
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Business Address
            </Typography>
            <TextField
              name="street"
              label="Street Address"
              value={formData.street}
              onChange={handleChange}
              fullWidth
              required
              helperText="Full street address including building number"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="city"
                label="City/Town"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                required
              />
              <FormControl fullWidth required>
                <InputLabel>Parish</InputLabel>
                <Select
                  name="parish"
                  value={formData.parish}
                  onChange={handleSelectChange('parish')}
                  label="Parish"
                >
                  {parishes.map((parish) => (
                    <MenuItem key={parish} value={parish}>
                      {parish}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="postal_code"
                label="Postal Code"
                value={formData.postal_code}
                onChange={handleChange}
                fullWidth
                helperText="Optional postal code"
              />
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleChange}
                fullWidth
                disabled
              />
            </Stack>
          </Stack>
        );

      case 3: // Contact & Review
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Business Contact Information
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="business_phone"
                label="Business Phone"
                value={formData.business_phone}
                onChange={handleChange}
                fullWidth
                required
                helperText="Primary business phone number"
              />
              <TextField
                name="business_email"
                label="Business Email"
                type="email"
                value={formData.business_email}
                onChange={handleChange}
                fullWidth
                required
                helperText="Primary business email"
              />
            </Stack>
            <TextField
              name="website"
              label="Website URL"
              value={formData.website}
              onChange={handleChange}
              fullWidth
              helperText="Business website (optional)"
              placeholder="https://www.yourbusiness.com"
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="h6" gutterBottom>
              Registration Summary
            </Typography>
            <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Personal:</strong> {formData.firstName} {formData.lastName} ({formData.email})
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Business:</strong> {formData.business_name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {formData.business_type} - {formData.industry}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {formData.city}, {formData.parish}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>TRN:</strong> {formData.trn}
              </Typography>
              {selectedPlan && (
                <Typography variant="body2" gutterBottom>
                  <strong>Plan:</strong> {selectedPlan.name} - {formatPrice(selectedPlan.price)}/{selectedPlan.billing}
                </Typography>
              )}
            </Box>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <Person />
            </Avatar>
            <Typography component="h1" variant="h4">
              Create Account & Business
            </Typography>
          </Box>

          {/* Plan Display */}
          {selectedPlan && (
            <Card sx={{ mb: 3, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
              <CardContent>
                <Typography variant="h6">
                  Selected Plan: {selectedPlan.name}
                </Typography>
                <Typography variant="body2">
                  {formatPrice(selectedPlan.price)} per {selectedPlan.billing === 'monthly' ? 'month' : 'year'}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Error Display */}
          {(registrationError || error) && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {registrationError || error}
            </Alert>
          )}

          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            {renderStepContent(activeStep)}
          </Box>

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
              startIcon={<ArrowBack />}
            >
              Back
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading || !validateStep(activeStep)}
                startIcon={loading ? <CircularProgress size={20} /> : <Business />}
              >
                {loading ? 'Creating...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep(activeStep)}
                endIcon={<ArrowForward />}
              >
                Next
              </Button>
            )}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Already have an account? Sign in
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterWithBusiness;