import { useState, useEffect } from "react"
import supabase from "../utils/supabase"
import { Container, Box, CircularProgress } from "@mui/material";
import HeroSlider from "../components/HeroSlider";
import BestDeals from "../components/BestDeals"; // We will create this below

type Product = {
  id: number;
  title: string;
  description: string;
  images: string[];
  price_in_rupees: number;
  average_rating: number;
};

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getProducts() {
      // Fetching slightly more to ensure we have enough for slider + deals
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(10); 

      if (!error && data) {
        setProducts(data as Product[]);
      }
      setLoading(false);
    }
    getProducts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ width: "100%", height: { xs: '50vh', md: '70vh' }, mb: 4 }}>
        <HeroSlider products={products.slice(0, 3)} />
      </Box>

      {/* The "Best Deals" Section inspired by your image */}
      <Container maxWidth="xl">
        <BestDeals />
      </Container>
    </Box>
  ); 
}

export default Home;