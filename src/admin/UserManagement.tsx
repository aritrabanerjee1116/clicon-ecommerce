import { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, TextField, CircularProgress, Chip, Avatar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import supabase from '../utils/supabase';

interface Profile {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    role: string;
    is_active: boolean;
    created_at: string;
}

const UserManagement = () => {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            setUsers(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    const filtered = users.filter((u) =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>User Management</Typography>

            <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                <SearchIcon color="action" />
                <TextField variant="standard" placeholder="Search users..." fullWidth value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    slotProps={{ input: { disableUnderline: true } }} />
                <Chip label={`${filtered.length} users`} sx={{ fontWeight: 600 }} />
            </Paper>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
            ) : (
                <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                                    {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined'].map((h) => (
                                        <th key={h} style={{ textAlign: 'left', padding: '14px 16px', fontWeight: 600, color: '#666', fontSize: '0.85rem' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((u) => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Avatar sx={{ width: 36, height: 36, bgcolor: '#2E6F95', fontSize: 14 }}>
                                                    {u.full_name?.charAt(0)?.toUpperCase() || 'U'}
                                                </Avatar>
                                                <Typography variant="body2" fontWeight={600}>{u.full_name || 'N/A'}</Typography>
                                            </Box>
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#666' }}>{u.email}</td>
                                        <td style={{ padding: '12px 16px', color: '#666' }}>{u.phone || '—'}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Chip label={u.role} size="small"
                                                color={u.role === 'admin' ? 'primary' : 'default'}
                                                sx={{ fontWeight: 600, textTransform: 'capitalize' }} />
                                        </td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <Chip label={u.is_active ? 'Active' : 'Disabled'} size="small"
                                                color={u.is_active ? 'success' : 'error'} sx={{ fontWeight: 600 }} />
                                        </td>
                                        <td style={{ padding: '12px 16px', color: '#888' }}>
                                            {new Date(u.created_at).toLocaleDateString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Box>
                </Paper>
            )}
        </Box>
    );
};

export default UserManagement;
