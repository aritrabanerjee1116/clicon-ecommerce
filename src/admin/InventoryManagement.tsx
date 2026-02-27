import { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress } from '@mui/material';
import supabase from '../utils/supabase';

const InventoryManagement = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data } = await supabase.from('products')
                .select('id, title, images, stock_quantity, price_in_rupees, is_active')
                .order('stock_quantity', { ascending: true });
            setProducts(data || []);
            setLoading(false);
        };
        fetch();
    }, []);



    const lowStock = products.filter(p => p.stock_quantity < 10).length;

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Inventory</Typography>
            {lowStock > 0 && (
                <Paper sx={{ p: 2, mb: 3, borderRadius: 3, bgcolor: '#fff3e0' }}>
                    <Typography fontWeight={600}>⚠️ {lowStock} product(s) with low stock</Typography>
                </Paper>
            )}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                            {['Product', 'Price', 'Stock', 'Status'].map(h => (
                                <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, color: '#666' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0', backgroundColor: p.stock_quantity < 10 ? '#fff8e1' : 'transparent' }}>
                                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.title}</td>
                                <td style={{ padding: '12px 16px' }}>₹{p.price_in_rupees?.toLocaleString('en-IN')}</td>
                                <td style={{ padding: '12px 16px' }}>
                                    <Chip label={p.stock_quantity} size="small"
                                        color={p.stock_quantity === 0 ? 'error' : p.stock_quantity < 10 ? 'warning' : 'success'}
                                        sx={{ fontWeight: 700 }} />
                                </td>
                                <td style={{ padding: '12px 16px' }}>
                                    <Chip label={p.is_active ? 'Active' : 'Inactive'} size="small" color={p.is_active ? 'success' : 'default'} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Paper>
        </Box>
    );
};

export default InventoryManagement;
