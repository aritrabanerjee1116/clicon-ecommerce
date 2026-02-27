import React from "react";
import {
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders within India are delivered in 5–7 business days. International deliveries may take 20–30 days depending on customs and location.",
  },
  {
    question: "Do you ship outside India?",
    answer:
      "Yes, we ship worldwide. Delivery timelines for international orders vary based on destination and customs clearance.",
  },
  {
    question: "Can I return my order?",
    answer:
      "Products delivered within India come with a 7-day return policy. International orders are not eligible for returns.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you will receive a tracking link via email or SMS.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major debit cards, credit cards, UPI, net banking, and select international payment methods.",
  },
  {
    question: "What should I do if I receive a damaged product?",
    answer:
      "Please contact our support team within 48 hours of delivery with photos of the damaged product for assistance.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us at support@clicon.com or call +1-202-555-0104 for assistance.",
  },
];

const FAQ: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        
        {/* Title */}
        <Typography variant="h2">
          Frequently Asked Questions
        </Typography>

        <Typography color="text.secondary">
          Find answers to common questions about orders, shipping, returns, and payments.
        </Typography>

        {/* FAQ List */}
        {faqs.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>
                {faq.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {faq.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

      </Stack>
    </Container>
  );
};

export default FAQ;