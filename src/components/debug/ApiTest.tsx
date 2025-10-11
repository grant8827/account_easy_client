import React, { useState } from 'react';
import { Button, Box, Typography, Paper, TextField } from '@mui/material';
import api from '../../services/api';

const ApiTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [email, setEmail] = useState('test@example.com');
  const [loading, setLoading] = useState(false);

  const testHealthCheck = async () => {
    setLoading(true);
    setResult('Testing health check...');
    try {
      const response = await api.get('/auth/health/');
      setResult(`✅ Health Check Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ Health Check Failed: ${error.message}\nDetails: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    }
    setLoading(false);
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('Testing registration...');
    try {
      const testData = {
        email: email,
        password: 'testpass123',
        password_confirm: 'testpass123',
        first_name: 'API',
        last_name: 'Test',
        role: 'employee'
      };
      
      console.log('Sending registration data:', testData);
      const response = await api.post('/auth/register/', testData);
      setResult(`✅ Registration Success: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      console.error('Registration error:', error);
      setResult(`❌ Registration Failed: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        API Connection Test
      </Typography>
      
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button 
          variant="contained" 
          onClick={testHealthCheck}
          disabled={loading}
        >
          Test Health Check
        </Button>
        
        <TextField
          label="Test Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="small"
          sx={{ minWidth: 200 }}
        />
        
        <Button 
          variant="contained" 
          color="secondary"
          onClick={testRegistration}
          disabled={loading}
        >
          Test Registration
        </Button>
      </Box>

      <Paper elevation={2} sx={{ p: 2, bgcolor: '#f5f5f5' }}>
        <Typography variant="h6" gutterBottom>
          Result:
        </Typography>
        <Typography 
          component="pre" 
          sx={{ 
            whiteSpace: 'pre-wrap', 
            fontSize: '0.875rem',
            fontFamily: 'monospace',
            maxHeight: 400,
            overflow: 'auto'
          }}
        >
          {result || 'Click a test button above...'}
        </Typography>
      </Paper>

      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          API Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:8000/api'}
        </Typography>
      </Box>
    </Box>
  );
};

export default ApiTest;