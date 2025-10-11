import React from 'react';

const DebugEnvPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Environment Variables Debug</h2>
      <div>
        <strong>REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL || 'NOT SET'}
      </div>
      <div>
        <strong>REACT_APP_PAYPAL_CLIENT_ID:</strong> {process.env.REACT_APP_PAYPAL_CLIENT_ID || 'NOT SET'}
      </div>
      <div>
        <strong>REACT_APP_PAYPAL_MODE:</strong> {process.env.REACT_APP_PAYPAL_MODE || 'NOT SET'}
      </div>
      <div>
        <strong>PayPal Client ID Valid:</strong> {process.env.REACT_APP_PAYPAL_CLIENT_ID && process.env.REACT_APP_PAYPAL_CLIENT_ID !== 'your_paypal_client_id_here' ? 'YES' : 'NO'}
      </div>
    </div>
  );
};

export default DebugEnvPage;