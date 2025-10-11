import React, { useState } from 'react';
import {
  Container,
  Paper,
  Button,
  Typography,
  Box,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const RegistrationDebugger: React.FC = () => {
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [testEmail, setTestEmail] = useState('debug-test@example.com');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  const clearLogs = () => {
    setDebugLogs([]);
    console.clear();
  };

  const testDirectRegistration = async () => {
    setIsLoading(true);
    addLog('🚀 Starting direct registration test...');
    
    try {
      // Test data
      const testData = {
        email: testEmail,
        password: 'testpass123',
        password_confirm: 'testpass123',
        first_name: 'Debug',
        last_name: 'Test',
        role: 'employee'
      };

      addLog(`📝 Test data: ${JSON.stringify(testData, null, 2)}`);

      // Direct axios call to bypass any interceptors initially
      addLog('🌐 Making direct axios call...');
      const response = await axios.post(
        'http://localhost:8000/api/auth/register/',
        testData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: false,
          timeout: 10000,
        }
      );

      addLog(`✅ Direct registration successful!`);
      addLog(`Response status: ${response.status}`);
      addLog(`Response data: ${JSON.stringify(response.data, null, 2)}`);

    } catch (error: any) {
      addLog(`❌ Direct registration failed!`);
      addLog(`Error message: ${error.message}`);
      
      if (error.response) {
        addLog(`Response status: ${error.response.status}`);
        addLog(`Response headers: ${JSON.stringify(error.response.headers, null, 2)}`);
        addLog(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      } else if (error.request) {
        addLog(`No response received`);
        addLog(`Request: ${JSON.stringify(error.request, null, 2)}`);
      } else {
        addLog(`Request setup error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testWithFormData = async () => {
    setIsLoading(true);
    addLog('🚀 Testing registration with form submission simulation...');
    
    try {
      // Simulate form data from the actual form
      const formData = {
        firstName: 'Form',
        lastName: 'Test',
        email: testEmail,
        password: 'testpass123',
        confirmPassword: 'testpass123',
        phone: '',
        trn: '',
        role: 'employee'
      };

      addLog(`📝 Form data: ${JSON.stringify(formData, null, 2)}`);

      // Apply the same transformation as Register.tsx
      const { confirmPassword, firstName, lastName, ...rest } = formData;
      
      const cleanedData = Object.entries(rest).reduce((acc, [key, value]) => {
        if (value && value.toString().trim() !== '') {
          acc[key] = value.toString().trim();
        }
        return acc;
      }, {} as any);
      
      const userData = {
        ...cleanedData,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        password_confirm: confirmPassword,
      };

      addLog(`🧹 Cleaned data: ${JSON.stringify(userData, null, 2)}`);

      // Use the configured api instance
      addLog('📡 Using configured API instance...');
      const { default: api } = await import('../../services/api');
      
      const response = await api.post('/auth/register/', userData);

      addLog(`✅ Form-based registration successful!`);
      addLog(`Response status: ${response.status}`);
      addLog(`Response data: ${JSON.stringify(response.data, null, 2)}`);

    } catch (error: any) {
      addLog(`❌ Form-based registration failed!`);
      addLog(`Error: ${error.message}`);
      
      if (error.response) {
        addLog(`Response status: ${error.response.status}`);
        addLog(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testFullAuthFlow = async () => {
    setIsLoading(true);
    addLog('🚀 Testing full AuthContext registration flow...');
    
    try {
      const userData = {
        email: testEmail,
        password: 'testpass123',
        password_confirm: 'testpass123',
        first_name: 'Auth',
        last_name: 'Test',
        role: 'employee'
      };

      addLog(`📝 Auth test data: ${JSON.stringify(userData, null, 2)}`);

      // Import and use authService directly
      const { authService } = await import('../../services/authService');
      
      addLog('🔐 Calling authService.register...');
      const response = await authService.register(userData);

      addLog(`✅ AuthService registration successful!`);
      addLog(`Response: ${JSON.stringify(response, null, 2)}`);

    } catch (error: any) {
      addLog(`❌ AuthService registration failed!`);
      addLog(`Error: ${error.message}`);
      
      if (error.response) {
        addLog(`Response status: ${error.response.status}`);
        addLog(`Response data: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom color="primary">
          🐛 Registration Debugger
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          This tool helps debug registration issues by testing different approaches.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Test Email"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              onClick={testDirectRegistration}
              disabled={isLoading}
            >
              Test Direct Registration
            </Button>
            
            <Button
              variant="contained"
              onClick={testWithFormData}
              disabled={isLoading}
            >
              Test Form Data Flow
            </Button>
            
            <Button
              variant="contained"
              onClick={testFullAuthFlow}
              disabled={isLoading}
            >
              Test AuthService Flow
            </Button>
            
            <Button
              variant="outlined"
              onClick={clearLogs}
            >
              Clear Logs
            </Button>
          </Box>
        </Box>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">
              Debug Logs ({debugLogs.length} entries)
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ 
              bgcolor: 'grey.100', 
              p: 2, 
              borderRadius: 1,
              maxHeight: 400,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem'
            }}>
              {debugLogs.length === 0 ? (
                <Typography color="textSecondary">
                  No logs yet. Click a test button to start debugging.
                </Typography>
              ) : (
                debugLogs.map((log, index) => (
                  <Box key={index} sx={{ mb: 0.5 }}>
                    {log}
                  </Box>
                ))
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
};

export default RegistrationDebugger;