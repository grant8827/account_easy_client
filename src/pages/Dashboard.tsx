import React, { useState } from 'react';
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
} from '@mui/material';
import {
  AccountCircle,
  Business,
  People,
  AttachMoney,
  Assessment,
  Receipt,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';
import SubscriptionManager from '../components/subscription/SubscriptionManager';

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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [tabValue, setTabValue] = useState(0);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Sample data for demonstration
  const stats = {
    totalBusinesses: 5,
    totalEmployees: 23,
    monthlyPayroll: 750000,
    pendingTransactions: 12
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-JM', {
      style: 'currency',
      currency: 'JMD'
    }).format(amount);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" sx={{ bgcolor: '#006633' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Account Easy - Business Financial Management
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
        <MenuItem onClick={handleMenuClose}>
          <AccountCircle sx={{ mr: 1 }} />
          Profile
        </MenuItem>
        <LogoutButton 
          variant="menuItem" 
          redirectTo="/landingpage"
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
                    Total Businesses
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalBusinesses}
                  </Typography>
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
                    {stats.totalEmployees}
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
                    {formatCurrency(stats.monthlyPayroll)}
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
                    {stats.pendingTransactions}
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
                Add Business
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Register a new business entity
              </Typography>
              <Button 
                variant="contained" 
                sx={{ bgcolor: '#1976d2' }}
                onClick={() => navigate('/businesses')}
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
          {user?.selectedBusiness ? (
            <SubscriptionManager businessId={user.selectedBusiness} />
          ) : (
            <Typography variant="body1" color="error" align="center">
              Please create or select a business to manage subscriptions
            </Typography>
          )}
        </TabPanel>
      </Container>
    </Box>
  );
};

export default Dashboard;
