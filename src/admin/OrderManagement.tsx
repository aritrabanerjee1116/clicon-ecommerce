import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Chip, FormControl, Select, MenuItem,
    CircularProgress, Accordion, AccordionSummary, AccordionDetails,
    Table, TableBody, TableCell, TableRow, Avatar, InputLabel, TextField
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

const statusColors: Record<string, 'warning' | 'info' | 'primary' | 'success' | 'error'> = {
    Pending: 'warning', Confirmed: 'info', Shipped: 'primary', Delivered: 'success', Cancelled: 'error',
};
const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const OrderManagement = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('');
    const [search, setSearch] = useState('');

    const fetchOrders = async () => {
        setLoading(true);
        let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
        if (filterStatus) query = query.eq('status', filterStatus);
        const { data } = await query;
        setOrders(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchOrders(); }, [filterStatus]);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', orderId);
        if (error) toast.error('Failed to update');
        else { toast.success(`Order #${orderId} → ${newStatus}`); fetchOrders(); }
    };

    const filtered = orders.filter((o) => {
        if (search) return `#${o.id}`.includes(search) || o.user_id?.includes(search);
        return true;
    });

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Order Management</Typography>

            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <SearchIcon color="action" />
                <TextField variant="standard" placeholder="Search by order #..." value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{ input: { disableUnderline: true } }} sx={{ flex: 1, minWidth: 200 }} />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Filter Status</InputLabel>
                    <Select value={filterStatus} label="Filter Status" onChange={(e) => setFilterStatus(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                </FormControl>
                <Chip label={`${filtered.length} orders`} sx={{ fontWeight: 600 }} />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : filtered.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <Typography variant="h6">No orders found</Typography>
                </Paper>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {filtered.map((order) => (
                        <Accordion key={order.id} elevation={0}
                            sx={{ border: '1px solid #e0e0e0', borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: '#fafbfc', px: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%', flexWrap: 'wrap' }}>
                                    <Typography fontWeight="bold">Order #{order.id}</Typography>
                                    <Chip label={order.status} color={statusColors[order.status] || 'default'} size="small" sx={{ fontWeight: 600 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </Typography>
                                    <Typography fontWeight="bold" color="primary" sx={{ ml: 'auto' }}>
                                        ₹{Number(order.total).toLocaleString('en-IN')}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Box sx={{ display: 'flex', gap: 3, mb: 2, alignItems: 'center' }}>
                                    <Typography variant="body2" fontWeight="bold">Update Status:</Typography>
                                    <FormControl size="small" sx={{ minWidth: 160 }}>
                                        <Select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                                            {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <Table size="small">
                                    <TableBody>
                                        {order.order_items?.map((item: any) => (
                                            <TableRow key={item.id}>
                                                <TableCell sx={{ border: 'none' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar variant="rounded" src={item.product_image || ''} sx={{ width: 40, height: 40 }} />
                                                        <Typography variant="body2">{item.product_title}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell sx={{ border: 'none' }}>Qty: {item.quantity}</TableCell>
                                                <TableCell align="right" sx={{ border: 'none', fontWeight: 600 }}>
                                                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            )}
        </Box>
    );
};

export default OrderManagement;
