import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, IconButton, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, Chip, FormControl,
    InputLabel, Select, MenuItem, CircularProgress, Switch, FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

const FALLBACK = 'https://placehold.co/60x60?text=N/A';

interface Product {
    id: number;
    title: string;
    description: string;
    images: string[];
    price_in_rupees: number;
    category_id: number | null;
    stock_quantity: number;
    is_active: boolean;
}

interface Category {
    id: number;
    name: string;
}

const emptyProduct: Omit<Product, 'id'> = {
    title: '', description: '', images: [], price_in_rupees: 0,
    category_id: null, stock_quantity: 0, is_active: true,
};

const ProductManagement = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<(Product & { imageUrls: string }) | null>(null);
    const [form, setForm] = useState<any>({ ...emptyProduct, imageUrls: '' });

    const fetchProducts = async () => {
        setLoading(true);
        const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
        setProducts(data || []);
        setLoading(false);
    };

    const fetchCategories = async () => {
        const { data } = await supabase.from('categories').select('id, name');
        setCategories(data || []);
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ ...emptyProduct, imageUrls: '' });
        setDialogOpen(true);
    };

    const openEdit = (p: Product) => {
        setEditing({ ...p, imageUrls: (p.images || []).join('\n') });
        setForm({ ...p, imageUrls: (p.images || []).join('\n') });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const images = form.imageUrls.split('\n').map((u: string) => u.trim()).filter((u: string) => u);
        const payload = {
            title: form.title,
            description: form.description,
            images,
            price_in_rupees: Number(form.price_in_rupees),
            category_id: form.category_id || null,
            stock_quantity: Number(form.stock_quantity),
            is_active: form.is_active,
        };

        try {
            if (editing?.id) {
                const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
                if (error) throw error;
                toast.success('Product updated');
            } else {
                const { error } = await supabase.from('products').insert(payload);
                if (error) throw error;
                toast.success('Product created');
            }
            setDialogOpen(false);
            fetchProducts();
        } catch {
            toast.error('Failed to save product');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this product?')) return;
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) toast.error('Failed to delete');
        else { toast.success('Product deleted'); fetchProducts(); }
    };

    const filtered = products.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Products</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ borderRadius: 2 }}>
                    Add Product
                </Button>
            </Box>

            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <SearchIcon color="action" />
                <TextField
                    variant="standard"
                    placeholder="Search products..."
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{ input: { disableUnderline: true } }}
                />
                <Chip label={`${filtered.length} products`} sx={{ fontWeight: 600 }} />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                    {['', 'Product', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                                        <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, color: '#666', fontSize: '0.85rem' }}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((p) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '10px 16px' }}>
                                            <img
                                                src={p.images?.[0] || FALLBACK}
                                                alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                                                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <Typography variant="body2" fontWeight={600} sx={{ maxWidth: 300 }} noWrap>
                                                {p.title}
                                            </Typography>
                                        </td>
                                        <td style={{ padding: '10px 16px', fontWeight: 600 }}>
                                            ₹{p.price_in_rupees?.toLocaleString('en-IN')}
                                        </td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <Chip
                                                label={p.stock_quantity}
                                                size="small"
                                                color={p.stock_quantity < 10 ? 'error' : 'success'}
                                                sx={{ fontWeight: 600, minWidth: 40 }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <Chip
                                                label={p.is_active ? 'Active' : 'Inactive'}
                                                size="small"
                                                color={p.is_active ? 'success' : 'default'}
                                                variant={p.is_active ? 'filled' : 'outlined'}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </td>
                                        <td style={{ padding: '10px 16px' }}>
                                            <IconButton size="small" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton>
                                            <IconButton size="small" color="error" onClick={() => handleDelete(p.id)}><DeleteIcon fontSize="small" /></IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Paper>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight="bold">{editing?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Title" fullWidth required value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })} />
                        <TextField label="Description" fullWidth multiline rows={3} value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })} />
                        <TextField label="Price (₹)" fullWidth type="number" value={form.price_in_rupees}
                            onChange={(e) => setForm({ ...form, price_in_rupees: e.target.value })} />
                        <TextField label="Stock Quantity" fullWidth type="number" value={form.stock_quantity}
                            onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} />
                        <FormControl fullWidth>
                            <InputLabel>Category</InputLabel>
                            <Select value={form.category_id || ''} label="Category"
                                onChange={(e) => setForm({ ...form, category_id: e.target.value || null })}>
                                <MenuItem value="">None</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Image URLs (one per line)"
                            fullWidth multiline rows={3}
                            placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
                            value={form.imageUrls}
                            onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                            helperText="Paste image URLs, one per line"
                        />
                        <FormControlLabel
                            control={<Switch checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />}
                            label="Active"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} sx={{ borderRadius: 2 }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductManagement;
