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

// Lazy load PayPal components to handle potential errors
const LazyPayPalScriptProvider = lazy(() => 
  import('@paypal/react-paypal-js').then(module => ({
    default: module.PayPalScriptProvider
  })).catch(() => ({
    default: () => null
  }))
);

const LazyPayPalButtons = lazy(() => 
  import('@paypal/react-paypal-js').then(module => ({
    default: module.PayPalButtons
  })).catch(() => ({
    default: () => null
  }))
);

const PayPalWrapper: React.FC<PayPalWrapperProps> = ({
  selectedPlan,
  onSuccess,
  onError,
  onProcessing,
  convertToUSD,
  userEmail
}) => {
  const [paypalAvailable, setPaypalAvailable] = useState(true);
  const [loading, setLoading] = useState(true);

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



  const PayPalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
      const handleError = () => {
        setHasError(true);
        setPaypalAvailable(false);
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    if (hasError) {
      return (
        <Box>
          <Alert severity="error" sx={{ mb: 2 }}>
            PayPal integration failed to load. Please refresh the page or contact support.
          </Alert>
        </Box>
      );
    }

    return <>{children}</>;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!paypalAvailable || !process.env.REACT_APP_PAYPAL_CLIENT_ID) {
    return (
      <Box>
        <Alert severity="error" sx={{ mb: 2 }}>
          PayPal Configuration Debug:<br/>
          - PayPal Available: {paypalAvailable ? 'YES' : 'NO'}<br/>
          - Client ID: {process.env.REACT_APP_PAYPAL_CLIENT_ID ? 'SET' : 'NOT SET'}<br/>
          - API URL: {process.env.REACT_APP_API_URL}<br/>
          Please restart the React development server to pick up environment changes.
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
                  
                  // Create order through Django backend
                  const response = await paypalApi.createOrder({
                    plan_type: selectedPlan.name.toLowerCase(),
                    billing_cycle: selectedPlan.billing === 'Monthly' ? 'monthly' : 
                                  selectedPlan.billing === 'Quarterly' ? 'quarterly' : 'annually',
                    user_email: userEmail
                  });
                  
                  if (response.data?.order_id) {
                    return response.data.order_id;
                  } else {
                    throw new Error('Failed to create PayPal order');
                  }
                } catch (error) {
                  console.error('Error creating PayPal order:', error);
                  onError(error);
                  throw error;
                }
              }}
              onApprove={async (data: any, actions: any) => {
                try {
                  onProcessing(true);
                  
                  // Capture payment through Django backend
                  const response = await paypalApi.capturePayment({
                    order_id: data.orderID,
                    payer_id: data.payerID
                  });
                  
                  if (response.data?.status === 'success') {
                    // Return the payment details in the expected format
                    const paymentDetails = {
                      id: response.data.payment_id,
                      payer: {
                        email_address: response.data.payer_email
                      },
                      purchase_units: [{
                        amount: {
                          value: convertToUSD(selectedPlan.price),
                          currency_code: 'USD'
                        }
                      }],
                      status: 'COMPLETED',
                      subscription_id: response.data.subscription_id
                    };
                    
                    onSuccess(paymentDetails);
                  } else {
                    throw new Error(response.data?.message || 'Payment capture failed');
                  }
                } catch (error) {
                  console.error('Error capturing PayPal payment:', error);
                  onError(error);
                }
              }}
              onError={(error: any) => {
                onError(error);
              }}
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'paypal',
              }}
            />
          </Suspense>
        </LazyPayPalScriptProvider>
      </Suspense>
    </PayPalErrorBoundary>
  );
};

export default PayPalWrapper;