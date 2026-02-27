import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, TextField,
    CircularProgress, Divider, IconButton, Dialog, DialogTitle,
    DialogContent, DialogActions, Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { updateProfile } from '../store/slices/authSlice';
import type { Address } from '../types';
import toast from 'react-hot-toast';

const emptyAddress: Address = {
    id: '', label: '', line1: '', line2: '', city: '', state: '', zip: '', country: 'India', is_default: false,
};

const AccountPage = () => {
    const dispatch = useAppDispatch();
    const { user, profile } = useAppSelector((s) => s.auth);
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [saving, setSaving] = useState(false);
    const [addressDialog, setAddressDialog] = useState(false);
    const [editAddress, setEditAddress] = useState<Address>(emptyAddress);

    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name);
            setPhone(profile.phone || '');
        }
    }, [profile]);

    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        try {
            await dispatch(updateProfile({ id: user.id, full_name: fullName, phone })).unwrap();
            toast.success('Profile updated!');
        } catch {
            toast.error('Failed to update profile');
        }
        setSaving(false);
    };

    const handleSaveAddress = async () => {
        if (!user || !profile) return;
        const addresses = [...(profile.addresses || [])];
        const addr = { ...editAddress, id: editAddress.id || Date.now().toString() };
        const idx = addresses.findIndex((a) => a.id === addr.id);
        if (idx >= 0) {
            addresses[idx] = addr;
        } else {
            addresses.push(addr);
        }
        await dispatch(updateProfile({ id: user.id, addresses })).unwrap();
        toast.success('Address saved!');
        setAddressDialog(false);
    };

    const handleDeleteAddress = async (addrId: string) => {
        if (!user || !profile) return;
        const addresses = (profile.addresses || []).filter((a) => a.id !== addrId);
        await dispatch(updateProfile({ id: user.id, addresses })).unwrap();
        toast.success('Address deleted');
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
                <PersonIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h5" mb={2}>Please login to manage your account</Typography>
                <Button component={RouterLink} to="/login" variant="contained" size="large">
                    Sign In
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Button component={RouterLink} to="/" startIcon={<ArrowBackIcon />} sx={{ mb: 3, textTransform: 'none' }}>
                Back to Home
            </Button>

            <Typography variant="h4" fontWeight="bold" mb={4}>My Account</Typography>

            {/* Profile Info */}
            <Paper sx={{ p: 4, mb: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: '#2E6F95', fontSize: 28 }}>
                        {fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" fontWeight="bold">{fullName || 'User'}</Typography>
                        <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                    </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Email" value={user.email || ''} disabled />
                    </Grid>
                </Grid>
                <Button
                    variant="contained" onClick={handleSaveProfile} disabled={saving}
                    sx={{ mt: 3, borderRadius: 2, fontWeight: 'bold' }}
                >
                    {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
                </Button>
            </Paper>

            {/* Addresses */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold">
                        <HomeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Saved Addresses
                    </Typography>
                    <Button
                        variant="outlined" startIcon={<AddIcon />}
                        onClick={() => { setEditAddress({ ...emptyAddress }); setAddressDialog(true); }}
                        sx={{ textTransform: 'none', borderRadius: 2 }}
                    >
                        Add Address
                    </Button>
                </Box>

                {(!profile?.addresses || profile.addresses.length === 0) ? (
                    <Typography color="text.secondary" textAlign="center" py={4}>
                        No addresses saved yet
                    </Typography>
                ) : (
                    <Grid container spacing={2}>
                        {profile.addresses.map((addr) => (
                            <Grid key={addr.id} size={{ xs: 12, sm: 6 }}>
                                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2, position: 'relative' }}>
                                    <Typography variant="subtitle2" fontWeight="bold" mb={1}>
                                        {addr.label || 'Address'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {addr.city}, {addr.state} - {addr.zip}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">{addr.country}</Typography>
                                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                                        <IconButton size="small" onClick={() => { setEditAddress(addr); setAddressDialog(true); }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error" onClick={() => handleDeleteAddress(addr.id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Paper>

            {/* Address Dialog */}
            <Dialog open={addressDialog} onClose={() => setAddressDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight="bold">
                    {editAddress.id ? 'Edit Address' : 'Add New Address'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField label="Label (e.g. Home, Office)" fullWidth value={editAddress.label}
                            onChange={(e) => setEditAddress({ ...editAddress, label: e.target.value })} />
                        <TextField label="Address Line 1" fullWidth required value={editAddress.line1}
                            onChange={(e) => setEditAddress({ ...editAddress, line1: e.target.value })} />
                        <TextField label="Address Line 2" fullWidth value={editAddress.line2 || ''}
                            onChange={(e) => setEditAddress({ ...editAddress, line2: e.target.value })} />
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="City" fullWidth required value={editAddress.city}
                                onChange={(e) => setEditAddress({ ...editAddress, city: e.target.value })} />
                            <TextField label="State" fullWidth required value={editAddress.state}
                                onChange={(e) => setEditAddress({ ...editAddress, state: e.target.value })} />
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField label="PIN Code" fullWidth required value={editAddress.zip}
                                onChange={(e) => setEditAddress({ ...editAddress, zip: e.target.value })} />
                            <TextField label="Country" fullWidth value={editAddress.country}
                                onChange={(e) => setEditAddress({ ...editAddress, country: e.target.value })} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setAddressDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveAddress} sx={{ borderRadius: 2 }}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default AccountPage;
