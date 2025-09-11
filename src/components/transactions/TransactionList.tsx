import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Fab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import {
  AccountBalance,
  MoreVert,
  Edit,
  Delete,
  Add,
  Search,
  TrendingUp,
  TrendingDown,
  Receipt,
  Download,
  DateRange
} from '@mui/icons-material';
import api from '../../services/api';
import TransactionForm from './TransactionForm';

interface Transaction {
  _id: string;
  business: {
    _id: string;
    name: string;
  };
  transactionNumber: string;
  type: 'income' | 'expense' | 'asset_purchase' | 'asset_sale' | 'liability' | 'equity' | 'transfer' | 'adjustment';
  category: string;
  description: string;
  amount: number;
  currency: string;
  date: string;
  paymentMethod: string;
  referenceNumber?: string;
  attachments?: string[];
  tax: {
    isTaxable: boolean;
    gct?: {
      rate: number;
      amount: number;
    };
    specialConsumptionTax?: {
      rate: number;
      amount: number;
    };
    customsDuty?: {
      rate: number;
      amount: number;
    };
  };
  parties: {
    from?: {
      name: string;
      type: 'customer' | 'supplier' | 'employee' | 'bank' | 'other';
      contact?: string;
    };
    to?: {
      name: string;
      type: 'customer' | 'supplier' | 'employee' | 'bank' | 'other';
      contact?: string;
    };
  };
  status: 'pending' | 'completed' | 'cancelled' | 'reconciled';
  reconciliation?: {
    reconciledDate: string;
    reconciledBy: string;
    bankStatement: {
      date: string;
      reference: string;
      amount: number;
    };
  };
  createdAt: string;
  updatedAt: string;
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
      id={`transaction-tabpanel-${index}`}
      aria-labelledby={`transaction-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const TransactionList: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [dateFilter, setDateFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search term and filters
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.parties.from?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.parties.to?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter) {
      filtered = filtered.filter(transaction => transaction.type === typeFilter);
    }

    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }

    // Date filter (last 30 days, last 90 days, etc.)
    if (dateFilter) {
      const now = new Date();
      const daysAgo = parseInt(dateFilter);
      const filterDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(transaction => new Date(transaction.date) >= filterDate);
    }

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/transactions');
      setTransactions(response.data.transactions || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, transaction: Transaction) => {
    setAnchorEl(event.currentTarget);
    setSelectedTransaction(transaction);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTransaction(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedTransaction) return;

    try {
      setDeleting(true);
      await api.delete(`/transactions/${selectedTransaction._id}`);
      setTransactions(transactions.filter(t => t._id !== selectedTransaction._id));
      setDeleteDialogOpen(false);
      setSelectedTransaction(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete transaction');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setTransactionFormOpen(true);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTransactionFormOpen(true);
    handleMenuClose();
  };

  const handleTransactionFormClose = () => {
    setTransactionFormOpen(false);
    setEditingTransaction(null);
  };

  const handleTransactionSubmit = () => {
    fetchTransactions(); // Refresh the transaction list
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'income': return 'success';
      case 'expense': return 'error';
      case 'asset_purchase': return 'primary';
      case 'asset_sale': return 'info';
      case 'transfer': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      case 'reconciled': return 'info';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'income': return <TrendingUp />;
      case 'expense': return <TrendingDown />;
      default: return <Receipt />;
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

  const calculateTotals = () => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses, net: income - expenses };
  };

  const totals = calculateTotals();

  const getTabTransactions = (tabIndex: number) => {
    switch (tabIndex) {
      case 0: return filteredTransactions; // All
      case 1: return filteredTransactions.filter(t => t.type === 'income');
      case 2: return filteredTransactions.filter(t => t.type === 'expense');
      case 3: return filteredTransactions.filter(t => ['asset_purchase', 'asset_sale'].includes(t.type));
      default: return filteredTransactions;
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
            Transactions
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track and manage all business transactions
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
          >
            New Transaction
          </Button>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
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
                  Total Income
                </Typography>
                <Typography variant="h5" color="success.main">
                  {formatCurrency(totals.income)}
                </Typography>
              </Box>
              <TrendingUp color="success" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Expenses
                </Typography>
                <Typography variant="h5" color="error.main">
                  {formatCurrency(totals.expenses)}
                </Typography>
              </Box>
              <TrendingDown color="error" />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Net Income
                </Typography>
                <Typography 
                  variant="h5" 
                  color={totals.net >= 0 ? 'success.main' : 'error.main'}
                >
                  {formatCurrency(totals.net)}
                </Typography>
              </Box>
              <AccountBalance color={totals.net >= 0 ? 'success' : 'error'} />
            </Box>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="textSecondary" gutterBottom>
                  Total Transactions
                </Typography>
                <Typography variant="h5">
                  {filteredTransactions.length}
                </Typography>
              </Box>
              <Receipt color="primary" />
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Search and Filters */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
        <TextField
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 300 }}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            label="Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="income">Income</MenuItem>
            <MenuItem value="expense">Expense</MenuItem>
            <MenuItem value="asset_purchase">Asset Purchase</MenuItem>
            <MenuItem value="asset_sale">Asset Sale</MenuItem>
            <MenuItem value="transfer">Transfer</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
            <MenuItem value="reconciled">Reconciled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateFilter}
            label="Date Range"
            onChange={(e) => setDateFilter(e.target.value)}
            startAdornment={<DateRange />}
          >
            <MenuItem value="">All Time</MenuItem>
            <MenuItem value="7">Last 7 days</MenuItem>
            <MenuItem value="30">Last 30 days</MenuItem>
            <MenuItem value="90">Last 90 days</MenuItem>
            <MenuItem value="365">Last year</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {/* Transaction Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={(_, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={`All (${filteredTransactions.length})`} />
          <Tab label={`Income (${filteredTransactions.filter(t => t.type === 'income').length})`} />
          <Tab label={`Expenses (${filteredTransactions.filter(t => t.type === 'expense').length})`} />
          <Tab label={`Assets (${filteredTransactions.filter(t => ['asset_purchase', 'asset_sale'].includes(t.type)).length})`} />
        </Tabs>

        <TabPanel value={activeTab} index={activeTab}>
          {getTabTransactions(activeTab).length === 0 ? (
            <Box textAlign="center" py={8}>
              <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                {searchTerm ? 'No transactions found matching your search' : 'No Transactions Found'}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first transaction.'}
              </Typography>
              {!searchTerm && (
                <Button variant="contained" startIcon={<Add />} onClick={handleAddTransaction}>
                  Add Transaction
                </Button>
              )}
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getTabTransactions(activeTab).map((transaction) => (
                    <TableRow key={transaction._id} hover>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2" fontWeight="medium">
                            {transaction.transactionNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {transaction.description}
                          </Typography>
                          {transaction.parties.from && (
                            <Typography variant="caption" color="text.secondary">
                              From: {transaction.parties.from.name}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {getTypeIcon(transaction.type)}
                          <Chip 
                            label={transaction.type.replace('_', ' ')} 
                            size="small" 
                            color={getTypeColor(transaction.type) as any}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {transaction.category.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography 
                          variant="body2" 
                          fontWeight="medium"
                          color={transaction.type === 'income' ? 'success.main' : 'error.main'}
                        >
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(transaction.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status}
                          size="small"
                          color={getStatusColor(transaction.status) as any}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, transaction)}
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
        </TabPanel>
      </Paper>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add transaction"
        onClick={handleAddTransaction}
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
        <MenuItem onClick={() => selectedTransaction && handleEditTransaction(selectedTransaction)}>
          <Edit sx={{ mr: 1 }} />
          Edit Transaction
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Receipt sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1 }} />
          Delete Transaction
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Transaction</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete transaction "{selectedTransaction?.transactionNumber}"? This action cannot be undone.
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
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Transaction Form Dialog */}
      <TransactionForm
        open={transactionFormOpen}
        onClose={handleTransactionFormClose}
        onSubmit={handleTransactionSubmit}
        transaction={editingTransaction}
      />
    </Box>
  );
};

export default TransactionList;
