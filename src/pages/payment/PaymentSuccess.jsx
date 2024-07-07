import React, { useEffect, useState } from "react";
import { Container, Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const PaymentSuccess = () => {
  const [vnp_Amount, setVnp_Amount] = useState('');
  const [vnp_BankCode, setVnp_BankCode] = useState('');
  const [vnp_OrderInfo, setVnp_OrderInfo] = useState('');
  const [vnp_ResponseCode, setVnp_ResponseCode] = useState('');
  const [vnp_TxnRef, setVnp_TxnRef] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const navigate = useNavigate();
  const [status, setstatus] = useState('');

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("bookingData"));
    if (storedData) {
      setBookingData(storedData);
      localStorage.removeItem("bookingData");

      const urlParams = new URLSearchParams(window.location.search);
      setVnp_Amount(urlParams.get('vnp_Amount'));
      setVnp_BankCode(urlParams.get('vnp_BankCode'));
      setVnp_OrderInfo(urlParams.get('vnp_OrderInfo'));
      setVnp_ResponseCode(urlParams.get('vnp_ResponseCode'));
      setVnp_TxnRef(urlParams.get('vnp_TxnRef'));

      
    }
  }, []);

  useEffect(() => {
    if (vnp_ResponseCode === "00" && bookingData) {
      const book = async (data) => {
        try {
          const response = await axios.post(
            "http://localhost:8080/booking/book/saveBookingV2",
            {
              bookingDto: {
                courtID: data.courtID,
                customerId: data.customerId,
                bookingDate: data.bookingDate,
                bookingType: data.bookingType,
                bookingDetails: data.bookingDetails,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
              },
              paymentDto: {
                amount: vnp_Amount,
                bankCode: vnp_BankCode,
                responseCode: vnp_ResponseCode,
                transactinCode: vnp_TxnRef,
              },
            }
          );
          if (response.status === 200 || response.status === 201) {
            setstatus("true")
            console.log("Booking successful:", response.data);
          } else {
            console.error("Booking failed:", response.data);
          }
        } catch (error) {
          console.error("Error during booking:", error);
        }
      };

      book(bookingData);
    }
  }, [vnp_ResponseCode, bookingData]);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <Container className="container">
      <Box className="success-wrapper" textAlign="center" mt={5}>
        {vnp_ResponseCode === "00" && status ==="true" ? (
          <>
          <CheckCircleOutlineIcon style={{ fontSize: 100, color: "green" }} />
            <Typography variant="h4" mt={2}>
              Payment Successful!
            </Typography>
            <Typography variant="h6" mt={2}>
              Thank you for your purchase.
            </Typography>
          </>
        ) : (
          <>
           <HighlightOffIcon style={{ fontSize: 100, color: "red" }} />
            <Typography variant="h4" mt={2}>
              Payment Error!
            </Typography>
            <Typography variant="h6" mt={2}>
              Please try again.
            </Typography>
          </>
        )}
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
