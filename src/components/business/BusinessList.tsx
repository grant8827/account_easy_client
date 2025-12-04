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
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  MoreVert,
  Edit,
  Delete,
  LocationOn,
  Phone,
  Email,
  Check
} from '@mui/icons-material';
import api from '../../services/api';
import BusinessForm from './BusinessForm';
import { useAuth } from '../../context/AuthContext';

interface Business {
  id: number;
  business_name: string;
  registration_number: string;
  trn: string;
  nis?: string;
  business_type: string;
  industry: string;
  is_active?: boolean;
  subscription_status?: string;
  subscription_plan?: string;
  street: string;
  city: string;
  parish: string;
  postal_code?: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  created_at: string;
  updated_at: string;
}

const BusinessList: React.FC = () => {
  const { user, selectBusiness } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [businessFormOpen, setBusinessFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      console.log('Fetching businesses...');
      const response = await api.get('/businesses/');
      console.log('Business API response:', response.data);
      const businessesData = response.data.data || response.data || [];
      console.log('Businesses found:', businessesData.length);
      setBusinesses(businessesData);
      setError(null);
    } catch (err: any) {
      console.error('Error fetching businesses:', err);
      setError(err.response?.data?.message || `Failed to fetch businesses: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, business: Business) => {
    setAnchorEl(event.currentTarget);
    setSelectedBusiness(business);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBusiness(null);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

    const handleDeleteBusiness = async () => {
    if (!selectedBusiness) return;

    setDeleting(true);
    try {
      await api.delete(`/api/businesses/${selectedBusiness.id}`);
      
      // Remove the deleted business from the state
      setBusinesses(prev => prev.filter(b => b.id !== selectedBusiness.id));
      
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    } catch (error) {
      console.error('Error deleting business:', error);
      setError('Failed to delete business');
    } finally {
      setDeleting(false);
    }
  };

  // Removed handleAddBusiness - one business per account policy

  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    setBusinessFormOpen(true);
  };

  const handleBusinessFormClose = () => {
    setBusinessFormOpen(false);
    setEditingBusiness(null);
  };

  const handleBusinessSaved = () => {
    // Refresh the business list when a business is saved
    fetchBusinesses();
    handleBusinessFormClose();
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
    }
  };

  const getBusinessStatus = (business: Business): string => {
    // Convert isActive boolean to status string
    if (business.is_active === false) {
      return 'inactive';
    }
    return 'active'; // Default to active if isActive is true or undefined
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Business Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {businesses.length > 0 
              ? 'View and manage your business information and settings'
              : 'Your business information will appear here once you complete registration'
            }
          </Typography>
        </Box>
{/* One business per account - removed Add Another Business button */}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Business Cards */}
      {businesses.length === 0 ? (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No Business Information Available
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Your business information will appear here once you complete your account registration process. 
              Business details are created during the initial account signup.
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Each account can have one business. If you need to register a business, please complete the registration process or contact support.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => window.location.href = '/dashboard'}
            >
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 3
          }}
        >
          {businesses.map((business) => (
            <Card 
              key={business.id}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                border: user?.selectedBusiness === business.id.toString() ? '2px solid' : 'none',
                borderColor: 'primary.main',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
                <CardContent>
                  {/* Header with menu */}
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <BusinessIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" component="div" noWrap>
                          {business.business_name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={getBusinessStatus(business)} 
                            size="small" 
                            color={getStatusColor(getBusinessStatus(business))}
                          />
                          {business.subscription_status && (
                            <Tooltip title={`Subscription: ${business.subscription_plan || 'None'}`}>
                              <Chip
                                label={business.subscription_status}
                                size="small"
                                color={business.subscription_status === 'active' ? 'success' : 'warning'}
                              />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, business)}
                      size="small"
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  {/* Business Details */}
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>TRN:</strong> {business.trn}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Registration:</strong> {business.registration_number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Type:</strong> {business.business_type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Industry:</strong> {business.industry}
                    </Typography>
                  </Box>

                  {/* Contact Info */}
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {business.city ? `${business.city}${business.parish ? `, ${business.parish}` : ''}` : 'Address not provided'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {business.phone || 'Phone not provided'}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {business.email || 'Email not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

{/* One business per account - removed floating add button */}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {selectedBusiness && (
          <MenuItem
            onClick={() => {
              selectBusiness(selectedBusiness.id.toString());
              handleMenuClose();
            }}
          >
            <Check sx={{ mr: 1 }} />
            {user?.selectedBusiness === selectedBusiness.id.toString() ? 'Selected' : 'Select Business'}
          </MenuItem>
        )}
        <MenuItem onClick={() => {
          if (selectedBusiness) {
            handleEditBusiness(selectedBusiness);
          }
          handleMenuClose();
        }}>
          <Edit sx={{ mr: 1 }} />
          Edit Business
        </MenuItem>
        <MenuItem onClick={handleDeleteClick}>
          <Delete sx={{ mr: 1 }} />
          Delete Business
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Business</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedBusiness?.business_name}"? This action cannot be undone.
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
            onClick={handleDeleteBusiness}
            color="error"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Business Form Dialog */}
      <BusinessForm
        open={businessFormOpen}
        onClose={handleBusinessFormClose}
        onSuccess={handleBusinessSaved}
        business={editingBusiness}
        mode={editingBusiness ? 'edit' : 'create'}
      />
    </Box>
  );
};

export default BusinessList;
