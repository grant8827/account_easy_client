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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Receipt,
  AccountBalance,
  Calculate,
  Schedule,
  Warning,
  CheckCircle,
  Download,
  Upload,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import api from '../../services/api';

interface TaxSummary {
  period: string;
  gct: {
    taxable: number;
    collected: number;
    paid: number;
    rate: number;
  };
  paye: {
    gross: number;
    deductions: number;
    netPay: number;
    tax: number;
  };
  companyTax: {
    profit: number;
    rate: number;
    tax: number;
  };
  nis: {
    employee: number;
    employer: number;
    total: number;
  };
  education: {
    payroll: number;
    rate: number;
    tax: number;
  };
  heartTrust: {
    payroll: number;
    rate: number;
    tax: number;
  };
}

interface TaxReturn {
  _id: string;
  business: string;
  type: 'gct' | 'paye' | 'company_tax' | 'annual_return';
  period: string;
  dueDate: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected' | 'overdue';
  amount: number;
  filedDate?: string;
  createdAt: string;
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
      id={`tax-tabpanel-${index}`}
      aria-labelledby={`tax-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TaxModule: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [taxSummary, setTaxSummary] = useState<TaxSummary | null>(null);
  const [taxReturns, setTaxReturns] = useState<TaxReturn[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('2024');

  const fetchTaxData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryResponse, returnsResponse] = await Promise.all([
        api.get(`/tax/summary?period=${selectedPeriod}`),
        api.get(`/tax/returns?period=${selectedPeriod}`)
      ]);
      
      setTaxSummary(summaryResponse.data);
      setTaxReturns(returnsResponse.data.returns || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tax data');
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchTaxData();
  }, [selectedPeriod, fetchTaxData]);

  const formatCurrency = (amount: number, currency: string = 'JMD') => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-JM');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'submitted': return 'info';
      case 'draft': return 'warning';
      case 'rejected': return 'error';
      case 'overdue': return 'error';
      default: return 'default';
    }
  };

  const getReturnTypeLabel = (type: string) => {
    switch (type) {
      case 'gct': return 'GCT Return';
      case 'paye': return 'PAYE Return';
      case 'company_tax': return 'Company Tax';
      case 'annual_return': return 'Annual Return';
      default: return type;
    }
  };

  const calculateGCTLiability = () => {
    if (!taxSummary) return 0;
    return taxSummary.gct.collected - taxSummary.gct.paid;
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    const upcoming = taxReturns.filter(ret => {
      const dueDate = new Date(ret.dueDate);
      const daysUntilDue = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
      return daysUntilDue >= 0 && daysUntilDue <= 30 && ret.status !== 'accepted';
    });
    return upcoming.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
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
            Tax Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Jamaica tax compliance and reporting
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
              <MenuItem value="2024">2024</MenuItem>
              <MenuItem value="2023">2023</MenuItem>
              <MenuItem value="2022">2022</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<Download />}>
            Export
          </Button>
          <Button variant="contained" startIcon={<Upload />}>
            File Return
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 2,
          mb: 3
        }}
      >
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  GCT Liability
                </Typography>
                <Typography variant="h5" color={calculateGCTLiability() >= 0 ? 'error.main' : 'success.main'}>
                  {formatCurrency(Math.abs(calculateGCTLiability()))}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {calculateGCTLiability() >= 0 ? 'Due' : 'Credit'}
                </Typography>
              </Box>
              <Receipt color={calculateGCTLiability() >= 0 ? 'error' : 'success'} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  PAYE Deductions
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(taxSummary?.paye.tax || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  This period
                </Typography>
              </Box>
              <AccountBalance color="primary" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Company Tax
                </Typography>
                <Typography variant="h5">
                  {formatCurrency(taxSummary?.companyTax.tax || 0)}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Annual liability
                </Typography>
              </Box>
              <Calculate color="secondary" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Upcoming Deadlines
                </Typography>
                <Typography variant="h5" color="warning.main">
                  {getUpcomingDeadlines().length}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Next 30 days
                </Typography>
              </Box>
              <Schedule color="warning" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Upcoming Deadlines Alert */}
      {getUpcomingDeadlines().length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Upcoming Tax Deadlines
          </Typography>
          {getUpcomingDeadlines().slice(0, 3).map(deadline => (
            <Typography key={deadline._id} variant="body2">
              • {getReturnTypeLabel(deadline.type)} - Due: {formatDate(deadline.dueDate)}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Main Content Tabs */}
      <Paper>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Tax Summary" />
          <Tab label="Returns & Filing" />
          <Tab label="GCT Analysis" />
          <Tab label="Payroll Taxes" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          {/* Tax Summary */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Tax Summary for {selectedPeriod}
            </Typography>
            
            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 3,
                mb: 3
              }}
            >
              {/* GCT Summary */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    General Consumption Tax (GCT)
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Taxable Sales:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.gct.taxable || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>GCT Collected:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.gct.collected || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>GCT Paid:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.gct.paid || 0)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold">Net Liability:</Typography>
                      <Typography 
                        fontWeight="bold"
                        color={calculateGCTLiability() >= 0 ? 'error.main' : 'success.main'}
                      >
                        {formatCurrency(Math.abs(calculateGCTLiability()))}
                        {calculateGCTLiability() >= 0 ? ' Due' : ' Credit'}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* PAYE Summary */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pay As You Earn (PAYE)
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Gross Payroll:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.paye.gross || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Total Deductions:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.paye.deductions || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Net Pay:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.paye.netPay || 0)}
                      </Typography>
                    </Box>
                    <Divider />
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight="bold">PAYE Tax:</Typography>
                      <Typography fontWeight="bold" color="error.main">
                        {formatCurrency(taxSummary?.paye.tax || 0)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Statutory Deductions */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Statutory Deductions
                  </Typography>
                  <Stack spacing={2}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>NIS Contributions:</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.nis.total || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ pl: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Employee (3%):
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(taxSummary?.nis.employee || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ pl: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Employer (2.5%):
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(taxSummary?.nis.employer || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>Education Tax (2.25%):</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.education.tax || 0)}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography>HEART Trust (3%):</Typography>
                      <Typography fontWeight="medium">
                        {formatCurrency(taxSummary?.heartTrust.tax || 0)}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          {/* Returns & Filing */}
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">
                Tax Returns for {selectedPeriod}
              </Typography>
              <Button variant="contained" startIcon={<Upload />}>
                File New Return
              </Button>
            </Box>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Return Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>Due Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Filed Date</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {taxReturns.map((taxReturn) => (
                    <TableRow key={taxReturn._id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {getReturnTypeLabel(taxReturn.type)}
                        </Typography>
                      </TableCell>
                      <TableCell>{taxReturn.period}</TableCell>
                      <TableCell>
                        <Typography 
                          color={
                            new Date(taxReturn.dueDate) < new Date() && taxReturn.status !== 'accepted'
                              ? 'error.main' 
                              : 'text.primary'
                          }
                        >
                          {formatDate(taxReturn.dueDate)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {formatCurrency(taxReturn.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={taxReturn.status.replace('_', ' ')}
                          size="small"
                          color={getStatusColor(taxReturn.status) as any}
                          icon={
                            taxReturn.status === 'accepted' ? <CheckCircle /> :
                            taxReturn.status === 'overdue' ? <Warning /> : undefined
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {taxReturn.filedDate ? formatDate(taxReturn.filedDate) : '-'}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" variant="outlined">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          {/* GCT Analysis */}
          <Box>
            <Typography variant="h6" gutterBottom>
              GCT Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              General Consumption Tax breakdown and compliance status
            </Typography>

            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  GCT Rate Compliance
                </Typography>
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Standard Rate (16.5%)</Typography>
                    <Typography variant="body2">98.5%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={98.5} />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Your GCT calculations are 98.5% compliant with Jamaica tax regulations.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          {/* Payroll Taxes */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Payroll Tax Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              PAYE, NIS, Education Tax, and HEART Trust contributions
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Jamaica Payroll Tax Rates (2024)
              </Typography>
              <Typography variant="body2">
                • PAYE: Progressive rates from 25% to 30%<br/>
                • NIS: Employee 3%, Employer 2.5%<br/>
                • Education Tax: 2.25% of gross emoluments<br/>
                • HEART Trust: 3% of gross emoluments
              </Typography>
            </Alert>

            <Box 
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 2
              }}
            >
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Payroll
                  </Typography>
                  <Typography variant="h4" color="primary.main">
                    {formatCurrency(taxSummary?.paye.gross || 0)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <TrendingUp color="success" fontSize="small" />
                    <Typography variant="caption" color="success.main" ml={1}>
                      +5.2% from last period
                    </Typography>
                  </Box>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Deductions
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {formatCurrency(taxSummary?.paye.deductions || 0)}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <TrendingDown color="error" fontSize="small" />
                    <Typography variant="caption" color="error.main" ml={1}>
                      {((taxSummary?.paye.deductions || 0) / (taxSummary?.paye.gross || 1) * 100).toFixed(1)}% of gross
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default TaxModule;
