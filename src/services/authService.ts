import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'manager' | 'employee';
  businesses: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
  role?: string;
  phone?: string;
  trn?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log('authService: Making login request to:', '/auth/login');
      console.log('authService: Login credentials:', { email: credentials.email, password: '***' });
      
      const response = await api.post('/auth/login/', credentials);
      console.log('authService: Login response status:', response.status);
      console.log('authService: Login response data:', response.data);
      
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        // Clear any existing tokens first
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // Store the token without Bearer prefix - let the api service add it
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('authService: Login successful, tokens stored');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('authService: Login error:', error);
      console.error('authService: Error response:', error.response?.data);
      console.error('authService: Error status:', error.response?.status);
      throw error;
    }
  },

  // Register new user
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      console.log('authService: Making registration request to:', '/auth/register/');
      console.log('authService: Registration data:', userData);
      console.log('authService: Registration data JSON:', JSON.stringify(userData, null, 2));
      
      const response = await api.post('/auth/register/', userData);
      console.log('authService: Registration response status:', response.status);
      console.log('authService: Registration response data:', response.data);
      
      if (response.data.success) {
        const { token, refreshToken, user } = response.data.data;
        // Store the token without Bearer prefix - let the api service add it
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('authService: Registration successful, tokens stored');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('authService: Registration error:', error);
      console.error('authService: Error response:', error.response?.data);
      console.error('authService: Error status:', error.response?.status);
      throw error;
    }
  },

  // Logout user
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        // First attempt to notify the server
        try {
          await api.post('/auth/logout/', { refreshToken });
        } catch (error) {
          console.warn('Server logout notification failed:', error);
          // Continue with local cleanup even if server call fails
        }
      }
    } finally {
      // Always clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  // Get current user from localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Refresh token
  refreshToken: async (): Promise<string | null> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await api.post('/auth/refresh/', { refreshToken });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  },
};

export default authService;
