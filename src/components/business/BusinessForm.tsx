import React, { useState } from 'react';
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
  'Finance & Insurance',
  'Real Estate',
  'Professional Services',
  'Healthcare',
  'Education',
  'Entertainment',
  'Hospitality',
  'Media',
  'Other Services'
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
    name: business?.name || '',
    registrationNumber: business?.registrationNumber || '',
    trn: business?.trn || '',
    nis: business?.nis || '',
    businessType: business?.businessType || '',
    industry: business?.industry || '',
    description: business?.description || '',
    
    // Address Information
    street: business?.address?.street || '',
    city: business?.address?.city || '',
    parish: business?.address?.parish || '',
    postalCode: business?.address?.postalCode || '',
    country: business?.address?.country || 'Jamaica',
    
    // Contact Information
    phone: business?.contact?.phone || '',
    email: business?.contact?.email || '',
    website: business?.contact?.website || ''
  });

  const steps = ['Basic Information', 'Address Details', 'Contact Information'];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string) => (e: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Basic Information
        return !!(
          formData.name &&
          formData.registrationNumber &&
          formData.trn &&
          formData.businessType &&
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
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const businessData = {
        name: formData.name,
        registrationNumber: formData.registrationNumber,
        trn: formData.trn,
        nis: formData.nis || undefined,
        businessType: formData.businessType,
        industry: formData.industry,
        description: formData.description || undefined,
        address: {
          street: formData.street,
          city: formData.city,
          parish: formData.parish,
          postalCode: formData.postalCode,
          country: formData.country || 'Jamaica'
        },
        contactInfo: {
          phone: formData.phone,
          email: formData.email,
          website: formData.website || undefined
        },
        payrollSettings: {
          payPeriod: 'monthly',
          payDay: 25,
          taxCalculationMethod: 'standard'
        },
        taxSettings: {
          gctRegistered: false,
          payeRegistered: true,
          nisRegistered: true,
          fiscalYearEnd: '12-31'
        },
        settings: {
          currency: 'JMD',
          timeZone: 'America/Jamaica',
          dateFormat: 'MM/DD/YYYY'
        }
      };

      if (mode === 'create') {
        await api.post('/businesses', businessData);
      } else {
        await api.put(`/businesses/${business._id}`, businessData);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      const message = err.response?.data?.message;
      const errors = err.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        setError(errors.join('\n'));
      } else if (message) {
        setError(message);
      } else {
        setError(`Failed to ${mode} business. Please try again.`);
      }

      console.error('Business creation error:', err.response?.data || err.message);
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
              name="name"
              label="Business Name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              helperText="Legal name of your business"
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="registrationNumber"
                label="Registration Number"
                value={formData.registrationNumber}
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
                inputProps={{ maxLength: 9 }}
                helperText="9-digit TRN number"
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                name="nis"
                label="NIS Number"
                value={formData.nis}
                onChange={handleInputChange}
                fullWidth
                inputProps={{ maxLength: 9 }}
                helperText="9-digit NIS number (optional)"
              />
              <FormControl fullWidth required>
                <InputLabel>Business Type</InputLabel>
                <Select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleSelectChange('businessType')}
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
            <TextField
              name="description"
              label="Business Description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={3}
              helperText="Brief description of your business activities"
            />
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
                name="postalCode"
                label="Postal Code"
                value={formData.postalCode}
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
        
        {activeStep < steps.length - 1 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={loading}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              mode === 'create' ? 'Register Business' : 'Update Business'
            )}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default BusinessForm;
