import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5007/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      // Ensure token is properly formatted
      const cleanToken = token.trim();
      config.headers.Authorization = cleanToken.startsWith('Bearer ') ? cleanToken : `Bearer ${cleanToken}`;
    }
    // Ensure Content-Type is set
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
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
          `${process.env.REACT_APP_API_URL || 'http://localhost:5007/api'}/auth/refresh-token`,
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

// Subscription API endpoints
export const subscriptionApi = {
  getCurrentSubscription: (businessId: string) => 
    api.get(`/subscriptions/businesses/${businessId}/subscription`),
  
  updateSubscription: (businessId: string, data: { plan: string; billingCycle: 'monthly' | 'yearly' }) =>
    api.put(`/subscriptions/businesses/${businessId}/subscription`, data),
  
  cancelSubscription: (businessId: string) =>
    api.post(`/subscriptions/businesses/${businessId}/subscription/cancel`),
};

export default api;
