import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, IconButton,
    CircularProgress, Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://placehold.co/300x300?text=No+Image';

const WishlistPage = () => {
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const { items, loading } = useAppSelector((s) => s.wishlist);

    useEffect(() => {
        if (user) dispatch(fetchWishlist(user.id));
    }, [user, dispatch]);

    const handleRemove = (itemId: number) => {
        dispatch(removeFromWishlist(itemId));
        toast.success('Removed from wishlist');
    };

    const handleMoveToCart = (item: any) => {
        if (!user) return;
        dispatch(addToCart({ userId: user.id, productId: item.product_id }));
        dispatch(removeFromWishlist(item.id));
        toast.success('Moved to cart! 🛒');
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <FavoriteIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h5" mb={2}>Please login to view your wishlist</Typography>
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
                My Wishlist
                <Chip label={`${items.length} items`} sx={{ ml: 2, fontWeight: 600 }} color="error" />
            </Typography>

            {items.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <FavoriteIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                    <Typography variant="h5" mb={2}>Your wishlist is empty</Typography>
                    <Typography color="text.secondary" mb={3}>
                        Save products you love to buy them later
                    </Typography>
                    <Button component={RouterLink} to="/products" variant="contained" size="large">
                        Browse Products
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {items.map((item) => (
                        <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Paper
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <Box sx={{ position: 'relative' }}>
                                    <Box
                                        component="img"
                                        src={item.product?.images?.[0] || FALLBACK_IMAGE}
                                        alt={item.product?.title}
                                        sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                                        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                        }}
                                    />
                                    <IconButton
                                        onClick={() => handleRemove(item.id)}
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 8,
                                            bgcolor: 'rgba(255,255,255,0.9)',
                                            '&:hover': { bgcolor: '#fff' },
                                        }}
                                    >
                                        <DeleteOutlineIcon color="error" />
                                    </IconButton>
                                </Box>
                                <Box sx={{ p: 2.5 }}>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight={600}
                                        component={RouterLink}
                                        to={`/products/${item.product_id}`}
                                        sx={{
                                            textDecoration: 'none',
                                            color: 'inherit',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            mb: 1,
                                            '&:hover': { color: '#2E6F95' },
                                        }}
                                    >
                                        {item.product?.title}
                                    </Typography>
                                    <Typography variant="h6" color="primary" fontWeight="bold" mb={2}>
                                        ₹{item.product?.price_in_rupees?.toLocaleString('en-IN')}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        startIcon={<ShoppingCartIcon />}
                                        onClick={() => handleMoveToCart(item)}
                                        sx={{
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            borderRadius: 2,
                                        }}
                                    >
                                        Move to Cart
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default WishlistPage;
