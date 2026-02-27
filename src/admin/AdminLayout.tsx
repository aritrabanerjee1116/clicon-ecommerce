import { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
    Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
    Typography, Avatar, Divider, AppBar, Toolbar, IconButton
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useAppSelector } from '../store/hooks';

const DRAWER_WIDTH = 260;

const navItems = [
    { label: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { label: 'Products', icon: <InventoryIcon />, path: '/admin/products' },
    { label: 'Categories', icon: <CategoryIcon />, path: '/admin/categories' },
    { label: 'Orders', icon: <ShoppingCartIcon />, path: '/admin/orders' },
    { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
    { label: 'Inventory', icon: <WarehouseIcon />, path: '/admin/inventory' },
    { label: 'Reviews', icon: <RateReviewIcon />, path: '/admin/reviews' },
    { label: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
];

const AdminLayout = () => {
    const location = useLocation();
    const { profile } = useAppSelector((s) => s.auth);
    const [mobileOpen, setMobileOpen] = useState(false);

    const drawerContent = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo */}
            <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 40, height: 40, borderRadius: 2,
                        background: 'linear-gradient(135deg, #2E6F95, #4dc0b5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <StorefrontIcon sx={{ color: '#fff', fontSize: 22 }} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="white">
                        CLICON
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8899aa' }}>
                        Admin Panel
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: '#2a3a4a' }} />

            {/* Nav Items */}
            <List sx={{ flex: 1, px: 1.5, py: 2 }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItemButton
                            key={item.label}
                            component={RouterLink}
                            to={item.path}
                            onClick={() => setMobileOpen(false)}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                color: isActive ? '#fff' : '#8899aa',
                                bgcolor: isActive ? 'rgba(46,111,149,0.3)' : 'transparent',
                                '&:hover': {
                                    bgcolor: isActive ? 'rgba(46,111,149,0.4)' : 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.label}
                                primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}
                            />
                        </ListItemButton>
                    );
                })}
            </List>

            <Divider sx={{ borderColor: '#2a3a4a' }} />

            {/* User Profile */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ width: 36, height: 36, bgcolor: '#2E6F95', fontSize: 16 }}>
                    {profile?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </Avatar>
                <Box sx={{ overflow: 'hidden' }}>
                    <Typography variant="body2" fontWeight="bold" color="white" noWrap>
                        {profile?.full_name || 'Admin'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#8899aa' }} noWrap>
                        Administrator
                    </Typography>
                </Box>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f0f2f5' }}>
            {/* Desktop Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    width: DRAWER_WIDTH,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: '#1B2838',
                        borderRight: 'none',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Mobile Sidebar */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': {
                        width: DRAWER_WIDTH,
                        bgcolor: '#1B2838',
                    },
                }}
            >
                {drawerContent}
            </Drawer>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
                {/* Mobile AppBar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        display: { xs: 'block', md: 'none' },
                        bgcolor: '#fff',
                        borderBottom: '1px solid #e0e0e0',
                    }}
                >
                    <Toolbar>
                        <IconButton onClick={() => setMobileOpen(true)} sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" fontWeight="bold" color="text.primary">
                            Admin Panel
                        </Typography>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box sx={{ p: { xs: 2, md: 4 }, flex: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default AdminLayout;
