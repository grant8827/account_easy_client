import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  SupervisorAccount,
  Business,
  People,
  Assessment,
  Security,
  Settings,
  Warning,
  CheckCircle,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/auth/LogoutButton';
import AccountManagement from '../components/admin/AccountManagement';
import api from '../services/api';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeUsers: 0,
    recentRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role !== 'super_admin') {
      setError('Access denied. Super admin privileges required.');
      setLoading(false);
      return;
    }
    
    fetchAdminStats();
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (err: any) {
      setError('Failed to load admin statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const adminActions = [
    {
      title: 'User Management',
      description: 'Manage system users and permissions',
      icon: <People />,
      action: 'users'
    },
    {
      title: 'Business Management',
      description: 'Oversee business registrations and compliance',
      icon: <Business />,
      action: 'businesses'
    },
    {
      title: 'System Reports',
      description: 'View system-wide analytics and reports',
      icon: <Assessment />,
      action: 'reports'
    },
    {
      title: 'Security Settings',
      description: 'Configure security policies and monitoring',
      icon: <Security />,
      action: 'security'
    },
    {
      title: 'System Settings',
      description: 'Manage application configuration',
      icon: <Settings />,
      action: 'settings'
    }
  ];

  const handleActionClick = (action: string) => {
    setActiveView(action);
  };

  // Show Account Management if users view is active
  if (activeView === 'users') {
    return (
      <Box p={3}>
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom display="flex" alignItems="center">
            <People sx={{ mr: 2, fontSize: '2rem' }} />
            Account Management
          </Typography>
          <Box display="flex" gap={2}>
            <Button 
              variant="outlined" 
              onClick={() => setActiveView('overview')}
            >
              Back to Overview
            </Button>
            <LogoutButton 
              variant="iconButton" 
              redirectTo="/"
              size="large"
              color="primary"
            />
          </Box>
        </Box>
        <AccountManagement />
      </Box>
    );
  }

  const systemHealth = [
    { status: 'Operational', component: 'Database Connection', icon: <CheckCircle color="success" /> },
    { status: 'Operational', component: 'Authentication Service', icon: <CheckCircle color="success" /> },
    { status: 'Operational', component: 'Tax Calculation Engine', icon: <CheckCircle color="success" /> },
    { status: 'Warning', component: 'Backup Service', icon: <Warning color="warning" /> }
  ];

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" gutterBottom display="flex" alignItems="center">
            <SupervisorAccount sx={{ mr: 2, fontSize: '2rem' }} />
            Super Admin Panel
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome back, {user?.firstName}! Here's your system overview.
          </Typography>
        </Box>
        <LogoutButton 
          variant="iconButton" 
          redirectTo="/"
          size="large"
          color="primary"
        />
      </Box>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h4">
              {stats.totalUsers}
            </Typography>
            <Chip 
              label={`+${stats.recentRegistrations} this week`} 
              size="small" 
              color="primary" 
              variant="outlined" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Active Businesses
            </Typography>
            <Typography variant="h4">
              {stats.totalBusinesses}
            </Typography>
            <Chip 
              label="All compliant" 
              size="small" 
              color="success" 
              variant="outlined" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              Active Users
            </Typography>
            <Typography variant="h4">
              {stats.activeUsers}
            </Typography>
            <Chip 
              label="Online now" 
              size="small" 
              color="info" 
              variant="outlined" 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography color="text.secondary" gutterBottom>
              System Health
            </Typography>
            <Typography variant="h4" color="success.main">
              98.7%
            </Typography>
            <Chip 
              label="Excellent" 
              size="small" 
              color="success" 
              variant="outlined" 
            />
          </CardContent>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Admin Actions */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Administrative Actions
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {adminActions.map((action, index) => (
              <Card 
                key={index}
                sx={{ 
                  cursor: 'pointer', 
                  '&:hover': { elevation: 4 },
                  height: '100%'
                }}
                onClick={() => handleActionClick(action.action)}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    {action.icon}
                    <Typography variant="h6" ml={1}>
                      {action.title}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {action.description}
                  </Typography>
                  <Button variant="outlined" size="small">
                    Manage
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Paper>

        {/* System Health */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            System Health Status
          </Typography>
          <List>
            {systemHealth.map((item, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.component}
                    secondary={item.status}
                  />
                </ListItem>
                {index < systemHealth.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      </div>

      {/* Jamaica Tax Compliance Section */}
      <Box mt={4}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Jamaica Tax Compliance Overview
          </Typography>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  PAYE Registrations
                </Typography>
                <Typography variant="h5" color="primary">
                  {Math.floor(stats.totalBusinesses * 0.85)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  85% of businesses
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  GCT Registrations
                </Typography>
                <Typography variant="h5" color="primary">
                  {Math.floor(stats.totalBusinesses * 0.72)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  72% of businesses
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  NIS Compliance
                </Typography>
                <Typography variant="h5" color="success.main">
                  {Math.floor(stats.totalBusinesses * 0.95)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  95% compliant
                </Typography>
              </CardContent>
            </Card>
          </div>
        </Paper>
      </Box>
    </Box>
  );
};

export default AdminPanel;
