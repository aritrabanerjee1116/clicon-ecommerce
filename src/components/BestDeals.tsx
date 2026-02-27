import { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Rating, Badge, Paper } from '@mui/material';
import Grid from '@mui/material/Grid'; // 1. Use Grid2 for more modern layout control
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import supabase from '../utils/supabase';

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  price_in_rupees: number;
}

const FALLBACK_IMAGE = 'https://placehold.co/400x300?text=Coming+Soon';

const BestDeals = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  
  const [timeLeft, setTimeLeft] = useState({
    days: 16, hours: 21, minutes: 57, seconds: 23
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { days, hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else {
          seconds = 59;
          if (minutes > 0) minutes--;
          else {
            minutes = 59;
            if (hours > 0) hours--;
            else { hours = 23; if (days > 0) days--; }
          }
        }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(9); 

        if (error) throw error;
        if (data) setDeals(data as Product[]);
      } catch (err) {
        console.error("Error fetching deals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.target as HTMLImageElement;
    target.src = FALLBACK_IMAGE;
  };

  if (loading || deals.length === 0) return null;

  const featured = deals[0];
  const others = deals.slice(1);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h5" fontWeight="bold">Best Deals</Typography>
          <Box sx={{ bgcolor: '#FFD700', px: 1.5, py: 0.5, borderRadius: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {timeLeft.days}d : {timeLeft.hours}h : {timeLeft.minutes}m : {timeLeft.seconds}s
            </Typography>
          </Box>
        </Box>
        <Button 
          component={Link} 
          to="/products" 
          endIcon={<ArrowForwardIcon />} 
          sx={{ textTransform: 'none', color: '#2DA5F3', fontWeight: 'bold' }}
        >
          Browse All Product
        </Button>
      </Box>

      {/* Main Layout using Paper for depth */}
      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 2 }}>
        <Grid container spacing={0}>
          
          {/* Left Section: Featured Large Product */}
          <Grid size={{ xs: 12, md: 4 }} sx={{ p: 4, borderRight: { md: '1px solid #eee' }, borderBottom: { xs: '1px solid #eee', md: 'none' } }}>
            <Box sx={{ position: 'relative', textAlign: 'center' }}>
              <Badge 
                badgeContent="32% OFF" 
                sx={{ 
                  '& .MuiBadge-badge': { 
                    backgroundColor: '#EFD33D', color: '#000', fontWeight: 'bold', 
                    left: 20, top: 10, borderRadius: '2px', fontSize: '0.75rem' 
                  } 
                }} 
              />
              <Box 
                component="img" 
                src={featured.images && featured.images.length > 0 ? featured.images[0] : FALLBACK_IMAGE} 
                onError={handleImageError}
                sx={{ width: '100%', height: 300, objectFit: 'contain', mb: 2 }} 
              />
              <Rating value={4.5} readOnly size="small" precision={0.5} sx={{ mb: 1 }} />
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, minHeight: '2.4em', lineHeight: 1.2 }}>
                {featured.title}
              </Typography>
              <Typography variant="h5" color="#2DA5F3" fontWeight="bold" sx={{ mb: 1 }}>
                ₹{featured.price_in_rupees?.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, height: '3.6em', overflow: 'hidden' }}>
                {featured.description.substring(0, 100)}...
              </Typography>
              <Button
              component={Link}
              to={`/products/${featured.id}`}
                variant="contained" 
                fullWidth             
                sx={{ bgcolor: '#FA8232', '&:hover': { bgcolor: '#e6732a' }, fontWeight: 'bold', py: 1.5 }}
              >
                View Details
              </Button>
            </Box>
          </Grid>

          {/* Right Section: Smaller Items Grid */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Grid container spacing={0}>
              {others.map((item) => (
                <Grid 
                  size={{ xs: 6, sm: 4, md: 3 }} // Shows 2 per row on mobile, 3 on tablet, 4 on desktop
                  key={item.id}
                  sx={{ 
                    border: '0.5px solid #eee',
                    p: 2,
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#fafafa', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)' }
                  }}
                >
                  <Link to={`/products/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center' }}>
                    <Box 
                      component="img" 
                      src={item.images && item.images.length > 0 ? item.images[0] : FALLBACK_IMAGE} 
                      onError={handleImageError}
                      sx={{ width: '100%', height: 140, objectFit: 'contain', mb: 1.5 }} 
                    />
                    <Typography variant="body2" sx={{ fontWeight: 500, height: '3em', overflow: 'hidden', mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="#2DA5F3" fontWeight="bold">
                      ₹{item.price_in_rupees?.toLocaleString('en-IN')}
                    </Typography>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

        </Grid>
      </Paper>
    </Container>
  );
};

export default BestDeals;