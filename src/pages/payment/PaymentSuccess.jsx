import React, { useEffect } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const book = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/booking/book",
        data
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Booking successful:", response.data);
        // Clear localStorage after successful booking
      } else {
        console.error("Booking failed:", response.data);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  useEffect(() => {
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    if (bookingData) {
      book(bookingData);
      localStorage.removeItem('bookingData');

    }
  }, []); // Empty dependency array ensures this runs only once after the initial render

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
