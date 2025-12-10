import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../services/api';

interface Business {
  id: number;
  business_name: string;
  registration_number: string;
}

interface EmployeeFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  employee?: any;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onClose, onSubmit, employee }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userBusiness, setUserBusiness] = useState<Business | null>(null);
  const [loadingBusiness, setLoadingBusiness] = useState(false);
  
  const [formData, setFormData] = useState({
    businessId: employee?.business?.id || employee?.business || '',
    employeeId: employee?.employee_id || '',
    firstName: employee?.user?.first_name || '',
    lastName: employee?.user?.last_name || '',
    email: employee?.user?.email || '',
    phone: employee?.user?.phone || '',
    position: employee?.position || '',
    department: employee?.department || '',
    basicSalary: employee?.base_salary_amount || 0,
    trn: employee?.trn || '',
    nis: employee?.nis || '',
    dateOfBirth: employee?.date_of_birth || '1990-01-01'
  });

  useEffect(() => {
    if (open) {
      console.log('🔄 Form opened. Initial formData.businessId:', formData.businessId);
      console.log('🔄 Employee prop:', employee);
      fetchUserBusiness();
    }
  }, [open]);

  const fetchUserBusiness = async () => {
    try {
      setLoadingBusiness(true);
      setError(null);
      
      console.log('🔍 Fetching user business...');
      const response = await api.get('/businesses/');
      console.log('✅ Business API response:', response);
      console.log('📊 Business data:', response.data);
      
      const businesses = response.data || [];
      console.log('📋 Businesses array:', businesses, 'Length:', businesses.length);
      
      if (businesses.length > 0) {
        const business = businesses[0]; // Since we enforce one business per account
        console.log('🏢 Selected business:', business);
        
        setUserBusiness(business);
        const businessId = business.id;
        console.log('✅ Business loaded successfully. ID:', businessId);
        
        // Only update businessId if not already set from employee prop
        setFormData(prev => ({
          ...prev,
          businessId: prev.businessId || businessId
        }));
      } else {
        console.log('❌ No businesses found in response');
        setError('No business found. Please create a business first.');
      }
    } catch (err: any) {
      console.error('❌ Error fetching business:', err);
      console.error('Response:', err.response);
      console.error('Response data:', err.response?.data);
      console.error('Status:', err.response?.status);
      
      if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to fetch business information. Please check your connection and try again.');
      }
    } finally {
      setLoadingBusiness(false);
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

      console.log('📋 Form data at submit:', formData);
      console.log('📋 Employee prop at submit:', employee);
      
      if (!formData.businessId) {
        setError('Business information is required. Please wait for business data to load or ensure you have a registered business.');
        return;
      }
      
      // Validate businessId is a number and not an employee ID
      if (isNaN(Number(formData.businessId))) {
        setError('Invalid business ID. Please refresh and try again.');
        return;
      }
      if (!formData.firstName?.trim() || !formData.lastName?.trim() || !formData.email?.trim() || !formData.position?.trim() || !formData.trn || !formData.nis) {
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

      // Create the employee data matching Django backend expectations
      let employeeData: any;
      
      if (employee) {
        // Update existing employee - don't include user_data
        employeeData = {
          date_of_birth: formData.dateOfBirth,
          position: formData.position,
          department: formData.department || 'General',
          employment_type: 'full_time',
          base_salary_amount: Math.max(0, formData.basicSalary || 0),
          salary_currency: 'JMD',
          salary_frequency: 'monthly',
          trn: cleanTrn,
          nis: cleanNis,
          hours_per_week: 40,
        };
      } else {
        // Create new employee - include user_data for automatic user creation
        employeeData = {
          user_data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: 'employee',
            password: 'TempPass123!' // Temporary password - should be changed on first login
          },
          date_of_birth: formData.dateOfBirth,
          position: formData.position,
          department: formData.department || 'General',
          start_date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
          employment_type: 'full_time',
          base_salary_amount: Math.max(0, formData.basicSalary || 0),
          salary_currency: 'JMD',
          salary_frequency: 'monthly',
          trn: cleanTrn,
          nis: cleanNis,
          hours_per_week: 40,
          work_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
          vacation_days_entitlement: 14,
          sick_days_entitlement: 10,
          ...(formData.employeeId.trim() && { employee_id: formData.employeeId.trim() })
        };
      }

      // Construct the correct endpoint based on whether we're creating or updating
      console.log('📍 Business ID:', formData.businessId);
      console.log('📍 Employee ID:', employee?.id);
      
      let response;
      if (employee) {
        // Update existing employee: PUT /employees/{business_id}/{employee_id}
        const endpoint = `/employees/${formData.businessId}/${employee.id}`;
        console.log('📤 PUT to:', endpoint);
        response = await api.put(endpoint, employeeData);
      } else {
        // Create new employee: POST /employees/{business_id}/
        const endpoint = `/employees/${formData.businessId}/`;
        console.log('📤 POST to:', endpoint);
        response = await api.post(endpoint, employeeData);
      }
      
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error('Employee creation error:', err);
      console.error('Error response data:', err.response?.data);
      console.error('Error response errors:', err.response?.data?.errors);
      console.error('Full error object:', JSON.stringify(err.response?.data, null, 2));
      
      const errorData = err.response?.data;
      
      // Handle Django REST framework validation errors
      if (errorData?.errors) {
        if (typeof errorData.errors === 'object' && !Array.isArray(errorData.errors)) {
          // DRF returns errors as an object with field names as keys
          const errorMessages = Object.entries(errorData.errors)
            .map(([field, messages]: [string, any]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(', ')}`;
            })
            .join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else if (Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map((error: any) => 
            typeof error === 'string' ? error : `${error.field}: ${error.message}`
          ).join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          setError(`Error: ${errorData.errors}`);
        }
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
          {/* Business Information Display */}
          <Box sx={{ 
            p: 2, 
            bgcolor: 'grey.50', 
            borderRadius: 1, 
            border: '1px solid',
            borderColor: 'grey.300'
          }}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Business Information
            </Typography>
            {loadingBusiness ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="body2">Loading business information...</Typography>
              </Box>
            ) : userBusiness ? (
              <Typography variant="body2">
                <strong>{userBusiness.business_name}</strong> ({userBusiness.registration_number})
              </Typography>
            ) : (
              <Typography variant="body2" color="error">
                No business found. Please create a business first.
              </Typography>
            )}
          </Box>

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
