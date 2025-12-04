import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
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
    <Box sx={{ width: 250, pt: 2, backgroundColor: '#e3d6b4', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton 
          onClick={() => setMobileDrawerOpen(false)}
          sx={{ 
            color: '#000000',
            '&:hover': {
              backgroundColor: alpha('#C7AE6A', 0.1)
            }
          }}
        >
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
              backgroundColor: isActive(item.value) ? alpha('#C7AE6A', 0.15) : 'transparent',
              border: 'none',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: alpha('#C7AE6A', 0.1)
              }
            }}
          >
            <ListItemText 
              primary={item.label}
              sx={{
                color: isActive(item.value) ? '#C7AE6A' : '#000000'
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
              backgroundColor: alpha('#C7AE6A', 0.1)
            }
          }}
        >
          <ListItemText 
            primary="Pricing"
            sx={{ color: '#000000' }}
          />
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
              sx={{ mb: 1, color: '#000000', borderColor: '#000000' }}
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
                backgroundColor: '#C7AE6A', 
                color: 'white', 
                '&:hover': { backgroundColor: '#b99a45' } 
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
          backgroundColor: '#e3d6b4', 
          justifyContent: 'space-around', 
          borderBottom: '1px solid #C7AE6A' 
        }}
      >
        <Toolbar className='navbar' sx={{ px: { xs: 2, md: 4 }, py: 1 }}>
          <Box 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            onClick={() => handleNavClick('home')}
          >
            <img 
              src="/azy-logo.png" 
              alt="Accountseezy Logo" 
              style={{ 
                height: 60, 
                width: 'auto', 
                maxWidth: 200,
                objectFit: 'contain',
                borderRadius: '15px',
                justifyContent: 'center',
              }} 
            />
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 2 }}>
              {navItems.map((item) => (
                <Button
                  key={item.value}
                  onClick={() => handleNavClick(item.value)}
                  sx={{
                    color: isActive(item.value) ? '#C7AE6A' : '#000000',
                    fontWeight: isActive(item.value) ? 'bold' : 'normal',
                    backgroundColor: isActive(item.value) ? alpha('#C7AE6A', 0.15) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha('#C7AE6A', 0.1)
                    },
                    mx: 1,
                    px: 2,
                    borderRadius: 1
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              <Button 
                onClick={() => navigate('/pricing')}
                sx={{ 
                  mx: 1,
                  px: 2,
                  color: '#000000',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: alpha('#C7AE6A', 0.1)
                  }
                }}
              >
                Pricing
              </Button>
              
              <Button 
                onClick={() => navigate('/login')}
                sx={{ 
                  mr: 2, 
                  ml: 2,
                  px: 2,
                  color: '#000000',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: alpha('#C7AE6A', 0.1)
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => navigate('/pricing')}
                sx={{ 
                  backgroundColor: '#C7AE6A', 
                  color: 'white', 
                  '&:hover': { backgroundColor: '#b99a45' },
                  borderRadius: 2,
                  fontWeight: 'bold',
                  px: 3,
                  py: 1
                }}
              >
                Get Started
              </Button>
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ 
                ml: 2,
                color: '#000000',
                '&:hover': {
                  backgroundColor: alpha('#C7AE6A', 0.1)
                }
              }}
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