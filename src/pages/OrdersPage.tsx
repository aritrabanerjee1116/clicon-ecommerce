import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Chip,
    CircularProgress, Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableRow, Avatar
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchOrders } from '../store/slices/ordersSlice';

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
    Pending: 'warning',
    Confirmed: 'info',
    Shipped: 'primary',
    Delivered: 'success',
    Cancelled: 'error',
};

const OrdersPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const { orders, loading } = useAppSelector((s) => s.orders);

    useEffect(() => {
        if (user) dispatch(fetchOrders(user.id));
    }, [user, dispatch]);

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <ReceiptIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h5" mb={2}>Please login to view your orders</Typography>
                <Button component={RouterLink} to="/login" variant="contained" size="large">
                    Sign In
                </Button>
            </Container>
        );
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Button
                component={RouterLink} to="/" startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, textTransform: 'none' }}
            >
                Back to Home
            </Button>

            <Typography variant="h4" fontWeight="bold" mb={4}>
                My Orders
                <Chip label={`${orders.length} orders`} sx={{ ml: 2, fontWeight: 600 }} color="primary" />
            </Typography>

            {orders.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <ReceiptIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                    <Typography variant="h5" mb={2}>No orders yet</Typography>
                    <Typography color="text.secondary" mb={3}>
                        Start shopping and your orders will appear here
                    </Typography>
                    <Button component={RouterLink} to="/products" variant="contained" size="large">
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {orders.map((order) => (
                        <Accordion
                            key={order.id}
                            elevation={0}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: '12px !important',
                                '&:before': { display: 'none' },
                                overflow: 'hidden',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ bgcolor: '#fafbfc', px: 3 }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', flexWrap: 'wrap' }}>
                                    <Typography fontWeight="bold">Order #{order.id}</Typography>
                                    <Chip
                                        label={order.status}
                                        color={statusColors[order.status] || 'default'}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'long', year: 'numeric',
                                        })}
                                    </Typography>
                                    <Typography fontWeight="bold" color="primary" sx={{ ml: 'auto' }}>
                                        ₹{Number(order.total).toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Table size="small">
                                    <TableBody>
                                        {order.order_items?.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell sx={{ border: 'none' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar
                                                            variant="rounded"
                                                            src={item.product_image || 'https://placehold.co/60x60?text=N/A'}
                                                            sx={{ width: 50, height: 50 }}
                                                        />
                                                        <Typography variant="body2" fontWeight={500}>
                                                            {item.product_title}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center" sx={{ border: 'none' }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Qty: {item.quantity}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right" sx={{ border: 'none' }}>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Container>
    );
};

export default OrdersPage;
