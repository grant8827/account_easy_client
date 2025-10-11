import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
  alpha,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery
} from '@mui/material';

import { Menu as MenuIcon, Close } from '@mui/icons-material';

interface NavigationProps {
  onPageChange: (page: string) => void;
  currentPage: string;
}

const Navigation: React.FC<NavigationProps> = ({ onPageChange, currentPage }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navItems = [
    { label: 'Home', value: 'home' },
    { label: 'About', value: 'about' },
    { label: 'Contact', value: 'contact' }
  ];

  const handleNavClick = (page: string) => {
    onPageChange(page);
    setMobileDrawerOpen(false);
  };

  const isActive = (page: string) => currentPage === page;

  // Mobile Drawer
  const drawer = (
    <Box sx={{ width: 250, pt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setMobileDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.value}
            component="button"
            onClick={() => handleNavClick(item.value)}
            sx={{
              backgroundColor: isActive(item.value) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              border: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.1)
              }
            }}
          >
            <ListItemText 
              primary={item.label}
              sx={{
                color: isActive(item.value) ? theme.palette.primary.main : 'inherit'
              }}
            />
          </ListItem>
        ))}
        <ListItem 
          component="button"
          onClick={() => {
            navigate('/pricing');
            setMobileDrawerOpen(false);
          }}
          sx={{
            border: 'none',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1)
            }
          }}
        >
          <ListItemText primary="Pricing" />
        </ListItem>
        <ListItem>
          <Box sx={{ width: '100%', pt: 2 }}>
            <Button 
              fullWidth
              variant="outlined"
              color="inherit"
              onClick={() => {
                navigate('/login');
                setMobileDrawerOpen(false);
              }}
              sx={{ mb: 1, color: 'black', borderColor: 'black' }}
            >
              Login
            </Button>
            <Button 
              fullWidth
              variant="contained" 
              color="primary"
              onClick={() => {
                navigate('/pricing');
                setMobileDrawerOpen(false);
              }}
              sx={{ 
                backgroundColor: '#fac83e', 
                color: theme.palette.primary.main, 
                '&:hover': { backgroundColor: alpha('#fac83e', 0.9) } 
              }}
            >
              Get Started
            </Button>
          </Box>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          backgroundColor: '#d9d9d9ff', 
          justifyContent: 'center', 
          borderBottom: '1px solid #e0e0e0' 
        }}
      >
        <Toolbar className='navbar'>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              color: theme.palette.primary.main, 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="/accounteezy-logo-bg.png" 
              alt="AccountEezy Logo" 
              style={{ height: 100, width: 180, marginLeft: 8, marginTop: 10 }} 
            />
          </Typography>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  sx={{
                    color: isActive(item.value) ? theme.palette.primary.main : theme.palette.text.primary,
                    fontWeight: isActive(item.value) ? 'bold' : 'normal',
                    backgroundColor: isActive(item.value) ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1)
                    },
                    mx: 0.5
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              <Button 
                color="primary" 
                onClick={() => navigate('/pricing')}
                sx={{ mx: 0.5 }}
              >
                Pricing
              </Button>
              
              <Button 
                color="primary" 
                onClick={() => navigate('/login')}
                sx={{ mr: 1, ml: 2 }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/pricing')}
                sx={{ 
                  backgroundColor: '#fac83e', 
                  color: theme.palette.primary.main, 
                  '&:hover': { backgroundColor: alpha('#fac83e', 0.9) } 
                }}
              >
                Get Started
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              color="primary"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ ml: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navigation;