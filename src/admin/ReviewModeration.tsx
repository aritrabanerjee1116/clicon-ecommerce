import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, IconButton, Rating, Avatar } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

const ReviewModeration = () => {
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        setLoading(true);
        const { data } = await supabase.from('reviews').select('*, product:products(title)')
            .order('created_at', { ascending: false });
        setReviews(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleApprove = async (id: number) => {
        await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
        toast.success('Review approved');
        fetchReviews();
    };

    const handleReject = async (id: number) => {
        await supabase.from('reviews').delete().eq('id', id);
        toast.success('Review deleted');
        fetchReviews();
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    const pending = reviews.filter(r => !r.is_approved);

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Review Moderation</Typography>
            {pending.length > 0 && (
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#fff3e0' }}>
                    <Typography fontWeight={600}>⏳ {pending.length} review(s) pending approval</Typography>
                </Paper>
            )}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                            {['User', 'Product', 'Rating', 'Comment', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, color: '#666' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(r => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: !r.is_approved ? '#fffde7' : 'transparent' }}>
                                <td style={{ padding: '12px 16px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Avatar sx={{ width: 30, height: 30, bgcolor: '#2E6F95', fontSize: 13 }}>{r.user_name?.charAt(0)}</Avatar>
                                        <Typography variant="body2" fontWeight={600}>{r.user_name}</Typography>
                                    </Box>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>{r.product?.title || '—'}</Typography>
                                </td>
                                <td style={{ padding: '12px 16px' }}><Rating value={r.rating} size="small" readOnly /></td>
                                <td style={{ padding: '12px 16px' }}>
                                    <Typography variant="body2" sx={{ maxWidth: 250, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {r.comment || '—'}
                                    </Typography>
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <Chip label={r.is_approved ? 'Approved' : 'Pending'} size="small"
                                        color={r.is_approved ? 'success' : 'warning'} sx={{ fontWeight: 600 }} />
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    {!r.is_approved && (
                                        <IconButton size="small" color="success" onClick={() => handleApprove(r.id)}><CheckCircleIcon /></IconButton>
                                    )}
                                    <IconButton size="small" color="error" onClick={() => handleReject(r.id)}><CancelIcon /></IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        </Box>
    );
};

export default ReviewModeration;
