import { useEffect, useState } from 'react';
import { Box, Typography, Paper, TextField, Button, CircularProgress, Divider } from '@mui/material';
import supabase from '../utils/supabase';
import toast from 'react-hot-toast';

const SettingsPage = () => {
    const [settings, setSettings] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await supabase.from('site_settings').select('*');
            const map: Record<string, string> = {};
            (data || []).forEach(s => { map[s.key] = s.value; });
            setSettings(map);
            setLoading(false);
        };
        fetch();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            for (const [key, value] of Object.entries(settings)) {
                await supabase.from('site_settings').upsert({ key, value, updated_at: new Date().toISOString() });
            }
            toast.success('Settings saved');
        } catch { toast.error('Failed to save'); }
        setSaving(false);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;

    const fields = [
        { key: 'site_name', label: 'Site Name' },
        { key: 'contact_email', label: 'Contact Email' },
        { key: 'contact_phone', label: 'Contact Phone' },
        { key: 'logo_url', label: 'Logo URL' },
        { key: 'tax_rate', label: 'Tax Rate (%)' },
        { key: 'shipping_flat_rate', label: 'Shipping Flat Rate (₹)' },
        { key: 'free_shipping_above', label: 'Free Shipping Above (₹)' },
        { key: 'currency_symbol', label: 'Currency Symbol' },
    ];

    return (
        <Box>
            <Typography variant="h4" fontWeight="bold" mb={3}>Settings</Typography>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    {fields.map(f => (
                        <TextField key={f.key} label={f.label} fullWidth value={settings[f.key] || ''}
                            onChange={e => setSettings({ ...settings, [f.key]: e.target.value })} />
                    ))}
                </Box>
                <Divider sx={{ my: 3 }} />
                <Button variant="contained" onClick={handleSave} disabled={saving}
                    sx={{ borderRadius: 2, fontWeight: 'bold' }}>
                    {saving ? 'Saving...' : 'Save Settings'}
                </Button>
            </Paper>
        </Box>
    );
};

export default SettingsPage;
