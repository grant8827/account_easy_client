import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://accounteasyserver-production-8481.up.railway.app/api',
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
      config.headers.Authorization = `Bearer ${token.trim()}`;
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

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL || 'https://accounteasyserver-production-8481.up.railway.app/'}/auth/refresh`,
            { refreshToken }
          );

          const { token } = response.data;
          localStorage.setItem('token', token);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

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
