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
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
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
