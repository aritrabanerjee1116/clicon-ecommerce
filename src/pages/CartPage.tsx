import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, IconButton,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Divider, Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCart, updateCartQuantity, removeFromCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/ordersSlice';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://placehold.co/80x80?text=No+Image';

const CartPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, profile } = useAppSelector((s) => s.auth);
    const { items, loading } = useAppSelector((s) => s.cart);

    useEffect(() => {
        if (user) dispatch(fetchCart(user.id));
    }, [user, dispatch]);

    const subtotal = items.reduce((sum, item) => {
        return sum + (item.product?.price_in_rupees || 0) * item.quantity;
    }, 0);

    const handleQuantityChange = (itemId: number, newQty: number) => {
        if (newQty < 1) return;
        dispatch(updateCartQuantity({ itemId, quantity: newQty }));
    };

    const handleRemove = (itemId: number) => {
        dispatch(removeFromCart(itemId));
        toast.success('Item removed from cart');
    };

    const handlePlaceOrder = async () => {
        if (!user) return;
        const address = profile?.addresses?.[0] || {
            id: '1', label: 'Default', line1: 'Not specified', city: 'N/A',
            state: 'N/A', zip: '000000', country: 'India',
        };
        try {
            await dispatch(placeOrder({ userId: user.id, cartItems: items, address })).unwrap();
            toast.success('Order placed successfully! 🎉');
            navigate('/orders');
        } catch {
            toast.error('Failed to place order');
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h5" mb={2}>Please login to view your cart</Typography>
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
                Continue Shopping
            </Button>

            <Typography variant="h4" fontWeight="bold" mb={4}>
                Shopping Cart
                <Chip label={`${items.length} items`} sx={{ ml: 2, fontWeight: 600 }} />
            </Typography>

            {items.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                    <Typography variant="h5" mb={2}>Your cart is empty</Typography>
                    <Button component={RouterLink} to="/products" variant="contained" size="large">
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                    {/* Cart Items Table */}
                    <TableContainer component={Paper} sx={{ flex: 1, borderRadius: 3 }}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Price</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Quantity</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => {
                                    const price = item.product?.price_in_rupees || 0;
                                    return (
                                        <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#fafbfc' } }}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Box
                                                        component="img"
                                                        src={item.product?.images?.[0] || FALLBACK_IMAGE}
                                                        sx={{ width: 70, height: 70, borderRadius: 2, objectFit: 'cover' }}
                                                    />
                                                    <Typography
                                                        variant="body2" fontWeight={600}
                                                        sx={{
                                                            maxWidth: 200,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        {item.product?.title}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight={600}>₹{price.toLocaleString('en-IN')}</Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                        sx={{ border: '1px solid #ddd' }}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Typography fontWeight={600} sx={{ minWidth: 30, textAlign: 'center' }}>
                                                        {item.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                        sx={{ border: '1px solid #ddd' }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography fontWeight="bold" color="primary">
                                                    ₹{(price * item.quantity).toLocaleString('en-IN')}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton color="error" onClick={() => handleRemove(item.id)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Order Summary */}
                    <Paper sx={{ width: { xs: '100%', md: 350 }, p: 4, borderRadius: 3, alignSelf: 'flex-start' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3}>
                            Order Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Subtotal ({items.length} items)</Typography>
                            <Typography fontWeight={600}>₹{subtotal.toLocaleString('en-IN')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography color="text.secondary">Shipping</Typography>
                            <Typography fontWeight={600} color="success.main">
                                {subtotal >= 999 ? 'FREE' : '₹99'}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 2 }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold">Total</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                                ₹{(subtotal + (subtotal >= 999 ? 0 : 99)).toLocaleString('en-IN')}
                            </Typography>
                        </Box>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handlePlaceOrder}
                            sx={{
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #F7941D, #E53935)',
                                '&:hover': { background: 'linear-gradient(135deg, #e0851a, #d32f2f)' },
                            }}
                        >
                            Place Order
                        </Button>
                        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
                            Free shipping on orders above ₹999
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Container>
    );
};

export default CartPage;
