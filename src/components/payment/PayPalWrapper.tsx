import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { paypalApi } from '../../services/api';

interface PayPalWrapperProps {
  selectedPlan: {
    name: string;
    price: number;
    billing: string;
  };
  onSuccess: (details: any) => void;
  onError: (error: any) => void;
  onProcessing: (processing: boolean) => void;
  convertToUSD: (amount: number) => string;
  userEmail?: string;
}

// Lazy load PayPal components with better error handling
// Enhanced React compatibility check for PayPal integration
const checkReactCompatibility = () => {
  try {
    // Import React for version check
    const ReactModule = require('react');
    
    // Check React version compatibility
    const reactVersion = ReactModule.version;
    console.log('React version detected:', reactVersion);
    
    // PayPal SDK has known issues with React 19+
    if (reactVersion && reactVersion.startsWith('19')) {
      console.warn('React 19+ detected - PayPal integration may have compatibility issues');
      return false;
    }
    
    // Test if React hooks are working properly
    const hasHooks = ReactModule && 
                    typeof ReactModule.useState === 'function' && 
                    typeof ReactModule.useEffect === 'function';
    
    if (!hasHooks) {
      console.warn('React hooks not properly available for PayPal');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('React compatibility check failed:', error);
    return false;
  }
};

// Only create lazy components if React is compatible
const LazyPayPalScriptProvider = lazy(() => {
  // Pre-check compatibility before attempting any imports
  if (!checkReactCompatibility()) {
    console.warn('Blocking PayPal ScriptProvider load due to React compatibility');
    return Promise.resolve({
      default: ({ children }: any) => (
        <Alert severity="error">
          <strong>PayPal Integration Blocked:</strong><br/>
          PayPal integration has been disabled due to React 19 compatibility issues.<br/>
          <em>Please use the "Skip Payment" option to complete registration.</em>
        </Alert>
      )
    });
  }

  return import('@paypal/react-paypal-js').then(module => {
    return { default: module.PayPalScriptProvider };
  }).catch(error => {
    console.error('Failed to load PayPal ScriptProvider:', error);
    return {
      default: ({ children }: any) => (
        <Alert severity="error">
          <strong>PayPal Loading Error:</strong><br/>
          Failed to load PayPal integration components.<br/>
          <em>Please use the "Skip Payment" option to continue.</em>
        </Alert>
      )
    };
  });
});

const LazyPayPalButtons = lazy(() => {
  // Pre-check compatibility before attempting any imports
  if (!checkReactCompatibility()) {
    console.warn('Blocking PayPal Buttons load due to React compatibility');
    return Promise.resolve({
      default: () => (
        <Alert severity="warning">
          <strong>PayPal Buttons Disabled:</strong><br/>
          PayPal payment buttons are disabled due to React 19 compatibility issues.<br/>
          Please use the "Skip Payment" option to complete registration.
        </Alert>
      )
    });
  }

  return import('@paypal/react-paypal-js').then(module => {
    return { default: module.PayPalButtons };
  }).catch(error => {
    console.error('Failed to load PayPal Buttons:', error);
    return {
      default: () => (
        <Alert severity="warning">
          <strong>PayPal Buttons Loading Error:</strong><br/>
          Failed to load PayPal payment buttons.<br/>
          Please use the "Skip Payment" option to complete registration.
        </Alert>
      )
    };
  });
});

const PayPalWrapper: React.FC<PayPalWrapperProps> = ({
  selectedPlan,
  onSuccess,
  onError,
  onProcessing,
  convertToUSD,
  userEmail
}) => {
  // Immediately check React compatibility before any state initialization
  const isCompatible = checkReactCompatibility();
  const [paypalAvailable, setPaypalAvailable] = useState(isCompatible);
  const [loading, setLoading] = useState(true);

  // Additional runtime compatibility check
  useEffect(() => {
    if (!isCompatible) {
      console.warn('PayPal disabled due to React compatibility issues');
      setPaypalAvailable(false);
      setLoading(false);
      return;
    }

    // Double-check compatibility during component lifecycle
    try {
      if (!checkReactCompatibility()) {
        console.warn('Runtime React compatibility check failed for PayPal');
        setPaypalAvailable(false);
      }
    } catch (error) {
      console.error('Error in runtime compatibility check:', error);
      setPaypalAvailable(false);
    }
    setLoading(false);
  }, [isCompatible]);

  const paypalOptions = {
    clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID || '',
    currency: 'USD',
    intent: 'capture' as const,
    // Use live mode if specified, otherwise default to sandbox
    'data-client-token': undefined, // Not needed for live mode
    // Enable debug mode only in sandbox
    debug: process.env.REACT_APP_PAYPAL_MODE !== 'live',
  };

  useEffect(() => {
    // Check if PayPal is available
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);



class PayPalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string; errorType: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '', errorType: '' };
  }

  static getDerivedStateFromError(error: Error): { hasError: boolean; errorMessage: string; errorType: string } {
    const isReactVersionError = error.message.includes('useReducer') || 
                               error.message.includes('Invalid hook call') ||
                               error.message.includes('Cannot read properties of null');
    
    return {
      hasError: true,
      errorMessage: error.message || 'PayPal component error',
      errorType: isReactVersionError ? 'version_compatibility' : 'general'
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PayPal Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.state.errorType === 'version_compatibility') {
        return (
          <Alert severity="warning">
            <strong>PayPal Temporarily Unavailable</strong><br/>
            There's a compatibility issue with the current React version and PayPal integration.<br/>
            <strong>What you can do:</strong><br/>
            • Use "Skip Payment (Set Up Later)" to complete registration<br/>
            • Set up payment from your dashboard once logged in<br/>
            • Contact support if you need immediate payment processing
          </Alert>
        );
      }
      
      return (
        <Alert severity="error">
          <strong>PayPal Error:</strong> {this.state.errorMessage}<br/>
          Please try refreshing the page or use the "Skip Payment" option.
        </Alert>
      );
    }

    return this.props.children;
  }
}  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!paypalAvailable || !process.env.REACT_APP_PAYPAL_CLIENT_ID) {
    const reactVersion = (() => {
      try {
        return require('react').version;
      } catch {
        return 'unknown';
      }
    })();

    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 2 }}>
          <strong>PayPal Integration Disabled</strong><br/>
          {reactVersion.startsWith('19') ? (
            <>
              PayPal integration is disabled due to React 19 compatibility issues.<br/>
              The PayPal React SDK doesn't fully support React 19 yet.
            </>
          ) : (
            'PayPal payment processing is currently unavailable.'
          )}
          {process.env.NODE_ENV === 'development' && (
            <>
              <br/>
              <strong>Debug Information:</strong><br/>
              - React Version: {reactVersion}<br/>
              - PayPal Available: {paypalAvailable ? 'YES' : 'NO'}<br/>
              - Client ID: {process.env.REACT_APP_PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET'}<br/>
              - Mode: {process.env.REACT_APP_PAYPAL_MODE || 'not set'}<br/>
              {reactVersion.startsWith('19') && 'Note: React 19+ has known compatibility issues with PayPal SDK'}
            </>
          )}
        </Alert>
        <Alert severity="info">
          <strong>Alternative Payment Options:</strong><br/>
          • You can proceed with registration and set up payment later<br/>
          • Contact support for manual payment setup<br/>
          • PayPal integration will be available once compatibility is resolved
        </Alert>
      </Box>
    );
  }

  return (
    <PayPalErrorBoundary>
      <Suspense fallback={<CircularProgress />}>
        <LazyPayPalScriptProvider options={paypalOptions}>
          <Suspense fallback={<CircularProgress />}>
            <LazyPayPalButtons
              createOrder={async (data: any, actions: any) => {
                try {
                  onProcessing(true);
                  
                  // Create order through Django backend with proper authentication
                  const token = localStorage.getItem('token');
                  if (!token) {
                    throw new Error('Authentication required for payment processing');
                  }
                  
                  const response = await paypalApi.createOrder({
                    plan_name: selectedPlan.name,
                    plan_type: selectedPlan.name.toLowerCase(),
                    billing_cycle: selectedPlan.billing === 'annual' ? 'annually' : 'monthly',
                    amount: selectedPlan.price // JMD amount
                  });
                  
                  if (response.data?.success && response.data?.order_id) {
                    console.log('✅ PayPal order created:', response.data.order_id);
                    return response.data.order_id;
                  } else {
                    throw new Error(response.data?.error || 'Failed to create PayPal order');
                  }
                } catch (error) {
                  console.error('Error creating PayPal order:', error);
                  onError(error);
                  throw error;
                } finally {
                  onProcessing(false);
                }
              }}
              onApprove={async (data: any, actions: any) => {
                try {
                  onProcessing(true);
                  
                  // Capture payment through Django backend
                  const response = await paypalApi.capturePayment({
                    order_id: data.orderID
                  });
                  
                  if (response.data?.success) {
                    console.log('✅ Payment captured successfully:', response.data);
                    
                    // Return the payment details in the expected format
                    const paymentDetails = {
                      id: response.data.payment_id,
                      paypal_order_id: data.orderID,
                      payer: {
                        email_address: userEmail || 'unknown@example.com'
                      },
                      purchase_units: [{
                        amount: {
                          value: convertToUSD(selectedPlan.price),
                          currency_code: 'USD'
                        }
                      }],
                      status: 'COMPLETED',
                      subscription_id: response.data.subscription_id,
                      django_backend: true, // Flag to indicate Django processing
                      plan_name: selectedPlan.name,
                      billing_cycle: selectedPlan.billing
                    };
                    
                    onSuccess(paymentDetails);
                  } else {
                    throw new Error(response.data?.error || 'Payment capture failed');
                  }
                } catch (error) {
                  console.error('Error capturing PayPal payment:', error);
                  onError(error);
                } finally {
                  onProcessing(false);
                }
              }}
              onError={(error: any) => {
                console.error('PayPal button error:', error);
                onError(error);
                onProcessing(false);
              }}
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
              }}
            />
          </Suspense>
          
          <Box sx={{ mt: 2 }}>
            <Alert severity="info" variant="outlined">
              <strong>Payment Security:</strong> All payments are processed securely through PayPal. 
              Your payment information is never stored on our servers.
            </Alert>
          </Box>
        </LazyPayPalScriptProvider>
      </Suspense>
    </PayPalErrorBoundary>
  );
};

export default PayPalWrapper;