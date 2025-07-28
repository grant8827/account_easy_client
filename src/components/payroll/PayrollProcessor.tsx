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
  Stack,
  InputAdornment,
  Card,
  CardContent,
  Divider,
  Chip
} from '@mui/material';
import {
  Person,
  AttachMoney,
  Calculate,
  Receipt
} from '@mui/icons-material';
import api from '../../services/api';

interface PayrollProcessorProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  period: string;
}

interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  position: string;
  basicSalary: number;
}

interface PayrollCalculation {
  basicSalary: number;
  overtime: number;
  allowances: number;
  bonuses: number;
  grossPay: number;
  paye: number;
  nis: number;
  educationTax: number;
  heartTrust: number;
  otherDeductions: number;
  totalDeductions: number;
  netPay: number;
}

const PayrollProcessor: React.FC<PayrollProcessorProps> = ({ open, onClose, onSubmit, period }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [overtimeHours, setOvertimeHours] = useState(0);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [allowances, setAllowances] = useState(0);
  const [bonuses, setBonuses] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);
  const [calculation, setCalculation] = useState<PayrollCalculation | null>(null);

  useEffect(() => {
    if (open) {
      fetchEmployees();
    }
  }, [open]);

  useEffect(() => {
    if (selectedEmployee) {
      const calculatePayroll = async () => {
        try {
          const employee = employees.find(emp => emp._id === selectedEmployee);
          if (!employee) return;

          const basicSalary = employee.basicSalary;
          const hourlyRate = basicSalary / (40 * 4); // Assuming 40 hours/week, 4 weeks/month
          const overtimePay = overtimeHours * hourlyRate * overtimeRate;
          const grossPay = basicSalary + overtimePay + allowances + bonuses;

          // Calculate Jamaica tax rates
          const paye = calculatePAYE(grossPay);
          const nis = Math.min(grossPay * 0.03, 13000); // Employee NIS: 3%, max JMD 13,000/month
          const educationTax = grossPay * 0.0225; // 2.25%
          const heartTrust = grossPay * 0.03; // 3%
          
          const totalDeductions = paye + nis + educationTax + heartTrust + otherDeductions;
          const netPay = grossPay - totalDeductions;

          setCalculation({
            basicSalary,
            overtime: overtimePay,
            allowances,
            bonuses,
            grossPay,
            paye,
            nis,
            educationTax,
            heartTrust,
            otherDeductions,
            totalDeductions,
            netPay
          });
        } catch (err: any) {
          setError('Failed to calculate payroll');
        }
      };
      
      calculatePayroll();
    }
  }, [selectedEmployee, employees, overtimeHours, overtimeRate, allowances, bonuses, otherDeductions]);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees?status=active');
      setEmployees(response.data.employees || []);
    } catch (err: any) {
      setError('Failed to fetch employees');
    }
  };

  const calculatePAYE = (grossPay: number) => {
    // Jamaica PAYE rates for 2024
    const annualGross = grossPay * 12;
    
    if (annualGross <= 1500000) return 0; // No tax for first 1.5M annually
    
    let tax = 0;
    if (annualGross <= 6000000) {
      tax = (annualGross - 1500000) * 0.25; // 25% for next portion
    } else {
      tax = 4500000 * 0.25 + (annualGross - 6000000) * 0.30; // 30% for amounts over 6M
    }
    
    return tax / 12; // Convert to monthly
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD'
    }).format(amount);
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !calculation) return;

    try {
      setLoading(true);
      setError(null);

      await api.post('/payroll/process-individual', {
        employeeId: selectedEmployee,
        period,
        basicSalary: calculation.basicSalary,
        overtime: calculation.overtime,
        allowances: calculation.allowances,
        bonuses: calculation.bonuses,
        otherDeductions: calculation.otherDeductions,
        grossPay: calculation.grossPay,
        paye: calculation.paye,
        nis: calculation.nis,
        educationTax: calculation.educationTax,
        heartTrust: calculation.heartTrust,
        totalDeductions: calculation.totalDeductions,
        netPay: calculation.netPay
      });
      
      onSubmit();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process payroll');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedEmployee('');
    setOvertimeHours(0);
    setOvertimeRate(1.5);
    setAllowances(0);
    setBonuses(0);
    setOtherDeductions(0);
    setCalculation(null);
    setError(null);
    onClose();
  };

  const selectedEmployeeData = employees.find(emp => emp._id === selectedEmployee);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={2}>
          <Calculate color="primary" />
          Process Individual Payroll - {period}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Employee Selection */}
          <FormControl fullWidth>
            <InputLabel>Select Employee</InputLabel>
            <Select
              value={selectedEmployee}
              label="Select Employee"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              {employees.map(employee => (
                <MenuItem key={employee._id} value={employee._id}>
                  <Box>
                    <Typography>
                      {employee.firstName} {employee.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {employee.position} - ID: {employee.employeeId}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedEmployeeData && (
            <Card variant="outlined">
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                  <Person color="primary" />
                  <Box>
                    <Typography variant="h6">
                      {selectedEmployeeData.firstName} {selectedEmployeeData.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedEmployeeData.position} • Basic Salary: {formatCurrency(selectedEmployeeData.basicSalary)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          )}

          {/* Payroll Inputs */}
          {selectedEmployee && (
            <>
              <Typography variant="h6" gutterBottom>
                Additional Earnings & Deductions
              </Typography>
              
              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  label="Overtime Hours"
                  type="number"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">hrs</InputAdornment>,
                  }}
                />
                <TextField
                  label="Overtime Rate Multiplier"
                  type="number"
                  value={overtimeRate}
                  onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 1.5)}
                  inputProps={{ step: 0.1, min: 1 }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">x</InputAdornment>,
                  }}
                />
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <TextField
                  label="Allowances"
                  type="number"
                  value={allowances}
                  onChange={(e) => setAllowances(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">JMD</InputAdornment>,
                  }}
                />
                <TextField
                  label="Bonuses"
                  type="number"
                  value={bonuses}
                  onChange={(e) => setBonuses(parseFloat(e.target.value) || 0)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">JMD</InputAdornment>,
                  }}
                />
              </Box>

              <TextField
                label="Other Deductions"
                type="number"
                value={otherDeductions}
                onChange={(e) => setOtherDeductions(parseFloat(e.target.value) || 0)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">JMD</InputAdornment>,
                }}
                helperText="Loan payments, uniform costs, etc."
              />

              {/* Calculation Summary */}
              {calculation && (
                <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      <Receipt sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Payroll Calculation
                    </Typography>
                    
                    <Stack spacing={2}>
                      {/* Earnings */}
                      <Box>
                        <Typography variant="subtitle2" color="success.main" gutterBottom>
                          Earnings
                        </Typography>
                        <Stack spacing={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Basic Salary:</Typography>
                            <Typography fontWeight="medium">
                              {formatCurrency(calculation.basicSalary)}
                            </Typography>
                          </Box>
                          {calculation.overtime > 0 && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Overtime ({overtimeHours} hrs):</Typography>
                              <Typography fontWeight="medium">
                                {formatCurrency(calculation.overtime)}
                              </Typography>
                            </Box>
                          )}
                          {calculation.allowances > 0 && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Allowances:</Typography>
                              <Typography fontWeight="medium">
                                {formatCurrency(calculation.allowances)}
                              </Typography>
                            </Box>
                          )}
                          {calculation.bonuses > 0 && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Bonuses:</Typography>
                              <Typography fontWeight="medium">
                                {formatCurrency(calculation.bonuses)}
                              </Typography>
                            </Box>
                          )}
                          <Divider />
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">Gross Pay:</Typography>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {formatCurrency(calculation.grossPay)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Deductions */}
                      <Box>
                        <Typography variant="subtitle2" color="error.main" gutterBottom>
                          Deductions
                        </Typography>
                        <Stack spacing={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>PAYE Tax:</Typography>
                            <Typography>{formatCurrency(calculation.paye)}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>NIS (3%):</Typography>
                            <Typography>{formatCurrency(calculation.nis)}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>Education Tax (2.25%):</Typography>
                            <Typography>{formatCurrency(calculation.educationTax)}</Typography>
                          </Box>
                          <Box display="flex" justifyContent="space-between">
                            <Typography>HEART Trust (3%):</Typography>
                            <Typography>{formatCurrency(calculation.heartTrust)}</Typography>
                          </Box>
                          {calculation.otherDeductions > 0 && (
                            <Box display="flex" justifyContent="space-between">
                              <Typography>Other Deductions:</Typography>
                              <Typography>{formatCurrency(calculation.otherDeductions)}</Typography>
                            </Box>
                          )}
                          <Divider />
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="subtitle2">Total Deductions:</Typography>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {formatCurrency(calculation.totalDeductions)}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>

                      {/* Net Pay */}
                      <Card variant="outlined" sx={{ bgcolor: 'success.light', p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6">Net Pay:</Typography>
                          <Chip 
                            label={formatCurrency(calculation.netPay)}
                            color="success"
                            variant="filled"
                            sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}
                          />
                        </Box>
                      </Card>
                    </Stack>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={loading || !selectedEmployee || !calculation}
          startIcon={loading ? <Calculate /> : <AttachMoney />}
        >
          {loading ? 'Processing...' : 'Process Payroll'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PayrollProcessor;
