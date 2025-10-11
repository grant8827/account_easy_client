import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, authService } from '../services/authService';

interface AuthState {
  user: User & { selectedBusiness?: string } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SELECT_BUSINESS'; payload: string };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case 'SELECT_BUSINESS':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          selectedBusiness: action.payload
        } : null
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  selectBusiness: (businessId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing authentication on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      dispatch({ type: 'SET_USER', payload: user });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });
    try {
      console.log('AuthContext: Attempting login for:', email);
      const response = await authService.login({ email, password });
      console.log('AuthContext: Login response:', response);
      if (response.success) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
      } else {
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message });
      }
    } catch (error: any) {
      console.error('AuthContext: Login error:', error);
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error.response?.data?.message || 'Login failed' 
      });
    }
  };

  const register = async (userData: any): Promise<void> => {
    console.log('AuthContext: Starting registration with data:', userData);
    console.log('AuthContext: Registration data JSON:', JSON.stringify(userData, null, 2));
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register(userData);
      console.log('AuthContext: Registration response:', response);
      if (response.success) {
        console.log('AuthContext: Registration successful');
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.user });
        // Registration successful - don't throw error
      } else {
        console.log('AuthContext: Registration failed with message:', response.message);
        dispatch({ type: 'LOGIN_FAILURE', payload: response.message });
        // Throw error so Register component knows it failed
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('AuthContext: Registration error caught:', error);
      console.error('AuthContext: Error response data:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: errorMessage
      });
      // Re-throw error so Register component can handle navigation
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const clearError = (): void => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const selectBusiness = (businessId: string): void => {
    dispatch({ type: 'SELECT_BUSINESS', payload: businessId });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    selectBusiness,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
