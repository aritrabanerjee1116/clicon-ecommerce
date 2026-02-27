import React from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Stack,
} from "@mui/material";

const supportTopics = [
  "Order Issues",
  "Returns & Refunds",
  "Payment Problems",
  "Delivery Delays",
  "Account Help",
  "Product Queries",
];

const Support: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        
        {/* Title */}
        <Box>
          <Typography variant="h2">Support</Typography>
          <Typography color="text.secondary">
            We're here to help with orders, payments, returns, and more.
          </Typography>
        </Box>

        {/* Contact Methods */}
        <Box
          display="flex"
          flexWrap="wrap"
          gap={3}
        >
          <Card sx={{ flex: "1 1 260px" }}>
            <CardContent>
              <Typography variant="h5">Call Support</Typography>
              <Typography variant="h6" color="primary" mt={1}>
                +1-202-555-0104
              </Typography>
              <Typography variant="body2">
                Mon – Sat, 9 AM – 7 PM
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: "1 1 260px" }}>
            <CardContent>
              <Typography variant="h5">Email Support</Typography>
              <Typography variant="h6" color="primary" mt={1}>
                support@clicon.com
              </Typography>
              <Typography variant="body2">
                Reply within 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Topics */}
        <Box>
          <Typography variant="h4" gutterBottom>
            What do you need help with?
          </Typography>

          <Box display="flex" flexWrap="wrap" gap={1}>
            {supportTopics.map((topic) => (
              <Chip key={topic} label={topic} clickable />
            ))}
          </Box>
        </Box>

        {/* Response time */}
        <Typography variant="body2" color="text.secondary">
          Average response time: <strong>2–12 hours</strong>
        </Typography>

        {/* Contact Form */}
        

      </Stack>
    </Container>
  );
};

export default Support;