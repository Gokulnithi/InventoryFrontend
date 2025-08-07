import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleHome = () => {
    navigate('/');
  };

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'History', path: '/history' },
    { label: 'Notifications', path: '/notifications' },
    isLoggedIn
      ? { label: 'Logout', action: handleLogout }
      : { label: 'Login', action: handleLogin }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar position="static" color="primary" elevation={2} style={{ padding: '10px' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={handleHome}>
            InventoryControl
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) =>
                item.path ? (
                  <Button
                    key={item.label}
                    color={isActive(item.path) ? 'secondary' : 'inherit'}
                    variant={isActive(item.path) ? 'contained' : 'text'}
                    onClick={() => navigate(item.path)}
                  >
                    {item.label}
                  </Button>
                ) : (
                  <Button key={item.label} color="inherit" onClick={item.action}>
                    {item.label}
                  </Button>
                )
              )}
            </Box>
          )}

          {isMobile && (
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box sx={{ width: 200 }} role="presentation" onClick={toggleDrawer(false)}>
          <List>
            {navItems.map((item) =>
              item.path ? (
                <ListItem
                  button
                  key={item.label}
                  selected={isActive(item.path)}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ) : (
                <ListItem button key={item.label} onClick={item.action}>
                  <ListItemText primary={item.label} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
