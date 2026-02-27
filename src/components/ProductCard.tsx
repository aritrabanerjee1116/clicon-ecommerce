import React from 'react';
import {
  Typography,
  CardContent,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom'; // 1. Import Link

type Product = {
  id: number;
  title: string;
  description: string;
  image: string[];
};

const ProductCard = ({id, image, title, description}: Product) => {
  return (
    <Card sx={{
      display: 'flex',
      flexDirection: 'column',
      width: 300,
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
      overflow: 'hidden'
    }}>
      <CardMedia
        component="img"
        height="180"
        image={image[0] || 'https://placehold.co/400x300?text=No+Image'}
        alt={title}
        loading='lazy'
        sx={{ objectFit: 'cover' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          const target = e.target as HTMLImageElement;
          target.src = 'https://placehold.co/400x300?text=Coming+Soon';
        }}
      />

      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            minHeight: '2.8em',
            lineHeight: 1.2,
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            minHeight: '3em',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.85rem'
          }}
        >
          {description}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, mt: 'auto' }}>
        {/* 2. Integrate the Link here */}
        <Button
          component={Link}           // This tells MUI to render a Link
          to={`/products/${id}`}    // This is the destination URL
          variant="contained"
          fullWidth
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            backgroundColor: '#3878A0',
            '&:hover': { backgroundColor: '#2d6282' }
          }}
        >
          VIEW DETAILS
        </Button>
      </Box>
    </Card>
  );
}

export default ProductCard;