import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Link as RouterLink } from 'react-router-dom';

// Import Swiper styles
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/navigation";
// @ts-ignore
import "swiper/css/pagination";

// Define the Product type to match your Supabase schema
interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
}

interface HeroSliderProps {
  products: Product[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  // If no products are loaded yet, show a placeholder or nothing
  if (!products || products.length === 0) return null;

  // We can pick the first few products for the banner
  const bannerProducts = products.slice(0, 3);

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        loop
        style={{ 
            height: "100%",
            "--swiper-navigation-color": "#fff",
            "--swiper-pagination-color": "#fff",
        } as React.CSSProperties}
      >
        {bannerProducts.map((product) => (
          <SwiperSlide key={product.id}>
            <Box
              sx={{
                height: "100%",
                backgroundImage: `url(${product.images?.[0] || 'https://placehold.co/400x300?text=Coming+Soon'})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  bgcolor: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Container>
                  <Typography variant="h3" color="white" fontWeight="bold" gutterBottom>
                    {product.title}
                  </Typography>

                  <Typography variant="h6" color="white" mb={3} sx={{ maxWidth: '600px' }}>
                    {product.description.substring(0, 100)}...
                  </Typography>

                  <Button 
                    variant="contained" 
                    size="large"
                    component={RouterLink}
                    to={`/products/${product.id}`} // Links to your ProductDetails page
                  >
                    View Details
                  </Button>
                </Container>
              </Box>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default HeroSlider;