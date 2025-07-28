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
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  business: {
    _id: string;
    name: string;
  };
  employeeId: string;
  personalInfo: {
    dateOfBirth: Date;
    gender?: string;
    maritalStatus?: string;
    nationality?: string;
    emergencyContact?: {
      name: string;
      relationship: string;
      phone: string;
      address: string;
    };
  };
  employment: {
    position: string;
    department: string;
    startDate: Date;
    endDate?: Date;
    employmentType: string;
    status: string;
    salary: {
      amount: number;
      currency: string;
      frequency: string;
    };
    workSchedule: {
      hoursPerWeek: number;
      workDays: string[];
    };
  };
  compliance: {
    trn?: string;
    nis?: string;
    taxExemptionStatus: string;
    filingStatus: string;
  };
  createdAt: string;
  updatedAt: string;
}

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [employeeFormOpen, setEmployeeFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    // Filter employees based on search term
    const filtered = employees.filter(employee =>
      employee.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employment.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employment.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [employees, searchTerm]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data.employees || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch employees');
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
      await api.delete(`/employees/${selectedEmployee._id}`);
      setEmployees(employees.filter(e => e._id !== selectedEmployee._id));
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
      {filteredEmployees.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <PeopleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {searchTerm ? 'No employees found matching your search' : 'No Employees Found'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first employee to get started.'}
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
                <TableRow key={employee._id} hover>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2">
                          {employee.user.firstName} {employee.user.lastName}
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
                      {employee.employeeId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Work fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {employee.employment.position}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {employee.employment.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={employee.employment.status.replace('_', ' ')}
                      size="small"
                      color={getStatusColor(employee.employment.status) as any}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(employee.employment.salary.amount, employee.employment.salary.currency)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      per {employee.employment.salary.frequency}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(employee.employment.startDate.toString())}
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
            Are you sure you want to remove "{selectedEmployee?.user.firstName} {selectedEmployee?.user.lastName}" from your workforce? This action cannot be undone.
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
