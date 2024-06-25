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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./tailwindcss-colors.css";
import "./Payment.css";
import { getCourtByIdCourt, payment } from "../../services/UserServices";
import VNPAGE from "../../img/VNPAGE.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";

const PaymentPage = () => {
  const user = useSelector(selectUser).user;
  const [orderDetail, setOrderDetail] = useState({
    firstname: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    customerId: user.userID,
    bookingType: "1",
    bookingDetails: [],
    selectedCourts: [],
    paymentMethod: "method-1", // Default payment method
    totalPrice: 49, // Update this with your logic
  });

  useEffect(() => {
    const storedDetails = localStorage.getItem("bookingDetails");
    if (storedDetails) {
      setOrderDetail((prevState) => ({
        ...prevState,
        ...JSON.parse(storedDetails),
        selectedCourts: JSON.parse(storedDetails).selectedCourts || [],
      }));
    }
  }, []);

  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(orderDetail.courtID);
      if (res.status === 200) {
        setCourt(res.data);
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

  const book = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8080/booking/book",
        data
      );
      if (response.status === 200 || response.status === 201) {
        console.log("Booking successful:", response.data);
        setOpenDialog(true); //
      } else {
        console.error("Booking failed:", response.data);
      }
    } catch (error) {
      console.error("Error during booking:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      courtID: orderDetail.courtID,
      customerId: orderDetail.customerId,
      bookingDate: orderDetail.selectedDate,
      bookingType: orderDetail.bookingType,
      bookingDetails: orderDetail.selectedCourts.map((court) => ({
        subCourtID: court.subCourtID,
        startTime: court.startTime,
        endTime: court.endTime,
      })),
    };
    console.log(orderDetail);
    console.log(dataToSubmit);
        book(dataToSubmit);

    // try {
    //   const res = await payment(orderDetail.totalPrice * 1000, orderDetail.customerId);
    //   console.log(res.data);

    //   // Redirect to VNPay
    //   window.location.href = res.data;
    // } catch (error) {
    //   console.error("Payment failed:", error);
    // }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate(`/booking/${orderDetail.courtID}`); // Navigate to the booking page with the specific court ID
  };
  

  // useEffect(() => {
  //   // Handle VNPay return URL
  //   const query = new URLSearchParams(window.location.search);
  //   const jsonResponse = query.get('response');
  //   console.log(query);
  //   console.log(jsonResponse);
  //   if (jsonResponse) {
  //     try {
  //       const response = JSON.parse(jsonResponse);
  //       if (response.message === 'Successfully') {
  //         setOpenDialog(true);
  //       }
  //     } catch (error) {
  //       console.error("Failed to parse VNPay response:", error);
  //     }
  //   }
  // }, [navigate]);

  return (
    <Container className="container">
      <Box className="payment-wrapper">
        <Box className="payment-left">
          <Box className="payment-header">
            <Box className="payment-header-icon">
              <i className="ri-flashlight-fill"></i>
            </Box>
            <h1 className="payment-header-title">Order Summary</h1>
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
                  {orderDetail.bookingType === "1" ? "" : "Standard"}
                </Typography>
                {court && (
                  <Box className="payment-plan-info">
                    <h5 className="payment-plan-info payment-plan-info-court-title">
                      {court.courtName}
                    </h5>
                    <h5 className="payment-plan-info">{court.courtAddress}</h5>
                    <h5 className="payment-plan-info">{court.phone}</h5>
                  </Box>
                )}
              </Box>
              <Box className="payment-summary">
                {orderDetail.selectedCourts.map((detail, index) => (
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
                  <Typography className="payment-summary-name">
                    Total
                  </Typography>
                  <Typography className="payment-summary-price">
                    ${orderDetail.totalPrice}
                  </Typography>
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
                    <img src={VNPAGE} style={{ width: "50px" }} alt="VNPAGE" />
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
                id="phone"
                label="Phone Number"
                variant="outlined"
                value={orderDetail.phone}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="totalPrice"
                label="Total Price"
                variant="outlined"
                value={orderDetail.totalPrice || ""}
                onChange={handleInputChange}
                disabled
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="payment-submit-button"
            >
              Proceed to Pay
            </Button>
          </form>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Booking Successful</DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully processed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentPage;
