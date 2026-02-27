import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import supabase from '../utils/supabase';

const COLORS = ['#2E6F95', '#F7941D', '#7BC043', '#E53935', '#9C27B0', '#00BCD4'];

const Dashboard = () => {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, productsRes, usersRes] = await Promise.all([
                    supabase.from('orders').select('*'),
                    supabase.from('products').select('id', { count: 'exact' }),
                    supabase.from('profiles').select('id', { count: 'exact' }),
                ]);

                const orders = ordersRes.data || [];
                const revenue = orders.reduce((s, o) => s + Number(o.total), 0);

                setStats({
                    orders: orders.length,
                    revenue,
                    users: usersRes.count || 0,
                    products: productsRes.count || 0,
                });

                setRecentOrders(orders.slice(0, 10));
            } catch (err) {
                console.error('Dashboard error:', err);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    const statCards = [
        { label: 'Total Orders', value: stats.orders, icon: <ShoppingCartIcon />, color: '#2E6F95', bg: '#e8f4f8' },
        { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: <AttachMoneyIcon />, color: '#7BC043', bg: '#edf7e3' },
        { label: 'Total Users', value: stats.users, icon: <PeopleIcon />, color: '#F7941D', bg: '#fff3e0' },
        { label: 'Total Products', value: stats.products, icon: <InventoryIcon />, color: '#9C27B0', bg: '#f3e5f5' },
    ];

    // Generate mock chart data from orders
    const monthlyData = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month) => ({
        month,
        sales: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 50) + 10,
    }));

    const categoryData = [
        { name: 'Electronics', value: 35 },
        { name: 'Computers', value: 25 },
        { name: 'Smartphones', value: 20 },
        { name: 'Accessories', value: 15 },
        { name: 'Others', value: 5 },
    ];

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Welcome back! Here's what's happening with your store.
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#7BC043' }}>
                    <TrendingUpIcon />
                    <Typography variant="body2" fontWeight="bold">Live</Typography>
                </Box>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {statCards.map((card) => (
                    <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Paper
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' },
                            }}
                        >
                            <Box>
                                <Typography variant="body2" color="text.secondary" mb={0.5}>
                                    {card.label}
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {card.value}
                                </Typography>
                            </Box>
                            <Box
                                sx={{
                                    width: 52,
                                    height: 52,
                                    borderRadius: 3,
                                    bgcolor: card.bg,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: card.color,
                                }}
                            >
                                {card.icon}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Charts Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Sales Overview</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip formatter={(v) => `₹${Number(v).toLocaleString('en-IN')}`} />
                                <Bar dataKey="sales" fill="#2E6F95" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Typography variant="h6" fontWeight="bold" mb={2}>Sales by Category</Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((_, index) => (
                                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                            {categoryData.map((item, i) => (
                                <Box key={item.name} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: COLORS[i] }} />
                                    <Typography variant="caption">{item.name}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Orders Trend */}
            <Paper sx={{ p: 3, borderRadius: 3, mb: 4 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Orders Trend</Typography>
                <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="orders" stroke="#F7941D" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>

            {/* Recent Orders */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>Recent Orders</Typography>
                {recentOrders.length === 0 ? (
                    <Typography color="text.secondary">No orders yet.</Typography>
                ) : (
                    <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #eee' }}>
                                    {['Order ID', 'Status', 'Total', 'Date'].map((h) => (
                                        <th
                                            key={h}
                                            style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 600, color: '#666', fontSize: '0.85rem' }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order) => (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>#{order.id}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span
                                                style={{
                                                    padding: '4px 12px',
                                                    borderRadius: 20,
                                                    fontSize: '0.8rem',
                                                    fontWeight: 600,
                                                    backgroundColor:
                                                        order.status === 'Delivered' ? '#e8f5e9' :
                                                            order.status === 'Shipped' ? '#e3f2fd' :
                                                                order.status === 'Cancelled' ? '#ffebee' : '#fff3e0',
                                                    color:
                                                        order.status === 'Delivered' ? '#2e7d32' :
                                                            order.status === 'Shipped' ? '#1565c0' :
                                                                order.status === 'Cancelled' ? '#c62828' : '#e65100',
                                                }}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                                            ₹{Number(order.total).toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#888' }}>
                                            {new Date(order.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Dashboard;
