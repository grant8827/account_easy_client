import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Stack
} from '@mui/material';
import { Business as BusinessIcon } from '@mui/icons-material';
import api from '../../services/api';

interface BusinessFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  business?: any;
  mode: 'create' | 'edit';
}

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

const BusinessForm: React.FC<BusinessFormProps> = ({
  open,
  onClose,
  onSuccess,
  business,
  mode
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Basic Information
    business_name: business?.business_name || '',
    registration_number: business?.registration_number || '',
    trn: business?.trn || '',
    nis: business?.nis || '',
    business_type: business?.business_type || '',
    industry: business?.industry || '',
    
    // Address Information
    street: business?.street || '',
    city: business?.city || '',
    parish: business?.parish || '',
    postal_code: business?.postal_code || '',
    country: business?.country || 'Jamaica',
    
    // Contact Information
    phone: business?.phone || '',
    email: business?.email || '',
    website: business?.website || ''
  });

  const steps = ['Basic Information', 'Address Details', 'Contact Information'];

  // Reset form when mode changes or dialog opens
  useEffect(() => {
    if (open && mode === 'create') {
      setError(null);
      setActiveStep(0);
    }
  }, [mode, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Special handling for TRN and NIS fields - only allow digits
    if (name === 'trn' || name === 'nis') {
      const digitsOnly = onlyDigits(value);
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
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const onlyDigits = (v: string) => (v || '').replace(/\D/g, '');
  const isValidNineDigits = (v: string) => onlyDigits(v).length === 9;

  const isStepValid = (step: number): boolean => {
    return validateStep(step);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(
          formData.business_name &&
          formData.registration_number &&
          formData.trn &&
          isValidNineDigits(formData.trn) &&
          (!formData.nis || isValidNineDigits(formData.nis)) &&
          formData.business_type &&
          formData.industry
        );
      case 1: // Address
        return !!(
          formData.street &&
          formData.city &&
          formData.parish
        );
      case 2: // Contact
        return !!(
          formData.phone &&
          formData.email
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) {
      // Provide more specific feedback for TRN/NIS when invalid
      if (!formData.trn) {
        setError('TRN is required.');
        return;
      }
      if (!isValidNineDigits(formData.trn)) {
        setError('TRN must be exactly 9 digits (numbers only).');
        return;
      }
      if (formData.nis && !isValidNineDigits(formData.nis)) {
        setError('NIS must be exactly 9 digits (numbers only) if provided.');
        return;
      }
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Sanitize inputs  
      // Sanitize and validate TRN - must be exactly 9 digits
      const trnSanitized = onlyDigits(formData.trn);
      if (!trnSanitized) {
        setError('TRN is required.');
        return;
      }
      if (trnSanitized.length !== 9) {
        setError(`TRN must be exactly 9 digits. You entered ${trnSanitized.length} digits: "${trnSanitized}"`);
        return;
      }
      
      // Sanitize NIS if provided
      const nisSanitized = formData.nis ? onlyDigits(formData.nis) : '';
      if (nisSanitized && nisSanitized.length !== 9) {
        setError(`NIS must be exactly 9 digits when provided. You entered ${nisSanitized.length} digits: "${nisSanitized}"`);
        return;
      }

      const businessData = {
        business_name: formData.business_name.trim(),
        registration_number: formData.registration_number.trim(),
        trn: trnSanitized,
        nis: nisSanitized,
        business_type: formData.business_type,
        industry: formData.industry,
        street: formData.street.trim(),
        city: formData.city.trim(),
        parish: formData.parish,
        postal_code: formData.postal_code || '',
        country: formData.country || 'Jamaica',
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        website: formData.website.trim() || '',
        // Default settings that match the backend model
        subscription_plan: 'basic',
        pay_period: 'monthly',
        pay_day: 28,
        overtime_rate: 1.5,
        public_holiday_rate: 2.0,
        paye_registered: false,
        nis_registered: false,
        education_tax_registered: false,
        heart_trust_registered: false,
        gct_registered: false,
        tax_year: new Date().getFullYear(),
        fiscal_year_end: `${new Date().getFullYear()}-03-31`, // Default to March 31st
        currency: 'JMD',
        timezone: 'America/Jamaica',
        date_format: 'DD/MM/YYYY',
        email_notifications: true,
        sms_notifications: false
      };

      if (mode === 'create') {
        await api.post('/businesses/', businessData);
      } else {
        await api.put(`/businesses/${business.id}/`, businessData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      const fieldErrors = err.response?.data;
      
      console.error('Business creation error:', err.response?.data || err.message);
      
      // Handle field-specific errors
      if (fieldErrors && typeof fieldErrors === 'object') {
        const errorMessages = [];
        
        if (fieldErrors.trn) {
          errorMessages.push(`TRN Error: ${Array.isArray(fieldErrors.trn) ? fieldErrors.trn.join(', ') : fieldErrors.trn}`);
        }
        if (fieldErrors.registration_number) {
          errorMessages.push(`Registration Number Error: ${Array.isArray(fieldErrors.registration_number) ? fieldErrors.registration_number.join(', ') : fieldErrors.registration_number}`);
        }
        if (fieldErrors.business_name) {
          errorMessages.push(`Business Name Error: ${Array.isArray(fieldErrors.business_name) ? fieldErrors.business_name.join(', ') : fieldErrors.business_name}`);
        }
        
        // Add other field errors
        Object.keys(fieldErrors).forEach(field => {
          if (!['trn', 'registration_number', 'business_name'].includes(field)) {
            const fieldError = fieldErrors[field];
            if (fieldError) {
              errorMessages.push(`${field}: ${Array.isArray(fieldError) ? fieldError.join(', ') : fieldError}`);
            }
          }
        });
        
        if (errorMessages.length > 0) {
          setError(errorMessages.join('\n'));
          return;
        }
      }
      
      if (errors && Array.isArray(errors)) {
        setError(errors.join('\n'));
      } else if (message) {
        setError(message);
      } else if (err.response?.data?.error) {
        // Handle the backend "one business per user" error
        setError(err.response.data.error);
      } else {
        setError(`Failed to ${mode} business. Please try again.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <TextField
              name="business_name"
              label="Business Name"
              value={formData.business_name}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Legal name of your business"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="registration_number"
                label="Registration Number"
                value={formData.registration_number}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Official business registration number"
              />
              <TextField
                name="trn"
                label="TRN (Tax Registration Number)"
                value={formData.trn}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
            {/* Remove description field as it's not in backend model */}
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <TextField
              name="street"
              label="Street Address"
              value={formData.street}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Full street address including building number"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="city"
                label="City/Town"
                value={formData.city}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                fullWidth
                helperText="Optional postal code"
              />
              <TextField
                name="country"
                label="Country"
                value={formData.country}
                onChange={handleInputChange}
                fullWidth
                disabled
              />
            </Stack>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Primary business phone number"
              />
              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                fullWidth
                required
                helperText="Primary business email"
              />
            </Stack>
            <TextField
              name="website"
              label="Website URL"
              value={formData.website}
              onChange={handleInputChange}
              fullWidth
              helperText="Business website (optional)"
              placeholder="https://www.yourbusiness.com"
            />
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { minHeight: 600 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <BusinessIcon sx={{ mr: 2 }} />
          {mode === 'create' ? 'Register New Business' : 'Edit Business'}
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

        <Box sx={{ mt: 3 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
        >
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
        )}
        
        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={loading || !isStepValid(activeStep)}
          startIcon={loading ? <CircularProgress size={20} /> : undefined}
        >
          {loading ? 'Processing...' : activeStep === steps.length - 1 ? (mode === 'create' ? 'Create Business' : 'Update Business') : 'Next'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusinessForm;
