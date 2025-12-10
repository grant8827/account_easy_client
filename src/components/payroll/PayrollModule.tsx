import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  ListItemIcon,
  ListItemText,
  IconButton,
  Checkbox
} from '@mui/material';
import {
  MonetizationOn,
  People,
  Receipt,
  Calculate,
  TrendingUp,
  Download,
  Add,
  MoreVert,
  Edit,
  Payment,
  Assessment,
  Warning,
  CheckCircle
} from '@mui/icons-material';
import api from '../../services/api';
import PayrollProcessor from './PayrollProcessor';

interface PayrollSummary {
  period: string;
  totalGross: number;
  totalDeductions: number;
  totalNet: number;
  employeeCount: number;
  averageSalary: number;
  totalTax: number;
  totalNIS: number;
  totalEducationTax: number;
  totalHeartTrust: number;
}

interface PayrollEntry {
  id: number;
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    employee_id: string;
    position: string;
  };
  payroll_number: string;
  pay_period_start: string;
  pay_period_end: string;
  pay_period_type: string;
  basic_salary: number;
  overtime_hours: number;
  overtime_amount: number;
  bonus: number;
  commission: number;
  gross_earnings: number;
  regular_hours: number;
  paye_amount: number;
  nis_contribution: number;
  education_tax_amount: number;
  heart_trust_amount: number;
  total_deductions: number;
  net_pay: number;
  status: 'draft' | 'calculated' | 'approved' | 'paid' | 'cancelled';
  pay_date: string;
  is_paid: boolean;
  created_at: string;
}

interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  employee_id: string;
  position: string;
  base_salary_amount: number;
  employment_status: 'active' | 'inactive' | 'terminated';
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payroll-tabpanel-${index}`}
      aria-labelledby={`payroll-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const PayrollModule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null);
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [processPayrollDialog, setProcessPayrollDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedEntry, setSelectedEntry] = useState<PayrollEntry | null>(null);
  const [selectedEntries, setSelectedEntries] = useState<number[]>([]);
  const [showPayrollProcessor, setShowPayrollProcessor] = useState(false);

  const fetchPayrollData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get business ID from user context or use first business
      const businessResponse = await api.get('/businesses/');
      const businesses = businessResponse.data || [];
      const businessId = businesses.length > 0 ? businesses[0].id : null;
      
      if (!businessId) {
        setError('No business found. Please create a business first.');
        setLoading(false);
        return;
      }
      
      const [summaryResponse, entriesResponse, employeesResponse] = await Promise.all([
        api.get(`/payroll/${businessId}/summary?period=${selectedPeriod}`),
        api.get(`/payroll/${businessId}?period=${selectedPeriod}`),
        api.get(`/payroll/${businessId}/employees/`)
      ]);
      
      setPayrollSummary(summaryResponse.data);
      setPayrollEntries(entriesResponse.data || []);
      setEmployees(employeesResponse.data?.data?.employees || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch payroll data');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  const formatCurrency = (amount: number, currency: string = 'JMD') => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'approved': return 'info';
      case 'draft': return 'warning';
      default: return 'default';
    }
  };

  const processPayroll = async () => {
    try {
      setLoading(true);
      await api.post('/payroll/process', { period: selectedPeriod });
      setProcessPayrollDialog(false);
      await fetchPayrollData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process payroll');
    } finally {
      setLoading(false);
    }
  };

  const approvePayroll = async (entryId: number) => {
    try {
      await api.patch(`/payroll/entries/${entryId}/approve`);
      await fetchPayrollData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to approve payroll');
    }
  };

  const markAsPaid = async (entryId: number) => {
    try {
      await api.patch(`/payroll/entries/${entryId}/paid`);
      await fetchPayrollData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark as paid');
    }
  };

  const filteredEntries = payrollEntries.filter(entry => {
    const matchesSearch = 
      entry.employee.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employee.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, entry: PayrollEntry) => {
    setMenuAnchor(event.currentTarget);
    setSelectedEntry(entry);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedEntry(null);
  };

  const handleSelectEntry = (entryId: number) => {
    setSelectedEntries(prev => 
      prev.includes(entryId) 
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId]
    );
  };

  const handleSelectAll = () => {
    if (selectedEntries.length === filteredEntries.length) {
      setSelectedEntries([]);
    } else {
      setSelectedEntries(filteredEntries.map(entry => entry.id));
    }
  };

  const generatePayslip = async (entry: PayrollEntry) => {
    try {
      // Generate individual payslip
      const response = await api.get(`/payroll/payslip/${entry.id}`, {
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslip_${entry.employee.first_name}_${entry.employee.last_name}_${entry.pay_period_start}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Failed to generate payslip');
    }
  };

  const generateBulkPayslips = async () => {
    try {
      const response = await api.post('/payroll/bulk-payslips', {
        entryIds: selectedEntries
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `payslips_${selectedPeriod}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSelectedEntries([]);
    } catch (err: any) {
      setError('Failed to generate bulk payslips');
    }
  };

  const approveBulkPayroll = async () => {
    try {
      await api.post('/payroll/bulk-approve', {
        entryIds: selectedEntries
      });
      
      await fetchPayrollData();
      setSelectedEntries([]);
    } catch (err: any) {
      setError('Failed to approve selected payrolls');
    }
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
            Payroll Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Employee payroll processing and tax compliance
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Period</InputLabel>
            <Select
              value={selectedPeriod}
              label="Period"
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <MenuItem value="2024-01">January 2024</MenuItem>
              <MenuItem value="2023-12">December 2023</MenuItem>
              <MenuItem value="2023-11">November 2023</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => setProcessPayrollDialog(true)}
          >
            Process Payroll
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Quick Stats */}
      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 2,
          mb: 3
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Gross Pay
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(payrollSummary?.totalGross || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  This period
                </Typography>
              </Box>
              <MonetizationOn color="primary" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Net Pay
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(payrollSummary?.totalNet || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  After deductions
                </Typography>
              </Box>
              <Payment color="success" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Deductions
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(payrollSummary?.totalDeductions || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Tax & statutory
                </Typography>
              </Box>
              <Receipt color="error" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Employees
                </Typography>
                <Typography variant="h5">
                  {payrollSummary?.employeeCount || 0}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Active payroll
                </Typography>
              </Box>
              <People color="info" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Average Salary
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(payrollSummary?.averageSalary || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Per employee
                </Typography>
              </Box>
              <Calculate color="secondary" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Main Content Tabs */}
      <Paper>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Payroll Entries" />
          <Tab label="Tax Summary" />
          <Tab label="Employee Summary" />
          <Tab label="Reports" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Payroll Entries */}
          <Box>
            <Box display="flex" gap={2} mb={3}>
              <TextField
                label="Search employees"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 250 }}
              />
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel size="small">Status</InputLabel>
                <Select
                  size="small"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="approved">Approved</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
              <Button 
                variant="outlined" 
                startIcon={<Calculate />}
                onClick={() => setShowPayrollProcessor(true)}
              >
                Process Individual Payroll
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedEntries.length === filteredEntries.length && filteredEntries.length > 0}
                        indeterminate={selectedEntries.length > 0 && selectedEntries.length < filteredEntries.length}
                        onChange={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell>Employee</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell align="right">Basic Salary</TableCell>
                    <TableCell align="right">Overtime</TableCell>
                    <TableCell align="right">Bonuses</TableCell>
                    <TableCell align="right">Gross Pay</TableCell>
                    <TableCell align="right">Deductions</TableCell>
                    <TableCell align="right">Net Pay</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredEntries.map((entry) => (
                    <TableRow key={entry.id} hover>
                      <TableCell>
                        <Checkbox
                          checked={selectedEntries.includes(entry.id)}
                          onChange={() => handleSelectEntry(entry.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography fontWeight="medium">
                            {entry.employee.first_name} {entry.employee.last_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {entry.employee.employee_id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{entry.employee.position}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {formatCurrency(entry.basic_salary)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="info.main">
                          {formatCurrency(entry.overtime_amount)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="success.main">
                          {formatCurrency(entry.bonus)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          {formatCurrency(entry.gross_earnings)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography color="error.main">
                          {formatCurrency(entry.total_deductions)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="success.main">
                          {formatCurrency(entry.net_pay)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={entry.status}
                          size="small"
                          color={getStatusColor(entry.status) as any}
                          icon={
                            entry.status === 'paid' ? <CheckCircle /> :
                            entry.status === 'approved' ? <Assessment /> :
                            <Warning />
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            onClick={() => generatePayslip(entry)}
                            title="Generate Payslip"
                          >
                            <Download />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, entry)}
                          >
                            <MoreVert />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Bulk Actions */}
            {selectedEntries.length > 0 && (
              <Paper sx={{ p: 2, mt: 2, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1">
                    {selectedEntries.length} employee(s) selected
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={generateBulkPayslips}
                      startIcon={<Download />}
                    >
                      Generate Payslips
                    </Button>
                    <Button 
                      variant="contained" 
                      color="success"
                      onClick={approveBulkPayroll}
                      startIcon={<CheckCircle />}
                    >
                      Approve Selected
                    </Button>
                  </Stack>
                </Box>
              </Paper>
            )}
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Tax Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Tax and Statutory Deductions Summary
            </Typography>
            
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 3,
                mb: 3
              }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    PAYE Tax
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {formatCurrency(payrollSummary?.totalTax || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pay As You Earn deductions
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    NIS Contributions
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {formatCurrency(payrollSummary?.totalNIS || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    National Insurance Scheme
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Education Tax
                  </Typography>
                  <Typography variant="h4" color="secondary.main">
                    {formatCurrency(payrollSummary?.totalEducationTax || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2.25% of gross emoluments
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    HEART Trust
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {formatCurrency(payrollSummary?.totalHeartTrust || 0)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3% of gross emoluments
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            <Alert severity="info">
              <Typography variant="subtitle2" gutterBottom>
                Jamaica Statutory Rates (2024)
              </Typography>
              <Typography variant="body2">
                • PAYE: 25% (income up to $6M), 30% (above $6M)<br/>
                • NIS: Employee 3%, Employer 2.5%<br/>
                • Education Tax: 2.25% of gross emoluments<br/>
                • HEART Trust: 3% of gross emoluments
              </Typography>
            </Alert>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* Employee Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Employee Payroll Summary
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Employee</TableCell>
                    <TableCell>Position</TableCell>
                    <TableCell align="right">Basic Salary</TableCell>
                    <TableCell align="right">YTD Gross</TableCell>
                    <TableCell align="right">YTD Tax</TableCell>
                    <TableCell align="right">YTD Net</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employees.map((employee) => {
                    const employeeEntries = payrollEntries.filter(
                      entry => entry.employee.id === employee.id
                    );
                    const ytdGross = employeeEntries.reduce((sum, entry) => sum + entry.gross_earnings, 0);
                    const ytdTax = employeeEntries.reduce((sum, entry) => sum + entry.total_deductions, 0);
                    const ytdNet = employeeEntries.reduce((sum, entry) => sum + entry.net_pay, 0);

                    return (
                      <TableRow key={employee.id} hover>
                        <TableCell>
                          <Box>
                            <Typography fontWeight="medium">
                              {employee.first_name} {employee.last_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              ID: {employee.employee_id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(employee.base_salary_amount || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(ytdGross)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(ytdTax)}
                        </TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold" color="success.main">
                            {formatCurrency(ytdNet)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={employee.employment_status}
                            size="small"
                            color={employee.employment_status === 'active' ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Reports */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Payroll Reports
            </Typography>
            
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 2
              }}
            >
              <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Assessment color="primary" />
                    <Box>
                      <Typography variant="h6">Payroll Register</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Complete payroll listing for the period
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Receipt color="secondary" />
                    <Box>
                      <Typography variant="h6">Tax Summary Report</Typography>
                      <Typography variant="body2" color="text.secondary">
                        PAYE, NIS, and statutory deductions
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <People color="info" />
                    <Box>
                      <Typography variant="h6">Employee Summary</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Individual employee payroll details
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ cursor: 'pointer' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2}>
                    <TrendingUp color="success" />
                    <Box>
                      <Typography variant="h6">Year-to-Date Report</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cumulative payroll and tax data
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
      </Paper>

      {/* Process Payroll Dialog */}
      <Dialog open={processPayrollDialog} onClose={() => setProcessPayrollDialog(false)}>
        <DialogTitle>Process Payroll</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Process payroll for {selectedPeriod}? This will calculate all salaries, 
            taxes, and statutory deductions for active employees.
          </Typography>
          <Alert severity="info">
            <Typography variant="body2">
              This action will create payroll entries for all active employees 
              based on their current salary and tax settings.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setProcessPayrollDialog(false)}>
            Cancel
          </Button>
          <Button onClick={processPayroll} variant="contained">
            Process Payroll
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        {selectedEntry?.status === 'draft' && (
          <MenuItem onClick={() => {
            approvePayroll(selectedEntry.id);
            handleMenuClose();
          }}>
            <ListItemIcon><CheckCircle /></ListItemIcon>
            <ListItemText>Approve</ListItemText>
          </MenuItem>
        )}
        {selectedEntry?.status === 'approved' && (
          <MenuItem onClick={() => {
            markAsPaid(selectedEntry.id);
            handleMenuClose();
          }}>
            <ListItemIcon><Payment /></ListItemIcon>
            <ListItemText>Mark as Paid</ListItemText>
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          setShowPayrollProcessor(true);
          handleMenuClose();
        }}>
          <ListItemIcon><Calculate /></ListItemIcon>
          <ListItemText>Process Individual</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Edit /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><Download /></ListItemIcon>
          <ListItemText>Download Payslip</ListItemText>
        </MenuItem>
      </Menu>

      {/* PayrollProcessor Dialog */}
      <PayrollProcessor
        open={showPayrollProcessor}
        onClose={() => setShowPayrollProcessor(false)}
        onSubmit={() => {
          setShowPayrollProcessor(false);
          fetchPayrollData();
        }}
        period={selectedPeriod}
      />
    </Box>
  );
};

export default PayrollModule;
