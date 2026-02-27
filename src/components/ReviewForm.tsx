import { useState } from 'react';
import { Box, Typography, Rating, TextField, Button, Alert } from '@mui/material';
import { useAppSelector } from '../store/hooks';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

interface ReviewFormProps {
    productId: number;
    onReviewSubmitted: () => void;
}

const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
    const { user, profile } = useAppSelector((s) => s.auth);
    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!user) {
        return (
            <Alert severity="info" sx={{ borderRadius: 2, mt: 2 }}>
                Please log in to write a review.
            </Alert>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!rating) {
            toast.error('Please select a rating');
            return;
        }
        setSubmitting(true);
        try {
            const { error } = await supabase.from('reviews').insert({
                product_id: productId,
                user_id: user.id,
                user_name: profile?.full_name || 'Anonymous',
                rating,
                comment,
                is_approved: false,
            });
            if (error) throw error;
            toast.success('Review submitted! It will appear after moderation.');
            setRating(null);
            setComment('');
            onReviewSubmitted();
        } catch {
            toast.error('Failed to submit review');
        }
        setSubmitting(false);
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                mt: 4,
                p: 3,
                bgcolor: '#f8f9fa',
                borderRadius: 3,
                border: '1px solid #e0e0e0',
            }}
        >
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Write a Review
            </Typography>
            <Box sx={{ mb: 2 }}>
                <Typography variant="body2" mb={0.5}>
                    Your Rating *
                </Typography>
                <Rating
                    value={rating}
                    onChange={(_, v) => setRating(v)}
                    size="large"
                    sx={{ color: '#F7941D' }}
                />
            </Box>
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Your Review"
                placeholder="Share your experience with this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 2 }}
            />
            <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ fontWeight: 'bold', borderRadius: 2 }}
            >
                {submitting ? 'Submitting...' : 'Submit Review'}
            </Button>
        </Box>
    );
};

export default ReviewForm;
