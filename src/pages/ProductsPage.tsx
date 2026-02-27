import { useEffect, useState } from 'react';
import {
  Typography, Box, Container, CircularProgress, FormControl,
  InputLabel, Select, MenuItem, Slider, Paper, IconButton, Chip,
  Button, Rating
} from '@mui/material';
import Grid from '@mui/material/Grid';
import FilterListIcon from '@mui/icons-material/FilterList';

import { Link } from 'react-router-dom';
import supabase from '../utils/supabase';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import toast from 'react-hot-toast';

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=Coming+Soon';

type Product = {
  id: number;
  title: string;
  description: string;
  images: string[];
  price_in_rupees: number;
  average_rating: number;
  category_id: number | null;
  stock_quantity: number;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

const ProductsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { items: wishlistItems } = useAppSelector((s) => s.wishlist);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedCategory, setSelectedCategory] = useState<number | ''>('');
  const [priceRange, setPriceRange] = useState<number[]>([0, 200000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    supabase.from('categories').select('*').then(({ data }) => {
      if (data) setCategories(data);
    });
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let query = supabase.from('products').select('*').eq('is_active', true);

        if (selectedCategory) {
          query = query.eq('category_id', selectedCategory);
        }
        query = query.gte('price_in_rupees', priceRange[0]).lte('price_in_rupees', priceRange[1]);
        if (minRating > 0) {
          query = query.gte('average_rating', minRating);
        }

        switch (sortBy) {
          case 'price_low':
            query = query.order('price_in_rupees', { ascending: true });
            break;
          case 'price_high':
            query = query.order('price_in_rupees', { ascending: false });
            break;
          case 'rating':
            query = query.order('average_rating', { ascending: false });
            break;
          case 'popular':
            query = query.order('total_reviews', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [sortBy, selectedCategory, priceRange, minRating]);

  const handleAddToCart = (productId: number) => {
    if (!user) { toast.error('Please log in'); return; }
    dispatch(addToCart({ userId: user.id, productId }));
    toast.success('Added to cart! 🛒');
  };

  const handleToggleWishlist = (productId: number) => {
    if (!user) { toast.error('Please log in'); return; }
    dispatch(toggleWishlist({ userId: user.id, productId }));
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 200000]);
    setMinRating(0);
    setSortBy('newest');
  };

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Our Products
          <Chip label={`${products.length} items`} sx={{ ml: 2, fontWeight: 600 }} />
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} label="Sort By" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="price_low">Price: Low to High</MenuItem>
              <MenuItem value="price_high">Price: High to Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Filters Sidebar */}
        {showFilters && (
          <Grid size={{ xs: 12, md: 3 }}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">Filters</Typography>
                <Button size="small" onClick={clearFilters} sx={{ textTransform: 'none' }}>
                  Clear All
                </Button>
              </Box>

              {/* Category Filter */}
              <Typography variant="subtitle2" fontWeight="bold" mb={1} mt={2}>
                Category
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                <Chip
                  label="All"
                  onClick={() => setSelectedCategory('')}
                  color={selectedCategory === '' ? 'primary' : 'default'}
                  variant={selectedCategory === '' ? 'filled' : 'outlined'}
                  sx={{ fontWeight: 600 }}
                />
                {categories.map((cat) => (
                  <Chip
                    key={cat.id}
                    label={cat.name}
                    onClick={() => setSelectedCategory(cat.id)}
                    color={selectedCategory === cat.id ? 'primary' : 'default'}
                    variant={selectedCategory === cat.id ? 'filled' : 'outlined'}
                    sx={{ fontWeight: 600 }}
                  />
                ))}
              </Box>

              {/* Price Range */}
              <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                Price Range
              </Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v as number[])}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200000}
                  step={1000}
                  valueLabelFormat={(v) => `₹${v.toLocaleString('en-IN')}`}
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="caption">₹{priceRange[0].toLocaleString('en-IN')}</Typography>
                  <Typography variant="caption">₹{priceRange[1].toLocaleString('en-IN')}</Typography>
                </Box>
              </Box>

              {/* Rating Filter */}
              <Typography variant="subtitle2" fontWeight="bold" mb={1} mt={3}>
                Minimum Rating
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                {[4, 3, 2, 1, 0].map((r) => (
                  <Box
                    key={r}
                    onClick={() => setMinRating(r)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      p: 0.5,
                      borderRadius: 1,
                      bgcolor: minRating === r ? '#e3f2fd' : 'transparent',
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <Rating value={r} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary">
                      {r === 0 ? 'All' : `${r}+`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid size={{ xs: 12, md: showFilters ? 9 : 12 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
              <Typography variant="h5" mb={2}>No products found</Typography>
              <Typography color="text.secondary" mb={3}>Try adjusting your filters</Typography>
              <Button variant="contained" onClick={clearFilters}>Clear Filters</Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {products.map((product) => {
                const inWishlist = wishlistItems.some((w) => w.product_id === product.id);
                return (
                  <Grid key={product.id} size={{ xs: 12, sm: 6, md: showFilters ? 4 : 3 }}>
                    <Paper
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <Box
                          component={Link}
                          to={`/products/${product.id}`}
                          sx={{ display: 'block' }}
                        >
                          <Box
                            component="img"
                            src={product.images?.[0] || FALLBACK_IMAGE}
                            alt={product.title}
                            sx={{ width: '100%', height: 220, objectFit: 'cover' }}
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                            }}
                          />
                        </Box>
                        <IconButton
                          onClick={() => handleToggleWishlist(product.id)}
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: '#fff' },
                          }}
                        >
                          {inWishlist ? (
                            <FavoriteIcon sx={{ color: '#E53935' }} />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                        {product.stock_quantity === 0 && (
                          <Chip
                            label="Out of Stock"
                            size="small"
                            color="error"
                            sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 600 }}
                          />
                        )}
                      </Box>

                      <Box sx={{ p: 2.5 }}>
                        <Typography
                          component={Link}
                          to={`/products/${product.id}`}
                          variant="subtitle1"
                          fontWeight={600}
                          sx={{
                            textDecoration: 'none',
                            color: 'inherit',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            minHeight: '3em',
                            mb: 1,
                            '&:hover': { color: '#2E6F95' },
                          }}
                        >
                          {product.title}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                          <Rating value={product.average_rating} size="small" readOnly precision={0.5} />
                          <Typography variant="caption" color="text.secondary">
                            ({product.average_rating})
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight="bold" color="primary">
                            ₹{product.price_in_rupees?.toLocaleString('en-IN')}
                          </Typography>
                          <IconButton
                            onClick={() => handleAddToCart(product.id)}
                            disabled={product.stock_quantity === 0}
                            sx={{
                              bgcolor: '#FA8232',
                              color: '#fff',
                              '&:hover': { bgcolor: '#e6732a' },
                              '&.Mui-disabled': { bgcolor: '#ddd' },
                            }}
                          >
                            <ShoppingCartIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductsPage;