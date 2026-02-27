import { Box, Container, Typography, Divider, IconButton } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
    const footerLinks = [
        {
            title: 'Shop',
            links: [
                { label: 'All Products', to: '/products' },
            ],
        },
        {
            title: 'Account',
            links: [
                { label: 'My Account', to: '/account' },
                { label: 'Orders', to: '/orders' },
                { label: 'Wishlist', to: '/wishlist' },
                { label: 'Cart', to: '/cart' },
            ],
        },
        {
            title: 'Help',
            links: [
                { label: 'Customer Support', to: '/support' },
                { label: 'Shipping Info', to: '/shipping' },
                { label: 'Return Policy', to: '/return' },
            ],
        },
    ];

    return (
        <Box sx={{ bgcolor: '#1B2838', color: '#ccc', mt: 8 }}>
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Grid container spacing={4}>
                    {/* Brand Column */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="h5" fontWeight="bold" color="white" mb={2}>
                            CLICON
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.8, color: '#aaa' }}>
                            Your one-stop shop for electronics, gadgets, and more.
                            Quality products at the best prices.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {[FacebookIcon, TwitterIcon, InstagramIcon, YouTubeIcon].map((Icon, i) => (
                                <IconButton
                                    key={i}
                                    size="small"
                                    sx={{
                                        color: '#aaa',
                                        border: '1px solid #444',
                                        '&:hover': { color: '#fff', borderColor: '#2E6F95', bgcolor: '#2E6F95' },
                                        transition: 'all 0.3s',
                                    }}
                                >
                                    <Icon fontSize="small" />
                                </IconButton>
                            ))}
                        </Box>
                    </Grid>

                    {/* Link Columns */}
                    {footerLinks.map((section) => (
                        <Grid key={section.title} size={{ xs: 6, sm: 4, md: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" color="white" mb={2}>
                                {section.title}
                            </Typography>
                            {section.links.map((link) => (
                                <Typography
                                    key={link.label}
                                    component={Link}
                                    to={link.to}
                                    variant="body2"
                                    sx={{
                                        display: 'block',
                                        mb: 1.2,
                                        color: '#aaa',
                                        textDecoration: 'none',
                                        '&:hover': { color: '#fff' },
                                        transition: 'color 0.2s',
                                    }}
                                >
                                    {link.label}
                                </Typography>
                            ))}
                        </Grid>
                    ))}

                    {/* Contact Column */}
                    <Grid size={{ xs: 12, md: 3 }}>
                        <Typography variant="subtitle1" fontWeight="bold" color="white" mb={2}>
                            Contact Us
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: '#aaa' }}>
                            📧 support@clicon.com
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1, color: '#aaa' }}>
                            📞 +1-202-555-0104
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                            📍 123 Commerce St, Market City
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ my: 4, borderColor: '#333' }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                    <Typography variant="body2" color="#777">
                        © 2026 CLICON. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default Footer;
