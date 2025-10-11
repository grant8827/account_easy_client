import axios from 'axios';

// Define the API URL - dynamically switch between local and production
const getApiBaseUrl = () => {
  // Check if we have an explicit environment variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Auto-detect environment based on hostname
  const hostname = window.location.hostname;
  const isLocalDevelopment = hostname === 'localhost' || hostname === '127.0.0.1';
  
  if (isLocalDevelopment) {
    // Local development - use Django dev server port
    return 'http://localhost:8002/api';
  } else {
    // Production (Railway or other deployment)
    return 'https://account-eezy-django-production.up.railway.app/api';
  }
};

const API_BASE_URL = getApiBaseUrl();

// Debug logging (only show in development or when debug is enabled)
if (process.env.NODE_ENV === 'development' || process.env.REACT_APP_DEBUG === 'true') {
  console.log('🔍 API Configuration:');
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Hostname:', window.location.hostname);
  console.log('Is Local Development:', window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
  console.log('REACT_APP_API_URL from env:', process.env.REACT_APP_API_URL);
  console.log('Final API_BASE_URL:', API_BASE_URL);
  console.log('---');
}

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 API Request Interceptor:');
    console.log('  Method:', config.method?.toUpperCase());
    console.log('  URL:', config.url);
    console.log('  Data:', config.data);
    console.log('  Headers before processing:', config.headers);
    
    // List of endpoints that don't require authentication
    const publicEndpoints = ['/auth/register/', '/auth/login/', '/auth/refresh/'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => config.url?.includes(endpoint));
    
    console.log('  Is public endpoint:', isPublicEndpoint);
    
    // Only add auth header for protected endpoints
    if (!isPublicEndpoint) {
      const token = localStorage.getItem('token');
      if (token && token !== 'undefined' && token !== 'null') {
        // Ensure token is properly formatted
        const cleanToken = token.trim();
        config.headers.Authorization = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;
        console.log('  Added auth header');
      } else {
        console.log('  No valid token found');
      }
    } else {
      console.log('  Skipping auth header for public endpoint');
    }
    
    // Ensure Content-Type is set
    config.headers['Content-Type'] = 'application/json';
    console.log('  Final headers:', config.headers);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    console.log('🎉 API Response Success:', response.status, response.config.url);
    return response;
  },
  async (error) => {
    console.log('❌ API Response Error:', error);
    console.log('  Error message:', error.message);
    console.log('  Error code:', error.code);
    console.log('  Response status:', error.response?.status);
    console.log('  Response data:', error.response?.data);
    console.log('  Request config:', error.config);
    
    const originalRequest = error.config;

    // Only handle 401 errors from API endpoints (not for static files)
    if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url.startsWith('/api')) {
      originalRequest._retry = true;

      try {
        const currentToken = localStorage.getItem('token');
        if (!currentToken) {
          throw new Error('No token available');
        }

        // Try to get a new token using the current token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          {},
          {
            headers: {
              Authorization: `Bearer ${currentToken}`
            }
          }
        );

        if (response.data?.data?.token) {
          const { token } = response.data.data;
          localStorage.setItem('token', token);

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          throw new Error('No new token received');
        }
      } catch (error: any) {
        // Only clear tokens and redirect if it's a real auth failure
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        throw error;
      }
    }

    // For all other errors, pass them through
    return Promise.reject(error);
  }
);

// Subscription API endpoints - updated for Django backend
export const subscriptionApi = {
  getCurrentSubscription: (businessId: string) => 
    api.get(`/subscriptions/${businessId}/`),
  
  updateSubscription: (businessId: string, data: { plan_type: string; billing_cycle: 'monthly' | 'quarterly' | 'annually' }) =>
    api.put(`/subscriptions/${businessId}/update/`, data),
  
  cancelSubscription: (businessId: string) =>
    api.post(`/subscriptions/${businessId}/cancel/`),
  
  getUsage: (businessId: string) =>
    api.get(`/subscriptions/${businessId}/usage/`),
  
  getPlans: () =>
    api.get('/subscriptions/plans/'),
};

// PayPal API endpoints - integrated with Django backend
export const paypalApi = {
  createOrder: (data: { 
    plan_type: string; 
    billing_cycle: 'monthly' | 'quarterly' | 'annually';
    user_email?: string;
  }) => 
    api.post('/paypal/create-order/', data),
  
  capturePayment: (data: { 
    order_id: string; 
    payer_id?: string;
  }) => 
    api.post('/paypal/capture-payment/', data),
  
  getPaymentStatus: (paymentId: string) =>
    api.get(`/paypal/payment-status/${paymentId}/`),
  
  simulateWebhook: (data: {
    event_type: string;
    resource: {
      id: string;
      status: string;
      [key: string]: any;
    };
  }) =>
    api.post('/paypal/simulate-webhook/', data),
};

// Business registration API - for post-payment business creation
export const businessApi = {
  createBusiness: (data: {
    business_name: string;
    industry?: string;
    address?: string;
    phone?: string;
    subscription_plan: string;
    payment_id?: string;
  }) =>
    api.post('/businesses/', data),
  
  getBusiness: (businessId: string) =>
    api.get(`/businesses/${businessId}/`),
  
  updateBusiness: (businessId: string, data: any) =>
    api.put(`/businesses/${businessId}/`, data),
};

// Auth API endpoints
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) =>
    api.post('/auth/register/', data),
  
  login: (data: {
    email: string;
    password: string;
  }) =>
    api.post('/auth/login/', data),
  
  logout: () =>
    api.post('/auth/logout/'),
  
  getCurrentUser: () =>
    api.get('/auth/user/'),
  
  refreshToken: () =>
    api.post('/auth/refresh/'),
};

export default api;
