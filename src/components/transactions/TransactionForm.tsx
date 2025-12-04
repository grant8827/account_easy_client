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
  id: number;
  business_name: string;
  registration_number: string;
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
    businessId: transaction?.business?.id || user?.selectedBusiness || '',
    transaction_type: transaction?.transaction_type || 'income',
    category: transaction?.category || '',
    description: transaction?.description || '',
    amount: transaction?.amount || 0,
    currency: transaction?.currency || 'JMD',
    transaction_date: transaction?.transaction_date || new Date().toISOString().split('T')[0],
    payment_method: transaction?.payment_method || 'cash',
    reference: transaction?.reference || '',
    vendor_name: transaction?.vendor_name || '',
    customer_name: transaction?.customer_name || '',
    is_taxable: transaction?.is_taxable || false,
    gct_rate: transaction?.gct_rate || 0.15,
    status: transaction?.status || 'completed'
  });

  useEffect(() => {
    if (open) {
      fetchBusinesses();
    }
  }, [open]);

  const fetchBusinesses = async () => {
    try {
      setLoadingBusinesses(true);
      const response = await api.get('/businesses/');
      setBusinesses(response.data || []);
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
    setLoading(true);
    setError(null);

    // Validation
    if (!formData.businessId) {
      setError('Please select a business.');
      setLoading(false);
      return;
    }
    if (!formData.transaction_type) {
      setError('Transaction type is required.');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Category is required.');
      setLoading(false);
      return;
    }
    if (!formData.description) {
      setError('Description is required.');
      setLoading(false);
      return;
    }
    if (!formData.amount || formData.amount <= 0) {
      setError('Amount must be greater than zero.');
      setLoading(false);
      return;
    }
    if (!formData.currency) {
      setError('Currency is required.');
      setLoading(false);
      return;
    }
    if (!formData.transaction_date) {
      setError('Date is required.');
      setLoading(false);
      return;
    }
    if (!formData.payment_method) {
      setError('Payment method is required.');
      setLoading(false);
      return;
    }

    // Sanitize and map fields
    const transactionData = {
      business: formData.businessId,
      transaction_type: formData.transaction_type,
      category: formData.category.trim(),
      description: formData.description.trim(),
      amount: Number(formData.amount),
      currency: formData.currency,
      transaction_date: formData.transaction_date,
      payment_method: formData.payment_method,
      reference: formData.reference?.trim() || undefined,
      vendor_name: formData.vendor_name?.trim() || undefined,
      customer_name: formData.customer_name?.trim() || undefined,
      is_taxable: !!formData.is_taxable,
      gct_rate: formData.is_taxable ? formData.gct_rate : 0,
      status: formData.status
    };

    try {
      const endpoint = transaction ? `/transactions/${formData.businessId}/${transaction.id}/` : `/transactions/${formData.businessId}/`;
      const method = transaction ? 'put' : 'post';
      await api[method](endpoint, transactionData);
      onSubmit();
      onClose();
    } catch (err: any) {
      console.error('Transaction creation error:', err);
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        setError(errorData.errors.map((e: any) => e.message).join('\n'));
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

  // Removed unused getTransactionCategories function to fix compile error.

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'mobile_money', label: 'Mobile Money' },
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
                  <MenuItem key={business.id} value={business.id}>
                    {business.business_name} ({business.registration_number})
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <FormControl fullWidth required>
              <InputLabel>Transaction Type *</InputLabel>
              <Select
                value={formData.transaction_type}
                label="Transaction Type *"
                onChange={(e) => handleInputChange('transaction_type', e.target.value)}
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
              value={formData.transaction_date}
              onChange={(e) => handleInputChange('transaction_date', e.target.value)}
              fullWidth
              required
              InputLabelProps={{
                shrink: true,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={formData.payment_method}
                label="Payment Method"
                onChange={(e) => handleInputChange('payment_method', e.target.value)}
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
            value={formData.reference}
            onChange={(e) => handleInputChange('reference', e.target.value)}
            fullWidth
            placeholder="Invoice number, receipt number, etc."
          />

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Transaction Parties (Optional)
            </Typography>
          </Divider>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              label="Customer Name"
              value={formData.customer_name}
              onChange={(e) => handleInputChange('customer_name', e.target.value)}
              fullWidth
              placeholder="Customer or payer name"
            />

            <TextField
              label="Vendor Name"
              value={formData.vendor_name}
              onChange={(e) => handleInputChange('vendor_name', e.target.value)}
              fullWidth
              placeholder="Vendor or payee name"
            />
          </Box>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Tax Information
            </Typography>
          </Divider>

          <FormControlLabel
            control={
              <Switch
                checked={formData.is_taxable}
                onChange={(e) => handleInputChange('is_taxable', e.target.checked)}
              />
            }
            label="This transaction is taxable"
          />

          {formData.is_taxable && (
            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <TextField
                label="GCT Rate (as decimal)"
                type="number"
                value={formData.gct_rate}
                onChange={(e) => handleInputChange('gct_rate', parseFloat(e.target.value) || 0)}
                fullWidth
                inputProps={{ step: 0.01 }}
                helperText="Enter as decimal (e.g., 0.15 for 15%)"
              />
              <TextField
                label="GCT Amount"
                value={(formData.amount * formData.gct_rate).toFixed(2)}
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