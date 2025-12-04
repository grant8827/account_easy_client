import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import {
  Add,
  Search,
  MoreVert,
  Edit,
  Delete,
  Person,
  Work,
  Email,
  Phone,
  FilterList,
  People as PeopleIcon
} from '@mui/icons-material';
import api from '../../services/api';
import EmployeeForm from './EmployeeForm';

interface Employee {
  id: number;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
  business: number; // Foreign key to business  
  employee_id: string;
  full_name: string; // Computed field from backend
  age?: number; // Computed field from backend
  employment_status: string; // Computed field from backend
  
  // Personal Information
  date_of_birth: string;
  gender?: string;
  marital_status?: string;
  nationality: string;
  
  // Emergency Contact
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact_address?: string;
  
  // Employment Information
  position: string;
  department: string;
  start_date: string;
  end_date?: string;
  employment_type: string;
  
  // Work Schedule
  hours_per_week: number;
  start_time?: string;
  end_time?: string;
  
  // Compensation
  base_salary_amount: number;
  salary_currency: string;
  salary_frequency: string;
  overtime_eligible: boolean;
  overtime_rate: number;
  
  // Tax Information
  trn: string;
  nis: string;
  tax_status: string;
  dependents: number;
  
  // Status
  is_active: boolean;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

const EmployeeList: React.FC = () => {
  const { user, selectBusiness } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    console.log('EmployeeList mounted, calling fetchEmployees');
    fetchBusinessesAndEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('User or selectedBusiness changed:', { user: user?.email, selectedBusiness: user?.selectedBusiness });
    if (user?.selectedBusiness) {
      console.log('User has selectedBusiness, fetching employees');
      fetchEmployees();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.selectedBusiness, user]);

  const fetchBusinessesAndEmployees = async () => {
    try {
      // First fetch businesses
      const businessResponse = await api.get('/businesses/');
      const userBusinesses = businessResponse.data || [];
      setBusinesses(userBusinesses);
      
      console.log('User businesses:', userBusinesses);
      console.log('Current selectedBusiness:', user?.selectedBusiness);
      
      // If user has no selected business but has businesses, select the first one
      if (!user?.selectedBusiness && userBusinesses.length > 0) {
        console.log('Auto-selecting first business:', userBusinesses[0].id);
        selectBusiness(userBusinesses[0].id.toString());
        return; // The useEffect will trigger fetchEmployees
      }
      
      // If user already has a selected business, fetch employees
      if (user?.selectedBusiness) {
        await fetchEmployees();
      }
    } catch (err: any) {
      console.error('Error fetching businesses:', err);
      setError(err.response?.data?.message || 'Failed to fetch businesses');
    }
  };

  useEffect(() => {
    // Filter employees based on search term
    const filtered = employees.filter(employee =>
      employee.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const businessId = user?.selectedBusiness;
      
      console.log('Fetching employees for business:', businessId);
      console.log('User data:', user);
      
      if (!businessId) {
        console.log('No business selected. Available businesses:', businesses);
        if (businesses.length === 0) {
          setError('No businesses found. Please create a business first.');
        } else {
          setError(`No business selected. Available businesses: ${businesses.map(b => b.name).join(', ')}`);
        }
        setEmployees([]);
        return;
      }
      
      const response = await api.get(`/employees/business/${businessId}`);
      console.log('Employees response:', response.data);
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const employeeData = response.data.employees || [];
      console.log('Employee data type:', typeof employeeData);
      console.log('Employee data is array:', Array.isArray(employeeData));
      console.log('Employee data length:', employeeData.length);
      
      if (employeeData.length > 0) {
        console.log('First employee sample:', employeeData[0]);
      }
      
      setEmployees(employeeData);
      setError(null);
    } catch (err: any) {
      console.error('Fetch employees error:', err);
      setError(err.response?.data?.message || 'Failed to fetch employees');
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, employee: Employee) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(employee);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const handleEditEmployee = () => {
    setEditingEmployee(selectedEmployee);
    setEmployeeFormOpen(true);
    handleMenuClose();
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setEmployeeFormOpen(true);
  };

  const handleFormClose = () => {
    setEmployeeFormOpen(false);
    setEditingEmployee(null);
  };

  const handleFormSubmit = () => {
    fetchEmployees();
    handleFormClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmployee) return;

    try {
      setDeleting(true);
      await api.delete(`/employees/${selectedEmployee.id}`);
      setEmployees(employees.filter(e => e.id !== selectedEmployee.id));
      setDeleteDialogOpen(false);
      setSelectedEmployee(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete employee');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'terminated': return 'error';
      case 'on_leave': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number, currency: string = 'JMD') => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-JM');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box m={3}>
      {/* Header */}
      <Box display="flex" justifyContent="space-around" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Employees
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your workforce and employee information
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={handleAddEmployee}
        >
          Add Employee
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Debug Information */}
      {process.env.NODE_ENV === 'development' && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            <strong>Debug Info:</strong><br/>
            Selected Business: {user?.selectedBusiness || 'None'}<br/>
            Available Businesses: {businesses.length}<br/>
            Employees Found: {employees.length}<br/>
            Filtered Employees: {filteredEmployees.length}
          </Typography>
        </Alert>
      )}

      {/* Search and Filters */}
      <Box mb={3}>
        <TextField
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300, mr: 2 }}
        />
        <Button
          variant="outlined"
          startIcon={<FilterList />}
        >
          Filters
        </Button>
      </Box>

      {/* Employee Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading employees...</Typography>
        </Box>
      ) : filteredEmployees.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchTerm ? 'No employees found matching your search' : 'No Employees Found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first employee to get started.'}
            </Typography>
            {/* Additional debug info when no employees */}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
              Total employees in state: {employees.length}<br/>
              Search term: "{searchTerm}"<br/>
              Business ID: {user?.selectedBusiness || 'Not selected'}<br/>
              Loading: {loading ? 'Yes' : 'No'}
            </Typography>
            {!searchTerm && (
              <Button variant="contained" startIcon={<Add />} onClick={handleAddEmployee}>
                Add Employee
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Employee ID</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Salary</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {employee.user.first_name} {employee.user.last_name}
                        </Typography>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Email fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {employee.user.email}
                          </Typography>
                        </Box>
                        {employee.user.phone && (
                          <Box display="flex" alignItems="center" mt={0.5}>
                            <Phone fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {employee.user.phone}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {employee.employee_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Work fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {employee.position}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.employment_status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(employee.employment_status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(employee.base_salary_amount, employee.salary_currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per {employee.salary_frequency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(employee.start_date)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, employee)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add employee"
        onClick={handleAddEmployee}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditEmployee}>
          <Edit sx={{ mr: 1 }} />
          Edit Employee
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 1 }} />
          View Profile
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1 }} />
          Remove Employee
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Remove Employee</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove "{selectedEmployee?.user.first_name} {selectedEmployee?.user.last_name}" from your workforce? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm}
            color="error"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Remove'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Employee Form */}
      <EmployeeForm
        open={employeeFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        employee={editingEmployee}
      />
    </Box>
  );
};

export default EmployeeList;
