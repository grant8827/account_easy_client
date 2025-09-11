import React, { useState, useEffect } from 'react';
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
  CircularProgress
} from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Business {
  _id: string;
  name: string;
  registrationNumber: string;
}

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  employee?: any;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  
  const [formData, setFormData] = useState({
    businessId: employee?.business?._id || user?.selectedBusiness || '',
    employeeId: employee?.employeeId || '',
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    basicSalary: employee?.basicSalary || 0,
    trn: employee?.trn || '',
    nis: employee?.nis || '',
    dateOfBirth: employee?.dateOfBirth || '1990-01-01'
  });

  useEffect(() => {
    if (open) {
      fetchBusinesses();
    }
  }, [open]);

  const fetchBusinesses = async () => {
    try {
      setLoadingBusinesses(true);
      const response = await api.get('/businesses');
      setBusinesses(response.data.businesses || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch businesses');
    } finally {
      setLoadingBusinesses(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!formData.businessId) {
        setError('Please select a business');
        return;
      }
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.position || !formData.trn || !formData.nis) {
        setError('Please fill in all required fields:\n• First Name\n• Last Name\n• Email\n• Position\n• TRN (9 digits)\n• NIS (9 digits)\n• Date of Birth');
        return;
      }

      // Validate TRN and NIS format
      const cleanTrn = formData.trn.replace(/\D/g, ''); // Remove non-digits
      const cleanNis = formData.nis.replace(/\D/g, ''); // Remove non-digits
      
      if (cleanTrn.length !== 9) {
        setError('TRN must be exactly 9 digits');
        return;
      }
      if (cleanNis.length !== 9) {
        setError('NIS must be exactly 9 digits');
        return;
      }

      // Create the employee data with user information
      const employeeData = {
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          role: 'employee',
          password: 'TempPass123!' // Temporary password - should be changed on first login
        },
        business: formData.businessId,
        employeeId: formData.employeeId.trim() || undefined, // Include if provided, otherwise let it auto-generate
        personalInfo: {
          dateOfBirth: new Date(formData.dateOfBirth),
        },
        employment: {
          position: formData.position,
          department: formData.department || 'General',
          startDate: new Date(),
          employmentType: 'full_time'
        },
        compensation: {
          baseSalary: {
            amount: Math.max(0, formData.basicSalary || 0), // Ensure non-negative value
            currency: 'JMD',
            frequency: 'monthly'
          }
        },
        taxInfo: {
          trn: cleanTrn,
          nis: cleanNis
        }
      };

      const endpoint = employee ? `/employees/${employee._id}` : '/employees';
      const method = employee ? 'put' : 'post';

      await api[method](endpoint, employeeData);
      
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error('Employee creation error:', err);
      console.error('Error response data:', err.response?.data);
      
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Handle detailed validation errors
        const errorMessages = errorData.errors.map((error: any) => 
          `${error.field}: ${error.message}`
        ).join('\n');
        setError(`Validation errors:\n${errorMessages}`);
      } else if (errorData?.details && Array.isArray(errorData.details)) {
        // Handle detailed error descriptions
        setError(`Validation errors:\n${errorData.details.join('\n')}`);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError('Failed to save employee. Please check all required fields.');
      }
    } finally {
      setLoading(false);
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

        <Box sx={{ display: 'grid', gap: 3, mt: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Select Business *</InputLabel>
            <Select
              value={formData.businessId}
              label="Select Business *"
              onChange={(e) => handleInputChange('businessId', e.target.value)}
              disabled={loadingBusinesses}
            >
              {loadingBusinesses ? (
                <MenuItem disabled>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Loading businesses...
                </MenuItem>
              ) : (
                businesses.map((business) => (
                  <MenuItem key={business._id} value={business._id}>
                    {business.name} ({business.registrationNumber})
                  </MenuItem>
                ))
              )}
            </Select>
            {businesses.length === 0 && !loadingBusinesses && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                No businesses found. Please create a business first.
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Employee ID"
            value={formData.employeeId}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
            fullWidth
            helperText="Optional - Leave blank to auto-generate (e.g., EMP-2025-0001)"
            placeholder="EMP-2025-0001"
          />

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="First Name *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Last Name *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              fullWidth
              required
            />
          </Box>

          <TextField
            label="Email Address *"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            fullWidth
            required
          />

          <TextField
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            fullWidth
          />

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Position *"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              fullWidth
            />
          </Box>

          <TextField
            label="Basic Salary (JMD)"
            type="number"
            value={formData.basicSalary}
            onChange={(e) => handleInputChange('basicSalary', parseFloat(e.target.value) || 0)}
            fullWidth
          />

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="TRN (Tax Registration Number) *"
              value={formData.trn}
              onChange={(e) => handleInputChange('trn', e.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 9 }}
              helperText="9 digits required"
            />
            <TextField
              label="NIS Number *"
              value={formData.nis}
              onChange={(e) => handleInputChange('nis', e.target.value)}
              fullWidth
              required
              inputProps={{ maxLength: 9 }}
              helperText="9 digits required"
            />
          </Box>

          <TextField
            label="Date of Birth *"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            fullWidth
            required
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Add Employee'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
