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
  CircularProgress,
  Divider,
  Switch,
  FormControlLabel,
  InputAdornment
} from '@mui/material';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Business {
  _id: string;
  name: string;
  registrationNumber: string;
}

interface TransactionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  transaction?: any;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ open, onClose, onSubmit, transaction }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  
  const [formData, setFormData] = useState({
    businessId: transaction?.business?._id || user?.selectedBusiness || '',
    type: transaction?.type || 'income',
    category: transaction?.category || '',
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    currency: transaction?.currency || 'JMD',
    date: transaction?.date || new Date().toISOString().split('T')[0],
    paymentMethod: transaction?.paymentMethod || 'cash',
    referenceNumber: transaction?.referenceNumber || '',
    fromName: transaction?.parties?.from?.name || '',
    fromType: transaction?.parties?.from?.type || 'customer',
    toName: transaction?.parties?.to?.name || '',
    toType: transaction?.parties?.to?.type || 'supplier',
    isTaxable: transaction?.tax?.isTaxable || false,
    gctRate: transaction?.tax?.gct?.rate || 16.5,
    status: transaction?.status || 'pending'
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
      if (!formData.description || !formData.category || formData.amount <= 0) {
        setError('Please fill in all required fields: Description, Category, and Amount');
        return;
      }

      // Calculate tax amounts
      const gctAmount = formData.isTaxable ? (formData.amount * formData.gctRate) / 100 : 0;

      // Create the transaction data
      const transactionData = {
        business: formData.businessId,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        amount: formData.amount,
        currency: formData.currency,
        date: new Date(formData.date),
        paymentMethod: formData.paymentMethod,
        reference: formData.referenceNumber || undefined,
        ...(formData.fromName && {
          customer: {
            name: formData.fromName,
            type: formData.fromType
          }
        }),
        ...(formData.toName && {
          vendor: {
            name: formData.toName,
            type: formData.toType
          }
        }),
        taxInfo: {
          isTaxable: formData.isTaxable,
          ...(formData.isTaxable && {
            gctRate: formData.gctRate / 100, // Convert percentage to decimal
            gctAmount: gctAmount
          })
        },
        status: formData.status
      };

      const endpoint = transaction ? `/transactions/${transaction._id}` : '/transactions';
      const method = transaction ? 'put' : 'post';

      await api[method](endpoint, transactionData);
      
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error('Transaction creation error:', err);
      
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        const errorMessages = errorData.errors.map((error: any) => 
          `${error.field}: ${error.message}`
        ).join('\n');
        setError(`Validation errors:\n${errorMessages}`);
      } else if (errorData?.details && Array.isArray(errorData.details)) {
        setError(`Validation errors:\n${errorData.details.join('\n')}`);
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError('Failed to save transaction. Please check all required fields.');
      }
    } finally {
      setLoading(false);
    }
  };

  const transactionTypes = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'asset_purchase', label: 'Asset Purchase' },
    { value: 'asset_sale', label: 'Asset Sale' },
    { value: 'liability', label: 'Liability' },
    { value: 'equity', label: 'Equity' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'adjustment', label: 'Adjustment' }
  ];

  const getTransactionCategories = (type: string) => {
    switch (type) {
      case 'income':
        return [
          { value: 'sales_revenue', label: 'Sales Revenue' },
          { value: 'service_revenue', label: 'Service Revenue' },
          { value: 'interest_income', label: 'Interest Income' },
          { value: 'rental_income', label: 'Rental Income' },
          { value: 'other_income', label: 'Other Income' }
        ];
      case 'expense':
        return [
          { value: 'salaries_wages', label: 'Salaries & Wages' },
          { value: 'rent_utilities', label: 'Rent & Utilities' },
          { value: 'office_supplies', label: 'Office Supplies' },
          { value: 'marketing_advertising', label: 'Marketing & Advertising' },
          { value: 'professional_fees', label: 'Professional Fees' },
          { value: 'insurance', label: 'Insurance' },
          { value: 'depreciation', label: 'Depreciation' },
          { value: 'interest_expense', label: 'Interest Expense' },
          { value: 'travel_entertainment', label: 'Travel & Entertainment' },
          { value: 'maintenance_repairs', label: 'Maintenance & Repairs' },
          { value: 'taxes_licenses', label: 'Taxes & Licenses' },
          { value: 'other_expenses', label: 'Other Expenses' }
        ];
      case 'asset_purchase':
      case 'asset_sale':
        return [
          { value: 'cash', label: 'Cash' },
          { value: 'accounts_receivable', label: 'Accounts Receivable' },
          { value: 'inventory', label: 'Inventory' },
          { value: 'equipment', label: 'Equipment' },
          { value: 'buildings', label: 'Buildings' },
          { value: 'land', label: 'Land' },
          { value: 'investments', label: 'Investments' },
          { value: 'other_assets', label: 'Other Assets' }
        ];
      case 'liability':
        return [
          { value: 'accounts_payable', label: 'Accounts Payable' },
          { value: 'loans_payable', label: 'Loans Payable' },
          { value: 'accrued_expenses', label: 'Accrued Expenses' },
          { value: 'other_liabilities', label: 'Other Liabilities' }
        ];
      case 'equity':
        return [
          { value: 'owner_equity', label: 'Owner Equity' },
          { value: 'retained_earnings', label: 'Retained Earnings' },
          { value: 'capital_contributions', label: 'Capital Contributions' }
        ];
      case 'transfer':
      case 'adjustment':
        return [
          { value: 'other_income', label: 'Other Income' },
          { value: 'other_expenses', label: 'Other Expenses' },
          { value: 'other_assets', label: 'Other Assets' }
        ];
      default:
        return [
          { value: 'other_income', label: 'Other Income' },
          { value: 'other_expenses', label: 'Other Expenses' }
        ];
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'mobile_money', label: 'Mobile Money' },
    { value: 'other', label: 'Other' }
  ];

  const partyTypes = [
    { value: 'customer', label: 'Customer' },
    { value: 'supplier', label: 'Supplier' },
    { value: 'employee', label: 'Employee' },
    { value: 'bank', label: 'Bank' },
    { value: 'other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {transaction ? 'Edit Transaction' : 'Add New Transaction'}
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
          </FormControl>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <FormControl fullWidth required>
              <InputLabel>Transaction Type *</InputLabel>
              <Select
                value={formData.type}
                label="Transaction Type *"
                onChange={(e) => handleInputChange('type', e.target.value)}
              >
                {transactionTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Category *"
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              fullWidth
              required
              placeholder="e.g., Office Supplies, Sales Revenue"
            />
          </Box>

          <TextField
            label="Description *"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            fullWidth
            required
            multiline
            rows={2}
            placeholder="Detailed description of the transaction"
          />

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Amount *"
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={(e) => handleInputChange('currency', e.target.value)}
              >
                <MenuItem value="JMD">JMD - Jamaican Dollar</MenuItem>
                <MenuItem value="USD">USD - US Dollar</MenuItem>
                <MenuItem value="EUR">EUR - Euro</MenuItem>
                <MenuItem value="GBP">GBP - British Pound</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Transaction Date *"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.paymentMethod}
                label="Payment Method"
                onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method.value} value={method.value}>
                    {method.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <TextField
            label="Reference Number"
            value={formData.referenceNumber}
            onChange={(e) => handleInputChange('referenceNumber', e.target.value)}
            fullWidth
            placeholder="Invoice number, receipt number, etc."
          />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Transaction Parties (Optional)
            </Typography>
          </Divider>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <Box>
              <TextField
                label="From (Payer)"
                value={formData.fromName}
                onChange={(e) => handleInputChange('fromName', e.target.value)}
                fullWidth
                placeholder="Who paid/sent the money"
                sx={{ mb: 1 }}
              />
              <FormControl fullWidth>
                <InputLabel>From Type</InputLabel>
                <Select
                  value={formData.fromType}
                  label="From Type"
                  onChange={(e) => handleInputChange('fromType', e.target.value)}
                >
                  {partyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <TextField
                label="To (Payee)"
                value={formData.toName}
                onChange={(e) => handleInputChange('toName', e.target.value)}
                fullWidth
                placeholder="Who received the money"
                sx={{ mb: 1 }}
              />
              <FormControl fullWidth>
                <InputLabel>To Type</InputLabel>
                <Select
                  value={formData.toType}
                  label="To Type"
                  onChange={(e) => handleInputChange('toType', e.target.value)}
                >
                  {partyTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tax Information
            </Typography>
          </Divider>

          <FormControlLabel
            control={
              <Switch
                checked={formData.isTaxable}
                onChange={(e) => handleInputChange('isTaxable', e.target.checked)}
              />
            }
            label="This transaction is taxable"
          />

          {formData.isTaxable && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="GCT Rate (%)"
                type="number"
                value={formData.gctRate}
                onChange={(e) => handleInputChange('gctRate', parseFloat(e.target.value) || 0)}
                fullWidth
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
              <TextField
                label="GCT Amount"
                value={((formData.amount * formData.gctRate) / 100).toFixed(2)}
                fullWidth
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Box>
          )}

          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) => handleInputChange('status', e.target.value)}
            >
              {statusOptions.map((status) => (
                <MenuItem key={status.value} value={status.value}>
                  {status.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          {loading ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TransactionForm;