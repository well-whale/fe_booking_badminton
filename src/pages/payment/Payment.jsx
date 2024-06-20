import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom"; // Import useLocation
import "./tailwindcss-colors.css";
import "./Payment.css";
import { getCourtByIdCourt } from "../../services/UserServices";
import PayPal from "../../img/888870.png";

const PaymentPage = () => {
  const location = useLocation();
  const { selectedCourts, selectedDate, startTime, endTime } = location.state || {};
console.log(selectedCourts)
  const [orderDetail, setOrderDetail] = useState({
    firstname: "ABC",
    lastName: "CDF",
    idCustomer: "6",
    email: "ahfhsfhdga@gmail.com",
    phone: "03456789",
    courtID: 1,
    customerId: "6",
    bookingDate: selectedDate ? selectedDate.format("YYYY-MM-DD") : "2024-06-20",
    bookingType: "1",
    bookingDetails: selectedCourts
      ? selectedCourts.map((court) => ({
          subCourtID: court.subCourtID,
          startTime: startTime
            ? `${String(Math.floor(startTime / 60)).padStart(2, "0")}:${String(
                startTime % 60
              ).padStart(2, "0")}`
            : "15:00:00",
          endTime: endTime
            ? `${String(Math.floor(endTime / 60)).padStart(2, "0")}:${String(
                endTime % 60
              ).padStart(2, "0")}`
            : "19:00:00",
        }))
      : [],
  });

  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(orderDetail.courtID);
      if (res.status === 200) {
        setCourt(res.data);
        console.log(res.data);
      } else {
        setError("Failed to fetch court details");
      }
    } catch (err) {
      setError("An error occurred while fetching court details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailCourt();
  }, [orderDetail.courtID]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setOrderDetail({ ...orderDetail, [id]: value });
  };

  const handlePaymentMethodChange = (e) => {
    setOrderDetail({ ...orderDetail, paymentMethod: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", orderDetail);
  };

  return (
    <Container className="container">
      <Box className="payment-wrapper">
        <Box className="payment-left">
          <Box className="payment-header">
            <Box className="payment-header-icon">
              <i className="ri-flashlight-fill"></i>
            </Box>
            <h1 className="payment-header-title" > Order Summary</h1>
            
            <Box className="payment-plan-info">
              <h5 className="payment-plan-info-name">
                Customer: {orderDetail.firstname} {orderDetail.lastName}
              </h5>
              <h5 className="payment-plan-info-email">
                Email: {orderDetail.email}
              </h5>
              <h5 className="payment-plan-info-phone">
                Phone: {orderDetail.phone}
              </h5>
            </Box>
          </Box>
          <Box className="payment-content">
            <Box className="payment-body">
              <Box className="payment-plan">
                <Typography variant="h6" className="payment-plan-type">
                  {orderDetail.bookingType === "1" ? "Pro" : "Standard"}
                </Typography>
                {court && (
                  <Box className="payment-plan-info">
                    <h5 className="payment-plan-info payment-plan-info-court-title">
                      {court.courtName}
                    </h5>
                    <h5 className="payment-plan-info">
                      {court.courtAddress}
                    </h5>
                    <h5 className="payment-plan-info">
                      {court.phone}
                    </h5>
                  </Box>
                )}
              </Box>
              <Box className="payment-summary">
                {orderDetail.bookingDetails.map((detail, index) => (
                  <Box key={index} className="payment-summary-item">
                    <Typography className="payment-summary-name">
                      Court {detail.subCourtID}
                    </Typography>
                    <Typography className="payment-summary-time">
                      {detail.startTime} - {detail.endTime}
                    </Typography>
                  </Box>
                ))}
                <Divider className="payment-summary-divider" />
                <Box className="payment-summary-item payment-summary-total">
                  <Typography className="payment-summary-name">Total</Typography>
                  <Typography className="payment-summary-price">$49</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="payment-right">
          <form className="payment-form" onSubmit={handleSubmit}>
            <Typography variant="h5" className="payment-title">
              Payment Details
            </Typography>
            <FormControl component="fieldset" className="formControl">
              <RadioGroup
                name="paymentMethod"
                value={orderDetail.paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="method-1"
                  control={<Radio />}
                  label={
                    <img src={PayPal} style={{ width: "50px" }} alt="PayPal" />
                  }
                />
                {/* <FormControlLabel
                  value="method-2"
                  control={<Radio />}
                  label={<img src="images/mastercard.png" alt="Momo" />}
                /> */}
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="firstname"
                label="First Name"
                variant="outlined"
                value={orderDetail.firstname || ""}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="lastName"
                label="Last Name"
                variant="outlined"
                value={orderDetail.lastName || ""}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="email"
                label="Email Address"
                variant="outlined"
                value={orderDetail.email}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="phoneNumber"
                label="Phone Number"
                variant="outlined"
                value={orderDetail.phone || ""}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="submitButton"
              startIcon={<i className="ri-wallet-line"></i>}
            >
              Pay
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentPage;
