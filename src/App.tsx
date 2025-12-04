import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import AdminPanel from './pages/AdminPanel';
import BusinessList from './components/business/BusinessList';
import EmployeeList from './components/employees/EmployeeList';
import PayrollModule from './components/payroll/PayrollModule';
import TaxModule from './components/tax/TaxModule';
import TransactionList from './components/transactions/TransactionList';
import ApiTest from './components/debug/ApiTest';
import RegistrationDebugger from './components/debug/RegistrationDebugger';
import PricingPage from './pages/PricingPage';
import PaymentPage from './pages/PaymentPageWithRealPayPal';
import DebugEnvPage from './pages/DebugEnvPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#000000', // Pure black
      light: '#1a1a1a', // Dark gray
      dark: '#000000',
    },
    secondary: {
      main: '#C7AE6A', // Elegant gold
      light: '#e3d6b4', // Light cream gold
      dark: '#b99a45', // Darker gold
    },
    success: {
      main: '#d5c28f', // Warm gold for success
    },
    warning: {
      main: '#C7AE6A', // Gold for warnings
    },
    error: {
      main: '#b99a45', // Dark gold for errors
    },
    background: {
      default: '#e3d6b4', // Light cream background
      paper: '#ffffff',
    },
    text: {
      primary: '#000000', // Black text
      secondary: '#1a1a1a', // Dark gray text
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(199, 174, 106, 0.25)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="/debug-register" element={<RegistrationDebugger />} />
            <Route path="/debug-env" element={<DebugEnvPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            
            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Super Admin Route */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            {/* Business Management */}
            <Route
              path="/landingpage"
              element={
                <ProtectedRoute>                  
                  <LandingPage />
                </ProtectedRoute>
              }
            />

            {/* Placeholder routes for future components */}
            <Route
              path="/businesses"
              element={
                <ProtectedRoute>
                  <BusinessList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeeList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/transactions"
              element={
                <ProtectedRoute>
                  <TransactionList />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <PayrollModule />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/tax"
              element={
                <ProtectedRoute>
                  <TaxModule />
                </ProtectedRoute>
              }
            />
            
            {/* 404 catch all */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
