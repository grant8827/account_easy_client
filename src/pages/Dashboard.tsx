import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Tab,
  Tabs,
  Alert,
  AlertTitle,
  CircularProgress,
} from '@mui/material';
import {
  AccountCircle,
  Business,
  People,
  AttachMoney,
  Assessment,
  Receipt,
  Home,
  SupervisorAccount,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';
import SubscriptionManager from '../components/subscription/SubscriptionManager';
import api from '../services/api';

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
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
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

function a11yProps(index: number) {
  return {
    id: `dashboard-tab-${index}`,
    'aria-controls': `dashboard-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const { user, selectBusiness } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [dashboardData, setDashboardData] = useState({
    totalBusinesses: 0,
    totalEmployees: 0,
    monthlyPayroll: 0,
    pendingTransactions: 0,
    businessStatus: 'inactive',
    loading: true
  });

  // Load user-specific data when component mounts
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardData(prev => ({ ...prev, loading: true }));
        
        // Check authentication
        console.log('Current user:', user);
        console.log('User email:', user?.email);
        console.log('Selected business:', user?.selectedBusiness);
        
        // Fetch businesses data directly
        console.log('Fetching businesses from API...');
        const businessResponse = await api.get('/businesses/');
        console.log('Business API Response:', businessResponse);
        console.log('Business Response Data:', businessResponse.data);
        const businessesData = businessResponse.data || [];
        console.log('Processed businesses data:', businessesData);
        console.log('Number of businesses found:', businessesData.length);
        
        // Fetch dashboard summary data
        let summaryData = {
          totalBusinesses: businessesData.length,
          totalEmployees: 0,
          monthlyPayroll: 0,
          pendingTransactions: 0
        };
        
        try {
          const summaryResponse = await api.get('/dashboard/summary');
          if (summaryResponse.data.data && summaryResponse.data.data.summary) {
            summaryData = summaryResponse.data.data.summary;
          }
        } catch (summaryError) {
          console.log('Dashboard summary not available, using basic data');
        }
        
        // Calculate business status based on subscription and payment
        let businessStatus = 'inactive';
        if (businessesData && businessesData.length > 0) {
          const business = businessesData[0];
          businessStatus = (business.subscription_status === 'active' || business.payment_status === 'paid') ? 'active' : 'inactive';
          
          // Auto-select the first business if user doesn't have one selected
          if (!user?.selectedBusiness && business.id) {
            selectBusiness(business.id.toString());
          }
        }

        setBusinesses(businessesData || []);
        setDashboardData({
          totalBusinesses: summaryData.totalBusinesses,
          totalEmployees: summaryData.totalEmployees,
          monthlyPayroll: summaryData.monthlyPayroll,
          pendingTransactions: summaryData.pendingTransactions,
          businessStatus: businessStatus,
          loading: false
        });

      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        console.error('Error details:', error);
        if (error.response) {
          console.error('Error response status:', error.response.status);
          console.error('Error response data:', error.response.data);
        }
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    };

    if (user) {
      fetchDashboardData();
    }
  }, [user, selectBusiness]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Remove the sample data - we now use real data from dashboardData state
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD'
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#000000' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#C7AE6A' }}>
            Accountseezy - Business Financial Management
          </Typography>
          <Chip 
            label={user?.role || 'User'} 
            color="secondary" 
            size="small" 
            sx={{ mr: 2 }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              onClick={handleMenuOpen}
            >
              <Avatar sx={{ bgcolor: 'secondary.main' }}>
                {user?.firstName?.[0] || 'U'}{user?.lastName?.[0] || ''}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => navigate('/landingpage')}>
          <Home sx={{ mr: 1 }} />
          Home
        </MenuItem>
        <MenuItem onClick={() => { navigate('/businesses'); handleMenuClose(); }}>
          <Business sx={{ mr: 1 }} />
          Manage Businesses
        </MenuItem>
        {user?.role === 'super_admin' && (
          <MenuItem onClick={() => { navigate('/admin'); handleMenuClose(); }}>
            <SupervisorAccount sx={{ mr: 1 }} />
            Admin Panel
          </MenuItem>
        )}
        <MenuItem onClick={handleMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <LogoutButton 
          variant="menuItem" 
          redirectTo="/"
          onLogout={handleMenuClose}
        />
      </Menu>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Section */}
        <Paper sx={{ p: 3, mb: 4, bgcolor: '#f5f5f5' }}>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.firstName || 'User'}!
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Manage your Jamaica financial operations with ease
          </Typography>
        </Paper>

        {/* Navigation Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
            <Tab label="Dashboard" {...a11yProps(0)} />
            <Tab label="Subscription" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          {/* Current Business Display */}
          {businesses.length > 0 && (
            <Alert severity="success" sx={{ mb: 3 }}>
              <AlertTitle>Current Business</AlertTitle>
              Working with: {businesses.find(b => b._id === user?.selectedBusiness || b.id === parseInt(user?.selectedBusiness || '0'))?.business_name || businesses[0]?.business_name || 'Your Business'}
            </Alert>
          )}

          {/* Stats Cards using CSS Grid */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(4, 1fr)' 
          },
          gap: 3,
          mb: 4 
        }}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Business Status
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    color: dashboardData.loading ? '#666' : 
                           dashboardData.businessStatus === 'active' ? '#4caf50' : '#f44336',
                    fontWeight: 'bold'
                  }}>
                    {dashboardData.loading ? (
                      <CircularProgress size={24} />
                    ) : businesses.length > 0 ? (
                      dashboardData.businessStatus === 'active' ? 'Active' : 'Inactive'
                    ) : 'No Business'}
                  </Typography>
                  {businesses.length > 0 && (
                    <Typography variant="caption" color="textSecondary">
                      {businesses[0]?.subscription_plan || 'Basic'} Plan
                    </Typography>
                  )}
                </Box>
                <Business sx={{ fontSize: 40, color: '#1976d2' }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Total Employees
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      dashboardData.totalEmployees
                    )}
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: '#388e3c' }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Monthly Payroll
                  </Typography>
                  <Typography variant="h5">
                    {dashboardData.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      formatCurrency(dashboardData.monthlyPayroll)
                    )}
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, color: '#f57c00' }} />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="body2">
                    Pending Items
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      dashboardData.pendingTransactions
                    )}
                  </Typography>
                </Box>
                <Assessment sx={{ fontSize: 40, color: '#7b1fa2' }} />
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Quick Actions */}
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { 
            xs: '1fr', 
            sm: 'repeat(2, 1fr)', 
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)' 
          },
          gap: 3 
        }}>
          <Card sx={{ 
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: '#1976d2', mb: 2 }}>
                <Business sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                {businesses.length > 0 ? 'View/Edit Business' : 'Add Business'}
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                {businesses.length > 0 
                  ? `Manage your business information and settings${businesses[0]?.subscription_status ? ` (${businesses[0].subscription_status === 'active' || businesses[0]?.payment_status === 'paid' ? 'Active' : 'Inactive'})` : ''}` 
                  : 'Register a new business entity'}
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#1976d2' }}
                onClick={() => navigate('/businesses')}
              >
                {businesses.length > 0 ? 'Manage' : 'Create'}
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: '#388e3c', mb: 2 }}>
                <People sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Add Employee
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Add new employee to payroll
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#388e3c' }}
                onClick={() => navigate('/employees')}
              >
                Open
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: '#d32f2f', mb: 2 }}>
                <Receipt sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Transactions
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Manage financial transactions
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#d32f2f' }}
                onClick={() => navigate('/transactions')}
              >
                Open
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: '#f57c00', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Process Payroll
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Calculate and process payroll
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#f57c00' }}
                onClick={() => navigate('/payroll')}
              >
                Open
              </Button>
            </CardContent>
          </Card>

          <Card sx={{ 
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 3
            },
            transition: 'all 0.2s ease-in-out'
          }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ color: '#7b1fa2', mb: 2 }}>
                <Assessment sx={{ fontSize: 48 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                Tax Filing
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Manage Jamaica tax requirements
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#7b1fa2' }}
                onClick={() => navigate('/tax')}
              >
                Open
              </Button>
            </CardContent>
          </Card>
        </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {businesses.length > 0 ? (
            <SubscriptionManager businessId={user?.selectedBusiness || businesses[0]?.id?.toString()} />
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Business sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                No Business Found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Please complete the registration process to create your business and manage subscriptions.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/register')}
                  startIcon={<Business />}
                >
                  Complete Registration
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setTabValue(0)}
                >
                  Back to Dashboard
                </Button>
              </Box>
            </Paper>
          )}
        </TabPanel>
      </Container>
    </Box>
  );
};

export default Dashboard;
