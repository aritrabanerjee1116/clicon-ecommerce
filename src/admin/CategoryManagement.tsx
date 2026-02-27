import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Button, TextField, Dialog,
    DialogTitle, DialogContent, DialogActions, IconButton, CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

interface Category {
    id: number;
    name: string;
    slug: string;
    image_url: string;
}

const CategoryManagement = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Category | null>(null);
    const [form, setForm] = useState({ name: '', slug: '', image_url: '' });

    const fetchCats = async () => {
        setLoading(true);
        const { data } = await supabase.from('categories').select('*').order('name');
        setCategories(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchCats(); }, []);

    const openAdd = () => {
        setEditing(null);
        setForm({ name: '', slug: '', image_url: '' });
        setDialogOpen(true);
    };

    const openEdit = (c: Category) => {
        setEditing(c);
        setForm({ name: c.name, slug: c.slug, image_url: c.image_url });
        setDialogOpen(true);
    };

    const handleSave = async () => {
        const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-');
        try {
            if (editing) {
                const { error } = await supabase.from('categories').update({ ...form, slug }).eq('id', editing.id);
                if (error) throw error;
                toast.success('Category updated');
            } else {
                const { error } = await supabase.from('categories').insert({ ...form, slug });
                if (error) throw error;
                toast.success('Category created');
            }
            setDialogOpen(false);
            fetchCats();
        } catch {
            toast.error('Failed to save');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this category?')) return;
        const { error } = await supabase.from('categories').delete().eq('id', id);
        if (error) toast.error('Failed to delete');
        else { toast.success('Deleted'); fetchCats(); }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight="bold">Categories</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} sx={{ borderRadius: 2 }}>
                    Add Category
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                {['Name', 'Slug', 'Actions'].map((h) => (
                                    <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, color: '#666' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>{c.name}</td>
                                    <td style={{ padding: '12px 16px', color: '#888' }}>{c.slug}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <IconButton size="small" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Paper>
            )}

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight="bold">{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Name" fullWidth value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <TextField label="Slug" fullWidth value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            helperText="Auto-generated if left blank" />
                        <TextField label="Image URL" fullWidth value={form.image_url}
                            onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
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

export default CategoryManagement;
