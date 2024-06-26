import React from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Container className="container">
      <Box className="success-wrapper" textAlign="center" mt={5}>
        <CheckCircleOutlineIcon style={{ fontSize: 100, color: "green" }} />
        <Typography variant="h4" mt={2}>
          Payment Successful!
        </Typography>
        <Typography variant="h6" mt={2}>
          Thank you for your purchase.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackHome}
          style={{ marginTop: "20px" }}
        >
          Back to Home
        </Button>
      </Box>
    </Container>
  );
};

export default PaymentSuccess;
