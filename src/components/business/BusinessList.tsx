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
  Fab,
  Tooltip
} from '@mui/material';
import {
  Business as BusinessIcon,
  MoreVert,
  Edit,
  Delete,
  Add,
  LocationOn,
  Phone,
  Email,
  Check
} from '@mui/icons-material';
import api from '../../services/api';
import BusinessForm from './BusinessForm';
import { useAuth } from '../../context/AuthContext';

interface Business {
  _id: string;
  name: string;
  registrationNumber: string;
  trn: string;
  nis?: string;
  businessType: string;
  industry: string;
  status: 'active' | 'inactive' | 'suspended';
  subscriptionStatus?: string;
  subscriptionPlan?: string;
  address: {
    street: string;
    city: string;
    parish: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  description?: string;
  createdAt: string;
  updatedAt: string;
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
      const response = await api.get('/businesses');
      setBusinesses(response.data.businesses || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch businesses');
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
      await api.delete(`/api/businesses/${selectedBusiness._id}`);
      
      // Remove the deleted business from the state
      setBusinesses(prev => prev.filter(b => b._id !== selectedBusiness._id));
      
      setDeleteDialogOpen(false);
      setSelectedBusiness(null);
    } catch (error) {
      console.error('Error deleting business:', error);
      setError('Failed to delete business');
    } finally {
      setDeleting(false);
    }
  };

  const handleAddBusiness = () => {
    setEditingBusiness(null);
    setBusinessFormOpen(true);
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'suspended': return 'error';
      default: return 'default';
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
            My Businesses
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your registered businesses and their information
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddBusiness}
        >
          Register Business
        </Button>
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
              No Businesses Found
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Start by registering your first business to get started with AccountEasy.
            </Typography>
            <Button variant="contained" startIcon={<Add />} onClick={handleAddBusiness}>
              Register Business
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
              key={business._id}
              sx={{ 
                height: '100%',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
                border: user?.selectedBusiness === business._id ? '2px solid' : 'none',
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
                          {business.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                          <Chip 
                            label={business.status} 
                            size="small" 
                            color={getStatusColor(business.status)}
                          />
                          {business.subscriptionStatus && (
                            <Tooltip title={`Subscription: ${business.subscriptionPlan || 'None'}`}>
                              <Chip
                                label={business.subscriptionStatus}
                                size="small"
                                color={business.subscriptionStatus === 'active' ? 'success' : 'warning'}
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
                      <strong>Registration:</strong> {business.registrationNumber}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <strong>Type:</strong> {business.businessType}
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
                        {business.address.city}, {business.address.parish}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Phone fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {business.contact.phone}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Email fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {business.contact.email}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  {business.description && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        {business.description.length > 100 
                          ? `${business.description.substring(0, 100)}...`
                          : business.description
                        }
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add business"
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
        {selectedBusiness && (
          <MenuItem
            onClick={() => {
              selectBusiness(selectedBusiness._id);
              handleMenuClose();
            }}
          >
            <Check sx={{ mr: 1 }} />
            {user?.selectedBusiness === selectedBusiness._id ? 'Selected' : 'Select Business'}
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
            Are you sure you want to delete "{selectedBusiness?.name}"? This action cannot be undone.
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
