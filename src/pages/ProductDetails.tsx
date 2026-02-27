import { useEffect, useState, useCallback } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container, Typography, Box, CircularProgress,
    Button, Divider, Paper, Rating, Avatar, IconButton, Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import supabase from '../utils/supabase';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import ReviewForm from '../components/ReviewForm';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((s) => s.auth);
    const { items: wishlistItems } = useAppSelector((s) => s.wishlist);
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);

    const isInWishlist = wishlistItems.some((i) => i.product_id === Number(id));

    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select(`*, reviews(id, user_name, rating, comment, created_at, is_approved)`)
                .eq('id', Number(id))
                .single();
            if (error) throw error;
            setProduct(data);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchProduct();
    }, [id, fetchProduct]);

    const handleAddToCart = () => {
        if (!user) {
            toast.error('Please log in to add items to cart');
            return;
        }
        dispatch(addToCart({ userId: user.id, productId: Number(id), quantity }));
        toast.success('Added to cart! 🛒');
    };

    const handleToggleWishlist = () => {
        if (!user) {
            toast.error('Please log in to use wishlist');
            return;
        }
        dispatch(toggleWishlist({ userId: user.id, productId: Number(id) }));
        toast(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist ❤️');
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <CircularProgress />
        </Box>
    );

    if (!product) return <Typography sx={{ p: 5 }}>Product not found.</Typography>;
    const FALLBACK_IMAGE = 'https://placehold.co/600x400?text=Coming+Soon';

    // Filter to show only approved reviews
    const approvedReviews = (product.reviews || []).filter((r: any) => r.is_approved);

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Button
                component={RouterLink}
                to="/products"
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 3, textTransform: 'none' }}
            >
                Back to Products
            </Button>

            <Grid container spacing={6}>
                {/* Image Gallery */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper elevation={0} sx={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <Box
                            component="img"
                            src={product.images?.[selectedImage] || FALLBACK_IMAGE}
                            alt={product.title}
                            sx={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                            }}
                        />
                    </Paper>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        {product.images?.map((img: string, index: number) => (
                            <Box
                                key={index}
                                component="img"
                                src={img || FALLBACK_IMAGE}
                                onClick={() => setSelectedImage(index)}
                                sx={{
                                    width: 80, height: 80, borderRadius: '8px',
                                    cursor: 'pointer',
                                    border: selectedImage === index ? '2px solid #3878A0' : '2px solid #eee',
                                    transition: 'border-color 0.2s',
                                }}
                                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                                    (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                                }}
                            />
                        ))}
                    </Box>
                </Grid>

                {/* Product Info */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h4" fontWeight="bold">{product.title}</Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 2, gap: 1 }}>
                        <Rating value={Number(product.average_rating)} precision={0.1} readOnly />
                        <Typography variant="body2" color="text.secondary">
                            ({product.average_rating} • {product.total_reviews} reviews)
                        </Typography>
                        {product.stock_quantity > 0 ? (
                            <Chip label="In Stock" color="success" size="small" sx={{ fontWeight: 600 }} />
                        ) : (
                            <Chip label="Out of Stock" color="error" size="small" sx={{ fontWeight: 600 }} />
                        )}
                    </Box>

                    <Typography variant="h4" color="primary" sx={{ my: 2, fontWeight: 'bold' }}>
                        ₹{product.price_in_rupees?.toLocaleString('en-IN')}
                    </Typography>

                    <Divider sx={{ my: 3 }} />
                    <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>{product.description}</Typography>

                    {product.details && Object.keys(product.details).length > 0 && (
                        <Box sx={{ mb: 4, p: 2.5, bgcolor: '#f9f9f9', borderRadius: '12px' }}>
                            {Object.entries(product.details).map(([key, value]) => (
                                <Typography key={key} variant="body2" sx={{ textTransform: 'capitalize', mb: 0.5 }}>
                                    • <strong>{key.replace('_', ' ')}:</strong> {String(value)}
                                </Typography>
                            ))}
                        </Box>
                    )}

                    {/* Quantity + Actions */}
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: 2 }}>
                            <IconButton onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ px: 2, fontWeight: 'bold' }}>{quantity}</Typography>
                            <IconButton onClick={() => setQuantity(quantity + 1)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="contained"
                            size="large"
                            startIcon={<ShoppingCartIcon />}
                            onClick={handleAddToCart}
                            disabled={product.stock_quantity === 0}
                            sx={{
                                flex: 1,
                                py: 1.5,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                background: 'linear-gradient(135deg, #F7941D, #FA8232)',
                                '&:hover': { background: 'linear-gradient(135deg, #e0851a, #e6732a)' },
                            }}
                        >
                            Add to Cart
                        </Button>
                        <IconButton
                            onClick={handleToggleWishlist}
                            sx={{
                                border: '1px solid #ddd',
                                borderRadius: 2,
                                px: 2,
                                color: isInWishlist ? '#E53935' : '#999',
                                '&:hover': { borderColor: '#E53935' },
                            }}
                        >
                            {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Grid>
            </Grid>

            {/* Reviews Section */}
            <Box sx={{ mt: 8 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                    Customer Reviews
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {approvedReviews.length > 0 ? (
                    <Grid container spacing={3}>
                        {approvedReviews.map((review: any) => (
                            <Grid size={{ xs: 12, md: 6 }} key={review.id}>
                                <Paper
                                    elevation={0}
                                    sx={{ p: 3, border: '1px solid #eee', borderRadius: '12px', height: '100%' }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                        <Avatar sx={{ bgcolor: '#3878A0', mr: 2 }}>
                                            {review.user_name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {review.user_name}
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Rating value={review.rating} size="small" readOnly />
                                                <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        "{review.comment}"
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1" color="text.secondary">
                        No reviews yet. Be the first to review this product!
                    </Typography>
                )}

                {/* Review Form */}
                <ReviewForm productId={Number(id)} onReviewSubmitted={fetchProduct} />
            </Box>
        </Container>
    );
};

export default ProductDetails;