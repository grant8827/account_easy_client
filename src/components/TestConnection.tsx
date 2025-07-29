import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TestConnection = () => {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await api.get('/health');
        setStatus('Connected to backend!');
        console.log('Backend connection successful:', response.data);
      } catch (error) {
        setStatus('Failed to connect to backend');
        console.error('Backend connection error:', error);
      }
    };

    testConnection();
  }, []);

  return <div>Backend Status: {status}</div>;
};

export default TestConnection;
