import React from "react";
import { Container, Typography, Stack, Box, Card, CardContent } from "@mui/material";

const ShippingInfo: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>

        <Typography variant="h2">
          Shipping Information
        </Typography>

        <Typography color="text.secondary">
          We deliver products across India and internationally to ensure you receive your orders wherever you are.
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={3}>
          <Card sx={{ flex: "1 1 260px" }}>
            <CardContent>
              <Typography variant="h5">Shipping Within India</Typography>
              <Typography mt={1}>
                Delivery typically takes <strong>5–7 business days</strong> depending on your location.
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ flex: "1 1 260px" }}>
            <CardContent>
              <Typography variant="h5">International Shipping</Typography>
              <Typography mt={1}>
                Orders delivered outside India usually arrive within <strong>20–30 days</strong>.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Delivery timelines may vary due to customs clearance, remote locations, or unforeseen logistical delays.
        </Typography>

      </Stack>
    </Container>
  );
};

export default ShippingInfo;