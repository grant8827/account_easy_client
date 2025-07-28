import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton, MenuItem } from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface LogoutButtonProps {
  variant?: 'button' | 'iconButton' | 'menuItem';
  size?: 'small' | 'medium' | 'large';
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  text?: string;
  redirectTo?: string;
  onLogout?: () => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = 'button',
  size = 'medium',
  color = 'primary',
  text = 'Sign Out',
  redirectTo = '/landingpage',
  onLogout
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      // Execute any additional cleanup provided by the parent
      if (onLogout) {
        onLogout();
      }
      // Force navigation to landing page last, after all cleanup
      navigate(redirectTo || '/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still try to navigate even if logout fails
      navigate(redirectTo || '/', { replace: true });
    }
  };

  switch (variant) {
    case 'iconButton':
      return (
        <IconButton 
          onClick={handleLogout}
          color={color}
          size={size}
          title={text}
        >
          <LogoutIcon />
        </IconButton>
      );
    
    case 'menuItem':
      return (
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          {text}
        </MenuItem>
      );
    
    default:
      return (
        <Button
          variant="outlined"
          color={color}
          size={size}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
        >
          {text}
        </Button>
      );
  }
};

export default LogoutButton;
