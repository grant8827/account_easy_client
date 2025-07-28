import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Stack,
  InputAdornment
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  employee?: any;
}

interface EmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  parish: string;
  employeeId: string;
  position: string;
  department: string;
  hireDate: Date | null;
  basicSalary: number;
  allowances: number;
  trn: string;
  nis: string;
  bankAccount: string;
  emergencyContact: string;
  emergencyPhone: string;
  status: 'active' | 'inactive';
}

const jamaicaParishes = [
  'Kingston', 'St. Andrew', 'St. Thomas', 'Portland', 'St. Mary',
  'St. Ann', 'Trelawny', 'St. James', 'Hanover', 'Westmoreland',
  'St. Elizabeth', 'Manchester', 'Clarendon', 'St. Catherine'
];

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<EmployeeData>({
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    address: employee?.address || '',
    parish: employee?.parish || '',
    employeeId: employee?.employeeId || '',
    position: employee?.position || '',
    department: employee?.department || '',
    hireDate: employee?.hireDate ? new Date(employee.hireDate) : null,
    basicSalary: employee?.basicSalary || 0,
    allowances: employee?.allowances || 0,
    trn: employee?.trn || '',
    nis: employee?.nis || '',
    bankAccount: employee?.bankAccount || '',
    emergencyContact: employee?.emergencyContact || '',
    emergencyPhone: employee?.emergencyPhone || '',
    status: employee?.status || 'active'
  });

  const steps = ['Personal Info', 'Employment Details', 'Financial Info'];

  const handleInputChange = (field: keyof EmployeeData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD'
    }).format(amount);
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 0:
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 1:
        return formData.employeeId && formData.position && formData.hireDate;
      case 2:
        return formData.basicSalary > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
      setError(null);
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = employee ? `/employees/${employee._id}` : '/employees';
      const method = employee ? 'put' : 'post';

      await api[method](endpoint, formData);
      
      onSubmit();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                fullWidth
              />
              <TextField
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Email Address *"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              fullWidth
            />

            <TextField
              label="Phone Number *"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              fullWidth
            />

            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              multiline
              rows={3}
              fullWidth
            />

            <FormControl fullWidth>
              <InputLabel>Parish</InputLabel>
              <Select
                value={formData.parish}
                label="Parish"
                onChange={(e) => handleInputChange('parish', e.target.value)}
              >
                {jamaicaParishes.map(parish => (
                  <MenuItem key={parish} value={parish}>{parish}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Emergency Contact"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                fullWidth
              />
              <TextField
                label="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                fullWidth
              />
            </Box>
          </Stack>
        );

      case 1:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Employment Details
            </Typography>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="Employee ID *"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                fullWidth
              />
              <TextField
                label="Position *"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                fullWidth
              />
            </Box>

            <TextField
              label="Department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              fullWidth
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Hire Date *"
                value={formData.hireDate}
                onChange={(date) => handleInputChange('hireDate', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true
                  }
                }}
              />
            </LocalizationProvider>

            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case 2:
        return (
          <Stack spacing={3}>
            <Typography variant="h6" gutterBottom>
              Financial Information
            </Typography>

            <TextField
              label="Basic Salary *"
              type="number"
              value={formData.basicSalary}
              onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">JMD</InputAdornment>,
              }}
              fullWidth
              helperText={`Monthly: ${formatCurrency(formData.basicSalary)}`}
            />

            <TextField
              label="Monthly Allowances"
              type="number"
              value={formData.allowances}
              onChange={(e) => handleInputChange('allowances', parseFloat(e.target.value) || 0)}
              InputProps={{
                startAdornment: <InputAdornment position="start">JMD</InputAdornment>,
              }}
              fullWidth
              helperText={`Allowances: ${formatCurrency(formData.allowances)}`}
            />

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="TRN (Tax Registration Number)"
                value={formData.trn}
                onChange={(e) => handleInputChange('trn', e.target.value)}
                fullWidth
                helperText="Format: 000-000-000"
              />
              <TextField
                label="NIS Number"
                value={formData.nis}
                onChange={(e) => handleInputChange('nis', e.target.value)}
                fullWidth
                helperText="National Insurance Scheme"
              />
            </Box>

            <TextField
              label="Bank Account Number"
              value={formData.bankAccount}
              onChange={(e) => handleInputChange('bankAccount', e.target.value)}
              fullWidth
              helperText="For salary payments"
            />

            <Alert severity="info">
              <Typography variant="body2">
                <strong>Total Monthly Compensation:</strong> {formatCurrency(formData.basicSalary + formData.allowances)}
              </Typography>
            </Alert>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {employee ? 'Edit Employee' : 'Add New Employee'}
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        
        {activeStep > 0 && (
          <Button onClick={handleBack} disabled={loading}>
            Back
          </Button>
        )}

        {activeStep < steps.length - 1 ? (
          <Button 
            onClick={handleNext} 
            variant="contained"
            disabled={!validateStep(activeStep)}
          >
            Next
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !validateStep(activeStep)}
          >
            {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
