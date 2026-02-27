import React from "react";
import { Container, Typography, Stack, Card, CardContent } from "@mui/material";

const Returns: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>

        <Typography variant="h2">
          Returns & Refund Policy
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h5">
              Returns within India
            </Typography>
            <Typography mt={1}>
              All products delivered within India are eligible for a <strong>7-day return policy</strong> from the date of delivery.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">
              International Orders
            </Typography>
            <Typography mt={1}>
              Products delivered outside India are <strong>not eligible for returns</strong>.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5">
              Need Help?
            </Typography>
            <Typography mt={1}>
              For any return-related queries, please contact us:
            </Typography>
            <Typography mt={1}>
              📧 support@clicon.com
            </Typography>
            <Typography>
              📞 +1-202-555-0104
            </Typography>
          </CardContent>
        </Card>

      </Stack>
    </Container>
  );
};

export default Returns;