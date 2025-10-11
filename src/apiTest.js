import api from './services/api';

// Test API URL being used by the frontend
console.log('Environment variables check:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('Expected API URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000/api');

// Test actual API call

export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    console.log('API base URL:', api.defaults.baseURL);
    
    const response = await api.get('/health');
    console.log('✅ API connection successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API connection failed:', error);
    console.error('Error config:', error.config);
    throw error;
  }
};

// Make this available globally for testing
window.testApiConnection = testApiConnection;